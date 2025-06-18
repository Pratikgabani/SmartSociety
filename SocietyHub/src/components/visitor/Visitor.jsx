import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import {toast ,  Toaster } from 'react-hot-toast';
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
  const [loading, setLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem('user'));
  const roles = token?.data?.user?.role;
  const userId = token?.data?.user?._id;
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [vari, setVari] = useState(false);
  const navigate = useNavigate();

  const fetchPreviousData = async () => {
    let response;
    try {
      setLoading(true);
      if (roles === "security") {
        response = await axios.get("http://localhost:8000/api/v1/visitor/getHisAllRecentVisitors", { withCredentials: true });
      }
      else {
        response = await axios.get("http://localhost:8000/api/v1/visitor/getHisRecentVisitorsByUserId", { withCredentials: true });
      }
      navigate("/history", { state: { data: response.data.data } });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecentVisitors = async () => {
      let response;
      try {
        if (roles === "security") {
          response = await axios.get('http://localhost:8000/api/v1/visitor/getRecentVisitors', { withCredentials: true });
        } else {
          response = await axios.get("http://localhost:8000/api/v1/visitor/getRecentVisitorsByUserId", { withCredentials: true });
        }
        const visitors = response.data.data || response.data;
        setRecentVisitors(visitors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent visitors:', error);
      }
    };
    fetchRecentVisitors();
  }, [vari]);

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
        setLoading(false);
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
        duration: '',
      });
      setVari(!vari);
      toast.success('Visitor added successfully');
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

  if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <HashLoader size={60} color="#2563eb" />
      <p className="mt-4 text-lg text-gray-700">Loading...</p>
    </div>
  );
}

return (
  <div className="container relative mx-auto px-4 py-8 bg-gray-50">
    {/* Add Visitor Modal */}
    {roles === "security" && showAddModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Add New Visitor</h3>
          <form onSubmit={handleAddVisitor}>
            {['visitorName', 'visitorPhone', 'visitingAdd', 'visitingBlock', 'purpose'].map((field, i) => (
              <div className="mb-4" key={i}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.replace('visitor', 'Visitor ').replace(/([A-Z])/g, ' $1')} *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newVisitor[field]}
                  onChange={(e) => setNewVisitor({ ...newVisitor, [field]: e.target.value })}
                />
              </div>
            ))}
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Add Visitor
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Visitors</h1>
      <p className="text-gray-600 text-lg">Manage and track your visitors</p>
    </div>

    {/* Buttons */}
    <div className="flex gap-4 mb-8">
      {roles === "security" && (
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          + Add New Visitor
        </button>
      )}
    </div>

    {/* Active Visitors */}
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Visitors</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check IN</th>
              {roles === "security" && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activeVisitors.map((visitor) => (
              <tr key={visitor._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-4 text-sm text-gray-800">{visitor.visitorName}</td>
                <td className="px-4 py-4 text-sm text-gray-800">{visitor.purpose}</td>
                <td className="px-4 py-4 text-sm text-black">{visitor.visitorPhone}</td>
                <td className="px-4 py-4 text-sm font-semibold text-green-600">Active</td>
                <td className="px-4 py-4 text-sm text-gray-800">{visitor.visitDate ? new Date(visitor.visitDate).toLocaleString() : "-"}</td>
                {roles === "security" && (
                  <td className="px-4 py-4 text-sm flex gap-2">
                    <button onClick={() => handleCheckOut(visitor._id)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm">
                      Check-Out
                    </button>
                    <button onClick={() => deleteVisitor(visitor._id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm">
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

    {/* Recent Visitors */}
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Visitors</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitor Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visit Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Checkout</th>
              {roles === "security" && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentVisitors.slice(0, 5).map(visitor => (
              <tr key={visitor._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-4 text-sm text-gray-800">{visitor.visitorName}</td>
                <td className="px-4 py-4 text-sm text-gray-800">{visitor.purpose}</td>
                <td className="px-4 py-4 text-sm text-gray-800">{visitor.visitorPhone}</td>
                <td className="px-4 py-4 text-sm text-gray-800">{visitor.visitDate ? new Date(visitor.visitDate).toLocaleString() : "-"}</td>
                <td className="px-4 py-4 text-sm text-gray-800">{visitor.duration}</td>
                {roles === "security" && (
                  <td className="px-4 py-4">
                    <button onClick={() => deleteVisitor(visitor._id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm">
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

    {/* History Button */}
    <div>
      <button onClick={fetchPreviousData} className="absolute top-8 right-5 rounded-lg px-3 py-2 bg-blue-500 text-white hover:bg-blue-600">
        History
      </button>
    </div>
  </div>
);

}

export default Visitor;
