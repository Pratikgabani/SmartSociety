// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import VisitorActive from "./VisitorActive";
// import VisitorRecent from "./VisitorRecent";

// function Visitor() {
//   const [activeVisitors, setActiveVisitors] = useState([]);
//   const [recentVisitors, setRecentVisitors] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newVisitor, setNewVisitor] = useState({
//     visitorName: "",
//     visitorPhone: "",
//     visitingAdd: "",
//     purpose: "",
//     visitDate: "",
//     visitTime: "",
//   });

//   const token = JSON.parse(localStorage.getItem("user"));
//   const roles = token?.data?.user?.role;

//   useEffect(() => {
//     const fetchVisitors = async () => {
//       try {
//         let response;
//         if (roles === "security") {
//           response = await axios.get(
//             "http://localhost:8000/api/v1/visitor/getAllVisitors",
//             { withCredentials: true }
//           );
//         } else {
//           response = await axios.get(
//             "http://localhost:8000/api/v1/visitor/getVisitor",
//             { withCredentials: true }
//           );
//         }

//         const visitors = response.data.data || response.data;
//         setActiveVisitors(visitors.filter((visitor) => visitor.isActive));
//         setRecentVisitors(visitors.filter((visitor) => !visitor.isActive));
//       } catch (error) {
//         console.error("Error fetching visitors:", error);
//       }
//     };

//     fetchVisitors();
//   }, [roles]); // Runs once on mount and when `roles` change

//   const handleCheckOut = async (id) => {
//     try {
//       await axios.get(
//         `http://localhost:8000/api/v1/visitor/removeVisitor/${id}`,
//         { withCredentials: true }
//       );

//       setActiveVisitors((prevActive) =>
//         prevActive.filter((visitor) => visitor._id !== id)
//       );

//       const checkedOutVisitor = activeVisitors.find((v) => v._id === id);
//       if (checkedOutVisitor) {
//         setRecentVisitors((prevRecent) => [...prevRecent, { ...checkedOutVisitor, isActive: false }]);
//       }
//     } catch (error) {
//       console.error("Error checking out visitor:", error);
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
//       <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
//       <button
//         onClick={() => setShowAddModal(true)}
//         className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//       >
//         + Add New Visitor
//       </button>

//       {/* Active Visitors */}
//       <h2 className="text-xl font-semibold text-gray-700 mb-4">Active Visitors</h2>
//       {activeVisitors.map((visitor) => (
//         <VisitorActive
//           key={visitor._id}
//           username={visitor.visitorName}
//           phoneNo={visitor.visitorPhone}
//           purpose={visitor.purpose}
//           checkIn={visitor.visitTime}
//           checkDay={visitor.visitDate}
//           onCheckOut={() => handleCheckOut(visitor._id)}
//         />
//       ))}

//       {/* Recent Visitors */}
//       <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Visitors</h2>
//       {recentVisitors.map((visitor) => (
//         <VisitorRecent
//           key={visitor._id}
//           name={visitor.visitorName}
//           phone={visitor.visitorPhone}
//           purpose={visitor.purpose}
//           checkIn={visitor.visitTime}
//           checkDay={visitor.visitDate}
//           duration="N/A"
//         />
//       ))}
//     </div>
//   );
// }

// export default Visitor;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VisitorActive from './VisitorActive';
import VisitorRecent from './VisitorRecent';
import { set } from 'mongoose';

