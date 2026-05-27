import { GithubReceiptHome } from "@/features/github-receipt/github-receipt-home";
import { getAuthedGithubLogin } from "@/lib/auth";

export default async function Page() {
  const login = await getAuthedGithubLogin();
  return <GithubReceiptHome login={login} />;
}
