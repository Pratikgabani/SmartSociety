// import React, { useState, useEffect } from "react";
// import { Search, Plus, Clock, X } from "lucide-react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// // import PreviousDataModal from '../history/PreviousDataModal ';
 
// function Complaint() {
//   const navigate = useNavigate();
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [complaints, setComplaints] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [vari, setVari] = useState(false);
//   const [file, setFile] = useState(null);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user?.token;
//   const roled = user?.data?.user?.role;
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [previousData, setPreviousData] = useState([]);
//       const handleHistoryClick = async () => {
//      await fetchPreviousData(); // Ensure it returns data
//     navigate("/history", { state: { data: previousData } });
//   };
//   const fetchPreviousData = async () => {
    
//     try {
      
//         const response = await axios.get("http://localhost:8000/api/v1/complain/getComplains", { withCredentials: true });
//       // Update API URL) // Update API URL
//       setPreviousData(response.data.data);
//       console.log(response.data.data);
//       setIsModalOpen(true); // Open modal after fetching
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8000/api/v1/complain/getAllComplains",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             withCredentials: true,
//           }
//         );
//         setComplaints(response.data.data);
//         console.log("usetate" +complaints.map((complaint) => ( console.log( 'map' + complaint._id) )) );
//         if(response.data.data.length === 0){
//           toast.error("No complaints found!");
//         }
//       } catch (error) {
//         console.error("Error fetching complaints:", error);
//         setErrorMessage("Failed to fetch complaints");
       
//       }
//     };
//     fetchComplaints();
//   }, [vari]);
   
//   const handleDelete = async (complaintId) => {
//     try {
//       console.log("handledelete" + complaintId);
//       await axios.delete(`http://localhost:8000/api/v1/complain/deleteComplain/${complaintId}`, { withCredentials: true });
//       setVari(!vari);
//       toast.success("Complaint deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting complaint:", error);
//       setErrorMessage("Failed to delete complaint");
//     } 
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("subject", e.target.subject.value);
//     formData.append("description", e.target.description.value);
//     formData.append("date", new Date().toLocaleDateString());
//     formData.append("isResolved", false);
//     if (file) formData.append("proof", file);

//     try {
//       await axios.post("http://localhost:8000/api/v1/complain/createComplain", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });
//       setVari(!vari);
//       setIsFormOpen(false);
//       setFile(null);
//       toast.success("Complaint added successfully!");
//     } catch (error) {
//       console.error("Error adding complaint:", error.response?.data || error.message);
//       toast.error("Failed to add complaint");
//     }
//   };

//   const handleResolve = async (complaintId) => {
//     if (roled !== "admin") {
//       alert("You are not authorized to resolve this complaint");
//       return;
//     }
//     try {
//       await axios.patch(
//         `http://localhost:8000/api/v1/complain/toggleComplain/${complaintId}`, { isResolved: true } ,
//         { withCredentials: true }
//       );
//       setVari(!vari);
//       toast.success("Complaint resolved successfully!");
//     } catch (error) {
//       console.error("Error resolving complaint:", error);
//       setErrorMessage("Failed to resolve complaint");
//     }
//   };

//   return (
//     <div className="min-h-screen relative px-4 py-8 w-full text-gray-900 bg-gray-50 ">
//       <Toaster />
//       <h1 className="text-3xl font-bold text-gray-800 mb-2">
//         Complaints Management
//       </h1>
//       <p className="text-gray-600 text-lg">Easily submit, track, and resolve resident complaints for a hassle-free living experience.</p>

//       <main className="max-w-5xl">
//         <div className="flex justify-between items-center m-6">
          
//             <button onClick={() => setIsFormOpen(true)} className="bg-blue-600 font-semibold text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition duration-200">
//               Add Complaint
//             </button>
//         </div>

//         <div className="space-y-4 relative">
//           {complaints.map((complaint) => (
//             <div key={complaint._id} className="bg-white p-6 rounded-xl shadow-md">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold">{complaint.subject}</h3>
//                 <span className={`px-3 py-1 text-sm rounded-full ${complaint.isResolved ? "bg-green-200 text-green-800" : "bg-orange-200 text-orange-800"}`}>
//                   {complaint.isResolved ? "Resolved" : "Pending"}
//                 </span>
//               </div>
//               <p className="text-gray-700 mt-2">{complaint.description}</p>
//               {complaint.proof && (
//                 <a href={complaint.proof} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline block mt-2">
//                   View Proof
//                 </a>
//               )}
//               <div className="flex justify-between items-center text-sm text-gray-600 mt-4 relative">
//                 <div className="flex items-center gap-2">
//                   <Clock size={16} /> {new Date(complaint.date).toLocaleDateString("en-GB")}
//                 </div>
                
