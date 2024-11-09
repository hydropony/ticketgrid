"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '~/trpc/react';  // Import trpc hook


const TicketList = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const { data, isLoading, isError, error } = api.ticket.getLatest.useQuery();
  
    // You can handle the tickets state or show loading/error states
    useEffect(() => {
      if (data) {
        setTickets(data); // Store the fetched tickets
      }
    }, [data]);
  
    if (isLoading) return <div className="text-center p-4">Loading...</div>;
    if (isError) return <div className="text-center p-4 text-red-500">Error: {error?.message}</div>;
  
    return (
        <div className="space-y-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-4">Tickets</h2>
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.ticket_id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                <Link href={`/ticket/${ticket.ticket_id}`} passHref>{ticket.title}</Link>
              </h3>
                <p className="text-gray-600 text-sm mb-4">{ticket.content}</p>
                <div className="text-sm text-gray-500">
                  <p>Status: <span className="font-medium text-gray-800">{ticket.status}</span></p>
                  <p>Created at: {new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default TicketList;
  