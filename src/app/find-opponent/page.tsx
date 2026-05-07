import { redirect } from "next/navigation";

import { FindOpponentClient } from "@/features/github-receipt/find-opponent-client";
import { getAuthedGithubLogin } from "@/lib/auth";

export default async function FindOpponentPage() {
  const login = await getAuthedGithubLogin();
  if (!login) {
    redirect("/");
  }
  return <FindOpponentClient login={login} />;
}
