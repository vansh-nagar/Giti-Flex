"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "motion/react";
import { Sword, Users, X } from "lucide-react";

import SoftPillButton from "@/components/ui/soft-pill-button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

import type { GitHubRepo, GitHubUser } from "../types";
import { fetchOpponentLogins } from "../utils";

const VISIBLE_CARDS = 3;
const BUFFER_TARGET = 5;
const SWIPE_COMMIT_DISTANCE = 130;
const SWIPE_COMMIT_VELOCITY = 500;

function computeMinFollowers(selfFollowers: number) {
  return Math.max(20, Math.min(2000, Math.floor(selfFollowers * 0.7)));
}

type CardStatus = "loading" | "ready" | "error";

interface CardSlot {
  id: string;
  login: string;
  status: CardStatus;
  user?: GitHubUser;
  totalStars?: number;
}

interface OpponentDeckProps {
  open: boolean;
  selfLogin: string;
  selfUser: GitHubUser;
  selfFollowers: number;
  onClose: () => void;
  onPick: (login: string) => void;
}

async function loadCardData(login: string) {
  const [user, repos] = await Promise.all([
    fetch(`/api/github/users/${login}`).then((response) => {
      if (!response.ok) throw new Error("user");
      return response.json() as Promise<GitHubUser>;
    }),
    fetch(`/api/github/users/${login}/repos?per_page=100&sort=updated`).then(
      (response) => {
        if (!response.ok) throw new Error("repos");
        return response.json() as Promise<GitHubRepo[]>;
      },
    ),
  ]);
  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0,
  );
  return { user, totalStars };
}

