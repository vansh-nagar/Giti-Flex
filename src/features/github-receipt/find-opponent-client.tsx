"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";

import { OpponentDeck } from "./components/opponent-deck";
import type { GitHubUser } from "./types";

interface FindOpponentClientProps {
  login: string;
}

export function FindOpponentClient({ login }: FindOpponentClientProps) {
  const router = useRouter();
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/github/users/${login}`)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load your profile");
        return response.json() as Promise<GitHubUser>;
      })
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch((fetchError: Error) => {
        if (!cancelled) setError(fetchError.message);
      });
    return () => {
      cancelled = true;
    };
  }, [login]);

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner className="size-8 text-zinc-900" />
      </div>
    );
  }

  return (
    <OpponentDeck
      open
      selfLogin={user.login}
      selfUser={user}
      selfFollowers={user.followers}
      onClose={() => router.push(`/${encodeURIComponent(user.login)}`)}
      onPick={(opponent) =>
        router.push(
          `/${encodeURIComponent(user.login)}/vs/${encodeURIComponent(opponent)}`,
        )
      }
    />
  );
}
