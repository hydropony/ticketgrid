"use client";

export const dynamicParams = false;

import React from 'react';
import { useEffect, useState } from 'react';
// import { useState } from 'react';
import { api } from '~/trpc/react';  // Import the trpc hook


export default function TicketPage({
  params: { id: ticketId },
}: {
  params: { id: string };
}) {
  // const ticketId = use(ticketId)
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 overflow-y-hidden">
      {ticketId}
      {/* <FullPageImageView photoId={photoId} /> */}
    </div>
  );
}

// export default async function TicketPage({
//   params: { id: ticketId},
// }: {
//   params: { ticketId: string };
// }) {
//   //const { ticketId } = params; // Unwrap the `params` object
//   const ticketId = await params.ticketId;


//   const { data, isLoading, isError, error } = api.ticket.getById.useQuery(
//     { ticketId },
//     { enabled: !!ticketId }
//   );

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error: {error?.message}</div>;

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-3xl font-bold mb-4">{data?.title}</h2>
//       <p className="text-gray-700 mb-6">{data?.content}</p>
//       <div className="text-sm text-gray-500">
//         <p>Status: <span className="font-medium text-gray-800">{data?.status}</span></p>
//         {/* <p>Created at: {new Date(data?.createdAt).toLocaleString()}</p> */}
//         <p>User ID: {data?.user_id}</p>
//       </div>
//     </div>
//   );

// }