import React from 'react'

function VisitorActive({ username, phoneNo, purpose, checkIn, checkDay, onCheckOut }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
            {username.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{username || "Unknown"}</div>
            <div className="text-sm text-gray-500">{phoneNo || "N/A"}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {purpose || "No Purpose"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{checkIn || "N/A"}</div>
        <div className="text-sm text-gray-500">{checkDay || "N/A"}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Active
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
        <button onClick={onCheckOut} className="hover:text-red-800">Check Out</button>
      </td>
    </tr>
  )
}

export default VisitorActive