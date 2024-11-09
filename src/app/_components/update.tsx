import React from 'react';


interface UpdateProps {
    description: string;
    date: string;
    status: string;
}

const Update: React.FC<UpdateProps> = ({ description, date, status }) => {
  return (
    <div className="update p-4 bg-white shadow-md rounded-lg border border-1 bg-slate-300 flex flex-col items-center">
      <small className="text-gray-500 mb-2">{date}</small>
      <p className="text-gray-700 mb-4">{description}</p>
      <span className={`status ${status}`}>🚀Status: {status}</span>
    </div>
  );
};

export default Update;