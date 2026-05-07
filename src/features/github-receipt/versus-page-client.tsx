"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RoseCurveLoader } from "@/components/ui/rose-curve-loader";
import SoftPillButton from "@/components/ui/soft-pill-button";

import { VersusView } from "./components/versus-view";
import type { GitHubRepo, GitHubUser } from "./types";
import { getTopRepos } from "./utils";

interface VersusPageClientProps {
  userLogin: string;
  opponentLogin: string;
}

interface BattleData {
  user: GitHubUser;
  repos: GitHubRepo[];
  opponent: GitHubUser;
  opponentRepos: GitHubRepo[];
}

async function fetchUserAndRepos(
  login: string,
): Promise<{ user: GitHubUser; repos: GitHubRepo[] }> {
  const [userResponse, reposResponse] = await Promise.all([
    fetch(`/api/github/users/${login}`),
    fetch(`/api/github/users/${login}/repos?per_page=100&sort=updated`),
  ]);
  if (!userResponse.ok) throw new Error(`@${login} not found`);
  if (!reposResponse.ok) throw new Error(`Could not fetch repos for @${login}`);
  const user = (await userResponse.json()) as GitHubUser;
  const allRepos = (await reposResponse.json()) as GitHubRepo[];
  return { user, repos: getTopRepos(allRepos) };
}

export function VersusPageClient({
  userLogin,
  opponentLogin,
}: VersusPageClientProps) {
  const router = useRouter();
  const [data, setData] = useState<BattleData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    Promise.all([
      fetchUserAndRepos(userLogin),
      fetchUserAndRepos(opponentLogin),
    ])
      .then(([self, opp]) => {
        if (cancelled) return;
        setData({
          user: self.user,
          repos: self.repos,
          opponent: opp.user,
          opponentRepos: opp.repos,
        });
      })
      .catch((fetchError: Error) => {
        if (!cancelled) setError(fetchError.message);
      });
    return () => {
      cancelled = true;
    };
  }, [userLogin, opponentLogin]);

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <SoftPillButton
          variant="secondary"
          onClick={() => router.push(`/${encodeURIComponent(userLogin)}`)}
        >
          Back to receipt
        </SoftPillButton>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <RoseCurveLoader className="size-40 text-zinc-900" />
      </div>
    );
  }

  return (
    <VersusView
      user={data.user}
      repos={data.repos}
      opponent={data.opponent}
      opponentRepos={data.opponentRepos}
      onClose={() => router.push(`/${encodeURIComponent(userLogin)}`)}
      onBrowseOpponents={() => router.push("/find-opponent")}
    />
  );
}
