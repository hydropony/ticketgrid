"use client";

import { useUser } from "@clerk/clerk-react";

const CreateUpdate = () => {
  const { user } = useUser();

  if (!user?.publicMetadata?.isAdmin) {
    return null;
  }


  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
}

export default CreateUpdate;