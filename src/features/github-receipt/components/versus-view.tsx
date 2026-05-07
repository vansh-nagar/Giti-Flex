"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Check, Crown, Layers, Link2, Skull, Star, Sword, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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

  const handleShareX = () =>
    openShare(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    );
  const handleShareFacebook = () =>
    openShare(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    );
  const handleShareLinkedIn = () =>
    openShare(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    );
  const handleShareReddit = () =>
    openShare(
      `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
    );
  const handleShareWhatsApp = () =>
    openShare(
      `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    );

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
        <Button onClick={onClose} variant="default">
          <X size={16} />
          Exit Versus
        </Button>
      </motion.div>

      <div className="flex w-full items-center justify-center gap-6 px-4">
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
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Share this battle
        </p>
        <div className="flex items-center gap-2">
          <ShareIconButton label="Share on X" onClick={handleShareX}>
            <XLogo />
          </ShareIconButton>
          <ShareIconButton
            label="Share on Facebook"
            onClick={handleShareFacebook}
          >
            <FacebookLogo />
          </ShareIconButton>
          <ShareIconButton
            label="Share on LinkedIn"
            onClick={handleShareLinkedIn}
          >
            <LinkedInLogo />
          </ShareIconButton>
          <ShareIconButton
            label="Share on Reddit"
            onClick={handleShareReddit}
          >
            <RedditLogo />
          </ShareIconButton>
          <ShareIconButton
            label="Share on WhatsApp"
            onClick={handleShareWhatsApp}
          >
            <WhatsAppLogo />
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

        <Button
          variant="outline"
          onClick={onBrowseOpponents}
          className="mt-4"
        >
          <Layers size={16} />
          Browse opponents
        </Button>
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
      <Button
        variant="outline"
        size="icon"
        onClick={onClick}
        title={label}
        aria-label={label}
        className="size-10"
      >
        {children}
      </Button>
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

function FacebookLogo() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function RedditLogo() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

function WhatsAppLogo() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892-1.99 0-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
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
