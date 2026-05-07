"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Check, Globe, Link2, Moon, Sun, Trophy, X } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

import DownloadIcon from "./download-icon";

import BookDemoButton from "@/components/ui/book-demo-button";
import SoftPillButton from "@/components/ui/soft-pill-button";
import { cn } from "@/lib/utils";
import GithubLogo from "@/components/logo/github";

import type { BackgroundItem, GitHubUser } from "../types";
import { getBlogUrl, getDisplayBlog } from "../utils";
import { useTheme } from "@/hooks/use-theme";

interface CustomizationPanelProps {
  selectedBackground: BackgroundItem;
  backgrounds: BackgroundItem[];
  user: GitHubUser;
  downloading: boolean;
  onClose: () => void;
  onSelect: (background: BackgroundItem) => void;
  onOpenExport: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.18,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 28, mass: 0.8 },
  },
};

const gridVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.035,
    },
  },
};

const swatchVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 6 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 24 },
  },
};

const iconSwapTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 22,
  mass: 0.7,
};

export function CustomizationPanel({
  selectedBackground,
  backgrounds,
  user,
  downloading,
  onClose,
  onSelect,
  onOpenExport,
}: CustomizationPanelProps) {
  const { theme, toggleTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [downloadHovered, setDownloadHovered] = useState(false);

  const handleCopyShareLink = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/${encodeURIComponent(user.login)}`
        : "";

    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy share link:", error);
    }
  };

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 382, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{
        width: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
        opacity: { duration: 0.25, ease: [0.32, 0.72, 0, 1] },
      }}
      className="sticky top-4 self-start shrink-0"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ width: 350, paddingRight: 32 }}
        className="pt-4"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between mb-2"
        >
          <h3 className="flex items-center gap-1 text-base font-semibold">
            Customize
          </h3>
          <div className="flex items-center gap-1">
            <div
              className="size-9 inline-flex items-center justify-center rounded-full"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.6)",
                boxShadow:
                  "0 12px 24px -8px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
              }}
            >
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
            </div>
            <SoftPillButton
              variant="secondary"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="size-9 px-0! py-0!"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={iconSwapTransition}
                  className="inline-flex"
                >
                  {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                </motion.span>
              </AnimatePresence>
            </SoftPillButton>
            <SoftPillButton
              variant="secondary"
              onClick={onClose}
              className="size-9 px-0! py-0!"
            >
              <motion.span
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="inline-flex"
              >
                <X size={14} />
              </motion.span>
            </SoftPillButton>
          </div>
        </motion.div>

        <motion.div
          variants={gridVariants}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
          }}
          className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto px-2 pt-1 pb-6 [&::-webkit-scrollbar]:hidden"
        >
          {backgrounds.map((background) => {
            const isSelected = selectedBackground.name === background.name;

            return (
              <motion.div
                key={background.name}
                variants={swatchVariants}
                className="text-left"
              >
                <motion.button
                  type="button"
                  aria-label={`Choose ${background.name}`}
                  title={background.description}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{
                    type: "spring",
                    stiffness: 480,
                    damping: 24,
                  }}
                  className={cn(
                    "relative w-full aspect-video h-auto overflow-hidden rounded-[10px] border-2 flex items-center justify-center cursor-pointer transition-colors",
                    isSelected ? "border-primary" : "border-transparent",
                  )}
                  onClick={() => onSelect(background)}
                >
                  <div className="w-full h-full">{background.component}</div>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        key="check"
                        initial={{ opacity: 0, scale: 0.3, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.3, rotate: 45 }}
                        transition={{
                          type: "spring",
                          stiffness: 520,
                          damping: 22,
                        }}
                        className="absolute inset-0 z-10 flex items-center justify-center"
                      >
                        <Check
                          size={18}
                          className="text-white"
                          strokeWidth={3}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.section
          variants={itemVariants}
          className="mt-8 flex flex-col justify-center"
        >
          <motion.div
            variants={itemVariants}
            style={{ marginBottom: "12px" }}
            className="flex justify-between items-center text-sm"
          >
            <p className="text-muted-foreground">Website</p>
            <motion.a
              href={getBlogUrl(user.blog)}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: -2 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              className="flex items-center gap-2 hover:underline text-primary"
              style={{ textDecoration: "none" }}
            >
              <p className="text-foreground font-medium">
                {getDisplayBlog(user.blog)}
              </p>
              <motion.span
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                className="inline-flex"
              >
                <Globe size={16} className="text-primary" />
              </motion.span>
            </motion.a>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -1 }}
              whileTap={{ y: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              style={{ textDecoration: "none" }}
              className="mb-2 block"
            >
              <SoftPillButton variant="secondary" className="w-full">
                <span className="inline-flex items-center justify-center gap-2">
                  <GithubLogo size={16} />
                  View Profile
                </span>
              </SoftPillButton>
            </motion.a>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-2">
            <SoftPillButton
              variant="secondary"
              onClick={handleCopyShareLink}
              className="w-full"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "check" : "link"}
                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                    transition={iconSwapTransition}
                    className="inline-flex"
                  >
                    {copied ? <Check size={16} /> : <Link2 size={16} />}
                  </motion.span>
                </AnimatePresence>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "copied-text" : "link-text"}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.16 }}
                  >
                    {copied ? "Link copied!" : "Copy Share Link"}
                  </motion.span>
                </AnimatePresence>
              </span>
            </SoftPillButton>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-2">
            <Link href="/leaderboard">
              <SoftPillButton variant="secondary" className="w-full">
                <Trophy size={16} />
                Leaderboard
              </SoftPillButton>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-2">
            <Link href="/find-opponent" className="flex-1">
              <BookDemoButton className="w-full">
                Versus Battle
              </BookDemoButton>
            </Link>
            <SoftPillButton
              variant="primary"
              onClick={onOpenExport}
              disabled={downloading}
              onMouseEnter={() => setDownloadHovered(true)}
              onMouseLeave={() => setDownloadHovered(false)}
              className="h-11 flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <DownloadIcon
                size={28}
                className="size-7"
                state={downloadHovered && !downloading ? "done" : "idle"}
              />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={downloading ? "exporting" : "download"}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.16 }}
                >
                  {downloading ? "Exporting..." : "Download"}
                </motion.span>
              </AnimatePresence>
            </SoftPillButton>
          </motion.div>
        </motion.section>
      </motion.div>
    </motion.div>
  );
}
