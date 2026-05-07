import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_PREFIXES = [
  /^users(\/[^/]+(\/repos)?)?$/,
  /^search\/users$/,
];

function isAllowed(path: string) {
  return ALLOWED_PREFIXES.some((re) => re.test(path));
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const joined = path.join("/");

  if (!isAllowed(joined)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const search = new URL(req.url).search;
  const upstream = `https://api.github.com/${joined}${search}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "github-recipt",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(upstream, { headers });
  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "application/json",
      "x-ratelimit-remaining":
        response.headers.get("x-ratelimit-remaining") ?? "",
      "x-ratelimit-limit": response.headers.get("x-ratelimit-limit") ?? "",
    },
  });
}
