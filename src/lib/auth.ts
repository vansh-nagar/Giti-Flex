import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getAuthedGithubLogin(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const githubAccount = user?.externalAccounts?.find(
    (account) => account.provider === "github" || account.provider === "oauth_github",
  );
  if (!githubAccount) return null;

  if (githubAccount.username) return githubAccount.username;

  if (githubAccount.providerUserId) {
    try {
      const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
      };
      if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
      }
      const response = await fetch(
        `https://api.github.com/user/${githubAccount.providerUserId}`,
        { headers },
      );
      if (response.ok) {
        const data = (await response.json()) as { login?: string };
        return data.login ?? null;
      }
    } catch (error) {
      console.error("Failed to resolve GitHub login from providerUserId:", error);
    }
  }
  return null;
}
