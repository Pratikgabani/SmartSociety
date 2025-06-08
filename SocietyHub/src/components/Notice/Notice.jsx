import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function Announcements() {
  const [notices, setNotices] = useState([]);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
 const token = localStorage.getItem("user");
 const roled = token ? JSON.parse(token) : null;
const role = roled?.data?.user?.role



  const navigate = useNavigate();
  const fetchPreviousData = async () => {
    
    try {
     const response = await axios.get("http://localhost:8000/api/v1/notices/getAllNotices",{withCredentials: true});
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
        const response = await axios.get("http://localhost:8000/api/v1/notices/getNotices",{withCredentials: true});
        setNotices(response.data.data);
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
        const response = await axios.post("http://localhost:8000/api/v1/notices/addNotice",{
            topic,
            description
        },{withCredentials: true});
        setNotices([...notices, response.data.data]);
        setTopic("");
        setDescription("");
        
    } catch (error) {
        
    }
     
  };
  const deleteNotice = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/v1/notices/deleteNotice/${id}`,{},{
        withCredentials: true,});
     setNotices(notices.filter((notice) => notice._id !== id));
      
    } catch (error) {
      console.error("Error deleting notice", error);
    }
  };

  

  return (
    <div className="min-h-screen relative w-full bg-gray-100 px-4 py-8">
      <div className="flex justify-between items-center">
        
      <h2 className="text-3xl font-bold mb-2">Announcements & Notices</h2>
      <div><button onClick={fetchPreviousData} className='absolute top-8 right-5 rounded-lg px-3 py-2 bg-blue-400'>History</button>

        </div>
      </div>
      {/* One liner for announcements and notices */}
      <p className="text-gray-600 text-lg"> Stay informed with important society announcements and notices at one place. </p>
      {/* Notice Form */}
     {
        role === "admin" && (
            <div className="bg-white shadow-lg rounded-xl p-4 mb-6 mt-4">
            <h3 className="text-lg font-medium mb-2">Add a Notice</h3>
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
            <button 
              onClick={handleAddNotice} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Notice
            </button>
          </div>
          
        )
     }
      {/* Notices List */}
      <div className="space-y-4">
        {notices.slice(0, 5).map((notice) => (
          <div key={notice._id} className="bg-white shadow-md border rounded-lg p-4">
            <h3 className="text-lg font-semibold">{notice.topic}</h3>
            <p className="text-gray-700 mt-1">{notice.description}</p>
           
            <span className="text-sm text-gray-500 block mt-2">Announced on: {format(new Date(notice.Date), "PPP p")}</span>
            {
                role === "admin" && (
                    <button
                    onClick={() => deleteNotice(notice._id)}
                    className="bg-red-500 text-white mt-1 px-4 py-1 rounded hover:bg-red-600"
                  >
                    Delete Notice
                  </button>
                )
            }
          </div>
           
        ))}
     
      </div>
      <div><button onClick={fetchPreviousData} className='absolute top-8 right-5 rounded-lg px-3 py-2 bg-blue-400'>History</button>

      
      </div>
    </div>
  );
}
