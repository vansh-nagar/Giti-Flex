"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

import SoftPillButton from "@/components/ui/soft-pill-button";
import GithubLogo from "@/components/logo/github";
import GitiFlexLogo from "@/components/logo/giti-flex";
import { TrophyDoodle } from "@/components/icons/trophy-doodle";
import { StarDoodle } from "@/components/icons/star-doodle";

const GITHUB_REPO_URL = "https://github.com/vansh-nagar/Giti-Flex";

type SiteHeaderProps = {
  actions?: ReactNode;
  showLeaderboard?: boolean;
  fixed?: boolean;
};

export function SiteHeader({
  actions,
  showLeaderboard = true,
  fixed = false,
}: SiteHeaderProps = {}) {
  return (
    <header
      className={
        fixed
          ? "sticky top-0 z-50 flex w-full items-center justify-between bg-background/80 px-6 py-5 backdrop-blur sm:px-10"
          : "relative z-10 flex w-full items-center justify-between px-6 py-5 sm:px-10"
      }
    >
      <Link href="/" aria-label="Giti Flex" className="flex items-center">
        <GitiFlexLogo size={52} className="text-foreground" />
      </Link>

      <div className="flex items-center gap-3">
        {actions}
        {showLeaderboard && (
          <Link href="/leaderboard" aria-label="Leaderboard">
            <SoftPillButton
              variant="secondary"
              className="h-9 gap-2 px-4 text-[13px]"
            >
              <TrophyDoodle size={14} />
              <span>Leaderboard</span>
            </SoftPillButton>
          </Link>
        )}
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Star Giti Flex on GitHub"
          className="group/star relative isolate inline-flex"
        >
          <SoftPillButton
            variant="secondary"
            className="relative z-10 h-9 gap-2 px-4 text-[13px]"
          >
            <GithubLogo size={14} />
            <span>Star on GitHub</span>
          </SoftPillButton>
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 bottom-full z-0 -translate-x-1/2 translate-y-full scale-75 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/star:translate-y-2 group-hover/star:scale-100 group-hover/star:opacity-100"
          >
            <StarDoodle size={28} />
          </span>
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
