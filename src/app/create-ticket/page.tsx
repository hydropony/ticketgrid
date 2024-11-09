// src/app/create-ticket.tsx
'use client';

import { auth } from '@clerk/nextjs/server';
import { useState } from 'react';
import { api } from '~/trpc/react';  // Import the trpc hook

const CreateTicketPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  
  // Get the mutate function for creating a ticket
  const createTicketMutation = api.ticket.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call the mutation to create the ticket
      await createTicketMutation.mutateAsync({
        title,
        content,
        user_id: userId,
      });
      alert('Ticket created successfully!');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
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
      <div>
        <label>User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Ticket</button>
    </form>
  );
};

export default CreateTicketPage;
