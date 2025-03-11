import React, { useState, useEffect } from "react";
import { Search, Plus, Clock, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import PreviousDataModal from '../history/PreviousDataModal ';

function Complaint() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [vari, setVari] = useState(false);
  const [file, setFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  const roled = user?.data?.user?.role;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousData, setPreviousData] = useState([]);

  const fetchPreviousData = async () => {
    
    try {
      
        const response = await axios.get("http://localhost:8000/api/v1/complain/getComplains", { withCredentials: true });
      // Update API URL) // Update API URL
      setPreviousData(response.data.data);
      console.log(response.data.data);
      setIsModalOpen(true); // Open modal after fetching
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
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
        console.log("usetate" +complaints.map((complaint) => ( console.log( 'map' + complaint._id) )) );
        if(response.data.data.length === 0){
          toast.error("No complaints found!");
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setErrorMessage("Failed to fetch complaints");
       
      }
    };
    fetchComplaints();
  }, [vari]);
   
  const handleDelete = async (complaintId) => {
    try {
      console.log("handledelete" + complaintId);
      await axios.delete(`http://localhost:8000/api/v1/complain/deleteComplain/${complaintId}`, { withCredentials: true });
      setVari(!vari);
      toast.success("Complaint deleted successfully!");
    } catch (error) {
      console.error("Error deleting complaint:", error);
      setErrorMessage("Failed to delete complaint");
    } 
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("subject", e.target.subject.value);
    formData.append("description", e.target.description.value);
    formData.append("date", new Date().toLocaleDateString());
    formData.append("isResolved", false);
    if (file) formData.append("proof", file);

    try {
      await axios.post("http://localhost:8000/api/v1/complain/createComplain", formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setVari(!vari);
      setIsFormOpen(false);
      setFile(null);
      toast.success("Complaint added successfully!");
    } catch (error) {
      console.error("Error adding complaint:", error.response?.data || error.message);
      toast.error("Failed to add complaint");
    }
  };

  const handleResolve = async (complaintId) => {
    if (roled !== "admin") {
      alert("You are not authorized to resolve this complaint");
      return;
    }
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/complain/toggleComplain/${complaintId}`, { isResolved: true } ,
        { withCredentials: true }
      );
      setVari(!vari);
      toast.success("Complaint resolved successfully!");
    } catch (error) {
      console.error("Error resolving complaint:", error);
      setErrorMessage("Failed to resolve complaint");
    }
  };

  return (
    <div className="min-h-screen relative w-full bg-gray-100 text-gray-900">
      <Toaster />
      <header className="bg-blue-800 shadow-md p-6 text-white text-center text-3xl font-bold">
        Complaints Management
      </header>

      <main className="max-w-5xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          
            <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-teal-600 transition duration-200">
              <Plus size={18} /> Add Complaint
            </button>
          
          
        </div>

        <div className="space-y-4 relative">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{complaint.subject}</h3>
                <span className={`px-3 py-1 text-sm rounded-full ${complaint.isResolved ? "bg-green-200 text-green-800" : "bg-orange-200 text-orange-800"}`}>
                  {complaint.isResolved ? "Resolved" : "Pending"}
                </span>
              </div>
              <p className="text-gray-700 mt-2">{complaint.description}</p>
              {complaint.proof && (
                <a href={complaint.proof} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block mt-2">
                  View Proof
                </a>
              )}
              <div className="flex justify-between items-center text-sm text-gray-600 mt-4 relative">
                <div className="flex items-center gap-2">
                  <Clock size={16} /> {new Date(complaint.date).toLocaleDateString()}
                </div>
                
                  {
                    roled === "admin" && (
                      <div className="flex gap-2 absolute bottom-0 right-20">
                      <button onClick={() => handleResolve(complaint._id)} className={`px-4 py-2 rounded-lg text-white transition duration-200 ${complaint.isResolved ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"}`}>
                        {complaint.isResolved ? "Mark as Unresolved" : "Mark as Resolved"}
                      </button>
                    </div>
                    )
                  }
                  <button  onClick={() => handleDelete(complaint._id)} className=" absolute bottom-0 right-0 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition duration-200">delete</button>
                
              </div>
            </div>
          ))}
          
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">New Complaint</h2>
                <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                <input type="text" name="subject" placeholder="Subject" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"/>
                <textarea name="description" placeholder="Description" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"></textarea>
                <input type="file" name="proof" accept="image/*,video/*" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" onChange={(e) => setFile(e.target.files[0])}/>
                <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition duration-200">
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
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

export default Complaint;

