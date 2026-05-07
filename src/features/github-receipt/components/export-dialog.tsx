"use client";

import { Download } from "lucide-react";

import SoftPillButton from "@/components/ui/soft-pill-button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ExportDialogProps {
  exportName: string;
  exportScale: number;
  open: boolean;
  onExport: () => void;
  onExportNameChange: (value: string) => void;
  onExportScaleChange: (value: number) => void;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({
  exportName,
  exportScale,
  open,
  onExport,
  onExportNameChange,
  onExportScaleChange,
  onOpenChange,
}: ExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Settings</DialogTitle>
        </DialogHeader>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            paddingTop: "16px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Label htmlFor="filename">File Name</Label>
            <Input
              id="filename"
              type="text"
              value={exportName}
              onChange={(event) => onExportNameChange(event.target.value)}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Label>Quality</Label>
              <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                {exportScale}x Scale
              </span>
            </div>
            <Slider
              value={[exportScale]}
              max={5}
              min={1}
              step={1}
              onValueChange={(values) => onExportScaleChange(values[0])}
            />
          </div>
        </div>

        <DialogFooter>
          <SoftPillButton variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </SoftPillButton>
          <SoftPillButton variant="primary" onClick={onExport}>
            <Download size={18} />
            Export Image
          </SoftPillButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
