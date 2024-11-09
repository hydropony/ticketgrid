"use client";

import { Ticket } from '@prisma/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '~/trpc/react';  // Import trpc hook
import { useUser } from '@clerk/clerk-react'; // Import useUser hook from Clerk



const TicketList = () => {
    const {user} = useUser(); // Use Clerk's hook to get user data

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const { data, isLoading, isError, error } = api.ticket.getLatest.useQuery();
  

    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newComment, setNewComment] = useState('');

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
        
            console.log({
                ticket_id: selectedTicket.ticket_id,
                content: newComment,
                user_id: user!.id,
                fullname: (user?.firstName ?? '') + " " + (user?.lastName ?? ''),
                imageUrl: user!.imageUrl
              })
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


    const openModal = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
    };


  
    if (isLoading) return <div className="text-center p-4">Loading...</div>;
    if (isError) return <div className="text-center p-4 text-red-500">Error: {error?.message}</div>;
  
    return (
        <div className=" px-4 sm:px-6 lg:px-8">
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
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{ticket.title}
              </h3>
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

                    <div className="bg-white rounded-lg shadow-lg w-full h-full max-w-none  overflow-y-auto">
                    
                      <div className="grid grid-cols-3  h-full">
                      <button
                        onClick={closeModal}
                        className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 text-3xl"
                      >
                        &times;
                      </button>
                        {/* Left section (2/3 of the modal) */}
                        <div className="col-span-2 flex flex-col  pl-20 pt-20 overflow-y-auto">
                        {selectedTicket.imageUrl && (
                            <div className="flex items-center space-x-4">
                            <img
                            className="rounded-full w-10 h-10 object-cover"
                            src={selectedTicket.imageUrl}
                            alt={selectedTicket.fullname}
                            />
                            <h3 className="text-xl font-medium">{selectedTicket.fullname}</h3> {/* Use title as a placeholder for username */}
                        </div>
                        )}

                            <h2 className="mt-4 text-3xl font-semibold ">{selectedTicket.title}</h2>
                            <p className="mt-4">{selectedTicket.content}</p>
                            <p className="mt-2">Status: {selectedTicket.status}</p>
                            <p className="mt-2">Created at: {new Date(selectedTicket.createdAt).toLocaleString()}</p>
                        </div>
          
                        {/* Right section (1/3 of the modal) */}
                        {/* <div className="col-span-1 flex flex-col items-center justify-center bg-gray-100">
                            chat
                        </div> */}
                        <div className="col-span-1 flex flex-col items-center justify-center bg-gray-100">
                                {/* Comments Section */}
                                <div className="overflow-y-auto max-h-[400px]">
                                    {/* {selectedTicket.comments?.map((comment) => (
                                        <div key={comment.createdAt} className="p-4 border-b">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={comment.user.profileImageUrl || '/default-avatar.jpg'}
                                                    alt={comment.user.name}
                                                    className="rounded-full w-10 h-10"
                                                />
                                                <div>
                                                    <p className="font-medium">{comment.user.name}</p>
                                                    <p className="text-sm text-gray-500">{comment.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))} */}
                                </div>
                                {/* New Comment Input */}
                                <div className="p-4">
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
  