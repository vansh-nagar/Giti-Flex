"use client";

import { GitBranchPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

interface GithubReceiptSearchProps {
  error: string | null;
  inputUsername: string;
  loading: boolean;
  onInputUsernameChange: (value: string) => void;
  onSubmit: () => void;
}

export function GithubReceiptSearch({
  error,
  inputUsername,
  loading,
  onInputUsernameChange,
  onSubmit,
}: GithubReceiptSearchProps) {
  return (
    <div
      className="gh-receipt"
      style={{
        width: "min(95%, 425px)",
        margin: "4em auto",
        textAlign: "center",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div style={{ marginBottom: "2em" }}>
        <GitBranchPlus size={48} style={{ margin: "0 auto 1em", opacity: 0.8 }} />
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#111",
            marginBottom: "0.5em",
          }}
        >
          GitHub Receipt
        </h1>
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          Generate a thermal-style receipt for any GitHub user
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (inputUsername.trim()) {
            onSubmit();
          }
        }}
      >
        <div className="space-y-2">
          <div className="flex flex-col gap-2 text-left">
            <Label htmlFor="username">GitHub Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="e.g. vansh-nagar"
              value={inputUsername}
              onChange={(event) => onInputUsernameChange(event.target.value)}
              disabled={loading}
            />
          </div>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <Button
            type="submit"
            disabled={loading || !inputUsername.trim()}
            className="w-full"
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <GitBranchPlus size={18} />
                Generate Receipt
              </>
            )}
          </Button>
        </div>
      </form>
      <style>{`@keyframes ghreceipt-spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
