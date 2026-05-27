"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  Check,
  Download,
  Gift,
  Globe,
  Link2,
} from "@/components/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import BookDemoButton from "@/components/ui/book-demo-button";
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
import { Spinner } from "@/components/ui/spinner";
import { GiftDoodle } from "@/components/icons/gift-doodle";
import { cn } from "@/lib/utils";

import type { BackgroundItem, GitHubUser } from "../types";
import { getBlogUrl, getDisplayBlog } from "../utils";

interface CustomizationPanelProps {
  selectedBackground: BackgroundItem;
  backgrounds: BackgroundItem[];
  user: GitHubUser;
  downloading: boolean;
  onClose: () => void;
  onSelect: (background: BackgroundItem) => void;
  onOpenExport: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.18,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 28, mass: 0.8 },
  },
};

const gridVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.035,
    },
  },
};

const swatchVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 6 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 24 },
  },
};

const iconSwapTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 22,
  mass: 0.7,
};

const MOBILE_BREAKPOINT_QUERY = "(max-width: 767px)";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export function CustomizationPanel({
  selectedBackground,
  backgrounds,
  user,
  downloading,
  onClose,
  onSelect,
  onOpenExport,
}: CustomizationPanelProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  const [downloadHovered, setDownloadHovered] = useState(false);
  const [friendDialogOpen, setFriendDialogOpen] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");
  const [friendLoading, setFriendLoading] = useState(false);
  const [friendError, setFriendError] = useState<string | null>(null);

  useEffect(() => {
    if (!isMobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobile]);

  const handleOpenFriendDialog = (open: boolean) => {
    setFriendDialogOpen(open);
    if (!open) {
      setFriendUsername("");
      setFriendError(null);
      setFriendLoading(false);
    }
  };

  const handleSubmitFriend = () => {
    const trimmed = friendUsername.trim();
    if (!trimmed) return;
    if (trimmed.toLowerCase() === user.login.toLowerCase()) {
      setFriendError("That's your own profile — try a friend's username.");
      return;
    }
    setFriendError(null);
    setFriendLoading(true);
    router.push(`/${encodeURIComponent(trimmed)}`);
  };

  const handleCopyShareLink = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/${encodeURIComponent(user.login)}`
        : "";

    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy share link:", error);
    }
  };

  const panelInner = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn(
        "pt-4",
        isMobile
          ? "flex flex-col min-h-0 flex-1 w-full px-5 pb-6"
          : "w-[350px] pr-8",
      )}
    >
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between mb-2"
        >
          <h3 className="flex items-center gap-1 text-base font-semibold">
            Customize
          </h3>
          <div className="flex items-center gap-1">
            <div
              className="size-9 inline-flex items-center justify-center rounded-full"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.6)",
                boxShadow:
                  "0 12px 24px -8px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
              }}
            >
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: { width: 36, height: 36 },
                    userButtonTrigger: {
                      width: 36,
                      height: 36,
                      borderRadius: 9999,
                      boxShadow: "none",
                      border: "none",
                      background: "transparent",
                      "&:focus": { boxShadow: "none" },
                    },
                  },
                }}
              />
            </div>
            <SoftPillButton
              variant="secondary"
              onClick={handleCopyShareLink}
              aria-label={copied ? "Link copied" : "Copy share link"}
              className="size-9 px-0! py-0!"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "check" : "link"}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={iconSwapTransition}
                  className="inline-flex"
                >
                  {copied ? <Check size={14} /> : <Link2 size={14} />}
                </motion.span>
              </AnimatePresence>
            </SoftPillButton>
            <SoftPillButton
              variant="secondary"
              onClick={onClose}
              className="size-9 px-0! py-0!"
            >
              <span className="inline-flex">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 596 603"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <g
                    clipPath="url(#close-doodle-clip)"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {[
                      "M555.095 38.876L555.575 40.1105C546.616 44.5759 529.003 57.1482 519.88 63.1117C509.304 70.6995 491.527 89.58 481.46 95.4738C459.165 108.521 462.681 105.745 458.204 127.896C456.587 135.877 421.741 143.135 412.15 146.617C405.241 149.124 382.044 161.228 376.29 169.725C374.187 182.096 364.343 193.683 358.636 205.69C349.501 211.576 332.72 220.602 322.536 225.357C318.3 227.248 307.531 222.569 304.167 225.881C296.878 233.061 285.775 245.659 283.536 255.725C284.275 257.861 285.652 260.757 286.595 262.889C277.22 278.188 250.93 296.934 236.03 307.187C229.643 311.581 217.633 313.749 212.008 320.423C205.905 327.671 207.672 338.153 202.494 345.946C195.943 356.094 186.606 366.782 178.334 375.483C177.352 376.514 154.079 387.676 152.32 388.121C137.481 391.883 134.436 388.502 127.95 405.096C126.008 410.059 118.494 418.092 115.712 423.166C112.847 428.175 109.665 434.416 106.397 439.314C103.836 442.876 96.1547 448.056 94.4959 451.894C88.8621 464.931 91.6137 470.526 76.527 476.972C67.5569 480.809 56.7932 488.632 51.6404 497.667C52.0793 508.442 49.9459 510.668 42.7945 518.678C39.4342 522.44 36.0141 526.647 32.625 530.473C35.6766 519.686 38.3086 507.768 42.1588 497.321C44.8313 490.073 51.7155 482.802 55.2451 475.735C59.6906 466.835 60.4447 457.185 64.0026 448.003C66.9914 440.433 73.3377 434.48 75.8555 426.658C77.1715 422.574 76.8645 416.627 76.8879 412.25C81.651 403.086 92.383 399.869 98.5354 391.701C103.528 385.08 104.285 375.682 110.822 369.934C115.993 365.651 130.797 363.788 134.122 358.344C135.284 356.446 131.05 334.069 130.421 330.542C139.235 322.046 151.679 312.636 159.664 304.108C172.884 289.991 185.878 274.426 198.983 260.161C203.493 255.251 213.613 242.977 218.171 239.578C228.721 231.709 251.07 222.922 257.719 210.955C261.121 204.831 256.861 196.922 254.527 190.872C258.685 187.568 262.318 184.337 266.684 181.235C285.57 180.232 289.009 180.143 304.736 169.454C308.568 166.848 318.517 167.33 323.491 162.233C328.695 156.907 329.966 151.34 335.286 146.571C341.779 141.974 353.427 141.131 359.743 136.727C379.999 122.612 383.028 104.203 410.749 99.3386C422.058 97.354 423.511 95.7427 436.454 96.43C443.216 90.6141 446.046 80.2519 451.765 77.4664C461.111 73.5483 473.005 75.4409 482.573 71.671C501.634 64.1629 520.454 55.6828 539.468 48.0317C544.431 46.0325 548.532 41.5279 555.095 38.876Z",
                      "M593.538 144.24C594.786 144.289 594.171 144.107 595.279 145.272C595.29 152.608 579.347 162.449 572.14 164.062C544.741 170.195 526.642 198.167 505.583 214.801C499.226 219.824 491.087 222.123 485.679 227.911C478.853 235.213 474.23 244.216 466.794 251.101C459.687 256.839 444.177 276.29 435.452 277.813C419.398 280.616 412.091 271.516 403.425 291.261C401.878 294.631 392.843 309.519 392.743 312.408C392.345 323.687 394.964 329.564 380.573 330.695C370.296 331.509 370.777 335.98 371.169 344.335C366.06 348.706 358.091 354.091 352.443 357.806C341.902 364.731 335.046 364.614 330.195 377.657C323.269 378.588 314.779 379.86 308.099 381.817C304.079 385.901 303.511 390.102 300.558 393.506C292.794 402.465 284.755 412.414 278.222 422.269C275.293 426.687 274.188 434.217 269.629 439.144C257.581 452.222 240.982 460.29 226.921 470.761C222.243 474.247 208.655 490.993 206.188 496.261C202.938 503.21 201.345 514.079 197.882 521.772C186.989 528.504 170.077 537.346 165.031 549.018C162.426 554.373 159.492 563.642 155.565 568.084C146.794 578.015 135.759 581.572 130.658 595.412C130.039 597.087 128.263 600.849 127.108 602.331L126.224 602.038L126.059 600.445C127.737 596.161 130.488 588.96 133.569 585.925C142.256 577.365 145.229 569.308 149.786 558.293C152.685 551.279 157.235 545.156 159.073 537.317C161.225 528.135 159.652 517.94 164.958 509.796C169.403 503.444 175.215 496.817 180.032 490.835C186.246 483.124 189.776 475.683 199.318 471.786C204.303 469.32 202.389 463.947 201.022 460.091C197.627 450.517 201.414 440.134 203.073 430.209C207.6 428.521 211.962 428.304 216.214 425.521C220.62 422.633 221.62 414.623 225.593 411.91C237.279 403.924 248.867 402.94 257.787 390.354C257.511 384.407 257.368 379.426 258.419 373.526C258.776 371.522 259.671 368.1 261.223 366.764C265.993 362.651 271.479 360.477 276.312 356.036C280.226 352.438 281.831 346.749 285.956 344.534C290.374 342.161 299.386 342.167 303.634 339.267C306.833 337.087 307.015 327.501 307.384 323.47C314.638 319.31 317.532 317.763 322.179 310.697C322.636 304.064 322.712 293.681 328.706 289.509C342.886 279.633 363.148 269.432 379.835 264.631C381.786 264.07 386.585 264.397 388.589 264.512C391.407 261.907 407.105 240.374 408.47 236.818C415.138 219.41 418.255 223.559 430.636 212.208C438.552 212.441 445.155 214.206 453.775 213.918L453.945 213.79C460.208 209.167 465.23 202.073 471.611 197.14C480.751 196.938 489.634 197.774 498.862 196.96C503.011 193.442 509.011 186.339 513.347 184.195C517.941 181.924 525.353 181.409 529.911 177.848C535.29 173.651 537.417 167.229 543.652 164.251C550.642 160.918 566.204 160.088 572.011 156.777C582.136 151.004 581.339 148.394 593.538 144.24Z",
                      "M396.353 0L397.085 0.0580064L397.519 0.641593C395.193 2.69527 389.398 4.71086 385.571 7.31825C381.487 9.13639 372.294 19.2302 368.802 20.4132C354.083 25.3971 349.396 34.4087 338.743 44.632C335.216 48.1675 327.03 49.9551 323.861 53.4221C311.644 66.7742 304.284 84.7529 293.779 99.3343C290.978 103.225 277.648 104.734 274.565 107.508C264.072 116.945 253.092 122.677 240.605 129.045C228.036 135.609 219.584 144.914 214.484 158.058C213.09 161.653 210.146 166.755 207.896 169.982C197.357 181.921 192.759 175.356 187.742 193.711C178.545 198.59 158.784 205.298 149.531 210.126C144.878 212.553 146.582 226.293 136.905 232.038C127.077 237.873 120.136 236.954 110.702 241.982C107.865 243.717 107.732 253.987 107.418 257.821C93.361 261.503 91.1625 262.856 86.4328 277.03C77.4393 297.254 55.1526 285.969 48.5496 311.464C45.7764 322.175 9.6375 351.735 0 355.965C2.50957 347.651 9.3006 335.921 11.5963 326.499C13.0236 320.646 33.0674 305.54 38.4897 299.887C39.8742 294.122 39.6281 287.231 42.0228 281.564C44.0619 276.74 48.3674 273.376 50.9742 268.849C52.7397 265.783 54.0141 260.685 55.0096 257.173C59.7451 256.494 67.084 256.235 70.2416 251.894C77.0567 242.526 89.6057 230.624 94.2264 220.402C94.8961 218.92 94.5492 208.312 94.5293 206.483C102.861 201.969 113.406 200.846 120.098 196.442C125.799 191.452 125.764 171.973 132.011 167.27C145.137 157.389 160.464 147.98 174.459 139.163C180.892 135.111 192.938 134.458 197.499 127.902C199.338 125.259 196.433 116.707 195.557 113.567C198.315 110.455 203.132 106.44 204.877 102.811C205.813 100.864 206.671 96.6209 207.623 94.3973C208.252 92.9289 209.016 91.9241 210.446 91.1137C214.709 88.6962 219.656 87.8525 224.271 86.3414C235.849 82.5498 248.202 79.7409 259.515 75.371C269.647 71.4576 269.238 61.7569 277.566 57.4292C288.118 51.9449 298.759 52.4717 309.775 47.0355C319.366 42.3035 320.31 32.8671 326.075 29.6556C335.556 24.3735 353.064 22.693 363.435 19.0773C367.577 17.6312 371.779 12.3842 375.616 9.90865C382.173 5.67883 389.187 2.95484 396.353 0Z",
                      "M569.146 290.798L569.767 290.9L570.13 291.806C562.53 304.017 561.177 312.003 546.78 317.944C543.335 319.368 536.339 322.731 533.591 325.058C527.767 329.997 523.613 339.888 517.964 345.143C511.068 351.553 501.57 355.333 495.013 362.422C487.144 370.93 490.097 383.158 483.593 391.988C479.439 397.631 472.999 398.445 466.624 399.307C458.644 406.519 452.837 417.558 441.57 420.734C436.618 422.123 428.948 423.078 425.538 426.623C422.497 429.775 420.247 434.984 417.3 438.329C410.814 445.7 402.236 452.872 396.657 460.882C390.329 469.454 384.886 483.1 376.454 489.833C364.161 499.653 349.132 505.061 336.552 515.426C328.284 522.246 317.638 526.705 310.079 535.09C304.659 541.101 304.314 545.543 300.663 552.34C297.593 556.775 292.542 561.843 288.962 566.138L288.898 566.132C287.626 562.857 322.068 512.526 322.988 504.205C323.239 501.868 322.548 498.885 322.161 496.665C330.974 480.692 343.876 482.872 344.89 459.341C351.107 453.353 368.521 445.823 369.722 442.988C373.249 434.667 370.407 417.312 377.978 405.494C385.888 394.057 399.153 397.988 411.95 392.217C422.409 387.5 444.775 350.458 450.236 347.915C462.482 342.22 490.595 331.872 503.814 328.392C508.237 324.085 513.288 315.607 517.689 310.632C528.558 298.332 536.638 297.391 552.036 294.998C555.734 294.424 564.945 291.838 569.146 290.798Z",
                      "M555.095 38.8759C557.509 37.7316 559.964 36.2562 562.542 36.1689C561.95 38.0011 557.433 39.4097 555.575 40.1105L555.095 38.8759Z",
                    ].map((d, i) => (
                      <motion.path
                        key={i}
                        d={d}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                          pathLength: {
                            duration: 1.6,
                            delay: i * 0.25,
                            ease: [0.65, 0, 0.35, 1],
                          },
                          opacity: {
                            duration: 0.2,
                            delay: i * 0.25,
                          },
                        }}
                      />
                    ))}
                  </g>
                  <defs>
                    <clipPath id="close-doodle-clip">
                      <rect width="596" height="603" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </SoftPillButton>
          </div>
        </motion.div>

        <motion.div
          variants={gridVariants}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 95%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 95%, transparent 100%)",
          }}
          className={cn(
            "grid grid-cols-2 gap-2 px-2 pt-1 pb-6 overflow-y-auto [&::-webkit-scrollbar]:hidden",
            isMobile ? "flex-1 min-h-0" : "max-h-[65vh]",
          )}
        >
          {backgrounds.map((background) => {
            const isSelected = selectedBackground.name === background.name;

            return (
              <motion.div
                key={background.name}
                variants={swatchVariants}
                className="text-left"
              >
                <motion.button
                  type="button"
                  aria-label={`Choose ${background.name}`}
                  title={background.description}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{
                    type: "spring",
                    stiffness: 480,
                    damping: 24,
                  }}
                  className={cn(
                    "relative w-full aspect-video h-auto overflow-hidden rounded-[10px] border-2 flex items-center justify-center cursor-pointer transition-colors",
                    isSelected ? "border-primary" : "border-transparent",
                  )}
                  onClick={() => onSelect(background)}
                >
                  <div className="w-full h-full">{background.component}</div>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        key="check"
                        initial={{ opacity: 0, scale: 0.3, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.3, rotate: 45 }}
                        transition={{
                          type: "spring",
                          stiffness: 520,
                          damping: 22,
                        }}
                        className="absolute inset-0 z-10 flex items-center justify-center"
                      >
                        <Check
                          size={18}
                          className="text-white"
                          strokeWidth={3}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.section
          variants={itemVariants}
          className="mt-4 sm:mt-8 flex flex-col justify-center"
        >
          <motion.div
            variants={itemVariants}
            style={{ marginBottom: "12px" }}
            className="flex justify-between items-center text-sm"
          >
            <p className="text-muted-foreground">Website</p>
            <motion.a
              href={getBlogUrl(user.blog)}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: -2 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              className="flex items-center gap-2 hover:underline text-primary"
              style={{ textDecoration: "none" }}
            >
              <p className="text-foreground font-medium">
                {getDisplayBlog(user.blog)}
              </p>
              <span className="inline-flex">
                <Globe size={16} className="text-primary" />
              </span>
            </motion.a>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-2">
            <SoftPillButton
              variant="secondary"
              className="h-11 w-full"
              onClick={() => handleOpenFriendDialog(true)}
            >
              <GiftDoodle size={18} />
              For a Friend
            </SoftPillButton>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-2">
            <Link href="/find-opponent" className="flex-1">
              <BookDemoButton className="w-full">Versus Battle</BookDemoButton>
            </Link>
            <SoftPillButton
              variant="primary"
              onClick={onOpenExport}
              disabled={downloading}
              onMouseEnter={() => setDownloadHovered(true)}
              onMouseLeave={() => setDownloadHovered(false)}
              className="h-11 flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={downloading ? "exporting" : "download"}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.16 }}
                >
                  {downloading ? "Exporting..." : "Download"}
                </motion.span>
              </AnimatePresence>
            </SoftPillButton>
          </motion.div>
        </motion.section>
    </motion.div>
  );

  return (
    <>
      {isMobile ? (
        <>
          <motion.div
            key="customization-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 supports-backdrop-filter:backdrop-blur-xs"
          />
          <motion.div
            key="customization-drawer"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 360,
              damping: 36,
              mass: 0.9,
            }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-t-2xl bg-background ring-1 ring-foreground/10 shadow-2xl"
          >
            <div className="flex shrink-0 justify-center pt-2 pb-1">
              <span className="h-1.5 w-10 rounded-full bg-foreground/20" />
            </div>
            {panelInner}
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 382, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{
            width: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
            opacity: { duration: 0.25, ease: [0.32, 0.72, 0, 1] },
          }}
          className="sticky top-24 self-start shrink-0"
        >
          {panelInner}
        </motion.div>
      )}

      <Dialog open={friendDialogOpen} onOpenChange={handleOpenFriendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift size={18} />
              Make a receipt for a friend
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (friendUsername.trim() && !friendLoading) handleSubmitFriend();
            }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <p className="text-sm text-muted-foreground">
              Enter your friend&apos;s GitHub username and we&apos;ll print
              their receipt — share the link with them after.
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <Label htmlFor="friend-username">
                Friend&apos;s GitHub Username
              </Label>
              <Input
                id="friend-username"
                type="text"
                placeholder="e.g. torvalds"
                value={friendUsername}
                onChange={(event) => setFriendUsername(event.target.value)}
                disabled={friendLoading}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>

            {friendError && (
              <p className="text-sm font-medium text-red-600">{friendError}</p>
            )}

            <DialogFooter>
              <SoftPillButton
                type="button"
                variant="secondary"
                onClick={() => handleOpenFriendDialog(false)}
                disabled={friendLoading}
              >
                Cancel
              </SoftPillButton>
              <SoftPillButton
                type="submit"
                variant="primary"
                disabled={friendLoading || !friendUsername.trim()}
              >
                {friendLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <Gift size={16} />
                    Print Receipt
                  </>
                )}
              </SoftPillButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
