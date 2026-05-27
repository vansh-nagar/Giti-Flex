"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface BookDemoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DoubleChevron = ({ index }: { index: number }) => {
  const base = index * 0.12;
  const dots: { cx: number; cy: number; d: number }[] = [
    { cx: 2, cy: 2, d: 0 },
    { cx: 5, cy: 5, d: 0.05 },
    { cx: 8, cy: 8, d: 0.1 },
    { cx: 5, cy: 11, d: 0.15 },
    { cx: 2, cy: 14, d: 0.2 },
    { cx: 6, cy: 2, d: 0.05 },
    { cx: 9, cy: 5, d: 0.1 },
    { cx: 12, cy: 8, d: 0.15 },
    { cx: 9, cy: 11, d: 0.2 },
    { cx: 6, cy: 14, d: 0.25 },
  ];
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      className="shrink-0 overflow-visible"
    >
      <g fill="#0f0f0f">
        {dots.map((p, i) => (
          <circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r="1"
            className="bd-dot"
            style={{ animationDelay: `${base + p.d}s` }}
          />
        ))}
      </g>
    </svg>
  );
};

const BookDemoButton = React.forwardRef<HTMLButtonElement, BookDemoButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group/btn relative inline-flex h-11 w-48 rounded-full overflow-hidden bg-neutral-900/90 ring-1 ring-white/10 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.12)] backdrop-blur transition active:scale-[0.98] hover:bg-neutral-900 disabled:opacity-60 disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      >
        <style>{`
          @keyframes bd-dot-wave {
            0%, 70%, 100% { opacity: 0.25; transform: scale(0.85); }
            35% { opacity: 1; transform: scale(1); }
          }
          .bd-dot {
            transform-box: fill-box;
            transform-origin: center;
            animation: bd-dot-wave 1.4s ease-in-out infinite;
          }
        `}</style>

        <span className="absolute inset-y-0 left-11 right-3 flex items-center justify-center text-white font-medium text-[14px] tracking-tight">
          {children || "Book a demo"}
        </span>

        <span
          className="absolute top-1 left-1 bottom-1 z-10 w-9 group-hover/btn:w-[calc(100%-0.5rem)] flex items-center justify-start overflow-hidden rounded-full pl-3 pr-2.5 gap-4 transition-[width,gap] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{
            background: "linear-gradient(180deg, #d6f54a 0%, #c5ea2c 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)",
          }}
        >
          <DoubleChevron index={0} />
          <DoubleChevron index={1} />
          <DoubleChevron index={2} />
          <DoubleChevron index={3} />
          <DoubleChevron index={4} />
        </span>
      </button>
    );
  },
);

BookDemoButton.displayName = "BookDemoButton";

export default BookDemoButton;
