"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import GithubLogo from "@/components/logo/github";

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
    <section className="relative flex flex-1 items-center justify-center px-6 py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.zinc.200/.6),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,theme(colors.zinc.800/.5),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,theme(colors.zinc.200/.4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.zinc.200/.4)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] dark:bg-[linear-gradient(to_right,theme(colors.zinc.800/.5)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.zinc.800/.5)_1px,transparent_1px)]"
      />

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <GithubLogo size={14} />
          Generate a printable GitHub receipt
        </span>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Your GitHub profile,
          <br />
          <span className="bg-gradient-to-br from-zinc-700 to-zinc-400 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-500">
            printed as a receipt.
          </span>
        </h1>

        <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
          Type a GitHub username and we&apos;ll print a clean, shareable receipt
          of their profile and top repos.
        </p>

        <form
          className="mt-10 flex w-full max-w-md flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <label htmlFor="username" className="sr-only">
            GitHub Username
          </label>
          <Input
            id="username"
            type="text"
            placeholder="e.g. vansh-nagar"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            disabled={isPending}
            className="h-11 flex-1 text-base"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <Button
            type="submit"
            disabled={isPending || !username.trim()}
            className="h-11 px-5 text-sm sm:w-auto"
          >
            {isPending ? (
              <Spinner />
            ) : (
              <>
                <GithubLogo size={16} color="#ffffff" />
                Generate Receipt
              </>
            )}
          </Button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          Try{" "}
          <button
            type="button"
            onClick={() => setUsername("vansh-nagar")}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            vansh-nagar
          </button>{" "}
          or{" "}
          <button
            type="button"
            onClick={() => setUsername("torvalds")}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            torvalds
          </button>
        </p>
      </div>
    </section>
  );
}
