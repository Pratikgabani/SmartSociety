import React, { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { toast, Toaster } from "react-hot-toast";
import { HashLoader } from "react-spinners";
import UserContext from "../../context/UserContext";
import { CheckCircle2, XCircle, MapPin, Calendar, FileText, User, Banknote, HelpCircle, Check, X, AlertCircle } from "lucide-react";

function RefundAdmin() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Modals state
  const [rejectModal, setRejectModal] = useState({ open: false, id: null });
  const [approveModal, setApproveModal] = useState({ open: false, id: null });
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

  const handleConfirmApprove = async () => {
    if (!approveModal.id) return;
    setActionLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/refunds/admin/${approveModal.id}/approve`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message || "Refund approved!");
      setRefunds(refunds.filter((r) => r._id !== approveModal.id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve refund");
    } finally {
      setActionLoading(false);
      setApproveModal({ open: false, id: null });
    }
  };

  const submitReject = async () => {
    if (!adminNotes.trim()) return toast.error("Please provide a reason for rejection.");
    setActionLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/refunds/admin/${rejectModal.id}/reject`,
        { adminNotes },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Refund rejected.");
      setRefunds(refunds.filter((r) => r._id !== rejectModal.id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject refund");
    } finally {
      setActionLoading(false);
      setRejectModal({ open: false, id: null });
      setAdminNotes("");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <HashLoader size={52} color="#2563eb" loading={loading} />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading refunds…</p>
      </div>
    );
  }

  if (rolee !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 text-red-500 p-8 rounded-2xl border border-red-100 shadow-sm text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Unauthorized Access</h2>
          <p className="text-red-400 font-medium">Admin privileges required to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4 md:py-8 md:px-6 font-sans text-gray-900 bg-gray-50 min-h-screen">
      <Toaster />
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 m-0 tracking-[-0.3px]">Refund Approvals</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-0">Review and manage manual refund requests from members</p>
        </div>
      </div>

      {/* REFUNDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
        {refunds.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-[72px] px-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <p className="font-medium text-lg text-gray-700 mb-1.5">No pending requests!</p>
            <p className="text-sm text-gray-400">All refund requests have been processed.</p>
          </div>
        ) : (
          refunds.map((req) => (
            <div key={req._id} className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 flex flex-col h-full group">
              
              {/* Badge Top Left */}
              <div className={`absolute top-4 right-4 inline-flex flex-shrink-0 items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium tracking-[0.3px] whitespace-nowrap shadow-sm border ${
                req.orderType === 'EventOrder' 
                  ? "bg-purple-50 text-purple-700 border-purple-200/60" 
                  : "bg-blue-50 text-blue-700 border-blue-200/60"
              }`}>
                {req.orderType === 'EventOrder' ? 'Event Refund' : 'Venue Refund'}
              </div>

              <div className="p-5 flex-1 flex flex-col relative z-20 mt-2">
                {/* Header row */}
                <div className="mb-4 pr-24">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-800 m-0 leading-snug tracking-tight truncate">
                      {req.user?.name || "Unknown User"}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(req.user?.block || req.user?.houseNo) && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-medium bg-blue-50/80 hover:bg-blue-100 border border-blue-100/50 px-2.5 py-1 rounded-md transition-colors">
                        <MapPin strokeWidth={2.5} className="w-3.5 h-3.5 text-blue-600" />
                        <span>
                          {[
                            req.user?.block ? `Block ${req.user.block}` : null,
                            req.user?.houseNo ? `House ${req.user.houseNo}` : null
                          ].filter(Boolean).join(" - ")}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{new Date(req.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 mb-5 relative flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-100/50 rounded-lg text-blue-600 flex items-center justify-center">
                      <h4 className="text-lg font-medium m-0 leading-none">₹{req.amount}</h4>
                    </div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Amount</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-600 m-0 italic line-clamp-3">
                      &quot;{req.reason}&quot;
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-end gap-3 text-right">
                  <button
                    onClick={() => setRejectModal({ open: true, id: req._id })}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3.5 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-gray-200 hover:border-red-200 rounded-lg text-sm font-medium cursor-pointer transition-all hover:shadow-sm active:scale-95"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => setApproveModal({ open: true, id: req._id })}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white border border-transparent rounded-lg text-sm font-medium cursor-pointer transition-all hover:shadow-md hover:shadow-emerald-600/20 active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* APPROVE CONFIRMATION MODAL */}
      {approveModal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[380px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200 text-center animate-in fade-in duration-200 zoom-in-95">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
              <Banknote className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 m-0 mb-2">Approve Refund?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to approve this refund? The funds will be deducted from the Stripe account immediately.
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setApproveModal({ open: false, id: null })}
                disabled={actionLoading}
                className="flex-1 py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm rounded-xl text-sm font-medium cursor-pointer transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                disabled={actionLoading}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/30 border-none rounded-xl text-sm font-medium cursor-pointer transition-all active:scale-95"
              >
                {actionLoading ? "Processing..." : "Yes, Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200 text-left animate-in fade-in duration-200 zoom-in-95">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 m-0">Reject Refund Request</h2>
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Reason for Rejection *</label>
              <textarea
                rows="3"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Explain why this request is denied..."
                className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-red-400 focus:bg-white transition-colors resize-none"
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setRejectModal({ open: false, id: null }); setAdminNotes(""); }}
                disabled={actionLoading}
                className="py-2.5 px-5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm rounded-xl text-sm font-medium cursor-pointer transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                disabled={actionLoading}
                className="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-500/30 border-none rounded-xl text-sm font-medium cursor-pointer transition-all active:scale-95"
              >
                {actionLoading ? "Processing..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RefundAdmin;
