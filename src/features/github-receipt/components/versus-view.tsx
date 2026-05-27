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
  Swords,
  Users,
  X,
} from "@/components/icons";

import SoftPillButton from "@/components/ui/soft-pill-button";
import { cn } from "@/lib/utils";

import type { GitHubRepo, GitHubUser } from "../types";

type Metric = "stars" | "followers";

interface VersusViewProps {
  user: GitHubUser;
  repos: GitHubRepo[];
  opponent: GitHubUser;
  opponentRepos: GitHubRepo[];
  onClose: () => void;
  onBrowseOpponents: () => void;
}

function totalStarsOf(repos: GitHubRepo[]) {
  return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
}

function chooseMetric(a: string, b: string): Metric {
  const combined = [a.toLowerCase(), b.toLowerCase()].sort().join("|");
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 2 === 0 ? "stars" : "followers";
}

function scoreFor(metric: Metric, user: GitHubUser, totalStars: number) {
  return metric === "stars" ? totalStars : user.followers;
}

const ROULETTE_ITEM_H = 36;
const ROULETTE_CYCLES = 12;
const ROULETTE_DURATION = 1.6;
const ROULETTE_DELAY = 0.2;
const REVEAL_DELAY_MS = (ROULETTE_DURATION + ROULETTE_DELAY) * 1000 + 100;

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
  const [metric] = useState<Metric>(() =>
    chooseMetric(user.login, opponent.login),
  );
  const [revealed, setRevealed] = useState(false);

  const userStars = totalStarsOf(repos);
  const oppStars = totalStarsOf(opponentRepos);
  const userScore = scoreFor(metric, user, userStars);
  const oppScore = scoreFor(metric, opponent, oppStars);
  const tie = userScore === oppScore;
  const userWins = !tie && userScore > oppScore;

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!revealed) return;
    if (battleRecorded.current) return;
    battleRecorded.current = true;
    const winner = tie ? user.login : userWins ? user.login : opponent.login;
    const loser = tie ? opponent.login : userWins ? opponent.login : user.login;
    fetch("/api/battle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winner, loser, isTie: tie }),
    }).catch((error) => console.error("Failed to record battle:", error));
  }, [revealed, user.login, opponent.login, tie, userWins]);

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
        <SoftPillButton onClick={onClose} variant="primary" className="py-2.5">
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
          totalStars={userStars}
          score={userScore}
          metric={metric}
          revealed={revealed}
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
            className="flex items-center justify-center size-14 rounded-full bg-white/90 text-neutral-900 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12),0_4px_8px_-2px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] [backdrop-filter:blur(6px)] ring-1 ring-black/6"
          >
            <Swords size={22} strokeWidth={2} />
          </motion.div>
          <div className="text-3xl font-medium tracking-[-0.04em] text-zinc-900">
            VS
          </div>
          <MetricRoulette metric={metric} revealed={revealed} />
        </motion.div>

        <ContestantSide
          ref={oppRef}
          side="right"
          user={opponent}
          totalStars={oppStars}
          score={oppScore}
          metric={metric}
          revealed={revealed}
          isWinner={!tie && !userWins}
          isLoser={!tie && userWins}
          isTie={tie}
        />
      </div>

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.7,
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
            className="mt-4 py-2.5"
          >
            <Layers size={16} />
            Browse opponents
          </SoftPillButton>
        </motion.div>
      )}
    </div>
  );
}

interface MetricRouletteProps {
  metric: Metric;
  revealed: boolean;
}

function MetricRoulette({ metric, revealed }: MetricRouletteProps) {
  const items: Metric[] = [];
  for (let i = 0; i < ROULETTE_CYCLES; i++) {
    items.push(i % 2 === 0 ? "stars" : "followers");
  }
  items.push(metric);
  const targetY = -(items.length - 1) * ROULETTE_ITEM_H;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-white/90 backdrop-blur shadow-[0_8px_20px_-8px_rgba(0,0,0,0.18)] transition-all duration-300",
        revealed && "ring-2 ring-amber-300/70 ring-offset-2 ring-offset-background",
      )}
      style={{ height: ROULETTE_ITEM_H, width: 168 }}
    >
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: targetY }}
        transition={{
          duration: ROULETTE_DURATION,
          ease: [0.16, 1, 0.3, 1],
          delay: ROULETTE_DELAY,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-center gap-1.5 px-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-900"
            style={{ height: ROULETTE_ITEM_H }}
          >
            {item === "stars" ? (
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
            ) : (
              <Users className="size-3.5 text-zinc-700" />
            )}
            {item}
          </div>
        ))}
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
  metric: Metric;
  revealed: boolean;
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
  metric,
  revealed,
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
          !revealed
            ? { filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12))" }
            : isWinner
              ? {
                  filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12))",
                  scale: [1, 1.03, 1.015],
                }
              : isLoser
                ? {
                    filter:
                      "drop-shadow(0 8px 24px rgba(0,0,0,0.12)) grayscale(0.5)",
                    opacity: [1, 0.94, 0.82],
                    x: [0, -4, 4, -2, 2, 0],
                  }
                : { filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12))" }
        }
        transition={{
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

        <div className="group/stars flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2">
          <Star className="size-4 text-amber-400 fill-transparent transition-colors duration-200 group-hover/stars:fill-amber-400" />
          <span className="font-mono text-base font-bold tabular-nums">
            {totalStars.toLocaleString()}
          </span>
        </div>
      </motion.section>

      {revealed && (
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.7 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
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
              delay: 0.4,
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
            <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">
              {metric}
            </span>
          </motion.div>

          {!isTie && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 360,
                damping: 20,
              }}
              className={cn(
                "font-mono text-sm font-bold tabular-nums",
                isWinner && "text-green-600",
                isLoser && "text-red-600",
              )}
            >
              {isWinner ? "+10" : "-10"} pts
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
