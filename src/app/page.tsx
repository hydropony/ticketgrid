import Link from "next/link";

// import { LatestPost } from "~/app/_components/post";
import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from "~/server/db";
import { api, HydrateClient } from "~/trpc/server";
import TicketList from "./_components/ticketlist";
import NavBar from "./_components/navbar";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });

  const { userId } = await auth()

  // void api.post.getLatest.prefetch();
  // const tickets = await db.post.findMany({})
  // console.log(tickets)
  return (
    <HydrateClient>
      <main>
        {/* <NavBar /> */}
        <TicketList />
      </main>
    </HydrateClient>
  );
}
