import { redirect } from "next/navigation";

import { GithubReceiptHome } from "@/features/github-receipt/github-receipt-home";
import { getAuthedGithubLogin } from "@/lib/auth";

export default async function Page() {
  const login = await getAuthedGithubLogin();
  if (login) {
    redirect(`/${encodeURIComponent(login)}`);
  }
  return <GithubReceiptHome />;
}
