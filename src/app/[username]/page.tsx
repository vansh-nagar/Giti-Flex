import { redirect } from "next/navigation";

import { GithubReceipt } from "@/features/github-receipt/github-receipt";
import { getAuthedGithubLogin } from "@/lib/auth";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    vs?: string;
  }>;
}

export default async function UserPage({
  params,
  searchParams,
}: UserPageProps) {
  const { username } = await params;
  const { vs } = await searchParams;

  const authedLogin = await getAuthedGithubLogin();
  if (!authedLogin) {
    redirect("/");
  }

  const decodedUsername = decodeURIComponent(username);
  const targetLogin =
    decodedUsername.toLowerCase() === authedLogin.toLowerCase()
      ? decodedUsername
      : authedLogin;

  if (vs) {
    redirect(
      `/${encodeURIComponent(targetLogin)}/vs/${encodeURIComponent(decodeURIComponent(vs))}`,
    );
  }

  if (decodedUsername.toLowerCase() !== authedLogin.toLowerCase()) {
    redirect(`/${encodeURIComponent(authedLogin)}`);
  }

  return <GithubReceipt username={authedLogin} />;
}
