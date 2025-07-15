import { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import PratikPreviousDataModal from "../history/PratikPreviousDataModel.jsx";
import { toast, Toaster } from "react-hot-toast";
import { HashLoader } from "react-spinners";
import UserContext from "../../context/UserContext.js";
const PollApp = () => {
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [vari, setVari] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const token = localStorage.getItem("user");
  // const user = token ? JSON.parse(token) : null;
  // const role = user?.data.user.role;
  const { rolee } = useContext(UserContext);
  const fetchPreviousData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/polls/getPolls", {
        withCredentials: true,
      });
      navigate("/history", { state: { data: response.data.data } });
      // console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [vari]);
  // useEffect(() => {
  //   toast.success("toast is working")
  // })
  const fetchPolls = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/polls/getAllPolls", {
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
      await axios.patch(
        `http://localhost:8000/api/v1/polls/votePoll/${pollId}/${optionId}`,
        {},
        { withCredentials: true }
      );
      toast.success("Vote cast successfully");
      setVari(!vari);
    } catch (err) {
      console.error("Error voting", err);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/api/v1/polls/createPoll",
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
        `http://localhost:8000/api/v1/polls/closePoll/${pollId}`,
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
      await axios.delete(`http://localhost:8000/api/v1/polls/deletePoll/${pollId}`, {
        withCredentials: true,
      });
      setVari(!vari);
      toast.success("Poll deleted successfully");
    } catch (err) {
      console.error("Error deleting poll", err);
    }
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <HashLoader size={60} color="#2563eb" loading={loading} />
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative w-full bg-gray-100 px-4 py-8">
      <Toaster />
      <div>
        <h1 className="text-3xl font-bold mb-2">Polls & Voting</h1>
        <p className="text-gray-600 text-lg">
          Effortlessly create and participate in society polls for collective decision-making
        </p>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl mt-4 font-semibold text-gray-800 mb-2">Active Polls</h2>
          {rolee === "admin" && (
            <div className="flex justify-end">
              <button
                onClick={() => setIsPollModalOpen(true)}
                className="bg-blue-600 font-semibold text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition duration-200"
              >
                Create Poll
              </button>
            </div>
          )}
        </div>

        {isPollModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md mt-4 mb-8 p-6 w-1/3">
              <h2 className="text-xl font-semibold mb-4">Create a Poll</h2>
              <form onSubmit={handleCreatePoll} className="space-y-4">

                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Poll question"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {options.map((opt, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = e.target.value;
                        setOptions(newOptions);
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-md transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                <div className="flex justify-between ">
                  <button
                    type="button"
                    onClick={addOption}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"                >
                    Add Option
                  </button>
                  <button
                    onClick={() => setIsPollModalOpen(false)}
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Create Poll
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* <h2 className="text-2xl mt-4 font-semibold text-gray-800 mb-2">Active Polls</h2> */}
<div className="container mx-auto px-2 py-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {polls.map((poll) => (
      <div
        key={poll._id}
        className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between h-full min-h-[300px]"
      >
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {poll.question}
          </h3>

          <div className="space-y-2">
            {poll.options.map((opt) => (
              <button
                key={opt._id}
                onClick={() => handleVote(poll._id, opt._id)}
                className="w-full p-3 bg-gray-100 text-left rounded-md hover:bg-gray-200 transition-colors flex justify-between items-center"
              >
                <span>{opt.option}</span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                  {opt.percent} %
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Admin Buttons */}
        {rolee === "admin" && (
          <div className="flex justify-between gap-2 mt-6 pt-4 border-t">
            <button
              onClick={() => handleDeletePoll(poll._id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors w-full"
            >
              Delete
            </button>
            <button
              onClick={() => handleClosePoll(poll._id)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors w-full"
            >
              Close
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
</div>

      </div>

      <div>
        <button
          onClick={fetchPreviousData}
          className="absolute top-8 right-5 rounded-lg px-3 py-2 text-white bg-blue-600"
        >
          History
        </button>
      </div>
    </div>
  );
};

export default PollApp;
