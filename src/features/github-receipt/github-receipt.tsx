"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Palette } from "@/components/icons";

import SoftPillButton from "@/components/ui/soft-pill-button";
import { SiteHeader } from "@/components/layout/site-header";
import { backgroundOptions } from "./constants";
import { CustomizationPanel } from "./components/customization-panel";
import { ExportDialog } from "./components/export-dialog";
import { GithubReceiptSearch } from "./components/github-receipt-search";
import { ReceiptCard } from "./components/receipt-card";
import { githubReceiptStyles } from "./styles";
import type {
  BackgroundItem,
  GitHubRepo,
  GitHubUser,
  ReceiptMetric,
} from "./types";
import {
  getDefaultCustomization,
  getReceiptThemeStyles,
  getTopRepos,
} from "./utils";

interface GithubReceiptProps {
  username?: string;
}

export function GithubReceipt({ username }: GithubReceiptProps = {}) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [contributions, setContributions] = useState<number | null>(null);
  const [metric, setMetric] = useState<ReceiptMetric>("stars");
  const [customizing, setCustomizing] = useState(true);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundItem>(
    () =>
      backgroundOptions.find((bg) => bg.name === "Holographic") ??
      backgroundOptions[0],
  );
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportScale, setExportScale] = useState(2);
  const [exportName, setExportName] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [inputUsername, setInputUsername] = useState(username || "");
  const [submittedUsername, setSubmittedUsername] = useState<string | null>(
    username || null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const receiptRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (user) {
      setExportName(`github-receipt-${user.login}`);
    }
  }, [user]);

  const lastSyncedPropRef = useRef<string | null>(null);
  const lastFetchedRef = useRef<string | null>(null);

  const fetchGithubData = useCallback((username: string) => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`/api/github/users/${username}`).then((response) => {
        if (!response.ok) {
          throw new Error("User not found");
        }

        return response.json() as Promise<GitHubUser>;
      }),
      fetch(
        `/api/github/users/${username}/repos?per_page=100&sort=updated`,
      ).then((response) => {
        if (!response.ok) {
          throw new Error("Could not fetch repositories");
        }
        return response.json() as Promise<GitHubRepo[]>;
      }),
      // Contributions are optional — never let them reject the whole batch.
      fetch(`/api/github/contributions/${username}`)
        .then((response) =>
          response.ok
            ? (response.json() as Promise<{
                available: boolean;
                total?: number;
              }>)
            : { available: false as const },
        )
        .catch(() => ({ available: false as const })),
    ])
      .then(([fetchedUser, allRepos, contributionsResult]) => {
        setUser(fetchedUser);
        setRepos(getTopRepos(allRepos));
        setContributions(
          contributionsResult.available &&
            typeof contributionsResult.total === "number"
            ? contributionsResult.total
            : null,
        );
      })
      .catch((fetchError: Error) => {
        setError(fetchError.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!username) return;
    if (lastSyncedPropRef.current?.toLowerCase() === username.toLowerCase()) {
      return;
    }
    lastSyncedPropRef.current = username;
    setUser(null);
    setRepos([]);
    setContributions(null);
    setMetric("stars");
    setError(null);
    setInputUsername(username);
    setSubmittedUsername(username);
  }, [username]);

  useEffect(() => {
    if (!submittedUsername) return;
    if (lastFetchedRef.current === submittedUsername) return;
    lastFetchedRef.current = submittedUsername;
    fetchGithubData(submittedUsername);
  }, [fetchGithubData, submittedUsername]);

  const handleDownload = useCallback(async () => {
    if (!receiptRef.current || downloading) {
      return;
    }

    setShowExportModal(false);
    setDownloading(true);

    try {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });

      const { toPng } = await import("html-to-image");
      const node = receiptRef.current;
      // Use scroll dimensions (transform-independent) so framer-motion's
      // layout/scale transforms don't crop the exported card.
      const dataUrl = await toPng(node, {
        pixelRatio: exportScale,
        cacheBust: true,
        backgroundColor: "transparent",
        width: node.scrollWidth,
        height: node.scrollHeight,
      });

      const link = document.createElement("a");
      link.download = `${exportName || "github-receipt"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (downloadError) {
      console.error("Failed to export image:", downloadError);
    } finally {
      setDownloading(false);
    }
  }, [downloading, exportName, exportScale]);

  if (!submittedUsername || !user) {
    return (
      <GithubReceiptSearch
        error={error}
        inputUsername={inputUsername}
        loading={loading}
        onInputUsernameChange={setInputUsername}
        onSubmit={() => setSubmittedUsername(inputUsername.trim())}
        onSubmitVersus={() => setSubmittedUsername(inputUsername.trim())}
      />
    );
  }

  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0,
  );
  const customization = getDefaultCustomization(selectedBackground);
  const themeStyles = getReceiptThemeStyles(selectedBackground, customization);

  return (
    <>
      <style>{githubReceiptStyles}</style>

      <SiteHeader
        fixed
        actions={
          <AnimatePresence initial={false}>
            {!customizing && (
              <motion.div
                key="open-customizer"
                initial={{ opacity: 0, scale: 0.85, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -4 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                <SoftPillButton
                  className="size-9 sm:w-auto sm:px-4 text-[13px]"
                  variant="primary"
                  onClick={() => setCustomizing(true)}
                  title="Open customizer"
                  aria-label="Open customizer"
                >
                  <Palette size={14} />
                  <span className="hidden sm:inline">Customize</span>
                </SoftPillButton>
              </motion.div>
            )}
          </AnimatePresence>
        }
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          margin: "0 auto",
          paddingTop: "4rem",
          paddingBottom: "4rem",
        }}
      >
        <AnimatePresence initial={false}>
          {customizing && (
            <CustomizationPanel
              key="customization-panel"
              selectedBackground={selectedBackground}
              backgrounds={[...backgroundOptions].reverse()}
              user={user}
              downloading={downloading}
              metric={metric}
              contributions={contributions}
              onMetricChange={setMetric}
              onClose={() => setCustomizing(false)}
              onSelect={setSelectedBackground}
              onOpenExport={() => setShowExportModal(true)}
            />
          )}
        </AnimatePresence>

        <ReceiptCard
          receiptRef={receiptRef}
          repos={repos}
          selectedBackground={selectedBackground}
          themeStyles={themeStyles}
          totalStars={totalStars}
          metric={metric}
          contributions={contributions}
          print
          user={user}
        />
      </div>

      <ExportDialog
        exportName={exportName}
        exportScale={exportScale}
        open={showExportModal}
        onExport={handleDownload}
        onExportNameChange={setExportName}
        onExportScaleChange={setExportScale}
        onOpenChange={setShowExportModal}
      />
    </>
  );
}
