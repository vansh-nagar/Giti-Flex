"use client";

import { AnimatePresence, motion } from "motion/react";
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
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="gh-customize"
          initial={{ opacity: 0, x: -30, width: 0 }}
          animate={{ opacity: 1, x: 0, width: 260 }}
          exit={{ opacity: 0, x: -30, width: 0 }}
          transition={{
            duration: 0.45,
            ease: [0.23, 1, 0.32, 1],
          }}
          style={{
            flexShrink: 0,
            overflow: "hidden",
            paddingTop: "1em",
            alignSelf: "flex-start",
            position: "sticky",
            top: "1em",
          }}
        >
          <div style={{ width: 260 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25em",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#111",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Palette size={16} /> Customize
              </h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={14} />
              </Button>
            </div>

            <div className="gh-customize__section">
              <div className="gh-customize__label">Themes & Backgrounds</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "8px",
                  maxHeight: "60vh",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
              >
                {backgrounds.map((background) => {
                  const isSelected = selectedBackground.name === background.name;

                  return (
                    <div key={background.name} style={{ textAlign: "left" }}>
                      <button
                        type="button"
                        aria-label={`Choose ${background.name}`}
                        title={background.description}
                        className={cn(
                          "gh-customize__swatch",
                          isSelected && "gh-customize__swatch--selected",
                        )}
                        style={{
                          aspectRatio: "16/9",
                          height: "auto",
                          backgroundColor: "#f9fafb",
                          overflow: "hidden",
                        }}
                        onClick={() => onSelect(background)}
                      >
                        <div>{background.component}</div>
                        {isSelected && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "rgba(59, 130, 246, 0.2)",
                              zIndex: 10,
                            }}
                          >
                            <Check size={18} color="#fff" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                      <div
                        className="gh-customize__swatch-name"
                        style={{ marginTop: "4px", fontWeight: 500 }}
                      >
                        {background.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
