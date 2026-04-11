"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  BookOpen,
  Download,
  ExternalLink,
  GitFork,
  Globe,
  Palette,
  Star,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import type { RefObject } from "react";

import { Button } from "@/components/ui/button";

import { languageColors } from "../constants";
import type {
  BackgroundItem,
  GitHubRepo,
  GitHubUser,
  ReceiptThemeStyles,
} from "../types";
import {
  formatMemberSince,
  formatPrintedAt,
  getBlogUrl,
  getDisplayBlog,
} from "../utils";
import GithubLogo from "@/components/logo/github";

interface ReceiptCardProps {
  customizing: boolean;
  downloading: boolean;
  onOpenExport: () => void;
  onToggleCustomizing: () => void;
  receiptRef: RefObject<HTMLElement | null>;
  repos: GitHubRepo[];
  selectedBackground: BackgroundItem;
  themeStyles: ReceiptThemeStyles;
  totalStars: number;
  user: GitHubUser;
}

const barcodePattern = [1, 2, 3, 1, 2, 1, 3, 2, 1, 2];

export function ReceiptCard({
  customizing,
  downloading,
  onOpenExport,
  onToggleCustomizing,
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
      <section className="gh-receipt">
        <section ref={receiptRef} className="gh-receipt__invoice-container">
          <div className="gh-receipt__slot">
            <div className="gh-receipt__slot-hole" />
          </div>

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
              <Image
                className="gh-receipt__avatar"
                src={user.avatar_url}
                alt={user.login}
                width={52}
                height={52}
                style={{ borderColor: dotBorderColor }}
                unoptimized
              />
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
              <div className="gh-receipt__stat">
                <span
                  className="gh-receipt__stat-value"
                  style={{ color: headingColor }}
                >
                  {user.public_repos}
                </span>
                <span
                  className="gh-receipt__stat-label"
                  style={{ color: textColor }}
                >
                  <BookOpen size={10} /> Repos
                </span>
              </div>
              <div className="gh-receipt__stat">
                <span
                  className="gh-receipt__stat-value"
                  style={{ color: headingColor }}
                >
                  {user.followers}
                </span>
                <span
                  className="gh-receipt__stat-label"
                  style={{ color: textColor }}
                >
                  <Users size={10} /> Followers
                </span>
              </div>
              <div className="gh-receipt__stat">
                <span
                  className="gh-receipt__stat-value"
                  style={{ color: headingColor }}
                >
                  {user.following}
                </span>
                <span
                  className="gh-receipt__stat-label"
                  style={{ color: textColor }}
                >
                  <UserPlus size={10} /> Following
                </span>
              </div>
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
              {repos.map((repo) => (
                <li
                  key={repo.id}
                  className=" border-b border-dashed"
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
                </li>
              ))}
            </ul>

            <div
              className="gh-receipt__footer"
              style={{ borderTop: `1.5px dashed ${borderColor}` }}
            >
              <div className="gh-receipt__total-row">
                <span style={{ color: textColor }}>TOTAL STARS</span>
                <span
                  className="gh-receipt__total-value"
                  style={{ color: headingColor }}
                >
                  &#9733; {totalStars.toLocaleString()}
                </span>
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

        <hr />
        <div className="gh-receipt__payment-info">
          <p>Website</p>
          <a
            href={getBlogUrl(user.blog)}
            target="_blank"
            rel="noopener noreferrer"
            className="gh-receipt__card-info"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <p>{getDisplayBlog(user.blog)}</p>
            <Globe size={20} color="#1a43bf" />
          </a>
        </div>
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Button className="w-full">
            <GithubLogo size={16} />
            View Profile
          </Button>
        </a>
        <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
          <Button
            variant="outline"
            onClick={onToggleCustomizing}
            style={{ flex: 1 }}
          >
            {customizing ? (
              <>
                <X size={16} /> Close
              </>
            ) : (
              <>
                <Palette size={16} /> Customize
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onOpenExport}
            disabled={downloading}
            style={{ flex: 1 }}
          >
            <Download size={16} />
            {downloading ? "Exporting..." : "Download"}
          </Button>
        </div>
      </section>
    </motion.div>
  );
}
