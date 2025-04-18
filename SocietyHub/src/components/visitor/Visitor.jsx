
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PreviousDataModal from '../history/PreviousDataModal ';
function Visitor() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    visitorName: '',
    visitorPhone: '',
    visitingBlock: '',
    visitingAdd: null,
    purpose: '',
    visitDate: '',
    visitTime: '',
    duration: '',
  });

  const token = JSON.parse(localStorage.getItem('user'));
  const roles = token?.data?.user?.role;
  const userId = token?.data?.user?._id;
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [vari, setVari] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousData, setPreviousData] = useState([]);

  const fetchPreviousData = async () => {
    let response;
    try {
      if (roles === "security") {
        response = await axios.get("http://localhost:8000/api/v1/visitor/getHisAllRecentVisitors", { withCredentials: true });
      }
      else {
        response = await axios.get("http://localhost:8000/api/v1/visitor/getHisRecentVisitorsByUserId",  { withCredentials: true });
      } // Update API URL) // Update API URL
      setPreviousData(response.data.data);
      console.log(response.data.data);
      setIsModalOpen(true); // Open modal after fetching
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Fetch recent visitors for user and security both
  useEffect(() => {
    const fetchRecentVisitors = async () => {
      let response;
      try {
        if (roles === "security") {
          response = await axios.get('http://localhost:8000/api/v1/visitor/getRecentVisitors', { withCredentials: true });
        } else {
          response = await axios.get("http://localhost:8000/api/v1/visitor/getRecentVisitorsByUserId",  { withCredentials: true });
        }
        const visitors = response.data.data || response.data;
        setRecentVisitors(visitors);
      } catch (error) {
        console.error('Error fetching recent visitors:', error);
      }
    };

    fetchRecentVisitors();
  }, [vari]);

  // Fetch active visitors
  useEffect(() => {
    const fetchActiveVisitors = async () => {
      let response;
      try {
        if (roles === "security") {
          response = await axios.get('http://localhost:8000/api/v1/visitor/getActiveVisitors', { withCredentials: true });
        } else {
          response = await axios.get("http://localhost:8000/api/v1/visitor/getActiveVisitorsByUserId", { withCredentials: true });
        }
        const visitors = response.data.data || response.data;
        setActiveVisitors(visitors);
      } catch (error) {
        console.error('Error fetching active visitors:', error);
      }
    };

    fetchActiveVisitors();
  }, [vari]);

  const deleteVisitor = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/visitor/deleteVisitor/${id}`, { withCredentials: true });
      setVari(!vari);
    } catch (error) {
      console.error('Error deleting visitor:', error);
    }
  }

  const handleAddVisitor = async (e) => {
    e.preventDefault();

    const newVisitorObj = {
      visitorName: newVisitor.visitorName,
      visitorPhone: newVisitor.visitorPhone,
      visitingAdd: newVisitor.visitingAdd,
      purpose: newVisitor.purpose,
      visitingBlock: newVisitor.visitingBlock,
      // visitDate: newVisitor.visitDate,
      // visitTime: newVisitor.visitTime,
      duration: ""
    };

    try {
      await axios.post('http://localhost:8000/api/v1/visitor/createVisitor', newVisitorObj, { withCredentials: true });
      setShowAddModal(false);
      setNewVisitor({
        visitorName: '',
        visitorPhone: '',
        visitingAdd: '',
        purpose: '',
        visitingBlock: '',
        // visitDate: '',
        // visitTime: '',
        duration: '',
      });
      setVari(!vari);
    } catch (error) {
      console.error('Error adding visitor:', error);
    }
  };

  const handleCheckOut = async (id) => {
    if (roles === "security") {
      try {
        const checkoutTime = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
      });
        await axios.patch(`http://localhost:8000/api/v1/visitor/updateVisitorDuration/${id}`, { duration: checkoutTime }, { withCredentials: true });

        const checkedOutVisitor = activeVisitors.find(visitor => visitor._id === id);
        if (!checkedOutVisitor) {
          console.warn("Visitor not found in active visitors list");
          return;
        }

        checkedOutVisitor.duration = checkoutTime;
        checkedOutVisitor.isActive = false;

        setActiveVisitors(activeVisitors.filter(visitor => visitor._id !== id));
        setRecentVisitors(prevVisitors => [...prevVisitors, checkedOutVisitor]);
      } catch (error) {
        console.error('Error checking out visitor:', error);
      }
    }
  };

  return (
    <div className="container relative mx-auto px-4 py-8">
      {/* Add Visitor Modal */}
      {roles === "security" && showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Visitor</h3>
            <form onSubmit={handleAddVisitor}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newVisitor.visitorName}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitorName: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newVisitor.visitorPhone}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitorPhone: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Visiting House *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newVisitor.visitingAdd}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitingAdd: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Visiting Block *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newVisitor.visitingBlock}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitingBlock: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newVisitor.purpose}
                  onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                />
              </div>
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date *</label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newVisitor.visitDate}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitDate: e.target.value })}
                />
              </div> */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Time *</label>
                <input
                  type="time"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newVisitor.visitTime}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitTime: e.target.value })}
                />
              </div> */}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Visitors</h1>
        <p className="text-gray-600 text-lg">Manage and track your visitors</p>
      </div>

      <div className="flex gap-4 mb-8">
        {roles === "security" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add New Visitor
          </button>
        )}
        {/* ... rest of the search input */}
      </div>

      {/* Active Visitors Section */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Visitors</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
  <div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-100">
    <tr>
      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Visitor</th>
      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Purpose</th>
      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone</th>
      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Check IN</th>
      {roles === "security" && (
        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Action</th>
      )}
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {activeVisitors.map((visitor) => (
      <tr key={visitor._id} className="hover:bg-gray-50 transition">
        <td className="px-4 md:px-6 py-4 text-sm text-gray-800">{visitor.visitorName}</td>
        <td className="px-4 md:px-6 py-4 text-sm text-gray-800">{visitor.purpose}</td>
        <td className="px-4 md:px-6 py-4 text-sm text-black">{visitor.visitorPhone}</td>
        
        <td className="px-4 md:px-6 py-4 text-sm font-semibold text-green-600">Active</td>
        <td className="px-4 md:px-6 py-4 text-sm text-gray-800">
          {visitor.visitDate ? new Date(visitor.visitDate).toLocaleString() : "-"}
        </td>
        {roles === "security" && (
          <td className="px-4 md:px-6 py-4 text-sm flex justify-start gap-2">
            <button
              onClick={() => handleCheckOut(visitor._id)}
              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
            >
              Check-Out
            </button>
            <button
              onClick={() => deleteVisitor(visitor._id)}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          </td>
        )}
      </tr>
    ))}
  </tbody>
</table>

  </div>
</div>


      {/* Recent Visitors Section */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Visitors</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Visitor</th>
          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Purpose</th>
          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Visitor Phone</th>
          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Visit Time</th>
          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Checkout</th>
          {roles === "security" && (
            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Action</th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {recentVisitors.slice(0, 5).map(visitor => (
          <tr key={visitor._id} className="hover:bg-gray-50 transition">
            <td className="px-4 md:px-6 py-4 text-sm text-gray-800">{visitor.visitorName}</td>
            <td className="px-4 md:px-6 py-4 text-sm text-gray-800">{visitor.purpose}</td>
            <td className="px-4 md:px-6 py-4 text-sm text-gray-800">{visitor.visitorPhone}</td>
            <td className="px-4 md:px-6 py-4 text-sm text-gray-800">
              {visitor.visitDate ? new Date(visitor.visitDate).toLocaleString() : "-"}
            </td>
            <td className="px-4 md:px-6 py-4 text-sm text-gray-800">{visitor.duration}</td>
            {roles === "security" && (
              <td className="px-4 md:px-6 py-4">
                <button
                  onClick={() => deleteVisitor(visitor._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      <div><button onClick={fetchPreviousData} className='absolute top-8 right-5 rounded-lg px-3 py-2 bg-blue-400'>History</button>
        <PreviousDataModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={previousData}
        />
      </div>
    </div>
  );
}

export default Visitor;