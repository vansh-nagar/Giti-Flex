import type {
  BackgroundItem,
  GitHubRepo,
  ReceiptThemeStyles,
} from "./types";

export function getTopRepos(repos: GitHubRepo[]) {
  return [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 4);
}

export function formatMemberSince(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatPrintedAt() {
  const now = new Date();
  const date = now
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date} • ${time}`;
}

export function getReceiptThemeStyles(
  selectedBackground: BackgroundItem,
): ReceiptThemeStyles {
  const textColor = selectedBackground.text;
  const headingColor = selectedBackground.heading;
  const isDark = Boolean(selectedBackground.isDark);
  const borderColor = isDark ? "rgba(255,255,255,0.12)" : "#d1d5db";
  const dotBorderColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const dashPattern = isDark
    ? `repeating-linear-gradient(90deg, ${headingColor}, ${headingColor} 8px, transparent 8px, transparent 16px)`
    : "repeating-linear-gradient(90deg, #1b1b1b, #1b1b1b 8px, transparent 8px, transparent 16px)";
  const sectionDash = isDark
    ? `repeating-linear-gradient(90deg, ${borderColor}, ${borderColor} 4px, transparent 4px, transparent 8px)`
    : "repeating-linear-gradient(90deg, #d1d5db, #d1d5db 4px, transparent 4px, transparent 8px)";
  const barcodeColor = isDark ? headingColor : "#111";

  return {
    textColor,
    headingColor,
    borderColor,
    dotBorderColor,
    dashPattern,
    sectionDash,
    barcodeColor,
  };
}

export function getBlogUrl(blog: string | null) {
  if (!blog) {
    return "#";
  }

  return blog.startsWith("http") ? blog : `https://${blog}`;
}

export function getDisplayBlog(blog: string | null) {
  if (!blog) {
    return "—";
  }

  return blog.replace(/^https?:\/\//, "");
}
