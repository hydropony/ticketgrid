"use client";

import { useUser } from "@clerk/clerk-react";
import React, { ChangeEvent, useState } from "react";
import { api } from "~/trpc/react";


interface CreateUpdateProps {
    ticketId: number,
    updates: any,
    setUpdates: any
}
  

const CreateUpdate: React.FC<CreateUpdateProps> = ({ ticketId, updates, setUpdates }) => {
  const { user } = useUser();

  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const createUpdateMutation = api.update.create.useMutation();
  const updateTicketStatusMutation = api.ticket.updateStatus.useMutation();
      
  

  if (!user?.publicMetadata?.isAdmin) {
    return null;
  }

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async () => {
    if (!description || !status) return;

    try {
      const newupdate = await createUpdateMutation.mutateAsync({
        ticket_id: ticketId,
        content: description,
        status,
      });
      await updateTicketStatusMutation.mutateAsync({
        ticket_id: ticketId,
        newStatus: status
      })
      setUpdates([...updates, newupdate]);
      setDescription('');
      setStatus('');
      // Optionally, trigger a refetch of updates or update the state
    } catch (error) {
      console.error('Error creating update:', error);
    }
  };


  return (
    <div className="p-4 border-t p-0 pt-2 pd-2">
      <div className="flex space-x-4">
        <input
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          className="w-2/3 p-2 border rounded"
          placeholder="Update description"
        />
        <input
          type="text"
          value={status}
          onChange={handleStatusChange}
          className="w-1/3 p-2 border rounded"
          placeholder="Status"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-2 w-full bg-red-500 text-white py-2 rounded"
      >
        Submit Update
      </button>
    </div>
  );
}

export default CreateUpdate;