function Visitor() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    visitorName: '',
    visitorPhone: '',
    visitingAdd: '',
    purpose: '',
    visitDate: '',
    visitTime: '',
  });

  const token = JSON.parse(localStorage.getItem('user'));
  const roles = token?.data?.user?.role;
  const userId = token?.data?.user?._id;

  const [activeVisitors, setActiveVisitors] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);

  // useEffect(() => {
  //   const fetchVisitors = async () => {
  //     try {
  //       let response;
  //       if (roles === 'security') {
  //         // Fetch all visitors for security
  //         response = await axios.get('http://localhost:8000/api/v1/visitor/getAllVisitors', { withCredentials: true });
  //       } else {
  //         // Fetch only the logged-in user's visitors
  //         response = await axios.get(`http://localhost:8000/api/v1/visitor/getVisitor`, { withCredentials: true });
  //       }

  //       const visitors = response.data.data || response.data; // Ensure we handle response properly based on role

  //       // Split visitors into active and recent
  //       setActiveVisitors(visitors.filter(visitor => visitor.isActive));
  //       setRecentVisitors(visitors.filter(visitor => !visitor.isActive));
  //     } catch (error) {
  //       console.error('Error fetching visitors:', error);
  //     }
  //   };

  //   fetchVisitors();
  // }, []);
   const [vari, setVari] = useState(false);
  useEffect(() => {
    const fetchRecentVisitors = async () => {
     try {
   const response = await axios.get('http://localhost:8000/api/v1/visitor/getRecentVisitors', { withCredentials: true });
   const visitors = response.data.data || response.data; 
   // Ensure we handle response properly based on role   

   setRecentVisitors(visitors); 
  } catch (error) {
      console.error('Error fetching recent visitors:', error);
     }
    };

    fetchRecentVisitors();
  }, [vari]);

  useEffect(() => {
    const fetchActiveVisitors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/visitor/getAllVisitors', { withCredentials: true });
        const visitors = response.data.data || response.data; 
        // Ensure we handle response properly based on role   

        setActiveVisitors(visitors); 
      } catch (error) {
        console.error('Error fetching active visitors:', error);
      }
}

    fetchActiveVisitors();
  }, [vari]);
  
  const handleAddVisitor = async (e) => {
    e.preventDefault();

    const newVisitorObj = {
      visitorName: newVisitor.visitorName,
      visitorPhone: newVisitor.visitorPhone,
      visitingAdd: newVisitor.visitingAdd,
      purpose: newVisitor.purpose,
      visitDate: newVisitor.visitDate,
      visitTime: newVisitor.visitTime,
    };

    try {
      await axios.post('http://localhost:8000/api/v1/visitor/createVisitor', newVisitorObj, { withCredentials: true });
      // Update the visitor list after adding
      if (roles === 'security') {
        // If security, fetch all visitors again
        const response = await axios.get('http://localhost:8000/api/v1/visitor/getAllVisitors', { withCredentials: true });
        const visitors = response.data.data;
        setActiveVisitors(visitors.filter(visitor => visitor.isActive));
        setRecentVisitors(visitors.filter(visitor => !visitor.isActive));
      } else {
        // For regular user, add the visitor to their list
        setActiveVisitors([...activeVisitors, newVisitorObj]);
      }

      setShowAddModal(false);
      setNewVisitor({
        visitorName: '',
        visitorPhone: '',
        visitingAdd: '',
        purpose: '',
        visitDate: '',
        visitTime: '',
      });
      setVari(!vari);
    } catch (error) {
      console.error('Error adding visitor:', error);
    }
  };

  const handleCheckOut = async (id) => {
    try {
        await axios.get(`http://localhost:8000/api/v1/visitor/removeVisitor/${id}`, { withCredentials: true });

        const checkedOutVisitor = activeVisitors.find(visitor => visitor._id === id);
          checkedOutVisitor.isActive = false;
        if (!checkedOutVisitor) {
            console.warn("Visitor not found in active visitors list"); // Debugging log
            return;
        }

        // Remove from active visitors
        const updatedVisitors = activeVisitors.filter(visitor => visitor._id !== id);
        setActiveVisitors(updatedVisitors);

        // Add to recent visitors only if it exists
        setRecentVisitors(prevRecent => [...prevRecent, checkedOutVisitor]);
        
    } catch (error) {
        console.error('Error checking out visitor:', error);
    }
};





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
            {activeVisitors.map(visitor => (
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
            {recentVisitors.map(visitor => (
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
  );
}
  
export default Visitor
