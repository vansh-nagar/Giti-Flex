"use client";

import { Check, Download, Globe, Moon, Palette, Sun, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import GithubLogo from "@/components/logo/github";

import type { BackgroundItem, GitHubUser } from "../types";
import { getBlogUrl, getDisplayBlog } from "../utils";
import { useTheme } from "@/hooks/use-theme";

interface CustomizationPanelProps {
  open: boolean;
  selectedBackground: BackgroundItem;
  backgrounds: BackgroundItem[];
  user: GitHubUser;
  downloading: boolean;
  onClose: () => void;
  onSelect: (background: BackgroundItem) => void;
  onOpenExport: () => void;
}

export function CustomizationPanel({
  open,
  selectedBackground,
  backgrounds,
  user,
  downloading,
  onClose,
  onSelect,
  onOpenExport,
}: CustomizationPanelProps) {
  const { theme, toggleTheme } = useTheme();
 
  if (!open) return null;

  return (
    <div className="sticky top-4 self-start w-[350px] pt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="flex items-center gap-1 text-base">
          <Palette size={16} /> Customize
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={14} />
          </Button>
        </div>
      </div>

      <div className="  mb-2 text-sm text-muted-foreground underline">
        Themes & Backgrounds
      </div>
      <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-1">
        {backgrounds.map((background) => {
          const isSelected = selectedBackground.name === background.name;

          return (
            <div key={background.name} className="text-left">
              <button
                type="button"
                aria-label={`Choose ${background.name}`}
                title={background.description}
                className={cn(
                  "relative w-full aspect-video h-auto overflow-hidden rounded-[10px] border-2 flex items-center justify-center transition-colors cursor-pointer",
                  isSelected ? "border-primary" : "border-transparent",
                )}
                onClick={() => onSelect(background)}
              >
                <div className="w-full h-full">{background.component}</div>
                {isSelected && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center ">
                    <Check size={18} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
 
      <section className="mt-8 flex flex-col justify-center">
        <div style={{ marginBottom: "12px" }} className="flex justify-between items-center text-sm">
          <p className="text-muted-foreground">Website</p>
          <a
            href={getBlogUrl(user.blog)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <p className="text-foreground font-medium">{getDisplayBlog(user.blog)}</p>
            <Globe size={16} className="text-primary" />
          </a>
        </div>
 
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
          className="mb-3"
        >
          <Button className="w-full" variant="outline">
            <GithubLogo size={16} />
            View Profile
          </Button>
        </a>
 
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            <X size={16} /> Close
          </Button>
          <Button
            variant="default"
            onClick={onOpenExport}
            disabled={downloading}
            className="flex-1"
          >
            <Download size={16} />
            {downloading ? "Exporting..." : "Download"}
          </Button>
        </div>
      </section>
    </div>
  );
}
