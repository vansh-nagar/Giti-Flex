import type {
  BackgroundItem,
  GitHubRepo,
  ReceiptCustomization,
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
  customization: ReceiptCustomization = getDefaultCustomization(selectedBackground),
): ReceiptThemeStyles {
  const backgroundColor = customization.backgroundColor;
  const textColor = customization.textColor;
  const headingColor = customization.headingColor;
  const borderColor = customization.borderColor;
  const dotBorderColor = borderColor;
  const dashPattern = `repeating-linear-gradient(90deg, ${headingColor}, ${headingColor} 8px, transparent 8px, transparent 16px)`;
  const sectionDash = `repeating-linear-gradient(90deg, ${borderColor}, ${borderColor} 4px, transparent 4px, transparent 8px)`;
  const barcodeColor = headingColor;

  return {
    backgroundColor,
    textColor,
    headingColor,
    borderColor,
    dotBorderColor,
    dashPattern,
    sectionDash,
    barcodeColor,
  };
}

export function getDefaultCustomization(
  selectedBackground: BackgroundItem,
): ReceiptCustomization {
  const isDark = Boolean(selectedBackground.isDark);

  return {
    backgroundColor: selectedBackground.backgroundColor ?? "#ffffff",
    textColor: selectedBackground.text,
    headingColor: selectedBackground.heading,
    borderColor: isDark ? "rgba(255,255,255,0.12)" : "#d1d5db",
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

export async function fetchOpponentLogins(
  count: number,
  minFollowers: number,
  exclude?: string,
): Promise<string[]> {
  const page = Math.floor(Math.random() * 10) + 1;
  const order = Math.random() < 0.5 ? "asc" : "desc";
  const query = `followers:>=${minFollowers} type:user`;
  const response = await fetch(
    `/api/github/search/users?q=${encodeURIComponent(query)}&per_page=100&page=${page}&sort=joined&order=${order}`,
  );
  if (!response.ok) {
    const remaining = response.headers.get("x-ratelimit-remaining");
    if (response.status === 403 && remaining === "0") {
      throw new Error(
        "GitHub rate limit hit. Wait a minute and try again.",
      );
    }
    throw new Error(
      `Failed to fetch opponents (HTTP ${response.status})`,
    );
  }
  const data = (await response.json()) as {
    items: { login: string; type: string }[];
  };
  const excludeLower = exclude?.toLowerCase();
  const real = (data.items ?? []).filter(
    (entry) =>
      entry.type === "User" && entry.login.toLowerCase() !== excludeLower,
  );
  for (let i = real.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [real[i], real[j]] = [real[j], real[i]];
  }
  return real.slice(0, count).map((entry) => entry.login);
}
