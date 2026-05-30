import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CONTRIBUTIONS_QUERY = `query($login:String!){
  user(login:$login){
    contributionsCollection{
      contributionCalendar{ totalContributions }
    }
  }
}`;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    // GraphQL requires auth; without a token we cannot fetch contributions.
    // Degrade gracefully so the receipt falls back to stars.
    return NextResponse.json({ available: false });
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "github-recipt",
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { login: username },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ available: false });
    }

    const data = (await response.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: { totalContributions?: number };
          };
        } | null;
      };
      errors?: unknown;
    };

    const total =
      data?.data?.user?.contributionsCollection?.contributionCalendar
        ?.totalContributions;

    if (data.errors || typeof total !== "number") {
      return NextResponse.json({ available: false });
    }

    return NextResponse.json({ available: true, total });
  } catch {
    return NextResponse.json({ available: false });
  }
}
