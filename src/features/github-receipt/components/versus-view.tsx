"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Check,
  Crown,
  Layers,
  Link2,
  Skull,
  Star,
  Sword,
  X,
} from "lucide-react";

import SoftPillButton from "@/components/ui/soft-pill-button";
import { cn } from "@/lib/utils";

import type { GitHubRepo, GitHubUser } from "../types";

interface VersusViewProps {
  user: GitHubUser;
  repos: GitHubRepo[];
  opponent: GitHubUser;
  opponentRepos: GitHubRepo[];
  onClose: () => void;
  onBrowseOpponents: () => void;
}

function calcScore(user: GitHubUser, repos: GitHubRepo[]) {
  const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  return stars * 2 + user.followers + user.public_repos;
}

function totalStarsOf(repos: GitHubRepo[]) {
  return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
}

export function VersusView({
  user,
  repos,
  opponent,
  opponentRepos,
  onClose,
  onBrowseOpponents,
}: VersusViewProps) {
  const userRef = useRef<HTMLElement>(null);
  const oppRef = useRef<HTMLElement>(null);
  const battleSceneRef = useRef<HTMLDivElement>(null);
  const battleRecorded = useRef(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const userScore = calcScore(user, repos);
  const oppScore = calcScore(opponent, opponentRepos);
  const tie = userScore === oppScore;
  const userWins = !tie && userScore > oppScore;

  useEffect(() => {
    if (battleRecorded.current) return;
    battleRecorded.current = true;
    const winner = tie ? user.login : userWins ? user.login : opponent.login;
    const loser = tie ? opponent.login : userWins ? opponent.login : user.login;
    fetch("/api/battle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winner, loser, isTie: tie }),
    }).catch((error) => console.error("Failed to record battle:", error));
  }, [user.login, opponent.login, tie, userWins]);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${encodeURIComponent(user.login)}?vs=${encodeURIComponent(opponent.login)}`
      : "";

  const winnerLogin = tie ? null : userWins ? user.login : opponent.login;
  const loserLogin = tie ? null : userWins ? opponent.login : user.login;
  const shareText = tie
    ? `@${user.login} and @${opponent.login} tied in a GitHub Receipt battle! Who's the real winner?`
    : `@${winnerLogin} crushed @${loserLogin} in a GitHub Receipt battle! Check the scores:`;

  const openShare = (url: string) => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
    }
  };

  const captureAndDownloadImage = async () => {
    if (!battleSceneRef.current) return;
    try {
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(battleSceneRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      if (!blob) return;
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `battle-${user.login}-vs-${opponent.login}.png`;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Failed to capture battle image:", error);
    }
  };

  const handleShareX = () => {
    openShare(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    );
    captureAndDownloadImage();
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-12 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-4 right-4 z-50"
      >
        <SoftPillButton onClick={onClose} variant="primary">
          <X size={16} />
          Exit Versus
        </SoftPillButton>
      </motion.div>

      <div
        ref={battleSceneRef}
        className="flex w-full items-center justify-center gap-6 bg-background px-4 py-8"
      >
        <ContestantSide
          ref={userRef}
          side="left"
          user={user}
          totalStars={totalStarsOf(repos)}
          score={userScore}
          isWinner={userWins}
          isLoser={!tie && !userWins}
          isTie={tie}
        />

        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.6,
            type: "spring",
            stiffness: 260,
            damping: 22,
          }}
          className="z-10 flex flex-col items-center gap-3 shrink-0"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{
              delay: 1.4,
              duration: 0.8,
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 2,
              ease: "easeInOut",
            }}
            className="flex items-center justify-center size-14 rounded-full bg-zinc-950 text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] ring-1 ring-white/10 dark:ring-white/15"
          >
            <Sword size={22} strokeWidth={2} />
          </motion.div>
          <div className="text-3xl font-black tracking-[-0.04em] text-zinc-900 dark:text-zinc-50">
            VS
          </div>
        </motion.div>

        <ContestantSide
          ref={oppRef}
          side="right"
          user={opponent}
          totalStars={totalStarsOf(opponentRepos)}
          score={oppScore}
          isWinner={!tie && !userWins}
          isLoser={!tie && userWins}
          isTie={tie}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 2.4,
          duration: 0.4,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-2">
          <ShareIconButton label="Share on X" onClick={handleShareX}>
            <XLogo />
          </ShareIconButton>
          <ShareIconButton
            label={linkCopied ? "Link copied" : "Copy link"}
            onClick={handleCopyLink}
          >
            {linkCopied ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Link2 size={16} />
            )}
          </ShareIconButton>
        </div>

        <SoftPillButton
          variant="secondary"
          onClick={onBrowseOpponents}
          className="mt-4"
        >
          <Layers size={16} />
          Browse opponents
        </SoftPillButton>
      </motion.div>
    </div>
  );
}

