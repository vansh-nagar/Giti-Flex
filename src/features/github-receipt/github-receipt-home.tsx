"use client";

import { useState } from "react";
import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";
import { motion } from "motion/react";

import SoftPillButton from "@/components/ui/soft-pill-button";
import GithubLogo from "@/components/logo/github";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";

type GithubReceiptHomeProps = {
  login?: string | null;
};

export function GithubReceiptHome({ login }: GithubReceiptHomeProps = {}) {
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader showLeaderboard={false} />

      <section className="relative flex flex-1 items-center justify-center px-6 pb-32">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute -left-6 -top-8 rotate-[30deg] sm:-left-10 sm:-top-10 md:-left-6 md:-top-7"
            >
              <svg
                width="53"
                height="65"
                viewBox="0 0 53 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-auto sm:h-12 md:h-16"
              >
                <g clipPath="url(#clip0_911_22)">
                  <path
                    d="M42.3616 0.0113368C46.2296 -0.157615 49.904 1.56041 51.5504 5.26152C53.1521 8.86198 50.9133 15.8829 48.5936 18.814C45.0084 23.3437 39.2779 27.8686 33.9132 30.1542C34.1033 30.6591 34.2387 31.2287 34.4273 31.7146C36.173 36.2125 36.8381 39.7221 37.2126 44.4989C37.6921 50.6159 38.7152 57.1826 36.5608 63.1398C36.3204 63.8043 35.4628 64.6364 34.7264 64.2561C34.268 63.4271 35.1918 58.0562 35.2086 56.6563C35.2959 49.3965 35.3986 42.6312 33.3936 35.5822C32.6619 33.5514 32.0572 31.5579 30.6837 29.875C25.7878 32.1662 22.1803 34.9365 16.6403 35.1717C11.6463 35.4227 7.49219 34.9033 3.66206 31.4278C-3.85225 24.6092 1.04405 14.1832 10.6838 13.7993C16.9015 13.5517 23.346 14.5798 28.1125 18.9013C28.6925 15.1238 30.4694 7.79677 33.0151 4.90764C35.3451 2.2632 38.8067 0.301599 42.3616 0.0113368Z"
                    fill="#010602"
                  />
                  <path
                    d="M11.6556 16.6468C15.3185 16.3008 19.1248 17.9883 22.4733 19.2997C25.8338 20.6158 27.8522 23.3779 29.1794 26.6836C27.2116 29.2629 22.8008 30.7254 19.6999 31.5682L19.5419 31.6026C15.4049 32.484 10.1122 32.514 6.49261 30.1593C3.58352 28.2668 1.09344 24.3183 3.15901 21.0224C4.46298 18.9417 9.3418 17.0756 11.6556 16.6468Z"
                    fill="#2AA749"
                  />
                  <path
                    d="M42.0699 3.30589C42.7608 3.19146 44.4652 3.24172 45.1154 3.40021C50.7503 4.77358 49.2073 9.50824 47.5536 13.265C46.0425 16.6973 46.0458 18.0624 42.851 20.5978C40.8225 22.2075 39.2648 23.6153 37.1195 25.0031C36.3343 25.5164 34.1067 26.6306 33.1972 27.1265C30.3943 22.5349 31.6629 11.3535 34.9119 6.80569C36.2898 4.87685 39.7045 3.59711 42.0699 3.30589Z"
                    fill="#2AA749"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_911_22">
                    <rect width="53" height="65" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
          <h1
            className={cn(
              "text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl",
              ctaHovered && "giti-shimmer-text",
            )}
          >
            Your GitHub
            <br />
            as a receipt
          </h1>
            <motion.span
              aria-hidden
              animate={{ rotate: [-20, -4, -20] }}
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              style={{ transformOrigin: "center" }}
              className="pointer-events-none absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-10 md:-bottom-5 md:-right-6"
            >
              <svg
                width="89"
                height="89"
                viewBox="0 0 89 89"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-7 sm:size-9 md:size-12"
              >
                <path
                  d="M59.6821 0C62.856 0.222207 66.7738 1.57679 69.562 3.08971C73.5022 5.22777 76.2691 9.92984 77.4284 14.1721C79.3203 21.0944 77.0105 24.7582 73.7153 30.4826C74.7952 31.4718 76.1914 32.3914 77.4729 33.1164C84.1924 36.9154 90.1556 47.2114 87.8712 54.9457C85.9626 61.4071 81.3447 67.1792 74.2197 67.6693C71.1925 67.8774 67.2565 67.9333 64.3378 67.0914C62.4866 74.2006 62.2677 79.7246 55.8699 84.6741C47.425 91.2069 35.9345 89.4112 29.4176 81.1437C27.6331 78.4332 26.4317 72.8977 25.966 69.641C23.1869 70.5342 14.5772 70.7799 12.007 69.5774C2.54355 65.1501 -2.49062 52.4946 1.23226 42.7426C3.67639 36.3402 7.86093 34.7822 13.2408 32.1518C11.5667 29.8881 9.49857 23.8194 9.30588 21.003C9.05446 17.3314 9.74137 11.099 12.265 8.24966C15.6268 4.45383 19.6747 1.67064 24.8233 1.33657C29.475 1.03474 35.0984 1.11785 38.9315 4.08646C40.5995 5.37838 42.3884 7.09518 44.0496 8.49261C45.3055 7.6227 46.9559 5.9012 48.1444 4.81484C51.0083 2.19679 55.8891 0.442144 59.6821 0Z"
                  fill="black"
                />
                <path
                  d="M56.6709 7.27168C60.1487 6.7254 64.6997 8.27495 67.1718 10.7354C69.2956 12.8494 70.8662 17.8285 70.7927 20.7689C70.6983 24.5316 68.6614 29.9067 65.9565 32.5562C69.876 33.6622 75.6858 38.1901 78.0553 41.5177C80.4715 44.9111 82.1531 50.2594 80.4917 54.2974C77.0272 62.7176 67.0531 63.2305 59.3761 61.9348C59.1281 65.4843 59.1969 67.9295 58.1026 71.4499C55.5335 79.716 47.8427 83.4036 39.6729 80.7877C35.9567 79.5978 33.4305 77.307 31.6689 73.7842C30.3386 70.7962 29.2504 67.1793 29.4709 63.8792C26.2108 65.3667 21.0549 66.0421 17.5815 65.0331C13.7979 63.9339 11.0542 61.3509 9.15533 57.9638C7.02136 54.1571 6.80233 50.9163 7.9621 46.7594C8.95447 43.2023 11.7263 39.182 14.9438 37.3255C16.5955 36.3723 18.4216 35.5713 20.1249 34.6289C17.4792 31.1211 14.6553 24.6281 15.3017 20.0991C15.8456 16.2891 17.8559 13.0704 20.8533 10.6242C24.3163 7.79814 28.8311 8.09724 33.0383 8.35986C37.0011 8.6072 42.3081 12.1259 44.6967 15.2089C44.7475 15.1402 44.7991 15.0722 44.8515 15.0049C47.8496 11.145 51.7178 7.90606 56.6709 7.27168Z"
                  fill="white"
                />
                <path
                  d="M42.7533 30.213C50.0486 29.6627 56.4094 35.1291 56.9625 42.4242C57.5156 49.7193 52.0517 56.0822 44.7568 56.6383C37.4579 57.1946 31.0906 51.7269 30.5371 44.4278C29.9837 37.1286 35.4538 30.7635 42.7533 30.213Z"
                  fill="black"
                />
                <path
                  d="M42.9391 34.7563C47.7471 34.3147 51.9972 37.8677 52.4148 42.6778C52.8324 47.488 49.2584 51.7202 44.4463 52.1139C39.6679 52.5047 35.4718 48.9612 35.0571 44.1849C34.6423 39.4086 38.165 35.1949 42.9391 34.7563Z"
                  fill="#FBBF24"
                />
              </svg>
            </motion.span>
          </div>

          <p className="mt-6 max-w-lg text-sm text-muted-foreground">
            A printable summary of your dev career. Style it, share it,
            <br />
            and challenge any GitHub user to a 1v1.
          </p>

          <Show when="signed-out">
            <div className="mt-10 flex flex-row items-center gap-3">
              <SignInButton mode="modal">
                <SoftPillButton variant="primary" className="h-9 px-4 text-[13px]">
                  <GithubLogo size={16} color="#ffffff" />
                  Sign in with GitHub
                </SoftPillButton>
              </SignInButton>
              <Link href="/leaderboard">
                <SoftPillButton variant="secondary" className="h-9 px-4 text-[13px]">
                  Leaderboard
                </SoftPillButton>
              </Link>
            </div>
          </Show>

          <Show when="signed-in">
            {login ? (
              <div className="mt-10 flex flex-row items-center gap-3">
                <Link
                  href={`/${encodeURIComponent(login)}`}
                  onMouseEnter={() => setCtaHovered(true)}
                  onMouseLeave={() => setCtaHovered(false)}
                  onFocus={() => setCtaHovered(true)}
                  onBlur={() => setCtaHovered(false)}
                >
                  <SoftPillButton variant="primary" className="h-9 px-4 text-[13px]">
                    Go to your receipt
                  </SoftPillButton>
                </Link>
                <Link href="/leaderboard">
                  <SoftPillButton variant="secondary" className="h-9 px-4 text-[13px]">
                    Leaderboard
                  </SoftPillButton>
                </Link>
              </div>
            ) : (
              <p className="mt-10 max-w-md text-sm text-amber-600">
                Your Clerk account isn&apos;t linked to GitHub. Sign out and sign
                back in choosing GitHub so we can read your username.
              </p>
            )}
          </Show>
        </div>
      </section>
    </div>
  );
}
