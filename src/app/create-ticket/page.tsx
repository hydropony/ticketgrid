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
        user_id: user?.id || '',  // Use Clerk's user ID
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
    <div className='columns-1'>

      <form onSubmit={handleSubmit}>
        <div className=''>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create ticket</button>
      </form>

    </div>  
  );
};

export default CreateTicketPage;
