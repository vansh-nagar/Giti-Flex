import { GithubReceipt } from "@/features/github-receipt/github-receipt";

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

  return (
    <GithubReceipt
      username={decodeURIComponent(username)}
      versusUsername={vs ? decodeURIComponent(vs) : undefined}
    />
  );
}


