"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

  const handleDownload = useCallback(async () => {
    if (!receiptRef.current || downloading) {
      return;
    }

    setDownloading(true);
    setShowExportModal(false);

    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(receiptRef.current, {
        pixelRatio: exportScale,
        skipAutoScale: true,
        cacheBust: true,
        backgroundColor: "transparent",
        fontEmbedCSS: "", // Can help with some environments
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          margin: "0",
          width: "380px", // Fixed width for the card itself in export
          boxShadow: "none",
        },
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

  return (
    <>
      <style>{githubReceiptStyles}</style>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: customizing ? "2em" : "0",
          width: "100%",
          maxWidth: customizing ? "900px" : "425px",
          margin: "0 auto",
          transition:
            "max-width 0.5s cubic-bezier(0.23, 1, 0.32, 1), gap 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <CustomizationPanel
          open={customizing}
          selectedBackground={selectedBackground}
          backgrounds={backgroundOptions}
          user={user}
          downloading={downloading}
          onClose={() => setCustomizing(false)}
          onSelect={setSelectedBackground}
          onOpenExport={() => setShowExportModal(true)}
        />

        <ReceiptCard
          customizing={customizing}
          downloading={downloading}
          onOpenExport={() => setShowExportModal(true)}
          onToggleCustomizing={() => setCustomizing((current) => !current)}
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
