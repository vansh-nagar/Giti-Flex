"use client";

import { Swords } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

interface VersusDialogProps {
  open: boolean;
  inputUsername: string;
  loading: boolean;
  error: string | null;
  onInputChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export function VersusDialog({
  open,
  inputUsername,
  loading,
  error,
  onInputChange,
  onOpenChange,
  onSubmit,
}: VersusDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Swords size={18} className="text-red-500" />
            Battle a friend
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (inputUsername.trim() && !loading) onSubmit();
          }}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <p className="text-sm text-muted-foreground">
            Enter another GitHub username to compare receipts side-by-side.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Label htmlFor="versus-username">Opponent&apos;s GitHub Username</Label>
            <Input
              id="versus-username"
              type="text"
              placeholder="e.g. torvalds"
              value={inputUsername}
              onChange={(event) => onInputChange(event.target.value)}
              disabled={loading}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !inputUsername.trim()}
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <Swords size={16} />
                  Start Battle
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