// import React, { useState, useEffect } from "react";
// import { Search, Plus, Clock, X } from "lucide-react";
// import axios from "axios";

// function Complaint() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [complaints, setComplaints] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [vari, setVari] = useState(false);
//   const [file, setFile] = useState(null); // State for file upload

//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user?.token;
//   const roled = user?.data?.user?.role;

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
//       } catch (error) {
//         console.error("Error fetching complaints:", error);
//         setErrorMessage("Failed to fetch complaints");
//       }
//     };
//     fetchComplaints();
//   }, [vari]);
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const formData = new FormData();
//   formData.append("subject", e.target.subject.value);
//   formData.append("description", e.target.description.value);
//   formData.append("date", new Date().toLocaleDateString());
//   formData.append("isResolved", false);

//   if (file) {
//     formData.append("proof", file);
//   }

//   // 🔍 Debugging: Check FormData contents
//   for (let pair of formData.entries()) {
//     console.log(`${pair[0]}:`, pair[1]);
//   }

//   try {
//     await axios.post(
//       "http://localhost:8000/api/v1/complain/createComplain",
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       }
//     );
//  setVari(!vari)
//     setIsFormOpen(false);
//     setFile(null);
//   } catch (error) {
//     console.error("Error adding complaint:", error.response?.data || error.message);
//   }
// };


 
  
//   const handleResolve = async (complaintId) => {
//     if (roled !== "admin") {
//       alert("You are not authorized to resolve this complaint");
//       return;
//     }
//     try {
//       await axios.delete(
//         `http://localhost:8000/api/v1/complain/deleteComplain/${complaintId}`,
//         { withCredentials: true }
//       );

//       setVari(!vari);
//       setComplaints((prevComplaints) =>
//         prevComplaints.map((complaint) =>
//           complaint._id === complaintId ? { ...complaint, isResolved: true } : complaint
//         )
//       );
//     } catch (error) {
//       console.error("Error resolving complaint:", error);
//       setErrorMessage("Failed to resolve complaint");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-indigo-600 shadow">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <h1 className="text-3xl font-bold text-white">Complaints Management</h1>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-6">
//         <div className="flex gap-4 mb-6">
//           {roled === "admin" && (
//             <button
//               onClick={() => setIsFormOpen(true)}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//             >
//               Add Complaint
//             </button>
//           )}
//           <div className="flex-1 relative">
//             <input
//               type="text"
//               placeholder="Search complaints..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-green-500"
//             />
//             <Search className="absolute right-3 top-2.5 text-gray-400" />
//           </div>
//         </div>

//         <div className="space-y-4">
//           {complaints.map((complaint) => (
//             <div key={complaint._id} className="bg-white rounded-lg shadow p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-lg font-semibold">{complaint.subject}</h3>
//                   {/* <p className="text-sm text-gray-500">ID: #{complaint._id}</p> */}
//                 </div>
//                 <span
//                   className={`px-3 py-1 rounded-full text-sm ${
//                     complaint.isResolved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
//                   }`}
//                 >
//                   {complaint.isResolved ? "Resolved" : "Pending"}
//                 </span>
//               </div>
//               <p className="text-gray-700 mb-4">{complaint.description}</p>
//               {complaint.proof && (
//                 <div className="mb-4">
//                   <p className="text-sm font-medium text-gray-700">Proof:</p>
//                   <a
//                     href={complaint.proof}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline"
//                   >
//                     View Proof
//                   </a>
//                 </div>
//               )}
//               <hr className="border-t-2 border-gray-400 mb-4" />
//               <div className="flex justify-between items-center text-sm text-gray-500">
//                 <div className="flex items-center">
//                   <Clock className="w-4 h-4 mr-2" />
//                   {complaint.date}
//                 </div>
//                 {roled === "admin" && (
//                   <button
//                     onClick={() => handleResolve(complaint._id)}
//                     className="text-indigo-600 hover:text-indigo-800"
//                   >
//                     {complaint.isResolved ? "Mark as Unresolved" : "Mark as Resolved"}
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {isFormOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg max-w-md w-full p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold">New Complaint</h2>
//                 <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//               <form onSubmit={handleSubmit} encType="multipart/form-data">
//                 <div className="space-y-4">
//                   <input type="text" name="subject" placeholder="Subject" required className="w-full px-3 py-2 border rounded-lg"/>
//                   <textarea name="description" placeholder="Description" required className="w-full px-3 py-2 border rounded-lg"></textarea>
//                   <input type="file" name="proof" accept="image/*,video/*" className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFile(e.target.files[0])}/>
//                   <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
//                     Submit
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default Complaint;


      


