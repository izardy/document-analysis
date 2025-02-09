import Link from "next/link";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <div>
        <Link href="/temporary-page">Temporary Page</Link>
        <div>First Page</div>
      </div>
    </HydrateClient>
  );
}
