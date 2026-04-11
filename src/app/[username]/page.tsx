import { GithubReceipt } from "@/features/github-receipt/github-receipt";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;

  return <GithubReceipt username={decodeURIComponent(username)} />;
}
