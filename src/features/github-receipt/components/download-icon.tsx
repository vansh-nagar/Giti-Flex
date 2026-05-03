"use client";
import { motion, type Transition } from "motion/react";

interface DownloadIconProps {
  state: "idle" | "done";
  size?: number;
  className?: string;
}

export default function DownloadIcon({
  state,
  size = 22,
  className,
}: DownloadIconProps) {
  const easeTransition: Transition = {
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  const springTransition: Transition = {
    type: "spring",
    stiffness: 320,
    damping: 12,
    mass: 1,
  };

  return (
    <motion.svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 46 46"
      fill="none"
      initial="idle"
      animate={state}
    >
      {/* 🔥 Vertical line */}
      <motion.path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={{
          idle: {
            d: "M22.9537 25.4541V13.4541",
            transition: springTransition,
          },
          done: {
            d: "M22.9537 28.2012V13.4541",
            transition: easeTransition,
          },
        }}
      />

      {/* 🔥 Tray */}
      <motion.path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          idle: {
            d: "M31.9537 25.4541V29.4541C31.9537 29.9845 31.743 30.4932 31.3679 30.8683C30.9929 31.2434 30.4842 31.4541 29.9537 31.4541H15.9537C15.4233 31.4541 14.9146 31.2434 14.5395 30.8683C14.1644 30.4932 13.9537 29.9845 13.9537 29.4541V25.4541",
            transition: springTransition,
          },
          done: {
            d: "M37.3994 25.4541V29.4541C37.3994 29.9845 37.0612 30.4932 36.4592 30.8683C35.8572 31.2434 35.0406 31.4541 34.1893 31.4541H11.7182C10.8668 31.4541 10.0503 31.2434 9.44829 30.8683C8.84627 30.4932 8.50806 29.9845 8.50806 29.4541V25.4541",
            transition: easeTransition,
          },
        }}
      />

      {/* 🔥 Arrow → Line */}
      <motion.path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          idle: {
            d: "M17.9537 20.4541L22.9537 25.4541L27.9537 20.4541",
            transition: springTransition,
          },
          done: {
            d: "M15.3462 28.2013L22.9538 28.2012L30.3573 28.2012",
            transition: easeTransition,
          },
        }}
      />
    </motion.svg>
  );
}
