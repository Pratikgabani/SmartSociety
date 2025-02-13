import React, { useState } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="btn px-2 py-1 text-black   rounded-md  flex items-center"
      >
        Features <IoMdArrowDropdown className={`ml-2 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <ul className="menu dropdown-content bg-white rounded-md shadow-lg z-10 mt-2 py-2 w-48 absolute right-0 ring-1 ring-black ring-opacity-5">
          <li><a href="/Visitor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Visitor</a></li>
          <li><a href="/Payment" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Payment</a></li>
          <li><a href="/Complaint" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Complaint</a></li>
          <li><a href="/poll" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Poll</a></li>
          <li><a href="/booking" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">bookings</a></li>
          <li><a href="/event" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">events</a></li>

        </ul>
      )}
    </div>
  );
};

export default Dropdown;

