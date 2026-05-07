"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Palette } from "lucide-react";

import SoftPillButton from "@/components/ui/soft-pill-button";
import { backgroundOptions } from "./constants";
import { CustomizationPanel } from "./components/customization-panel";
import { ExportDialog } from "./components/export-dialog";
import { GithubReceiptSearch } from "./components/github-receipt-search";
import { OpponentDeck } from "./components/opponent-deck";
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
  versusUsername?: string;
}

export function GithubReceipt({
  username,
  versusUsername,
}: GithubReceiptProps = {}) {
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
  const [versusInput, setVersusInput] = useState(versusUsername || "");
  const [versusUser, setVersusUser] = useState<GitHubUser | null>(null);
  const [versusRepos, setVersusRepos] = useState<GitHubRepo[]>([]);
  const [versusLoading, setVersusLoading] = useState(false);
  const [versusError, setVersusError] = useState<string | null>(null);
  const [autoOpenVersus, setAutoOpenVersus] = useState(false);
  const [deckOpen, setDeckOpen] = useState(false);
  const versusAutoTriggered = useRef(false);
  const versusDialogAutoOpened = useRef(false);

  useEffect(() => {
    if (user) {
      setExportName(`github-receipt-${user.login}`);
    }
  }, [user]);

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

  const fetchVersus = useCallback((opponentLogin: string) => {
    setVersusLoading(true);
    setVersusError(null);

    Promise.all([
      fetch(`/api/github/users/${opponentLogin}`).then((response) => {
        if (!response.ok) throw new Error("Opponent not found");
        return response.json() as Promise<GitHubUser>;
      }),
      fetch(
        `/api/github/users/${opponentLogin}/repos?per_page=100&sort=updated`,
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
  }, []);

  const handleVersusSubmit = useCallback(() => {
    const trimmed = versusInput.trim();
    if (!trimmed || versusLoading) return;
    fetchVersus(trimmed);
  }, [fetchVersus, versusInput, versusLoading]);

  const handleOpenDeck = useCallback(() => {
    setVersusError(null);
    setVersusDialogOpen(false);
    setDeckOpen(true);
  }, []);

  const handleDeckPick = useCallback(
    (login: string) => {
      setDeckOpen(false);
      setVersusInput(login);
      fetchVersus(login);
    },
    [fetchVersus],
  );

  const handleExitVersus = useCallback(() => {
    setVersusUser(null);
    setVersusRepos([]);
    setVersusInput("");
    setVersusError(null);
    if (typeof window !== "undefined" && user) {
      window.history.replaceState(null, "", `/${user.login}`);
    }
  }, [user]);

  useEffect(() => {
    if (
      versusUsername &&
      user &&
      !versusUser &&
      !versusLoading &&
      !versusAutoTriggered.current
    ) {
      versusAutoTriggered.current = true;
      fetchVersus(versusUsername);
    }
  }, [fetchVersus, user, versusLoading, versusUser, versusUsername]);

  useEffect(() => {
    if (autoOpenVersus && user && !versusDialogAutoOpened.current) {
      versusDialogAutoOpened.current = true;
      setVersusError(null);
      setVersusDialogOpen(true);
      setAutoOpenVersus(false);
    }
  }, [autoOpenVersus, user]);

  useEffect(() => {
    if (typeof window === "undefined" || !user) return;
    const baseUrl = `/${user.login}`;
    const newUrl = versusUser
      ? `${baseUrl}?vs=${encodeURIComponent(versusUser.login)}`
      : baseUrl;
    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [user, versusUser]);

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
        onSubmitVersus={() => {
          versusDialogAutoOpened.current = false;
          setAutoOpenVersus(true);
          setSubmittedUsername(inputUsername.trim());
        }}
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

  return (
    <>
      <style>{githubReceiptStyles}</style>

      <AnimatePresence mode="wait" initial={false}>
        {versusActive && versusUser ? (
          <motion.div
            key={`versus-scene-${versusUser.login}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          >
            <VersusView
              user={user}
              repos={repos}
              opponent={versusUser}
              opponentRepos={versusRepos}
              onClose={handleExitVersus}
              onBrowseOpponents={handleOpenDeck}
            />
          </motion.div>
        ) : (
          <motion.div
            key="receipt-scene"
            initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>

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
        onBrowseOpponents={handleOpenDeck}
      />

      <OpponentDeck
        open={deckOpen}
        selfLogin={user.login}
        selfUser={user}
        selfFollowers={user.followers}
        onClose={() => setDeckOpen(false)}
        onPick={handleDeckPick}
      />
    </>
  );
}
