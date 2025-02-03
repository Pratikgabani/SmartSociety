
// import React, { useState } from 'react'
// import VisitorActive from './VisitorActive'
// import VisitorRecent from './VisitorRecent'

// function Visitor() {
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [newVisitor, setNewVisitor] = useState({
//     name: '',
//     phone: '',
//     purpose: ''
//   })

//   const [activeVisitors, setActiveVisitors] = useState([
//     // ... existing active visitors array
//   ])

//   const [recentVisitors, setRecentVisitors] = useState([
//     // ... existing recent visitors array
//   ])

//   const handleAddVisitor = (e) => {
//     e.preventDefault()
//     const currentTime = new Date()
//     const hours = currentTime.getHours()
//     const minutes = currentTime.getMinutes().toString().padStart(2, '0')
//     const ampm = hours >= 12 ? 'PM' : 'AM'
//     const formattedHours = (hours % 12 || 12).toString()

//     const newVisitorObj = {
//       id: Date.now(),
//       username: newVisitor.name,
//       phoneNo: newVisitor.phone,
//       purpose: newVisitor.purpose,
//       checkIn: {
//         time: `${formattedHours}:${minutes} ${ampm}`,
//         date: "Today"
//       },
//       Active: false
//     }

//     setActiveVisitors([...activeVisitors, newVisitorObj])
//     setShowAddModal(false)
//     setNewVisitor({ name: '', phone: '', purpose: '' })
//   }

//   const handleCheckOut = (id) => {
//     const checkedOutVisitor = activeVisitors.find(visitor => visitor.id === id);
//     const checkInTime = new Date(checkedOutVisitor.checkIn.time);
//     const checkOutTime = new Date();
//     const duration = Math.round((checkOutTime - checkInTime) / (1000 * 60)); // in minutes
  
//     setActiveVisitors(activeVisitors.filter(visitor => visitor.id !== id));
//     setRecentVisitors([...recentVisitors, {
//       id: checkedOutVisitor.id,
//       name: checkedOutVisitor.username,
//       phone: checkedOutVisitor.phoneNo,
//       purpose: checkedOutVisitor.purpose,
//       visitDate: checkedOutVisitor.checkIn,
//       duration: `${duration} mins`
//     }]);
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
//       {/* Add Visitor Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Visitor</h3>
//             <form onSubmit={handleAddVisitor}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
//                 <input
//                   type="text"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   value={newVisitor.name}
//                   onChange={(e) => setNewVisitor({...newVisitor, name: e.target.value})}
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
//                 <input
//                   type="tel"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   value={newVisitor.phone}
//                   onChange={(e) => setNewVisitor({...newVisitor, phone: e.target.value})}
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
//                 <input
//                   type="text"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   value={newVisitor.purpose}
//                   onChange={(e) => setNewVisitor({...newVisitor, purpose: e.target.value})}
//                 />
//               </div>
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//                 >
//                   Add Visitor
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Existing UI */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
//         <p className="text-gray-600">Manage and track your visitors</p>
//       </div>

//       <div className="flex gap-4 mb-8">
//         <button 
//           onClick={() => setShowAddModal(true)}
//           className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//         >
//           + Add New Visitor
//         </button>
//         {/* ... rest of the search input */}
//       </div>

//      {/* Active Visitors Section */}
// <h2 className="text-xl font-semibold text-gray-700 mb-4">Active Visitors</h2>
// <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
//   <table className="w-full">
//     <thead className="bg-gray-50">
//       <tr>
//         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
//         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
//         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
//         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//       </tr>
//     </thead>
//     <tbody className="divide-y divide-gray-200">
//       {activeVisitors.map((visitor) => (
//         <VisitorActive
//           key={visitor.id}
//           username={visitor.username}
//           phoneNo={visitor.phoneNo}
//           purpose={visitor.purpose}
//           checkIn={visitor.checkIn.time}
//           checkDay={visitor.checkIn.date}
//           onCheckOut={() => handleCheckOut(visitor.id)}
//         />
//       ))}
//     </tbody>
//   </table>
// </div>

// {/* Recent Visitors Section */}
// <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Visitors</h2>
// <div className="bg-white rounded-lg shadow overflow-hidden">
//   <table className="w-full">
//     <thead className="bg-gray-50">
//       <tr>
//         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
//         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
//         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Date</th>
//         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
//       </tr>
//     </thead>
//     <tbody className="divide-y divide-gray-200">
//       {recentVisitors.map((visitor) => (
//         <VisitorRecent
//           key={visitor.id}
//           name={visitor.name}
//           phone={visitor.phone}
//           purpose={visitor.purpose}
//           checkIn={visitor.visitDate.time}
//           checkDay={visitor.visitDate.date}
//           duration={visitor.duration}
//         />
//       ))}
//     </tbody>
//   </table>
// </div>
//     </div>
//   )
// }

// export default Visitor

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import VisitorActive from './VisitorActive'
import VisitorRecent from './VisitorRecent'

function Visitor() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newVisitor, setNewVisitor] = useState({
    visitorName: '',
    visitorPhone: '',
    visitingAdd: '',
    purpose: '',
    visitDate: '',
    visitTime: ''
  })

  const [activeVisitors, setActiveVisitors] = useState([])
  const [recentVisitors, setRecentVisitors] = useState([])

  useEffect(() => {
    // Fetch all visitors when component mounts
    const fetchVisitors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/visitor/getAllVisitors')
        const visitors = response.data.data
        setActiveVisitors(visitors.filter(visitor => visitor.isActive))
        setRecentVisitors(visitors.filter(visitor => !visitor.isActive))
      } catch (error) {
        console.error('Error fetching visitors:', error)
      }
    }
    fetchVisitors()
  }, [])

  const handleAddVisitor = async (e) => {
    e.preventDefault()

    const newVisitorObj = {
      visitorName: newVisitor.visitorName,
      visitorPhone: newVisitor.visitorPhone,
      visitingAdd: newVisitor.visitingAdd,
      purpose: newVisitor.purpose,
      visitDate: newVisitor.visitDate,
      visitTime: newVisitor.visitTime
    }

    try {
      await axios.post('http://localhost:8000/api/v1/visitor/createVisitor', newVisitorObj)
      setActiveVisitors([...activeVisitors, newVisitorObj])
      setShowAddModal(false)
      setNewVisitor({ visitorName: '', visitorPhone: '', visitingAdd: '', purpose: '', visitDate: '', visitTime: '' })
    } catch (error) {
      console.error('Error adding visitor:', error)
    }
  }

  const handleCheckOut = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/v1/visitor/removeVisitor/${id}`)
      const updatedVisitors = activeVisitors.filter(visitor => visitor._id !== id)
      setActiveVisitors(updatedVisitors)
      const checkedOutVisitor = activeVisitors.find(visitor => visitor._id === id)
      setRecentVisitors([...recentVisitors, checkedOutVisitor])
    } catch (error) {
      console.error('Error checking out visitor:', error)
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Add Visitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Visitor</h3>
            <form onSubmit={handleAddVisitor}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newVisitor.visitorName}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitorName: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newVisitor.visitorPhone}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitorPhone: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Visiting Address *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newVisitor.visitingAdd}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitingAdd: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newVisitor.purpose}
                  onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date *</label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newVisitor.visitDate}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitDate: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Time *</label>
                <input
                  type="time"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newVisitor.visitTime}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitTime: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add Visitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Existing UI */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
        <p className="text-gray-600">Manage and track your visitors</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          + Add New Visitor
        </button>
        {/* ... rest of the search input */}
      </div>

      {/* Active Visitors Section */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Active Visitors</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activeVisitors.map((visitor) => (
              <VisitorActive
                key={visitor._id}
                username={visitor.visitorName}
                phoneNo={visitor.visitorPhone}
                purpose={visitor.purpose}
                checkIn={visitor.visitTime}
                checkDay={visitor.visitDate}
                onCheckOut={() => handleCheckOut(visitor._id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Visitors Section */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Visitors</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentVisitors.map((visitor) => (
              <VisitorRecent
                key={visitor._id}
                name={visitor.visitorName}
                phone={visitor.visitorPhone}
                purpose={visitor.purpose}
                checkIn={visitor.visitTime}
                checkDay={visitor.visitDate}
                duration="N/A" // Duration can be calculated if needed
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Visitor
