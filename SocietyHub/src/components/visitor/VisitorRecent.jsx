import React from 'react'

function VisitorRecent() {
  return (
    <div>
    
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Visitor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Purpose
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Visit Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                  PS
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">Priya Singh</div>
                  <div className="text-sm text-gray-500">+91 98765 43211</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              Delivery
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">Yesterday</div>
              <div className="text-sm text-gray-500">2:30 PM</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              15 mins
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default VisitorRecent
