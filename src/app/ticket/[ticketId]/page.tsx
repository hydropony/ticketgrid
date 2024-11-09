// src/app/ticket/[ticketId].tsx
'use client';

import { api } from '~/trpc/react';  // Ensure you're importing the tRPC hooks correctly

export default function TicketPage({
  params: { ticketId },
}: {
  params: { ticketId: string };
}) {
  // Fetch the ticket data using tRPC's `getById` query
  // const { data, isLoading, isError, error } = api.ticket.getById.useQuery(
  //   { ticketId }, // Pass the ticketId as a parameter
  //   { enabled: !!ticketId } // Ensure this is enabled only when ticketId is available
  // );

  console.log(api.ticket)
  // const ticketQuery = api.ticket.getById.useQuery({ticketId});


  return (
    <div>
      {ticketId}
    </div>
  );

  // if (isLoading) return <div>Loading...</div>;
  // if (isError) return <div>Error: {error?.message}</div>;

  // return (
  //   <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
  //     <h2 className="text-3xl font-bold mb-4">{data?.title}</h2>
  //     <p className="text-gray-700 mb-6">{data?.content}</p>
  //     <div className="text-sm text-gray-500">
  //       <p>Status: <span className="font-medium text-gray-800">{data?.status}</span></p>
  //       {/* <p>Created at: {data.createdAt}</p> */}
  //       <p>User ID: {data?.user_id}</p>
  //     </div>
  //   </div>
  // );
}
