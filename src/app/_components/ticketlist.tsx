
"use client";

import { Ticket, Comment } from '@prisma/client';
import { useQueryClient } from "@tanstack/react-query";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '~/trpc/react';  // Import trpc hook
import { useUser } from '@clerk/clerk-react'; // Import useUser hook from Clerk
import Update from './update'
import CreateUpdate from './createupdate';

interface IComment {
  comment_id: number;
  user_id: string;
  fullname: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

interface IUpdate {
  update_id: number;
  content: string;
  status: string;
  createdAt: string;
}


interface TicketWithFavorite extends Ticket {
  isFavorited: boolean;
}


const TicketList = () => {
    const { user, isLoaded, isSignedIn } = useUser();



    // const [tickets, setTickets] = useState<Ticket[]>([]);
    const [tickets, setTickets] = useState<TicketWithFavorite[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<TicketWithFavorite | null>(null);
    // const { data, isLoading, isError, error } = api.ticket.getTickets.useQuery();
    const queryClient = useQueryClient();


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comments, setComments] = useState<IComment[] | null>([]);
    const [updates, setUpdates] = useState<IUpdate[] | null>([]);
    const [newComment, setNewComment] = useState('');


    // const [data, setData] = useState(null);
    // const [data, setData] = useState<TicketWithFavorite[] | null>(null);
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState<string | null>(null);

    // const { data, isLoading, isError, error } = api.ticket.getLatestWithFavorites.useQuery({userId: user?.id.toString()});
    
    const { data, isLoading, isError, error } = api.ticket.getLatestWithFavorites.useQuery(
      { userId: user?.id ?? "" },
      {
        enabled: isLoaded && !!user?.id, // Only run when `user.id` is defined and `useUser` is fully loaded
      }
    );

    // const { data, isLoading, isError, error } = api.ticket.getLatestWithFavorites.useQuery(
    //   { userId: user?.id || "" },
    //   { enabled: !!user } // Only run query if user is available
    // );

    // const fetchData = async () => {
    //   setIsLoading(true);
    //   setError(null);
  
    //   try {
    //     // Create a caller instance to fetch data imperatively
    //     const caller = api.ticket.getLatestWithFavorites.createCaller();
    //     const response = await caller({ userId: user?.id || "" });
    //     setData(response || []); // Update data state with the fetched response or an empty array
    //   } catch (err) {
    //     setError("Failed to fetch data");
    //     console.error("Error fetching data:", err);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
  


    const toggleFavoriteMutation = api.ticket.toggleFavorite.useMutation();

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(e.target.value);
    };

    const createCommentMutation = api.comment.create.useMutation();


    const handleCommentSubmit = async () => {
        if (newComment.trim() === '' || !selectedTicket) return;
    

        try {
          // Replace this with your actual API call to add a comment
        //   ticket_id: z.number(),
        // content: z.string().min(1),
        // user_id: z.string().min(1),
        // fullname: z.string().min(1),
        // imageUrl: z.string().min(1)
        
            // console.log({
            //     ticket_id: selectedTicket.ticket_id,
            //     content: newComment,
            //     user_id: user!.id,
            //     fullname: (user?.firstName ?? '') + " " + (user?.lastName ?? ''),
            //     imageUrl: user!.imageUrl
            //   })
          await createCommentMutation.mutateAsync({
            ticket_id: selectedTicket.ticket_id,
            content: newComment,
            user_id: user!.id,
            fullname: (user?.firstName ?? '') + " " + (user?.lastName ?? ''),
            imageUrl: user!.imageUrl
          });
    
          setNewComment('');
          // Optionally refetch the comments or append the new comment directly
        //   setSelectedTicket({
        //     ...selectedTicket,
        //     comments: [
        //       ...selectedTicket.comments,
        //       { content: newComment, createdAt: new Date().toISOString(), user: { name: 'You' } }, // Placeholder
        //     ], // Replace with actual comment fetch
        //   });
        } catch (error) {
          console.error('Error adding comment:', error);
        }
      };
    
    

    // You can handle the tickets state or show loading/error states
    useEffect(() => {
      if (data) {
        setTickets(data); // Store the fetched tickets
      }
    }, [data]);

    const toggleFavorite = async (ticketId: number) => {
      if (!user) return;
      await toggleFavoriteMutation.mutateAsync({
        ticketId,
        userId: user.id,
      });


    };


