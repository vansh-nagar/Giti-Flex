"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { GithubReceiptSearch } from "./components/github-receipt-search";

export function GithubReceiptHome() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      return;
    }

    startTransition(() => {
      router.push(`/${encodeURIComponent(trimmedUsername)}`);
    });
  }

  return (
    <GithubReceiptSearch
      error={null}
      inputUsername={username}
      loading={isPending}
      onInputUsernameChange={setUsername}
      onSubmit={handleSubmit}
    />
  );
}
