import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { db } from "~/server/db";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();
  const tickets = await db.post.findMany({})
  console.log(tickets)
  return (
    <HydrateClient>
      <main>
        hello!!!
        {tickets.map((ticket) => ticket.name)}
      </main>
    </HydrateClient>
  );
}
