"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  BookOpen,
  Code,
  ExternalLink,
  GitFork,
  Star,
  UserPlus,
  Users,
} from "@/components/icons";
import { useState, type RefObject } from "react";

import { cn } from "@/lib/utils";
import type {
  BackgroundItem,
  GitHubRepo,
  GitHubUser,
  ReceiptMetric,
  ReceiptThemeStyles,
} from "../types";
import { formatMemberSince, formatPrintedAt } from "../utils";

interface ReceiptCardProps {
  receiptRef: RefObject<HTMLElement | null>;
  repos: GitHubRepo[];
  selectedBackground: BackgroundItem;
  themeStyles: ReceiptThemeStyles;
  totalStars: number;
  metric?: ReceiptMetric;
  contributions?: number | null;
  /** Plays the "printing out of the slot" animation once on mount. */
  print?: boolean;
  user: GitHubUser;
}

const barcodePattern = [1, 2, 3, 1, 2, 1, 3, 2, 1, 2];

// "Printing out" in bursts: the paper jumps a chunk, then holds, like a real
// receipt printer feeding line groups. Each plateau is duplicated so the value
// stays put (a pause) between quick advances.
const PRINT_KEYFRAMES = [
  "-100%",
  "-83.3%",
  "-83.3%",
  "-66.6%",
  "-66.6%",
  "-50%",
  "-50%",
  "-33.3%",
  "-33.3%",
  "-16.6%",
  "-16.6%",
  "0%",
];
// Quick advance (~0.04) followed by a longer hold (~0.152) between each chunk.
const PRINT_TIMES = [
  0, 0.04, 0.192, 0.232, 0.384, 0.424, 0.576, 0.616, 0.768, 0.808, 0.96, 1,
];
// Once printing finishes, let the receipt drop a little further off the
// dispenser so it doesn't visually rest on the machine.
const REST_OFFSET = 28;

