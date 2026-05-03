"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { Crown, Skull, Swords, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ReceiptCard } from "./receipt-card";
import type { BackgroundItem, GitHubRepo, GitHubUser } from "../types";
import { getDefaultCustomization, getReceiptThemeStyles } from "../utils";

interface VersusViewProps {
  user: GitHubUser;
  repos: GitHubRepo[];
  opponent: GitHubUser;
  opponentRepos: GitHubRepo[];
  selectedBackground: BackgroundItem;
  onClose: () => void;
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
  selectedBackground,
  onClose,
}: VersusViewProps) {
  const userRef = useRef<HTMLElement>(null);
  const oppRef = useRef<HTMLElement>(null);

  const userScore = calcScore(user, repos);
  const oppScore = calcScore(opponent, opponentRepos);
  const tie = userScore === oppScore;
  const userWins = !tie && userScore > oppScore;

  const customization = getDefaultCustomization(selectedBackground);
  const themeStyles = getReceiptThemeStyles(selectedBackground, customization);

  return (
    <div className="relative w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-4 right-4 z-50"
      >
        <Button onClick={onClose} variant="default">
          <X size={16} />
          Exit Versus
        </Button>
      </motion.div>

      <div className="flex items-center justify-center gap-6 w-full px-4 overflow-x-auto">
        <ContestantSide
          ref={userRef}
          side="left"
          user={user}
          repos={repos}
          totalStars={totalStarsOf(repos)}
          score={userScore}
          isWinner={userWins}
          isLoser={!tie && !userWins}
          isTie={tie}
          selectedBackground={selectedBackground}
          themeStyles={themeStyles}
        />

        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{
            scale: [0, 1.6, 1],
            rotate: [180, 12, -8, 0],
            opacity: [0, 1, 1],
          }}
          transition={{
            delay: 0.6,
            duration: 0.7,
            times: [0, 0.6, 1],
            ease: [0.23, 1, 0.32, 1],
          }}
          className="z-10 flex flex-col items-center gap-3 shrink-0"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{
                delay: 1.4,
                duration: 0.6,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 1.4,
              }}
              className="rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 p-4 shadow-[0_0_50px_rgba(239,68,68,0.45)]"
            >
              <Swords size={42} className="text-white" strokeWidth={2.5} />
            </motion.div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-5xl font-black text-transparent">
            VS
          </div>
        </motion.div>

        <ContestantSide
          ref={oppRef}
          side="right"
          user={opponent}
          repos={opponentRepos}
          totalStars={totalStarsOf(opponentRepos)}
          score={oppScore}
          isWinner={!tie && !userWins}
          isLoser={!tie && userWins}
          isTie={tie}
          selectedBackground={selectedBackground}
          themeStyles={themeStyles}
        />
      </div>
    </div>
  );
}

interface ContestantSideProps {
  ref: React.RefObject<HTMLElement | null>;
  side: "left" | "right";
  user: GitHubUser;
  repos: GitHubRepo[];
  totalStars: number;
  score: number;
  isWinner: boolean;
  isLoser: boolean;
  isTie: boolean;
  selectedBackground: BackgroundItem;
  themeStyles: ReturnType<typeof getReceiptThemeStyles>;
}

function ContestantSide({
  ref,
  side,
  user,
  repos,
  totalStars,
  score,
  isWinner,
  isLoser,
  isTie,
  selectedBackground,
  themeStyles,
}: ContestantSideProps) {
  const fromX = side === "left" ? -360 : 360;
  const tiltAngle = side === "left" ? -10 : 10;

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
      <motion.div
        animate={
          isWinner
            ? {
                filter: [
                  "drop-shadow(0 0 0 rgba(34,197,94,0))",
                  "drop-shadow(0 0 40px rgba(34,197,94,0.85))",
                  "drop-shadow(0 0 25px rgba(34,197,94,0.6))",
                ],
                scale: [1, 1.04, 1.02],
              }
            : isLoser
              ? {
                  filter: [
                    "drop-shadow(0 0 0 rgba(239,68,68,0))",
                    "drop-shadow(0 0 35px rgba(239,68,68,0.7)) grayscale(0.5)",
                    "drop-shadow(0 0 20px rgba(239,68,68,0.5)) grayscale(0.6)",
                  ],
                  opacity: [1, 0.92, 0.78],
                  x: [0, -6, 6, -4, 4, 0],
                }
              : { filter: "drop-shadow(0 0 18px rgba(99,102,241,0.5))" }
        }
        transition={{
          delay: 1.5,
          duration: isLoser ? 1 : 0.9,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        <ReceiptCard
          receiptRef={ref}
          repos={repos}
          selectedBackground={selectedBackground}
          themeStyles={themeStyles}
          totalStars={totalStars}
          user={user}
        />
      </motion.div>

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
        <span className="text-xs text-muted-foreground font-mono">
          @{user.login}
        </span>
      </motion.div>
    </motion.div>
  );
}
