"use client";

import { RoseCurveLoader } from "@/components/ui/rose-curve-loader";

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
      <RoseCurveLoader className="size-40 text-zinc-900" />
    </div>
  );
}