interface ShareIconButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}

function ShareIconButton({ label, onClick, children }: ShareIconButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
    >
      <SoftPillButton
        variant="secondary"
        onClick={onClick}
        title={label}
        aria-label={label}
        className="size-10 px-0! py-0!"
      >
        {children}
      </SoftPillButton>
    </motion.div>
  );
}

function XLogo() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 1200 1227"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M714.163 519.284 1160.89 0H1055.03L667.137 450.887 357.328 0H0L468.492 681.821 0 1226.37H105.866L515.491 750.218 842.672 1226.37H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" />
    </svg>
  );
}

interface ContestantSideProps {
  ref: React.RefObject<HTMLElement | null>;
  side: "left" | "right";
  user: GitHubUser;
  totalStars: number;
  score: number;
  isWinner: boolean;
  isLoser: boolean;
  isTie: boolean;
}

function ContestantSide({
  ref,
  side,
  user,
  totalStars,
  score,
  isWinner,
  isLoser,
  isTie,
}: ContestantSideProps) {
  const fromX = side === "left" ? -360 : 360;
  const tiltAngle = side === "left" ? -6 : 6;

  return (
    <motion.div
      initial={{ x: fromX, opacity: 0, rotate: tiltAngle }}
      animate={{ x: 0, opacity: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 22,
        mass: 1,
        delay: 0.1,
      }}
      className="relative shrink-0"
    >
      <motion.section
        ref={ref}
        animate={
          isWinner
            ? {
                filter: [
                  "drop-shadow(0 0 0 rgba(34,197,94,0))",
                  "drop-shadow(0 0 40px rgba(34,197,94,0.7))",
                  "drop-shadow(0 0 22px rgba(34,197,94,0.5))",
                ],
                scale: [1, 1.03, 1.015],
              }
            : isLoser
              ? {
                  filter: [
                    "drop-shadow(0 0 0 rgba(239,68,68,0))",
                    "drop-shadow(0 0 28px rgba(239,68,68,0.55)) grayscale(0.4)",
                    "drop-shadow(0 0 16px rgba(239,68,68,0.4)) grayscale(0.5)",
                  ],
                  opacity: [1, 0.94, 0.82],
                  x: [0, -4, 4, -2, 2, 0],
                }
              : { filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12))" }
        }
        transition={{
          delay: 1.5,
          duration: isLoser ? 1 : 0.9,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="flex w-[260px] flex-col items-center gap-5 rounded-3xl border border-border bg-background/70 px-8 py-10 backdrop-blur"
      >
        <div className="relative">
          <Image
            src={user.avatar_url}
            alt={user.login}
            width={140}
            height={140}
            className="rounded-full border-4 border-background shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
            unoptimized
          />
        </div>

        <div className="flex flex-col items-center gap-0.5 text-center">
          <h3 className="text-xl font-bold tracking-tight">
            {user.name || user.login}
          </h3>
          <p className="font-mono text-xs text-muted-foreground">
            @{user.login}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="font-mono text-base font-bold tabular-nums">
            {totalStars.toLocaleString()}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            stars
          </span>
        </div>
      </motion.section>

      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.7 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{
          delay: 1.8,
          type: "spring",
          stiffness: 320,
          damping: 22,
        }}
        className="mt-4 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={
            isWinner
              ? { y: [0, -4, 0] }
              : isLoser
                ? { rotate: [0, -2, 2, -2, 0] }
                : {}
          }
          transition={{
            delay: 2,
            duration: 1.2,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg",
            isWinner && "bg-green-500 shadow-green-500/40",
            isLoser && "bg-red-500 shadow-red-500/40",
            isTie && "bg-zinc-500 shadow-zinc-500/40",
          )}
        >
          {isWinner && <Crown size={14} />}
          {isLoser && <Skull size={14} />}
          {isTie && "TIE"}
          <span className="font-mono">{score.toLocaleString()}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