export function OpponentDeck({
  open,
  selfLogin,
  selfUser,
  selfFollowers,
  onClose,
  onPick,
}: OpponentDeckProps) {
  const minFollowers = computeMinFollowers(selfFollowers);
  const [deck, setDeck] = useState<CardSlot[]>([]);
  const [refilling, setRefilling] = useState(false);
  const [refillError, setRefillError] = useState<string | null>(null);
  const slotSeq = useRef(0);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (!open) {
      cancelRef.current = true;
      setDeck([]);
      setRefilling(false);
      setRefillError(null);
    } else {
      cancelRef.current = false;
    }
  }, [open]);

  const refill = useCallback(async () => {
    if (cancelRef.current) return;
    setRefilling(true);
    setRefillError(null);
    try {
      const logins = await fetchOpponentLogins(
        BUFFER_TARGET,
        minFollowers,
        selfLogin,
      );
      if (cancelRef.current) return;
      const fresh: CardSlot[] = logins.map((login) => ({
        id: `slot-${slotSeq.current++}`,
        login,
        status: "loading",
      }));
      setDeck((prev) => [...prev, ...fresh]);

      fresh.forEach((slot) => {
        loadCardData(slot.login)
          .then(({ user, totalStars }) => {
            if (cancelRef.current) return;
            if (totalStars === 0) {
              setDeck((prev) => prev.filter((card) => card.id !== slot.id));
              return;
            }
            setDeck((prev) =>
              prev.map((card) =>
                card.id === slot.id
                  ? { ...card, status: "ready", user, totalStars }
                  : card,
              ),
            );
          })
          .catch(() => {
            if (cancelRef.current) return;
            setDeck((prev) => prev.filter((card) => card.id !== slot.id));
          });
      });
    } catch (error) {
      console.error("Deck refill failed:", error);
      if (!cancelRef.current) {
        const message =
          error instanceof Error
            ? error.message
            : "Couldn't fetch opponents. Try again.";
        setRefillError(message);
      }
    } finally {
      if (!cancelRef.current) setRefilling(false);
    }
  }, [minFollowers, selfLogin]);

  useEffect(() => {
    if (!open || refilling || refillError) return;
    const liveCount = deck.filter((card) => card.status !== "error").length;
    if (liveCount < BUFFER_TARGET) {
      refill();
    }
  }, [deck, open, refill, refilling, refillError]);

  const handleManualRefill = useCallback(() => {
    setRefillError(null);
    refill();
  }, [refill]);

  const handleSkip = useCallback((id: string) => {
    setDeck((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const handleFight = useCallback(
    (slot: CardSlot) => {
      if (slot.status !== "ready" || !slot.user) return;
      onPick(slot.user.login);
    },
    [onPick],
  );

  const visible = deck.slice(0, VISIBLE_CARDS);
  const top = visible[0];
  const topReady = top && top.status === "ready" && top.user;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="opponent-deck-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between gap-6 overflow-hidden bg-background/95 px-4 pt-6 pb-8 backdrop-blur-md"
        >
          <div className="flex w-full max-w-md items-center justify-between gap-3">
            <SelfCard user={selfUser} followers={selfFollowers} />
            <SoftPillButton
              variant="secondary"
              onClick={onClose}
              aria-label="Close opponent deck"
              className="size-9 px-0! py-0!"
            >
              <X size={16} />
            </SoftPillButton>
          </div>

          <div className="relative flex h-105 w-full max-w-sm items-center justify-center">
            <AnimatePresence initial={false}>
              {visible.length === 0 && !refilling && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <p className="text-sm text-muted-foreground">
                    {refillError ?? "Out of opponents."}
                  </p>
                  <SoftPillButton
                    variant="secondary"
                    onClick={handleManualRefill}
                  >
                    Find more
                  </SoftPillButton>
                </motion.div>
              )}

              {visible.length === 0 && refilling && (
                <motion.div
                  key="refilling"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 text-muted-foreground"
                >
                  <Spinner className="size-6" />
                  <p className="text-sm">Shuffling opponents…</p>
                </motion.div>
              )}

              {visible.map((slot, index) => (
                <DeckCard
                  key={slot.id}
                  slot={slot}
                  index={index}
                  isTop={index === 0}
                  onSkip={() => handleSkip(slot.id)}
                  onFight={() => handleFight(slot)}
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="flex w-full max-w-sm flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              <SoftPillButton
                variant="secondary"
                className="size-16 px-0! py-0!"
                onClick={() => top && handleSkip(top.id)}
                disabled={!top}
                aria-label="Skip opponent"
              >
                <X size={26} />
              </SoftPillButton>
              <SoftPillButton
                variant="primary"
                className="size-16 px-0! py-0!"
                onClick={() => top && handleFight(top)}
                disabled={!topReady}
                aria-label="Challenge opponent"
              >
                <Sword size={24} />
              </SoftPillButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface SelfCardProps {
  user: GitHubUser;
  followers: number;
}

function SelfCard({ user, followers }: SelfCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-border bg-background/80 py-1.5 pr-4 pl-1.5 shadow-sm">
      <Image
        src={user.avatar_url}
        alt={user.login}
        width={36}
        height={36}
        className="rounded-full"
        unoptimized
      />
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Your card
        </span>
        <span className="font-mono text-xs font-semibold">@{user.login}</span>
      </div>
      <div className="flex items-center gap-1 border-l border-border pl-3 text-xs">
        <Users className="size-3 text-sky-500" />
        <span className="font-mono tabular-nums">
          {followers.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

interface DeckCardProps {
  slot: CardSlot;
  index: number;
  isTop: boolean;
  onSkip: () => void;
  onFight: () => void;
}

function DeckCard({ slot, index, isTop, onSkip, onFight }: DeckCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const fightOpacity = useTransform(x, [40, 140], [0, 1]);
  const skipOpacity = useTransform(x, [-140, -40], [1, 0]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (!isTop) return;
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset > SWIPE_COMMIT_DISTANCE || velocity > SWIPE_COMMIT_VELOCITY) {
      if (slot.status === "ready") {
        onFight();
      } else {
        onSkip();
      }
    } else if (
      offset < -SWIPE_COMMIT_DISTANCE ||
      velocity < -SWIPE_COMMIT_VELOCITY
    ) {
      onSkip();
    }
  };

  const offsetY = index * 12;
  const scale = 1 - index * 0.05;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: scale * 0.95, y: offsetY + 20 }}
      animate={{
        opacity: 1,
        scale,
        y: offsetY,
        zIndex: VISIBLE_CARDS - index,
      }}
      exit={{
        x: x.get() > 0 ? 600 : x.get() < 0 ? -600 : 0,
        opacity: 0,
        rotate: x.get() > 0 ? 24 : x.get() < 0 ? -24 : 0,
        transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      drag={isTop ? "x" : false}
      dragElastic={0.5}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x: isTop ? x : 0, rotate: isTop ? rotate : 0 }}
      className={cn(
        "absolute h-100 w-75 cursor-grab overflow-hidden rounded-3xl border border-border bg-background shadow-[0_20px_60px_rgba(0,0,0,0.18)] active:cursor-grabbing",
        !isTop && "pointer-events-none",
      )}
    >
      {slot.status === "loading" && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
          <Spinner className="size-6" />
          <span className="font-mono text-xs">@{slot.login}</span>
        </div>
      )}

      {slot.status === "error" && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
          <p className="text-sm">Couldn&apos;t load this user.</p>
          <SoftPillButton variant="secondary" onClick={onSkip}>
            Skip
          </SoftPillButton>
        </div>
      )}

      {slot.status === "ready" && slot.user && (
        <>
          <div className="flex h-full w-full flex-col items-center justify-center gap-5 px-6 py-8">
            <Image
              src={slot.user.avatar_url}
              alt={slot.user.login}
              width={160}
              height={160}
              className="rounded-full border-4 border-background shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
              unoptimized
            />
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-xl font-bold tracking-tight">
                {slot.user.name || slot.user.login}
              </h3>
              <p className="font-mono text-xs text-muted-foreground">
                @{slot.user.login}
              </p>
            </div>
            <Stat
              icon={<Users className="size-4 text-sky-500" />}
              value={slot.user.followers.toLocaleString()}
              label="followers"
            />
          </div>

          {isTop && (
            <>
              <motion.div
                style={{ opacity: fightOpacity }}
                className="pointer-events-none absolute top-6 left-6 -rotate-12 rounded-md border-2 border-green-500 px-3 py-1 text-sm font-black tracking-widest text-green-500"
              >
                FIGHT
              </motion.div>
              <motion.div
                style={{ opacity: skipOpacity }}
                className="pointer-events-none absolute top-6 right-6 rotate-12 rounded-md border-2 border-red-500 px-3 py-1 text-sm font-black tracking-widest text-red-500"
              >
                SKIP
              </motion.div>
            </>
          )}
        </>
      )}
    </motion.div>
  );
}

interface StatProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function Stat({ icon, value, label }: StatProps) {
  return (
    <SoftPillButton
      variant="secondary"
      type="button"
      tabIndex={-1}
      className="cursor-default px-3! py-1.5! text-sm"
    >
      {icon}
      <span className="font-mono font-bold tabular-nums">{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </SoftPillButton>
  );
}
