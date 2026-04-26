import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "../../axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { HashLoader } from 'react-spinners';
import UserContext from "../../context/UserContext";
import { Calendar, Trash2, Bell, MessageSquare, AlertCircle } from "lucide-react";

// 🔥 Memoization Implementation for Notices
const NoticeCard = React.memo(({ notice, rolee, onDeleteRequest }) => {
  const displayDate = notice.Date ? format(new Date(notice.Date), "PPP p") : "";

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 flex flex-col h-full group">
      
      {/* Delete Button - Top Right Absolute */}
      {rolee === "admin" && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onDeleteRequest(notice._id, notice.topic);
          }}
          className="absolute top-3 right-3 z-30 flex items-center justify-center p-2 bg-white/90 hover:bg-red-50 text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 rounded-full shadow-sm backdrop-blur-md cursor-pointer transition-all active:scale-95"
          title="Delete Notice"
        >
          <Trash2 strokeWidth={2.5} className="w-[18px] h-[18px]" />
        </button>
      )}

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col relative z-20 bg-white">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4 pr-8">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-medium text-gray-900 m-0 leading-[1.35] pb-2 break-words" title={notice.topic}>
              {notice.topic}
            </h3>
            
            <div className="flex flex-col gap-2 mt-1">
              {displayDate && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{displayDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description body */}
        <div className="text-[0.84rem] text-gray-500 leading-[1.55] mb-2 flex-1 break-words whitespace-pre-wrap">
          <p className="m-0">
            {notice.description}
          </p>
        </div>
      </div>
    </div>
  );
});

export default function Announcements() {
  const [notices, setNotices] = useState([]);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({ open: false, noticeId: null, topic: "" });
  
  const { rolee } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchPreviousData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/notices/getAllNotices`, { withCredentials: true });
      navigate("/history", { state: { data: response.data.data } });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch Notices
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/notices/getNotices`, { withCredentials: true });
        // The API returns all active notices.
        setNotices(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notices", error);
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // Add Notice
  const handleAddNotice = async (e) => {
    if (e) e.preventDefault();
    if (!topic || !description) return;
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL_BACKEND}/api/v1/notices/addNotice`, {
        topic,
        description
      }, { withCredentials: true });
      setNotices([response.data.data, ...notices]);
      setTopic("");
      setDescription("");
      setIsNoticeModalOpen(false);
      toast.success("Notice added successfully!");
    } catch (error) {
      console.error("Error adding notice", error);
      toast.error("Failed to add notice");
    }
  };

  const handleRequestDelete = useCallback((noticeId, topic) => {
    setConfirmDeleteModal({ open: true, noticeId, topic });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDeleteModal.noticeId) return;
    try {
      await axios.patch(`${import.meta.env.VITE_URL_BACKEND}/api/v1/notices/deleteNotice/${confirmDeleteModal.noticeId}`, {}, {
        withCredentials: true,
      });
      setNotices((prevNotices) => prevNotices.filter((notice) => notice._id !== confirmDeleteModal.noticeId));
      toast.success("Notice deleted successfully!");
    } catch (error) {
      console.error("Error deleting notice", error);
      toast.error("Error deleting notice");
    } finally {
      setConfirmDeleteModal({ open: false, noticeId: null, topic: "" });
    }
  }, [confirmDeleteModal.noticeId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <HashLoader size={52} color="#2563eb" loading={loading} />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading announcements…</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4 md:py-8 md:px-6 font-sans text-gray-900 bg-gray-50 min-h-screen">
      <Toaster />
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 m-0 tracking-[-0.3px]">Announcements & Notices</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-0">Stay informed with important society announcements and notices at one place.</p>
        </div>
        <div className="flex gap-2.5 items-center w-full sm:w-auto">
          <button
            onClick={fetchPreviousData}
            className="w-full sm:w-auto py-[9px] px-[18px] bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap"
          >
            History
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 mt-8 gap-4">
        <h2 className="text-xl font-medium text-gray-900 m-0">Recent Notices</h2>
        {rolee === "admin" && (
          <button
            onClick={() => setIsNoticeModalOpen(true)}
            className="w-full sm:w-auto py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap"
          >
            + Add Notice
          </button>
        )}
      </div>

      {/* NOTICES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
        {notices.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-[72px] px-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <p className="font-medium text-lg text-gray-700 mb-1.5">No recent notices!</p>
            <p className="text-sm text-gray-400">There are no new announcements to show.</p>
          </div>
        ) : (
          notices.map((notice) => (
            <NoticeCard
              key={notice._id}
              notice={notice}
              rolee={rolee}
              onDeleteRequest={handleRequestDelete}
            />
          ))
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {confirmDeleteModal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[380px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200 text-center animate-in fade-in duration-200 zoom-in-95">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 m-0 mb-2">Delete Notice?</h2>
            <p className="text-sm text-gray-500 mb-2">Are you sure you want to permanently remove:</p>
            <p className="font-semibold text-gray-900 text-[0.95rem] mb-2 line-clamp-2 px-2">
              &ldquo;{confirmDeleteModal.topic}&rdquo;
            </p>
            <p className="text-xs text-red-500 mb-6 font-medium bg-red-50 py-1.5 px-3 rounded-md inline-block">This action cannot be undone.</p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmDeleteModal({ open: false, noticeId: null, topic: "" })}
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

      {/* ADD NOTICE MODAL */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 m-0">Add a Notice</h2>
                <p className="text-xs text-gray-400 mt-0.5 mb-0">Create a new announcement</p>
              </div>
              <button 
                onClick={() => setIsNoticeModalOpen(false)} 
                className="bg-transparent border-none text-lg text-gray-400 hover:text-gray-600 cursor-pointer p-1 leading-none"
              >✕</button>
            </div>
            
            <form onSubmit={handleAddNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Topic *</label>
                <input
                  type="text"
                  placeholder="E.g., Water Supply Disruption"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Description *</label>
                <textarea
                  placeholder="Provide details about the notice..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors resize-y"
                />
              </div>

              <div className="flex justify-end gap-2.5 mt-6 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors"
                >
                  Add Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
