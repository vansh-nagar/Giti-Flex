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
      const response = await fetch(
        `https://api.github.com/user/${githubAccount.providerUserId}`,
        { headers: { Accept: "application/vnd.github+json" } },
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
