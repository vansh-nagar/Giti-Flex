"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import { backgroundOptions } from "./constants";
import { CustomizationPanel } from "./components/customization-panel";
import { ExportDialog } from "./components/export-dialog";
import { GithubReceiptSearch } from "./components/github-receipt-search";
import { ReceiptCard } from "./components/receipt-card";
import { VersusDialog } from "./components/versus-dialog";
import { VersusView } from "./components/versus-view";
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

  const [versusDialogOpen, setVersusDialogOpen] = useState(false);
  const [versusInput, setVersusInput] = useState("");
  const [versusUser, setVersusUser] = useState<GitHubUser | null>(null);
  const [versusRepos, setVersusRepos] = useState<GitHubRepo[]>([]);
  const [versusLoading, setVersusLoading] = useState(false);
  const [versusError, setVersusError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setExportName(`github-receipt-${user.login}`);
    }
  }, [user]);

  const fetchGithubData = useCallback((username: string) => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`https://api.github.com/users/${username}`).then((response) => {
        if (!response.ok) {
          throw new Error("User not found");
        }

        return response.json() as Promise<GitHubUser>;
      }),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
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
        setSubmittedUsername(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (submittedUsername) {
      fetchGithubData(submittedUsername);
    }
  }, [fetchGithubData, submittedUsername]);

  const handleVersusSubmit = useCallback(() => {
    const trimmed = versusInput.trim();
    if (!trimmed || versusLoading) return;

    setVersusLoading(true);
    setVersusError(null);

    Promise.all([
      fetch(`https://api.github.com/users/${trimmed}`).then((response) => {
        if (!response.ok) throw new Error("Opponent not found");
        return response.json() as Promise<GitHubUser>;
      }),
      fetch(
        `https://api.github.com/users/${trimmed}/repos?per_page=100&sort=updated`,
      ).then((response) => {
        if (!response.ok) throw new Error("Could not fetch opponent repos");
        return response.json() as Promise<GitHubRepo[]>;
      }),
    ])
      .then(([fetchedUser, allRepos]) => {
        setVersusUser(fetchedUser);
        setVersusRepos(getTopRepos(allRepos));
        setVersusDialogOpen(false);
      })
      .catch((fetchError: Error) => {
        setVersusError(fetchError.message);
      })
      .finally(() => {
        setVersusLoading(false);
      });
  }, [versusInput, versusLoading]);

  const handleExitVersus = useCallback(() => {
    setVersusUser(null);
    setVersusRepos([]);
    setVersusInput("");
    setVersusError(null);
  }, []);

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
      />
    );
  }

  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0,
  );
  const customization = getDefaultCustomization(selectedBackground);
  const themeStyles = getReceiptThemeStyles(selectedBackground, customization);

  const versusActive = versusUser !== null;

  if (versusActive && versusUser) {
    return (
      <>
        <style>{githubReceiptStyles}</style>
        <VersusView
          user={user}
          repos={repos}
          opponent={versusUser}
          opponentRepos={versusRepos}
          selectedBackground={selectedBackground}
          onClose={handleExitVersus}
        />
      </>
    );
  }

  return (
    <>
      <style>{githubReceiptStyles}</style>
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
            <Button
              variant="default"
              onClick={() => setCustomizing(true)}
              title="Open customizer"
            >
              <Palette size={16} />
              Customize
            </Button>
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
              onOpenVersus={() => {
                setVersusError(null);
                setVersusDialogOpen(true);
              }}
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

      <VersusDialog
        open={versusDialogOpen}
        inputUsername={versusInput}
        loading={versusLoading}
        error={versusError}
        onInputChange={setVersusInput}
        onOpenChange={setVersusDialogOpen}
        onSubmit={handleVersusSubmit}
      />
    </>
  );
}
