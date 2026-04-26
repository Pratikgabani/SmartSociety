import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { toast } from "react-hot-toast";
import UserContext from "../../context/UserContext.js";
import { 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  FileImage, 
  Trash2, 
  ExternalLink, 
  CheckCircle
} from "lucide-react";

// ── Memoized Complaint Card ──────────────────────────────────────────────────
const ComplaintCard = React.memo(({ complaint, rolee, onResolve, onDelete, canDelete }) => {
  const isResolved = complaint.isResolved;

  // Formatter for dates if available
  const dateStr = complaint.date || complaint.createdAt;
  const displayDate = dateStr 
    ? new Date(dateStr).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) 
    : "";
    
  const postedBlock = complaint?.complainId?.block || complaint?.byBlock;
  const postedHouseNo = complaint?.complainId?.houseNo || complaint?.byHouse;
  const postedByText = [
    postedBlock ? `Block ${postedBlock}` : null,
    postedHouseNo ? `House ${postedHouseNo}` : null,
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 flex flex-col h-full group">
      
      {/* Delete Button - Top Right Absolute */}
      {canDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(complaint._id, complaint.subject);
          }}
          className="absolute top-3 right-3 z-30 flex items-center justify-center p-2 bg-white/90 hover:bg-red-50 text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 rounded-full shadow-sm backdrop-blur-md cursor-pointer transition-all active:scale-95"
          title="Delete Complaint"
        >
          <Trash2 strokeWidth={2.5} className="w-[18px] h-[18px]" />
        </button>
      )}

      {/* Proof Preview Section */}
      {complaint.proof && (
        <a 
          href={complaint.proof} 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative w-full h-[160px] bg-gray-50 border-b border-gray-100 overflow-hidden block group/image cursor-pointer"
          title="Click to view full proof document"
        >
          <img 
            src={complaint.proof} 
            alt="Complaint Proof" 
            className="w-full h-full object-cover group-hover/image:scale-105 group-hover/image:rotate-1 transition-transform duration-700"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Missing Image Fallback */}
          <div className="hidden absolute inset-0 flex-col items-center justify-center bg-gray-50 text-gray-400">
            <FileImage className="w-8 h-8 mb-2 opacity-30" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Unavailable</span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
            <div className="flex flex-col items-center text-white translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300">
              <ExternalLink className="w-7 h-7 mb-2 drop-shadow-md" />
              <span className="text-xs font-medium tracking-wide drop-shadow-md">View Full File</span>
            </div>
          </div>
        </a>
      )}

      <div className="p-5 flex-1 flex flex-col relative z-20 bg-white">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 m-0 leading-snug tracking-tight pb-2 line-clamp-2" title={complaint.subject}>
              {complaint.subject}
            </h3>
            
            <div className="flex flex-col gap-2 mt-1">
              {postedByText && (
                <div className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-medium bg-blue-50/80 hover:bg-blue-100 border border-blue-100/50 w-fit px-2.5 py-1 rounded-md transition-colors">
                  <MapPin strokeWidth={2.5} className="w-3.5 h-3.5 text-blue-600" />
                  <span>{postedByText}</span>
                </div>
              )}
              {displayDate && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium ml-0.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{displayDate}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`inline-flex flex-shrink-0 items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium tracking-[0.3px] whitespace-nowrap shadow-sm border ${
            isResolved 
              ? "bg-green-50 text-green-700 border-green-200/60" 
              : "bg-amber-50 text-amber-700 border-amber-200/60"
          }`}>
            {!isResolved ? (
              <>
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5 animate-pulse shadow-[0_0_4px_rgba(245,158,11,0.5)]" />
                Pending
              </>
            ) : (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Resolved
              </>
            )}
          </div>
        </div>

        {/* Description body */}
        <div className="text-sm text-gray-600 leading-relaxed mb-6 flex-1 break-words">
          <p className="line-clamp-4 m-0" title={complaint.description}>
            {complaint.description}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-end gap-2 text-right">
          {!isResolved && rolee === "admin" && (
            <button
              onClick={() => onResolve(complaint._id)}
              className="flex items-center gap-1.5 py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white border border-transparent rounded-lg text-xs font-medium cursor-pointer transition-all hover:shadow-md hover:shadow-emerald-600/20 active:scale-95 text-center mx-auto w-full justify-center"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Resolved</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

// ── Main Component ───────────────────────────────────────────────────────────
function Complaint() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({ open: false, complaintId: null, subject: "" });
  
  const { rolee } = useContext(UserContext);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/users/currentUser`, {
        withCredentials: true,
      })
      .then((res) => setCurrentUserId(res?.data?.data?._id || null))
      .catch(() => setCurrentUserId(null));
  }, []);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const [pendingResponse, resolvedResponse] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_URL_BACKEND}/api/v1/complain/getAllComplains`,
            { withCredentials: true }
          ),
          axios.get(
            `${import.meta.env.VITE_URL_BACKEND}/api/v1/complain/getComplains`,
            { withCredentials: true }
          ),
        ]);

        const pending = pendingResponse?.data?.data || [];
        const resolved = resolvedResponse?.data?.data || [];

        // Merge both lists so tabs can reliably split by isResolved.
        const merged = [...pending, ...resolved].sort(
          (a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
        );

        setComplaints(merged);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [refresh]);

  const handleHistoryClick = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/complain/getComplains`, {
        withCredentials: true,
      });
      navigate("/history", { state: { data: response.data.data } });
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("date", new Date().toLocaleDateString());
    formData.append("isResolved", false);
    if (file) formData.append("proof", file);

    try {
      await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/complain/createComplain`,
        formData,
        { withCredentials: true }
      );
      toast.success("Complaint added successfully!");
      setIsFormOpen(false);
      setFile(null);
      setSubject("");
      setDescription("");
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error adding complaint:", error);
      toast.error("Failed to add complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestDelete = useCallback((complaintId, subject) => {
    setConfirmDeleteModal({ open: true, complaintId, subject });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDeleteModal.complaintId) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/complain/deleteComplain/${confirmDeleteModal.complaintId}`,
        { withCredentials: true }
      );
      toast.success("Complaint removed!");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error deleting complaint:", error);
      toast.error(error?.response?.data?.message || "Failed to delete complaint");
    } finally {
      setConfirmDeleteModal({ open: false, complaintId: null, subject: "" });
    }
  }, [confirmDeleteModal.complaintId]);

  const handleResolve = useCallback(async (complaintId) => {
    if (rolee !== "admin") return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/complain/toggleComplain/${complaintId}`,
        { isResolved: true },
        { withCredentials: true }
      );
      toast.success("Priority complaint marked as resolved!");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error resolving complaint:", error);
    }
  }, [rolee]);

  // Apply Search + Tabs Derived State
  const pendingComplaints = complaints.filter(c => !c.isResolved);
  const resolvedComplaints = complaints.filter(c => c.isResolved);

  const activeTabList = activeTab === "pending" ? pendingComplaints : resolvedComplaints;
  const filteredList = activeTabList.filter(c => 
    c.subject?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <HashLoader size={52} color="#2563eb" loading={loading} />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading complaints…</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4 md:py-8 md:px-6 font-sans text-gray-900 bg-gray-50 min-h-screen">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 m-0 tracking-[-0.3px]">Complaints Space</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-0">Submit, track, and resolve residential concerns</p>
        </div>
        <div className="flex gap-2.5 items-center w-full sm:w-auto">
          <button
            onClick={handleHistoryClick}
            className="w-full sm:w-auto py-[9px] px-[18px] bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap"
          >
            History
          </button>
        </div>
      </div>

      {/* TAB BAR & SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        {/* Containerized Tabs */}
        <div className="flex bg-gray-200/60 p-1 rounded-xl border border-gray-200/80 w-full sm:w-max max-w-full overflow-x-auto no-scrollbar">
          {[
            { id: 'pending', label: 'Pending Issues', count: pendingComplaints.length },
            { id: 'resolved', label: 'Resolved', count: resolvedComplaints.length },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-1.5 px-4 font-semibold text-sm cursor-pointer transition-all duration-300 rounded-lg whitespace-nowrap border border-transparent ${
                  isActive
                    ? "bg-white text-blue-700 shadow-sm border-gray-200/50"
                    : "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-xs font-medium ${
                  isActive ? "bg-blue-100/80 text-blue-700" : "bg-gray-300/60 text-gray-600"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto py-[9px] px-[18px] bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap"
        >
          + Add Complaint
        </button>
        {/* <div className="relative w-full max-w-[280px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search matching issues…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-[38px] pr-3 py-2.5 border border-gray-200/80 rounded-xl text-sm text-gray-900 outline-none bg-white font-medium box-border focus:ring-2 focus:ring-blue-100 hover:border-gray-300 focus:border-blue-400 transition-all"
          />
        </div> */}
      </div>

      {/* COMPLAINTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
        {filteredList.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-[72px] px-6">
            <p className="text-[2.4rem] mb-3">
              {activeTab === "pending" ? "🎉" : "🗂️"}
            </p>
            <p className="font-medium text-lg text-gray-700 mb-1.5">
              {searchQuery 
                ? "No matching records found" 
                : (activeTab === "pending" ? "No pending complaints!" : "No resolved records")}
            </p>
            <p className="text-sm text-gray-400">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : (activeTab === "pending" ? "You're all caught up and completely issue-free." : "")}
            </p>
          </div>
        ) : (
          filteredList.map((complaint) => {
            const complaintOwnerId = complaint?.complainId?._id || complaint?.complainId;
            const canDelete =
              !complaint?.isResolved &&
              Boolean(complaintOwnerId) &&
              Boolean(currentUserId) &&
              complaintOwnerId.toString() === currentUserId.toString();

            return (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                rolee={rolee}
                onResolve={handleResolve}
                onDelete={handleRequestDelete}
                canDelete={canDelete}
              />
            );
          })
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {confirmDeleteModal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[380px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200 text-center animate-in fade-in duration-200 zoom-in-95">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 m-0 mb-2">Delete Complaint?</h2>
            <p className="text-sm text-gray-500 mb-2">Are you sure you want to permanently remove:</p>
            <p className="font-semibold text-gray-900 text-[0.95rem] mb-2 line-clamp-2 px-2">
              &ldquo;{confirmDeleteModal.subject}&rdquo;
            </p>
            <p className="text-xs text-red-500 mb-6 font-medium bg-red-50 py-1.5 px-3 rounded-md inline-block">This action cannot be undone.</p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmDeleteModal({ open: false, complaintId: null, subject: "" })}
                className="flex-1 py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm rounded-xl text-sm font-medium cursor-pointer transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-500/30 border-none rounded-xl text-sm font-medium cursor-pointer transition-all active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD COMPLAINT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 m-0">Log a Complaint</h2>
                <p className="text-xs text-gray-400 mt-0.5 mb-0">Outline your issue for resolution</p>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="bg-transparent border-none text-lg text-gray-400 hover:text-gray-600 cursor-pointer p-1 leading-none"
              >✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Subject *</label>
                <input
                  type="text"
                  placeholder="E.g., Broken street light, Water issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Description *</label>
                <textarea
                  placeholder="Provide details about what happened and where..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors resize-y"
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Attach Proof (Optional)</label>
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 mt-6 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`py-2 px-4 text-white border-none rounded-lg text-sm font-semibold transition-colors flex items-center justify-center min-w-[124px] ${
                    isSubmitting 
                      ? "bg-blue-400 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <HashLoader size={16} color="#ffffff" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Issue"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Complaint;