    const openModal = (ticket: TicketWithFavorite) => {
        setSelectedTicket(ticket);
        // @ts-expect-error: just forget about it
        setComments(ticket.comments as IComment[] | null);
        // @ts-expect-error: just forget about it too
        setUpdates(ticket.updates as IUpdate[] | null); 
        console.log(ticket)
        // console.log("lol", ticket)
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
    };


  
    if (isLoading) return <div className="text-center p-4">Loading...</div>;
    if (isError) return <div className="text-center p-4 text-red-500">Error: {error?.message}</div>;
  
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-4">Tickets</h2>
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.ticket_id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                onClick={() => openModal(ticket)}
              >
                <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{ticket.title}</h3>
                <button
                  onClick={async (e) => {
                    e.stopPropagation(); // Prevents modal from opening when toggling favorite
                    
                    try {
                      await toggleFavorite(ticket.ticket_id);
                    } catch (error) {
                      console.error("Error toggling favorite:", error);
                    }
                    // toggleFavorite(ticket.ticket_id);
                  }}
                  className='text-2xl'
                >
                  {ticket.isFavorited ? (
                    <span className="text-yellow-500">★</span> // Filled star for favorited
                  ) : (
                    <span className="text-gray-300">☆</span> // Outline star for not favorited
                  )}
                </button>
              </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{ticket.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{ticket.content}</p>
                <div className="text-sm text-gray-500">
                  <p>Status: <span className="font-medium text-gray-800">{ticket.status}</span></p>
                  <p>Created at: {new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
  
        {isModalOpen && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg w-full h-full max-w-full overflow-hidden flex flex-col">
              <button
                onClick={closeModal}
                className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 text-3xl z-50"
              >
                &times;
              </button>
  
              <div className="flex-1 flex overflow-hidden">
                {/* Left section (Ticket details) */}
                <div className="w-2/3 p-8 overflow-y-auto">
                  {selectedTicket.imageUrl && (
                    <div className="flex items-center space-x-4">
                      <img
                        className="rounded-full w-10 h-10 object-cover"
                        src={selectedTicket.imageUrl}
                        alt={selectedTicket.fullname}
                      />
                      <h3 className="text-xl font-medium">{selectedTicket.fullname}</h3>
                    </div>
                  )}
  
                  <h2 className="mt-4 text-3xl font-semibold">{selectedTicket.title}</h2>
                  <p className="mt-4">{selectedTicket.content}</p>
                  <p className="mt-2">Status: {selectedTicket.status}</p>
                  <p className="mt-2">Created at: {new Date(selectedTicket.createdAt).toLocaleString()}</p>
                  <div>
                    <CreateUpdate ticketId={selectedTicket.ticket_id} />
                    <div className="flex flex-col items-center">
                      {updates?.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((update: IUpdate) => (
                        <div key={update.update_id} className="flex flex-col items-center">
                          <Update key={update.update_id} description={update.content} date={update.createdAt.toString()} status={update.status} />
                          <svg key={1000 - update.update_id} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mt-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
                          </svg>
                        </div>
                        ))}
                      <Update key={228} status='Submitted' date={selectedTicket.createdAt.toString()} description='Request submitted'></Update>
                    </div>
                  </div>
                </div>
  
                {/* Right section (Comments and Input) */}
                <div className="w-1/3 flex flex-col bg-gray-100">
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {/* Comments Section - Scrollable */}
                    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                      {comments?.map((comment: IComment) => (
                        <div key={comment.comment_id} className="p-4 border-b w-full">
                          <div className="flex items-start space-x-4">
                            <img
                              src={comment.imageUrl}
                              className="rounded-full w-10 h-10"
                              alt={comment.fullname}
                            />
                            <div className="flex-1">
                              <p className="font-medium">{comment.fullname}</p>
                              <p className="text-sm text-gray-500">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
  
                  {/* Comment Input Box (Fixed at the bottom) */}
                  <div className="p-4 border-t bg-white">
                    <input
                      type="text"
                      value={newComment}
                      onChange={handleCommentChange}
                      className="w-full p-2 border rounded"
                      placeholder="Write a comment..."
                    />
                    <button
                      onClick={handleCommentSubmit}
                      className="mt-2 w-full bg-blue-500 text-white py-2 rounded"
                    >
                      Submit Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  
  };
  
  export default TicketList;
  