"use client";

import { Spinner } from "@/components/ui/spinner";

interface GithubReceiptSearchProps {
  error: string | null;
  inputUsername: string;
  loading: boolean;
  onInputUsernameChange: (value: string) => void;
  onSubmit: () => void;
  onSubmitVersus: () => void;
}

export function GithubReceiptSearch({}: GithubReceiptSearchProps) {
  return (
    <div className=" h-screen w-full flex justify-center items-center">
      <Spinner className="size-8 text-zinc-900" />
    </div>
  );
}
