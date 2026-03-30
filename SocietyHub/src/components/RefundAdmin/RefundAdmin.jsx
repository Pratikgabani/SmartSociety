import React, { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { toast, Toaster } from "react-hot-toast";
import { HashLoader } from "react-spinners";
import UserContext from "../../context/UserContext";

function RefundAdmin() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const { rolee } = useContext(UserContext);

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_BACKEND}/api/v1/refunds/admin/all`,
          { withCredentials: true }
        );
        setRefunds(response.data.data);
      } catch (error) {
        console.error("Error fetching refunds", error);
        toast.error("Failed to load refund requests");
      } finally {
        setLoading(false);
      }
    };
    if (rolee === "admin") {
      fetchRefunds();
    } else {
      setLoading(false);
    }
  }, [rolee]);

  const handleApprove = async (id) => {
    if(!window.confirm("Are you sure you want to approve this refund? The money will be deducted from the Stripe account immediately.")) return;
    setActionLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/refunds/admin/${id}/approve`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message || "Refund approved!");
      setRefunds(refunds.filter((r) => r._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve refund");
    } finally {
      setActionLoading(false);
    }
  };

  const submitReject = async () => {
    if (!adminNotes.trim()) return toast.error("Please provide a reason for rejection.");
    setActionLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/refunds/admin/${rejectId}/reject`,
        { adminNotes },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Refund rejected.");
      setRefunds(refunds.filter((r) => r._id !== rejectId));
      setRejectId(null);
      setAdminNotes("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject refund");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <HashLoader size={60} color="#2563eb" loading={loading} />
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (rolee !== "admin") {
    return <div className="p-8 text-center text-red-500 font-bold">Unauthorized. Admin access required.</div>;
  }

  return (
    <div className="container relative mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <Toaster />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Refund Approvals</h1>
      <p className="text-gray-600 text-lg mb-8">Manage manual refund requests from members</p>

      {refunds.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-500 text-lg">No pending refund requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {refunds.map((req) => (
            <div key={req._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{req.user?.name || "Unknown User"}</h3>
                  <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md text-xs font-medium">Flat: {req.user?.houseNo || "N/A"}</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${req.orderType === 'EventOrder' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {req.orderType === 'EventOrder' ? 'Event' : 'Venue Booking'}
                  </span>
                </div>
                <p className="text-gray-600 mb-1"><strong>Amount:</strong> ₹{req.amount}</p>
                <p className="text-gray-600 mb-1"><strong>Reason given:</strong> {req.reason}</p>
                <p className="text-gray-400 text-xs mt-2">Requested on: {new Date(req.createdAt).toLocaleString("en-GB")}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setRejectId(req._id)}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-red-100 text-red-700 hover:bg-red-200 font-semibold rounded-lg transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(req._id)}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 font-semibold rounded-lg transition-colors"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-4 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reject Refund</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason (Admin Notes)
                </label>
                <textarea
                  rows="3"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Required: Tell the user why this was rejected..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => { setRejectId(null); setAdminNotes(""); }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                disabled={actionLoading}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RefundAdmin;
