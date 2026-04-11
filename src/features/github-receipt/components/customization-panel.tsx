"use client";

import { Check, Palette, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { BackgroundItem } from "../types";

interface CustomizationPanelProps {
  open: boolean;
  selectedBackground: BackgroundItem;
  backgrounds: BackgroundItem[];
  onClose: () => void;
  onSelect: (background: BackgroundItem) => void;
}

export function CustomizationPanel({
  open,
  selectedBackground,
  backgrounds,
  onClose,
  onSelect,
}: CustomizationPanelProps) {
  if (!open) return null;

  return (
    <div className="sticky top-4 self-start w-[260px] pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-1 text-base">
          <Palette size={16} /> Customize
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={14} />
        </Button>
      </div>

      <div className="  mb-2 text-sm text-muted-foreground">
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
                  "relative w-full aspect-video h-auto overflow-hidden rounded-[10px] border-2 bg-[#f9fafb] flex items-center justify-center transition-colors cursor-pointer",
                  isSelected ? "boreder" : "border-transparent",
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
    </div>
  );
}
