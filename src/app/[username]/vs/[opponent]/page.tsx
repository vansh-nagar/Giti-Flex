import { redirect } from "next/navigation";

import { VersusPageClient } from "@/features/github-receipt/versus-page-client";
import { getAuthedGithubLogin } from "@/lib/auth";

interface VersusPageProps {
  params: Promise<{
    username: string;
    opponent: string;
  }>;
}

export default async function VersusPage({ params }: VersusPageProps) {
  const { username, opponent } = await params;
  const authedLogin = await getAuthedGithubLogin();
  if (!authedLogin) {
    redirect("/");
  }

  const decodedUsername = decodeURIComponent(username);
  const decodedOpponent = decodeURIComponent(opponent);

  if (decodedUsername.toLowerCase() !== authedLogin.toLowerCase()) {
    redirect(
      `/${encodeURIComponent(authedLogin)}/vs/${encodeURIComponent(decodedOpponent)}`,
    );
  }

  return (
    <VersusPageClient
      userLogin={authedLogin}
      opponentLogin={decodedOpponent}
    />
  );
}
