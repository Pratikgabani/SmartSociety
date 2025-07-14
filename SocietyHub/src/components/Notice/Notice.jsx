import { useState, useEffect, useContext } from "react";
import axios from "../../axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { HashLoader } from 'react-spinners'
import UserContext from "../../context/UserContext";
export default function Announcements() {
  const [notices, setNotices] = useState([]);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  // const token = localStorage.getItem("user");
  // const roled = token ? JSON.parse(token) : null;
  // const role = roled?.data?.user?.role
  const [ isNoticeModalOpen ,setIsNoticeModalOpen] = useState(false)
  const [loading, setLoading] = useState(true);
  const {rolee} = useContext(UserContext)
  const navigate = useNavigate();
  const fetchPreviousData = async () => {

    try {
      const response = await axios.get("http://localhost:8000/api/v1/notices/getAllNotices", { withCredentials: true });
      // Update API URL) // Update API URL

      navigate("/history", { state: { data: response.data.data } });
      // Open modal after fetching
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch Notices
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/notices/getNotices", { withCredentials: true });
        setNotices(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notices", error);
      }
    };
    fetchNotices();
  }, []);

  // Add Notice
  const handleAddNotice = async () => {
    if (!topic || !description) return;
    try {
      const response = await axios.post("http://localhost:8000/api/v1/notices/addNotice", {
        topic,
        description
      }, { withCredentials: true });
      setNotices([...notices, response.data.data]);
      setTopic("");
      setDescription("");
      setIsNoticeModalOpen(false);
      toast.success("Notice added successfully!");
    } catch (error) {
      console.error("Error adding notice", error);
    }

  };
  const deleteNotice = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/v1/notices/deleteNotice/${id}`, {}, {
        withCredentials: true,
      });
      setNotices(notices.filter((notice) => notice._id !== id));
      toast.success("Notice deleted successfully!");
    } catch (error) {
      console.error("Error deleting notice", error);
      toast.error("Error deleting notice");
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

  return (
    <div className="min-h-screen relative w-full bg-gray-100 px-4 py-8">
      <Toaster />
      <div className="flex justify-between items-center">

        <h2 className="text-3xl font-bold mb-2">Announcements & Notices</h2>
        <div><button onClick={fetchPreviousData} className='absolute top-8 right-5 rounded-lg px-3 py-2 bg-blue-400'>History</button>

        </div>
      </div>
<p className="text-gray-600 text-lg"> Stay informed with important society announcements and notices at one place. </p>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold mt-4">Recent Notices</div>
        {
        rolee === "admin" && (
          <button
            onClick={() => setIsNoticeModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded mt-4 mb-4"
          >
            Add Notice 
          </button>

        )
      }
      </div>
      

      {isNoticeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">

        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-4 border border-gray-100">
          <h3 className="text-lg font-medium mb-2">Add a Notice</h3>
          <form onSubmit={handleAddNotice}>
             <input 
              type="text" 
              placeholder="Topic" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded mb-3" 
              />
            <textarea 
              placeholder="Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded mb-3"
              />
              </form>
            <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsNoticeModalOpen(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={handleAddNotice}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Venue
                      </button>
                    </div>
        </div>
              </div>
      )}
      {/* Notices List */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
  {notices.slice(0, 5).map((notice) => (
    <div
      key={notice._id}
      className="bg-white shadow-md border rounded-lg p-4 h-full flex flex-col justify-between"
    >
      <div>
        <h3 className="text-lg font-semibold">{notice.topic}</h3>
        <p className="text-gray-700 mt-1">
          {notice.description.length > 100
            ? notice.description.slice(0, 100) + "..."
            : notice.description}
        </p>
        <span className="text-sm text-gray-500 block mt-2">
          Announced on: {format(new Date(notice.Date), "PPP p")}
        </span>
      </div>

      {rolee === "admin" && (
        <button
          onClick={() => deleteNotice(notice._id)}
          className="bg-red-500 text-white mt-4 px-4 py-1 rounded hover:bg-red-600"
        >
          Delete Notice
        </button>
      )}
    </div>
  ))}
</div>


      </div>
      <div><button onClick={fetchPreviousData} className='absolute top-8 right-5 rounded-lg px-3 py-2 bg-blue-400'>History</button>


      </div>
    </div>
  );
}
