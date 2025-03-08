// import { useState } from "react";
// import { format } from "date-fns";
// import { v4 as uuidv4 } from "uuid";

// const Announcements = ()=> {
//   const [notices, setNotices] = useState([
//     { id: uuidv4(), topic: "Maintenance Update", description: "Water supply will be off from 10 AM - 2 PM.", timestamp: new Date() },
//     { id: uuidv4(), topic: "Festival Celebration", description: "Diwali celebration on Nov 10th at 7 PM.", timestamp: new Date() },
//   ]);

//   const [topic, setTopic] = useState("");
//   const [description, setDescription] = useState("");

//   const handleAddNotice = () => {
//     if (!topic || !description) return;
//     setNotices([{ id: uuidv4(), topic, description, timestamp: new Date() }, ...notices]);
//     setTopic("");
//     setDescription("");
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-4">Announcements & Notices</h2>
      
//       {/* Notice Form */}
//       <div className="bg-white shadow-lg rounded-xl p-4 mb-6">
//         <h3 className="text-lg font-medium mb-2">Add a Notice</h3>
//         <input 
//           type="text" 
//           placeholder="Topic" 
//           value={topic} 
//           onChange={(e) => setTopic(e.target.value)} 
//           className="w-full p-2 border border-gray-300 rounded mb-3" 
//         />
//         <textarea 
//           placeholder="Description" 
//           value={description} 
//           onChange={(e) => setDescription(e.target.value)} 
//           className="w-full p-2 border border-gray-300 rounded mb-3"
//         />
//         <button 
//           onClick={handleAddNotice} 
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Add Notice
//         </button>
//       </div>
      
//       {/* Notices List */}
//       <div className="space-y-4">
//         {notices.map((notice) => (
//           <div key={notice.id} className="bg-white shadow-md border rounded-lg p-4">
//             <h3 className="text-lg font-semibold">{notice.topic}</h3>
//             <p className="text-gray-700 mt-1">{notice.description}</p>
//             <span className="text-sm text-gray-500 block mt-2">Announced on: {format(notice.timestamp, "PPP p")}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// export default Announcements

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import PreviousDataModal from '../history/PreviousDataModal ';
export default function Announcements() {
  const [notices, setNotices] = useState([]);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
 const token = localStorage.getItem("user");
 const roled = token ? JSON.parse(token) : null;
const role = roled?.data?.user?.role
 console.log(role)

 const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousData, setPreviousData] = useState([]);

  const fetchPreviousData = async () => {
    
    try {
     const response = await axios.get("http://localhost:8000/api/v1/notices/getNotices",{withCredentials: true});
      // Update API URL) // Update API URL
      setPreviousData(response.data.data);
      console.log(response.data.data);
      setIsModalOpen(true); // Open modal after fetching
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
      await axios.delete(`http://localhost:8000/api/v1/notices/deleteNotice/${id}`,{
        withCredentials: true,});
      setNotices(notices.filter((notice) => notice._id !== id));
      
    } catch (error) {
      console.error("Error deleting notice", error);
    }
  };

  return (
    <div className="max-w-3xl relative mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Announcements & Notices</h2>
      
      {/* Notice Form */}
     {
        role === "admin" && (
            <div className="bg-white shadow-lg rounded-xl p-4 mb-6">
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
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Notice
            </button>
          </div>
          
        )
     }
      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice._id} className="bg-white shadow-md border rounded-lg p-4">
            <h3 className="text-lg font-semibold">{notice.topic}</h3>
            <p className="text-gray-700 mt-1">{notice.description}</p>
           
            <span className="text-sm text-gray-500 block mt-2">Announced on: {format(new Date(notice.timestamp), "PPP p")}</span>
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
<PreviousDataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={previousData}
      />
      </div>
    </div>
  );
}
