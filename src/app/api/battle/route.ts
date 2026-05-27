import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthedGithubLogin } from "@/lib/auth";

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

const POINTS_PER_BATTLE = 10;

export const runtime = "nodejs";

function isLogin(value: unknown): value is string {
  return typeof value === "string" && /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(value);
}

export async function POST(req: Request) {
  const authedLogin = await getAuthedGithubLogin();
  if (!authedLogin) {
    return NextResponse.json(
      { error: "Sign in with GitHub to record a battle" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { winner, loser, isTie } = (body ?? {}) as {
    winner?: unknown;
    loser?: unknown;
    isTie?: unknown;
  };

  if (!isLogin(winner) || !isLogin(loser)) {
    return NextResponse.json({ error: "Invalid logins" }, { status: 400 });
  }
  if (winner.toLowerCase() === loser.toLowerCase()) {
    return NextResponse.json({ error: "Same player" }, { status: 400 });
  }

  const authedLower = authedLogin.toLowerCase();
  const winnerLower = winner.toLowerCase();
  const loserLower = loser.toLowerCase();
  if (authedLower !== winnerLower && authedLower !== loserLower) {
    return NextResponse.json(
      { error: "You can only record battles you took part in" },
      { status: 403 },
    );
  }

  const id = crypto.randomUUID();
  const tie = Boolean(isTie);
  const points = tie ? 0 : POINTS_PER_BATTLE;

  try {
    const result = await prisma.$transaction(async (tx: TxClient) => {
      await tx.player.upsert({
        where: { login: winner },
        create: { login: winner },
        update: {},
      });
      await tx.player.upsert({
        where: { login: loser },
        create: { login: loser },
        update: {},
      });

      if (tie) {
        await tx.player.update({
          where: { login: winner },
          data: { ties: { increment: 1 } },
        });
        await tx.player.update({
          where: { login: loser },
          data: { ties: { increment: 1 } },
        });
      } else {
        await tx.player.update({
          where: { login: winner },
          data: { points: { increment: points }, wins: { increment: 1 } },
        });
        await tx.player.update({
          where: { login: loser },
          data: { points: { decrement: points }, losses: { increment: 1 } },
        });
      }

      await tx.battle.create({
        data: {
          id,
          winnerLogin: tie ? null : winner,
          loserLogin: tie ? null : loser,
          isTie: tie,
          points,
        },
      });

      return { recorded: true, id, points };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("battle POST error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const login = searchParams.get("login");

  try {
    if (login) {
      if (!isLogin(login)) {
        return NextResponse.json({ error: "Invalid login" }, { status: 400 });
      }
      const player = await prisma.player.findUnique({ where: { login } });
      return NextResponse.json({ player });
    }

    const leaderboard = await prisma.player.findMany({
      orderBy: [{ points: "desc" }, { wins: "desc" }],
      take: 50,
    });
    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("battle GET error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
