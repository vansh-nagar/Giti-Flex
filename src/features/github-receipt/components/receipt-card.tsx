"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  BookOpen,
  ExternalLink,
  GitFork,
  Star,
  UserPlus,
  Users,
} from "lucide-react";
import type { RefObject } from "react";

import { languageColors } from "../constants";
import type {
  BackgroundItem,
  GitHubRepo,
  GitHubUser,
  ReceiptThemeStyles,
} from "../types";
import { formatMemberSince, formatPrintedAt } from "../utils";

interface ReceiptCardProps {
  receiptRef: RefObject<HTMLElement | null>;
  repos: GitHubRepo[];
  selectedBackground: BackgroundItem;
  themeStyles: ReceiptThemeStyles;
  totalStars: number;
  user: GitHubUser;
}

const barcodePattern = [1, 2, 3, 1, 2, 1, 3, 2, 1, 2];

export function ReceiptCard({
  receiptRef,
  repos,
  selectedBackground,
  themeStyles,
  totalStars,
  user,
}: ReceiptCardProps) {
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

  return (
    <motion.div
      layout
      transition={{
        duration: 0.45,
        ease: [0.23, 1, 0.32, 1],
      }}
      style={{ flexShrink: 0 }}
    >
      <section ref={receiptRef} className="gh-receipt">
        <section className="gh-receipt__invoice-container">
          <div
            className="gh-receipt__invoice"
            style={{
              backgroundColor,
              color: textColor,
              overflow: "hidden",
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
                  style={{ borderBottom: `1px dashed ${borderColor}` }}
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
                        <span
                          className="gh-receipt__lang-dot"
                          style={{
                            backgroundColor:
                              languageColors[repo.language] || "#888",
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span>
                      <Star size={11} /> {repo.stargazers_count}
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
                <span style={{ color: textColor }}>TOTAL STARS</span>
                <motion.span
                  key={totalStars}
                  className="gh-receipt__total-value"
                  style={{ color: headingColor, display: "inline-block" }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  &#9733; {totalStars.toLocaleString()}
                </motion.span>
              </div>
              <div className="gh-receipt__total-row">
                <span style={{ color: textColor }}>MEMBER SINCE</span>
                <span
                  className="gh-receipt__total-value"
                  style={{ fontSize: "0.82rem", color: headingColor }}
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
        </section>
      </section>
    </motion.div>
  );
}
