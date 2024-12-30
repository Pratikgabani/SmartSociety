import React from 'react';

const Card = ({ title, description }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6">
      <div className="font-bold text-xl mb-2 text-gray-800">{title}</div>
      <p className="text-gray-700 text-base">{description}</p>
    </div>
  );
};

export default Card;
