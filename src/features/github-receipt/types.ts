import type { ReactNode } from "react";

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  blog: string | null;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

export interface BackgroundItem {
  name: string;
  description: string;
  component: ReactNode;
  backgroundColor?: string;
  text: string;
  heading: string;
  isDark?: boolean;
}

export interface ReceiptCustomization {
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  borderColor: string;
}

export interface ReceiptThemeStyles {
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  borderColor: string;
  dotBorderColor: string;
  dashPattern: string;
  sectionDash: string;
  barcodeColor: string;
}
