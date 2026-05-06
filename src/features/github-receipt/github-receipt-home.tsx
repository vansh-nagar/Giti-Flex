"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";
import { Show, SignInButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import GithubLogo from "@/components/logo/github";

export function GithubReceiptHome() {
  return (
    <section className="relative flex flex-1 items-center justify-center px-6 py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.zinc.200/.6),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,theme(colors.zinc.800/.5),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,theme(colors.zinc.200/.4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.zinc.200/.4)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] dark:bg-[linear-gradient(to_right,theme(colors.zinc.800/.5)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.zinc.800/.5)_1px,transparent_1px)]"
      />

      <Link
        href="/leaderboard"
        className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground sm:right-6 sm:top-6"
      >
        <Trophy size={14} />
        Leaderboard
      </Link>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <GithubLogo size={14} />
          Generate a printable GitHub receipt
        </span>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Your GitHub profile,
          <br />
          <span className="bg-gradient-to-br from-zinc-700 to-zinc-400 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-500">
            printed as a receipt.
          </span>
        </h1>

        <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
          Sign in with GitHub to print your profile as a clean receipt and
          battle other devs on the leaderboard.
        </p>

        <Show when="signed-out">
          <div className="mt-10 flex flex-col items-center gap-3">
            <SignInButton mode="modal">
              <Button className="h-11 px-6 text-sm">
                <GithubLogo size={16} color="#ffffff" />
                Sign in with GitHub
              </Button>
            </SignInButton>
            <p className="text-xs text-muted-foreground">
              Auth is required so leaderboard scores stay yours.
            </p>
          </div>
        </Show>

        <Show when="signed-in">
          <p className="mt-10 max-w-md text-sm text-amber-600">
            Your Clerk account isn&apos;t linked to GitHub. Sign out and sign
            back in choosing GitHub so we can read your username.
          </p>
        </Show>
      </div>
    </section>
  );
}