export function ReceiptCard({
  receiptRef,
  repos,
  selectedBackground,
  themeStyles,
  totalStars,
  metric = "stars",
  contributions = null,
  print = false,
  user,
}: ReceiptCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const animateIn = print && !prefersReducedMotion;
  // Play the print sequence once; afterwards stay at rest so later re-renders
  // (background swap, metric toggle) don't replay the keyframes.
  const [printed, setPrinted] = useState(!animateIn);
  const showContributions = metric === "contributions" && contributions !== null;
  const headlineLabel = showContributions ? "CONTRIBUTIONS" : "TOTAL STARS";
  const headlineValue = showContributions
    ? contributions.toLocaleString()
    : totalStars.toLocaleString();
  const {
    backgroundColor,
    barcodeColor,
    borderColor,
    dashPattern,
    dotBorderColor,
    headingColor,
    sectionDash,
    textColor,
  } = themeStyles;

  const invoice = (
    <div
      ref={receiptRef as RefObject<HTMLDivElement | null>}
      className={cn(
        "gh-receipt__invoice",
        print && "gh-receipt__invoice--torn",
      )}
      style={{
        backgroundColor,
        color: textColor,
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
            <div style={{ position: "absolute", inset: 0, zIndex: -1 }}>
              {selectedBackground.component}
            </div>

            <h2 className="gh-receipt__title" style={{ color: headingColor }}>
              <span
                style={{
                  position: "absolute",
                  height: "1.5px",
                  width: "100%",
                  top: 0,
                  left: 0,
                  backgroundImage: dashPattern,
                }}
              />
              GitHub Receipt — @{user.login}
              <span
                style={{
                  position: "absolute",
                  height: "1.5px",
                  width: "100%",
                  bottom: 0,
                  left: 0,
                  backgroundImage: dashPattern,
                }}
              />
            </h2>

            <div
              className="gh-receipt__header"
              style={{ borderBottom: `1.5px dashed ${borderColor}` }}
            >
              <motion.div
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{ display: "inline-block" }}
              >
                <Image
                  className="gh-receipt__avatar"
                  src={user.avatar_url}
                  alt={user.login}
                  width={52}
                  height={52}
                  style={{ borderColor: dotBorderColor }}
                  unoptimized
                />
              </motion.div>
              <div className="gh-receipt__name" style={{ color: headingColor }}>
                {user.name || user.login}
              </div>
              <div className="gh-receipt__login" style={{ color: textColor }}>
                @{user.login}
              </div>
              {user.bio && (
                <div className="gh-receipt__bio" style={{ color: textColor }}>
                  &ldquo;{user.bio}&rdquo;
                </div>
              )}
            </div>

            <div
              className="gh-receipt__stats"
              style={{ borderBottom: `1.5px dashed ${borderColor}` }}
            >
              {[
                { value: user.public_repos, label: "Repos", Icon: BookOpen },
                { value: user.followers, label: "Followers", Icon: Users },
                { value: user.following, label: "Following", Icon: UserPlus },
              ].map(({ value, label, Icon }, index) => (
                <motion.div
                  key={label}
                  className="gh-receipt__stat"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.06 * index,
                  }}
                >
                  <span
                    className="gh-receipt__stat-value"
                    style={{ color: headingColor }}
                  >
                    {value}
                  </span>
                  <span
                    className="gh-receipt__stat-label"
                    style={{ color: textColor }}
                  >
                    <Icon size={10} /> {label}
                  </span>
                </motion.div>
              ))}
            </div>

            <div
              className="gh-receipt__section-title"
              style={{ color: textColor }}
            >
              Top Repositories
              <span
                style={{
                  flex: 1,
                  height: "1px",
                  background: sectionDash,
                }}
              />
            </div>

            <ul className="gh-receipt__repos">
              {repos.map((repo, index) => (
                <motion.li
                  key={repo.id}
                  className="gh-receipt__repo"
                  style={{
                    borderBottom:
                      index === repos.length - 1
                        ? "none"
                        : `1px dashed ${borderColor}`,
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.04 * index,
                  }}
                >
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gh-receipt__repo-name"
                    style={{ color: headingColor, textDecoration: "none" }}
                  >
                    {repo.name}
                    <ExternalLink size={11} color={textColor} />
                  </a>
                  {repo.description && (
                    <div
                      className="gh-receipt__repo-desc"
                      style={{ color: textColor }}
                    >
                      {repo.description}
                    </div>
                  )}
                  <div
                    className="gh-receipt__repo-meta"
                    style={{ color: textColor }}
                  >
                    {repo.language && (
                      <span>
                        <Code size={11} color={textColor} />
                        {repo.language}
                      </span>
                    )}
                    <span>
                      <Star size={8} /> {repo.stargazers_count}
                    </span>
                    <span>
                      <GitFork size={11} /> {repo.forks_count}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div
              className="gh-receipt__footer"
              style={{ borderTop: `1.5px dashed ${borderColor}` }}
            >
              <div className="gh-receipt__total-row">
                <span style={{ color: textColor }}>{headlineLabel}</span>
                <motion.span
                  key={headlineValue}
                  className="gh-receipt__total-value gh-receipt__total-value--lead"
                  style={{
                    color: headingColor,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25em",
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {!showContributions && <Star size="1em" />}
                  {headlineValue}
                </motion.span>
              </div>
              <div className="gh-receipt__total-row">
                <span style={{ color: textColor }}>MEMBER SINCE</span>
                <span
                  className="gh-receipt__total-value"
                  style={{ color: headingColor }}
                >
                  {formatMemberSince(user.created_at)}
                </span>
              </div>

              <div className="gh-receipt__barcode">
                {Array.from({ length: 40 }).map((_, index) => {
                  const width = barcodePattern[index % barcodePattern.length];

                  return (
                    <span
                      key={index}
                      className="gh-receipt__barcode-bar"
                      style={{
                        width: `${width}px`,
                        backgroundColor: barcodeColor,
                      }}
                    />
                  );
                })}
              </div>

              <div className="gh-receipt__date" style={{ color: textColor }}>
                PRINTED {formatPrintedAt()}
              </div>

              <div className="gh-receipt__tagline" style={{ color: textColor }}>
                Thank you for your contributions
              </div>
            </div>
    </div>
  );

  const body = print ? (
    <div className="gh-printer">
      <div className="gh-printer__machine" aria-hidden>
        <span className="gh-printer__brand">giti·flex</span>
        <span className="gh-printer__led" />
        <span className="gh-printer__mouth" />
      </div>
      <div className="gh-printer__feed">
        <motion.div
          className="gh-receipt__paper gh-receipt__paper--shadow"
          initial={animateIn ? { y: "-100%" } : false}
          animate={
            animateIn && !printed ? { y: PRINT_KEYFRAMES } : { y: REST_OFFSET }
          }
          transition={
            animateIn && !printed
              ? { duration: 3.6, times: PRINT_TIMES, ease: "linear" }
              : printed
                ? { type: "spring", stiffness: 220, damping: 26 }
                : { duration: 0 }
          }
          onAnimationComplete={() => {
            if (animateIn) setPrinted(true);
          }}
        >
          {invoice}
        </motion.div>
      </div>
    </div>
  ) : (
    <section className="gh-receipt__invoice-container">{invoice}</section>
  );

  return (
    <motion.div
      layout
      transition={{
        duration: 0.45,
        ease: [0.23, 1, 0.32, 1],
      }}
      style={{ width: "100%", maxWidth: 425, flexShrink: 1, minWidth: 0 }}
    >
      <section className="gh-receipt">{body}</section>
    </motion.div>
  );
}
