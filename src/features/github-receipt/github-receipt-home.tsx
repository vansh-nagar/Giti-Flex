"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

import SoftPillButton from "@/components/ui/soft-pill-button";
import GithubLogo from "@/components/logo/github";

export function GithubReceiptHome() {
  return (
    <div className="relative flex flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.zinc.200/.6),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,theme(colors.zinc.800/.5),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,theme(colors.zinc.200/.4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.zinc.200/.4)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] dark:bg-[linear-gradient(to_right,theme(colors.zinc.800/.5)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.zinc.800/.5)_1px,transparent_1px)]"
      />

      <header className="relative z-10 flex w-full items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="flex items-center gap-2">
          <GithubLogo size={22} />
          <span className="text-base font-semibold tracking-tight text-foreground">
            Giti Flex
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/70 md:flex">
          <Link
            href="/leaderboard"
            className="transition-colors hover:text-foreground"
          >
            Leaderboard
          </Link>
          <Show when="signed-in">
            <Link
              href="/find-opponent"
              className="transition-colors hover:text-foreground"
            >
              Battle
            </Link>
          </Show>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <SoftPillButton variant="secondary" className="h-9 px-4 text-sm">
                Log In
              </SoftPillButton>
            </SignInButton>
            <SignInButton mode="modal">
              <SoftPillButton variant="primary" className="h-9 px-4 text-sm">
                Get Started
              </SoftPillButton>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>

      <section className="relative flex flex-1 items-center justify-center px-6 py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Your GitHub profile,
            <br />
            printed as a receipt.
          </h1>

          <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
            Sign in with GitHub to print your profile as a clean receipt and
            battle other devs on the leaderboard.
          </p>

          <Show when="signed-out">
            <div className="mt-10 flex flex-row items-center gap-3">
              <SignInButton mode="modal">
                <SoftPillButton variant="primary" className="h-11 px-6 text-sm">
                  <GithubLogo size={16} color="#ffffff" />
                  Sign in with GitHub
                </SoftPillButton>
              </SignInButton>
              <Link href="/leaderboard">
                <SoftPillButton variant="secondary" className="h-11 px-6 text-sm">
                  <Trophy size={16} />
                  Leaderboard
                </SoftPillButton>
              </Link>
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
    </div>
  );
}