//                   {
//                     roled === "admin" && (
//                       <div className="flex gap-2 absolute bottom-0 right-20">
//                       <button onClick={() => handleResolve(complaint._id)} className={`px-4 py-2 rounded-lg text-white transition duration-200 ${complaint.isResolved ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"}`}>
//                         {complaint.isResolved ? "Mark as Unresolved" : "Mark as Resolved"}
//                       </button>
//                     </div>
//                     )
//                   }
//                   <button  onClick={() => handleDelete(complaint._id)} className=" absolute bottom-0 right-0 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition duration-200">Delete</button>
                
//               </div>
//             </div>
//           ))}
          
//         </div>

//         {isFormOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold">New Complaint</h2>
//                 <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">
//                   <X size={24} />
//                 </button>
//               </div>
//               <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
//                 <input type="text" name="subject" placeholder="Subject" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"/>
//                 <textarea name="description" placeholder="Description" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"></textarea>
//                 <input type="file" name="proof" accept="image/*,video/*" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" onChange={(e) => setFile(e.target.files[0])}/>
//                 <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200">
//                   Submit
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </main>
//       {/* <div><button onClick={fetchPreviousData} className='absolute top-8 right-5 rounded-lg px-3 py-2 bg-blue-400'>History</button>
// <PreviousDataModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         data={previousData}
//       />
//       </div> */}
//       <div>
//         <button
//         onClick={handleHistoryClick}
//         className="absolute top-8 right-5 rounded-lg px-3 py-2 bg-blue-400"
//       >
//         History
//       </button>
//       </div>
//     </div>
//   );
// }

// export default Complaint;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

function Complaint() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [previousData, setPreviousData] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  const role = user?.data?.user?.role;

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/complain/getAllComplains",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setComplaints(response.data.data);
        if (response.data.data.length === 0) {
          toast.error("No complaints found!");
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
        toast.error("Failed to fetch complaints");
      }
    };

    fetchComplaints();
  }, [refresh]);

  const handleHistoryClick = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/complain/getComplains", {
        withCredentials: true,
      });
      setPreviousData(response.data.data);
      navigate("/history", { state: { data: response.data.data } });
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to fetch history");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("date", new Date().toLocaleDateString());
    formData.append("isResolved", false);
    if (file) formData.append("proof", file);

    try {
      await axios.post(
        "http://localhost:8000/api/v1/complain/createComplain",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
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
    }
  };

  const handleDelete = async (complaintId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/complain/deleteComplain/${complaintId}`,
        { withCredentials: true }
      );
      toast.success("Complaint deleted successfully!");
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error deleting complaint:", error);
      toast.error("Failed to delete complaint");
    }
  };

  const handleResolve = async (complaintId) => {
    if (role !== "admin") {
      alert("You are not authorized to resolve this complaint");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:8000/api/v1/complain/toggleComplain/${complaintId}`,
        { isResolved: true },
        { withCredentials: true }
      );
      toast.success("Complaint marked as resolved!");
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error resolving complaint:", error);
      toast.error("Failed to resolve complaint");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 w-full bg-gray-50 text-gray-900">
      <Toaster />
      <h1 className="text-3xl font-bold mb-2">Complaints Management</h1>
      <p className="text-gray-600 mb-6 text-lg">
        Easily submit, track, and resolve resident complaints for a hassle-free living experience.
      </p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Add Complaint
        </button>
        {/* <button
          onClick={handleHistoryClick}
          className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-900"
        >
          View My Complaints
        </button> */}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 space-y-4">
          <div>
            <label className="block font-semibold mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Upload Proof (optional)</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Submit
            </button>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {complaints.map((complaint) => (
          <div key={complaint._id} className="bg-white p-6 rounded shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{complaint.subject}</h3>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  complaint.isResolved
                    ? "bg-green-200 text-green-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {complaint.isResolved ? "Resolved" : "Pending"}
              </span>
            </div>
            <p className="text-gray-700 mt-2">{complaint.description}</p>

            {complaint.proof && (
              <a
                href={complaint.proof}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline block mt-2"
              >
                View Proof
              </a>
            )}

            <div className="flex gap-4 mt-4">
              {!complaint.isResolved && role === "admin" && (
                <button
                  onClick={() => handleResolve(complaint._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Mark Resolved
                </button>
              )}
              <button
                onClick={() => handleDelete(complaint._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button
          onClick={handleHistoryClick}
          className="absolute top-8 right-5 rounded-lg px-3 py-2 bg-blue-400"
        >
          History
        </button>
      </div>
    </div>
  );
}

export default Complaint;
