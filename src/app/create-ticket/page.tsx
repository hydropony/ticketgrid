// src/app/create-ticket.tsx
'use client';

import { auth } from '@clerk/nextjs/server';
import { useUser } from '@clerk/nextjs';  // Import the Clerk hook
import { useState } from 'react';
import { api } from '~/trpc/react';  // Import the trpc hook

const CreateTicketPage = () => {
  const { user, isLoaded, isSignedIn } = useUser(); // Clerk hook to get user data
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Get the mutate function for creating a ticket
  const createTicketMutation = api.ticket.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      alert('You need to be signed in to create a ticket!');
      return;
    }

    try {

      // Call the mutation to create the ticket
      await createTicketMutation.mutateAsync({
        title,
        content,
        user_id: user?.id ?? '',
        fullname: (user?.firstName ?? '') + " " + (user?.lastName ?? ''),
        imageUrl: user?.imageUrl
      });
      alert('Ticket created successfully!');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket');
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>; // Show loading state while Clerk data is loading
  }

  if (!isSignedIn) {
    return <div>Please sign in to create a ticket.</div>; // If user is not signed in
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-black-800">Create a New Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-black-500 sm:text-sm"
            placeholder="Enter ticket title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-grey-100 sm:text-sm"
            rows={4}
            placeholder="Enter ticket content"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Create Ticket
        </button>
      </form>
    </div>
  );

};

export default CreateTicketPage;
