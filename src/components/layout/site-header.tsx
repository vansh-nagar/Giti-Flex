"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

import SoftPillButton from "@/components/ui/soft-pill-button";
import GithubLogo from "@/components/logo/github";
import GitiFlexLogo from "@/components/logo/giti-flex";
import { Trophy } from "@/components/icons";

const GITHUB_REPO_URL = "https://github.com/vansh-nagar/Giti-Flex";

type SiteHeaderProps = {
  actions?: ReactNode;
};

export function SiteHeader({ actions }: SiteHeaderProps = {}) {
  return (
    <header className="relative z-10 flex w-full items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" aria-label="Giti Flex" className="flex items-center">
        <GitiFlexLogo size={52} className="text-foreground" />
      </Link>

      <div className="flex items-center gap-3">
        {actions}
        <Link href="/leaderboard" aria-label="Leaderboard">
          <SoftPillButton
            variant="secondary"
            className="h-9 gap-2 px-4 text-[13px]"
          >
            <Trophy size={14} />
            <span>Leaderboard</span>
          </SoftPillButton>
        </Link>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Star Giti Flex on GitHub"
        >
          <SoftPillButton
            variant="secondary"
            className="h-9 gap-2 px-4 text-[13px]"
          >
            <GithubLogo size={14} />
            <span>Star on GitHub</span>
          </SoftPillButton>
        </a>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <SoftPillButton variant="secondary" className="h-9 px-4 text-[13px]">
              Log In
            </SoftPillButton>
          </SignInButton>
          <SignInButton mode="modal">
            <SoftPillButton variant="primary" className="h-9 px-4 text-[13px]">
              Get Started
            </SoftPillButton>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: { width: 36, height: 36 },
                userButtonTrigger: {
                  width: 36,
                  height: 36,
                  borderRadius: 9999,
                  boxShadow: "none",
                  border: "none",
                  background: "transparent",
                  "&:focus": { boxShadow: "none" },
                },
              },
            }}
          />
        </Show>
      </div>
    </header>
  );
}
