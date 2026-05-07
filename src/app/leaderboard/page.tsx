import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import GithubLogo from "@/components/logo/github";
import SoftPillButton from "@/components/ui/soft-pill-button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getLeaderboard() {
  return prisma.player.findMany({
    orderBy: [{ points: "desc" }, { wins: "desc" }, { login: "asc" }],
    take: 100,
  });
}

function formatRecord(wins: number, losses: number, ties: number) {
  return `${wins}W · ${losses}L · ${ties}T`;
}

function rankBadge(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export default async function LeaderboardPage() {
  const players = await getLeaderboard();
  const totalBattles = await prisma.battle.count();

  return (
    <section className="relative flex flex-1 flex-col items-center px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.zinc.200/.6),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,theme(colors.zinc.800/.5),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,theme(colors.zinc.200/.4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.zinc.200/.4)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] dark:bg-[linear-gradient(to_right,theme(colors.zinc.800/.5)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.zinc.800/.5)_1px,transparent_1px)]"
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col">
        <div className="mb-10 flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Top contenders
          </h1>

          <div className="mt-6 flex gap-2">
            <Link href="/">
              <SoftPillButton variant="secondary">
                Build a receipt
              </SoftPillButton>
            </Link>
          </div>
        </div>

        {players.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background/40 p-12 text-center text-sm text-muted-foreground">
            No battles fought yet. Start a versus from any receipt.
          </div>
        ) : (
          <ol className="overflow-hidden rounded-xl border border-border bg-background/60 backdrop-blur">
            {players.map((player, index) => {
              const rank = index + 1;
              const isPositive = player.points > 0;
              const isNegative = player.points < 0;

              return (
                <li
                  key={player.login}
                  className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0 sm:px-6 sm:py-4"
                >
                  <span className="w-10 shrink-0 text-center font-mono text-sm font-semibold text-muted-foreground sm:text-base">
                    {rankBadge(rank)}
                  </span>

                  <Image
                    src={`https://github.com/${player.login}.png?size=80`}
                    alt={player.login}
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-full border border-border"
                    unoptimized
                  />

                  <div className="min-w-0 flex-1">
                    <a
                      href={`https://github.com/${player.login}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-sm font-semibold hover:underline sm:text-base"
                    >
                      @{player.login}
                    </a>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {formatRecord(player.wins, player.losses, player.ties)}
                    </p>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-mono text-lg font-bold tabular-nums sm:text-xl ${
                        isPositive
                          ? "text-emerald-500"
                          : isNegative
                            ? "text-red-500"
                            : "text-muted-foreground"
                      }`}
                    >
                      {player.points > 0 ? "+" : ""}
                      {player.points}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      points
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
