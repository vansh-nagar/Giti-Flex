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
import type { BackgroundItem, GitHubRepo, GitHubUser } from "./types";
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
  const [customizing, setCustomizing] = useState(true);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundItem>(
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
    ])
      .then(([fetchedUser, allRepos]) => {
        setUser(fetchedUser);
        setRepos(getTopRepos(allRepos));
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
      const { width, height } = receiptRef.current.getBoundingClientRect();
      const dataUrl = await toPng(receiptRef.current, {
        pixelRatio: exportScale,
        skipAutoScale: true,
        cacheBust: true,
        backgroundColor: "transparent",
        width: Math.ceil(width),
        height: Math.ceil(height),
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

      <SiteHeader />

      <AnimatePresence>
        {!customizing && (
          <motion.div
            key="open-customizer"
            initial={{ opacity: 0, scale: 0.85, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -8 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="fixed top-4 right-4 z-50"
          >
            <SoftPillButton
              className="gap-2 flex"
              variant="primary"
              onClick={() => setCustomizing(true)}
              title="Open customizer"
            >
              <Palette size={16} />
              Customize
            </SoftPillButton>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <AnimatePresence initial={false}>
          {customizing && (
            <CustomizationPanel
              key="customization-panel"
              selectedBackground={selectedBackground}
              backgrounds={backgroundOptions}
              user={user}
              downloading={downloading}
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
