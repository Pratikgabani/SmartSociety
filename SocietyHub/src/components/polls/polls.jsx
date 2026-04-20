import { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import PratikPreviousDataModal from "../history/PratikPreviousDataModel.jsx";
import { toast } from "react-hot-toast";
import { HashLoader } from "react-spinners";
import { Trash2 } from "lucide-react";
import UserContext from "../../context/UserContext.js";

const PollApp = () => {
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [vari, setVari] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activePollTab, setActivePollTab] = useState("open");
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({ open: false, pollId: null, question: "" });
  const { rolee } = useContext(UserContext);

  const [currentUserId, setCurrentUserId] = useState(null);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/users/currentUser`, { withCredentials: true })
      .then(res => setCurrentUserId(res.data.data._id))
      .catch(() => {});
  }, []);

  const fetchPreviousData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/polls/getPolls`, {
        withCredentials: true,
      });
      navigate("/history", { state: { data: response.data.data } });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [vari]);

  const fetchPolls = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/polls/getAllPolls`, {
        withCredentials: true,
      });
      setPolls(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching polls", err);
    }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/polls/votePoll/${pollId}/${optionId}`,
        {},
        { withCredentials: true }
      );
      const msg = res.data?.message || "";
      toast.success(msg.toLowerCase().includes("removed") ? "Vote removed" : "Vote cast successfully");
      setVari(!vari);
    } catch (err) {
      console.error("Error voting", err);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/polls/createPoll`,
        {
          question,
          options: options
            .filter((opt) => opt.trim() !== "")
            .map((opt) => ({ option: opt })),
        },
        { withCredentials: true }
      );
      setQuestion("");
      setOptions(["", ""]);
      setVari(!vari);
      setIsPollModalOpen(false);
      toast.success("Poll created successfully");
    } catch (err) {
      console.error("Error creating poll", err);
      toast.error("Error creating poll");
    }
  };

  const handleClosePoll = async (pollId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/polls/closePoll/${pollId}`,
        {},
        { withCredentials: true }
      );
      setVari(!vari);
      toast.success("Poll closed successfully");
    } catch (err) {
      console.error("Error closing poll", err);
      toast.error("Error closing poll");
    }
  };

  const handleDeletePoll = async (pollId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL_BACKEND}/api/v1/polls/deletePoll/${pollId}`, {
        withCredentials: true,
      });
      setVari(!vari);
      toast.success("Poll deleted successfully");
    } catch (err) {
      console.error("Error deleting poll", err);
    }
  };

  const handleRequestDelete = (pollId, question) => {
    setConfirmDeleteModal({ open: true, pollId, question });
  };

  const handleConfirmDelete = () => {
    handleDeletePoll(confirmDeleteModal.pollId);
    setConfirmDeleteModal({ open: false, pollId: null, question: "" });
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <HashLoader size={52} color="#2563eb" loading={loading} />
        <p className="mt-4 text-[0.9rem] text-gray-500 font-medium">Loading polls…</p>
      </div>
    );
  }

  const openPolls = polls.filter(p => p.isClosed !== true);
  const pastPolls = polls.filter(p => p.isClosed === true);
  const tabPolls  = activePollTab === "open" ? openPolls : pastPolls;

  return (
    <div className="max-w-[1100px] mx-auto py-8 px-6 pb-14 font-sans text-gray-900 bg-gray-50 min-h-screen">

      {/* PAGE HEADER */}
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[1.875rem] font-bold text-gray-900 m-0 tracking-[-0.3px]">Polls &amp; Voting</h1>
          <p className="text-[0.9rem] text-gray-500 mt-1 mb-0">Create and participate in society polls for collective decisions</p>
        </div>
        <div className="flex gap-2.5 items-center">
          {rolee === "admin" && (
            <button
              onClick={() => setIsPollModalOpen(true)}
              className="py-[9px] px-[18px] bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-[0.875rem] font-semibold cursor-pointer transition-colors whitespace-nowrap"
            >
              + Create Poll
            </button>
          )}
          <button
            onClick={fetchPreviousData}
            className="py-[9px] px-[18px] bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-[0.875rem] font-semibold cursor-pointer transition-colors whitespace-nowrap"
          >
            History
          </button>
        </div>
      </div>

      {/* TAB BAR */}
      <div className="flex bg-gray-200/60 p-1 rounded-xl border border-gray-200/80 w-max mb-6 overflow-x-auto no-scrollbar">
        {[
          { id: "open", label: "Open Polls", count: openPolls.length },
          { id: "past", label: "Past Polls", count: pastPolls.length },
        ].map(tab => {
          const isActive = activePollTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePollTab(tab.id)}
              className={`flex items-center gap-2 py-1.5 px-4 font-semibold text-[0.85rem] cursor-pointer transition-all duration-300 rounded-lg whitespace-nowrap border border-transparent ${
                isActive
                  ? "bg-white text-blue-700 shadow-sm border-gray-200/50"
                  : "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-[0.72rem] font-bold ${
                isActive ? "bg-blue-100/80 text-blue-700" : "bg-gray-300/60 text-gray-600"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* POLLS LIST */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-5 items-start">
        {tabPolls.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-[72px] px-6">
            <p className="text-[2.4rem] mb-3">🗳️</p>
            <p className="font-bold text-[1.1rem] text-gray-700 mb-1.5">
              {activePollTab === "open" ? "No open polls" : "No past polls"}
            </p>
            <p className="text-[0.875rem] text-gray-400">
              {activePollTab === "open"
                ? (rolee === "admin" ? "Create the first poll to get started." : "No active polls right now.")
                : "Closed polls will appear here."}
            </p>
          </div>
        ) : (
          tabPolls.map((poll) => {
            const isOpen = poll.isClosed !== true;
            const totalVotes = poll.options.reduce((s, o) => s + (o.votes || 0), 0);
            const votedOptionId = currentUserId
              ? (poll.options.find(o =>
                  Array.isArray(o.voting) && o.voting.some(v => v.toString() === currentUserId.toString())
                )?._id || null)
              : null;

            return (
              <div
                key={poll._id}
                className="bg-white border border-gray-200 rounded-2xl py-[22px] px-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.10)] hover:border-gray-300 transition-all duration-200"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[1.08rem] font-bold text-gray-900 m-0 leading-[1.45] tracking-[-0.2px]">
                      {poll.question}
                    </h3>
                    <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                      <p className="text-[0.78rem] text-gray-400 m-0">
                        {totalVotes} vote{totalVotes !== 1 ? "s" : ""} · {poll.options.length} options
                      </p>
                      {votedOptionId && (
                        <span className="inline-flex items-center gap-1 py-[3px] px-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-[0.72rem] font-bold">
                          ✓ You voted
                        </span>
                      )}
                      <span className={`inline-block py-[2px] px-2 rounded-full text-[0.67rem] font-bold tracking-[0.3px] whitespace-nowrap ${
                        isOpen ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                      }`}>
                        {isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>

                  {/* Admin actions */}
                  {rolee === "admin" && (
                    <div className="flex gap-1.5 items-center flex-shrink-0">
                      {isOpen && (
                        <button
                          onClick={() => handleClosePoll(poll._id)}
                          className="py-[5px] px-3 bg-green-600 hover:bg-green-700 text-white border-none rounded-[7px] text-[0.78rem] font-semibold cursor-pointer transition-colors whitespace-nowrap"
                        >
                          Close
                        </button>
                      )}
                      <button
                        onClick={() => handleRequestDelete(poll._id, poll.question)}
                        className="inline-flex items-center justify-center p-[5px] bg-transparent hover:bg-red-50 text-red-400 hover:text-red-600 border-none rounded-[7px] cursor-pointer transition-colors"
                        title="Delete poll"
                      >
                        <Trash2 strokeWidth={2.5} className="w-[18px] h-[18px]" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="flex flex-col gap-2 min-w-0">
                  {poll.options.map(opt => {
                    const isMyVote = Boolean(votedOptionId && opt._id && opt._id.toString() === votedOptionId.toString());
                    return (
                      <button
                        key={opt._id}
                        onClick={() => handleVote(poll._id, opt._id)}
                        disabled={!isOpen}
                        className="relative flex justify-between items-center gap-3 py-2 px-3 bg-white border rounded-lg text-left w-full overflow-hidden transition-all duration-150"
                        style={{
                          borderColor: isMyVote ? "#2563eb" : "#e5e7eb",
                          boxShadow: isMyVote ? "0 0 0 2px #bfdbfe" : "none",
                          cursor: isOpen ? "pointer" : "default",
                        }}
                      >
                        {/* Progress bar background fill */}
                        <div
                          className="absolute inset-0 left-0 rounded-lg transition-all duration-500"
                          style={{
                            width: `${opt.percent || 0}%`,
                            backgroundColor: isMyVote ? "#dbeafe" : (isOpen ? "#eff6ff" : "#f3f4f6"),
                            zIndex: 0,
                          }}
                        />
                        {/* Option label */}
                        <span
                          className="relative flex items-center gap-1.5 text-[0.83rem]"
                          style={{
                            zIndex: 1,
                            fontWeight: isMyVote ? 700 : 500,
                            color: isMyVote ? "#1e40af" : "#374151",
                          }}
                        >
                          {isMyVote && <span className="text-[0.7rem] text-blue-600">✓</span>}
                          {opt.option}
                        </span>
                        {/* Percent badge */}
                        <span
                          className="relative text-[0.75rem] font-bold px-2 py-[2px] rounded-full whitespace-nowrap"
                          style={{
                            zIndex: 1,
                            color: isMyVote ? "#fff" : (isOpen ? "#2563eb" : "#6b7280"),
                            backgroundColor: isMyVote ? "#2563eb" : (isOpen ? "#dbeafe" : "#e5e7eb"),
                          }}
                        >
                          {opt.percent || 0}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {confirmDeleteModal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-[380px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-[1.2rem] font-bold text-gray-900 m-0 mb-2.5 flex justify-center">Delete Poll?</h2>
            <p className="text-[0.875rem] text-gray-500 mb-1.5">Are you sure you want to delete:</p>
            <p className="font-semibold text-gray-900 text-[0.9rem] mb-1.5">
              &ldquo;{confirmDeleteModal.question}&rdquo;
            </p>
            <p className="text-[0.8rem] text-red-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-2.5 justify-center">
              <button
                onClick={() => setConfirmDeleteModal({ open: false, pollId: null, question: "" })}
                className="flex-1 max-w-[130px] py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-[0.875rem] font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 max-w-[130px] py-2 px-4 bg-red-600 hover:bg-red-700 text-white border-none rounded-lg text-[0.875rem] font-semibold cursor-pointer transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE POLL MODAL */}
      {isPollModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[1.2rem] font-bold text-gray-900 m-0">Create a Poll</h2>
              <button onClick={() => setIsPollModalOpen(false)} className="bg-transparent border-none text-[1.1rem] text-gray-400 hover:text-gray-600 cursor-pointer p-1 leading-none">✕</button>
            </div>
            <form onSubmit={handleCreatePoll}>
              <div className="mb-[18px]">
                <label className="block text-[0.78rem] font-semibold text-gray-700 mb-[7px] uppercase tracking-[0.3px]">Question *</label>
                <input
                  type="text"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="What would you like to ask?"
                  required
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-[0.9rem] text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="mb-[18px]">
                <label className="block text-[0.78rem] font-semibold text-gray-700 mb-[7px] uppercase tracking-[0.3px]">Options</label>
                <div className="flex flex-col gap-2">
                  {options.map((opt, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={opt}
                        onChange={e => {
                          const newOptions = [...options];
                          newOptions[index] = e.target.value;
                          setOptions(newOptions);
                        }}
                        placeholder={`Option ${index + 1}`}
                        required
                        className="flex-1 py-2.5 px-3 border border-gray-300 rounded-lg text-[0.9rem] text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="inline-flex items-center justify-center py-2 px-2.5 flex-shrink-0 bg-transparent text-red-400 border border-red-200 rounded-[7px] text-[0.78rem] font-bold cursor-pointer hover:bg-red-50 transition-colors"
                        title="Remove option"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-2 py-[7px] px-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-[7px] text-[0.82rem] font-semibold cursor-pointer transition-colors"
                >
                  + Add Option
                </button>
              </div>

              <div className="flex justify-end gap-2.5 mt-6">
                <button
                  type="button"
                  onClick={() => setIsPollModalOpen(false)}
                  className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-[0.875rem] font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-[0.875rem] font-semibold cursor-pointer transition-colors"
                >
                  Create Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollApp;
