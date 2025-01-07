import React from 'react'
import VisitorActive from './VisitorActive'
import VisitorRecent from './VisitorRecent'
function Visitor() {
  return (
    <div className="p-6 min-h-screen bg-gray-100">
    {/* Header Section */}
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
      <p className="text-gray-600">Manage and track your visitors</p>
    </div>

    {/* Search and Add Section */}
    <div className="flex gap-4 mb-8">
      <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        + Add New Visitor
      </button>
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search visitors..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    {/* Active Visitors Section */}
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Visitors</h2>
   <VisitorActive username="hitesh" phoneNo="1234567890" purpose="Meeting" checkIn="12/12/2022"  checkDay="yesterday" Active={true} />

    {/* Recent Visitors Section */}
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Visitors</h2>
<VisitorRecent />
  </div>
  )
}

export default Visitor


