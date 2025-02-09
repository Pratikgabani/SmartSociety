import React, { useState, useEffect } from "react";
import { Search, Plus, Clock, X } from "lucide-react";
import axios from "axios";

function Complaint() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [vari, setVari] = useState(false);
  const [file, setFile] = useState(null); // State for file upload

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  const roled = user?.data?.user?.role;

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
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setErrorMessage("Failed to fetch complaints");
      }
    };
    fetchComplaints();
  }, [vari]);
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("subject", e.target.subject.value);
  formData.append("description", e.target.description.value);
  formData.append("date", new Date().toLocaleDateString());
  formData.append("isResolved", false);

  if (file) {
    formData.append("proof", file);
  }

  // 🔍 Debugging: Check FormData contents
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  try {
    await axios.post(
      "http://localhost:8000/api/v1/complain/createComplain",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
 setVari(!vari)
    setIsFormOpen(false);
    setFile(null);
  } catch (error) {
    console.error("Error adding complaint:", error.response?.data || error.message);
  }
};


 
  
  const handleResolve = async (complaintId) => {
    if (roled !== "admin") {
      alert("You are not authorized to resolve this complaint");
      return;
    }
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/complain/deleteComplain/${complaintId}`,
        { withCredentials: true }
      );

      setVari(!vari);
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === complaintId ? { ...complaint, isResolved: true } : complaint
        )
      );
    } catch (error) {
      console.error("Error resolving complaint:", error);
      setErrorMessage("Failed to resolve complaint");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Complaints Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          {roled === "admin" && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Complaint
            </button>
          )}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{complaint.subject}</h3>
                  <p className="text-sm text-gray-500">ID: #{complaint._id}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    complaint.isResolved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {complaint.isResolved ? "Resolved" : "Pending"}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{complaint.description}</p>
              {complaint.proof && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Proof:</p>
                  <a
                    href={complaint.proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Proof
                  </a>
                </div>
              )}
              <hr className="border-t-2 border-gray-400 mb-4" />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {complaint.date}
                </div>
                {roled === "admin" && (
                  <button
                    onClick={() => handleResolve(complaint._id)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {complaint.isResolved ? "Mark as Unresolved" : "Mark as Resolved"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">New Complaint</h2>
                <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="space-y-4">
                  <input type="text" name="subject" placeholder="Subject" required className="w-full px-3 py-2 border rounded-lg"/>
                  <textarea name="description" placeholder="Description" required className="w-full px-3 py-2 border rounded-lg"></textarea>
                  <input type="file" name="proof" accept="image/*,video/*" className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFile(e.target.files[0])}/>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Complaint;


      


{/* import React, { useState, useEffect } from 'react';
import { Search, Plus, Clock, X } from 'lucide-react';
import axios from 'axios';

function Complaint() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [vari, setVari] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  const roled = user.data.user.role


  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/complain/getAllComplains", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const data = response.data.data;
        console.log('Fetched Complaints:', data);
        setComplaints(data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setErrorMessage('Failed to fetch complaints');
      }
    };
    fetchComplaints();
  }, [vari]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newComplaint = {
      subject: formData.get('subject'),
      description: formData.get('description'),
      byHouse: formData.get('byHouse'),
      date: new Date().toLocaleDateString(),
      isResolved: false,
    };

    try {
      const response = await axios.post("http://localhost:8000/api/v1/complain/createComplain", newComplaint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setComplaints((prevComplaints) => [...prevComplaints, response.data.data]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding complaint:', error);
      setErrorMessage('Failed to add complaint');
    }
  };

  const handleResolve = async (complaintId) => {
    if(roled !== "admin"){  
      alert("You are not authorized to resolve this complaint")
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/complain/deleteComplain/${complaintId}`,  {
        
        withCredentials: true,
      });
   setVari(!vari)
      setComplaints(complaints.map(complaint =>
        complaint._id === complaintId ? { ...complaint, isResolved: response.data.data.isResolved } : complaint
      ));
    } catch (error) {
      console.error('Error resolving complaint:', error);
      setErrorMessage('Failed to resolve complaint');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Complaints Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
         {
           roled === "admin" && (
             <button
               onClick={() => setIsFormOpen(true)}
               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
             >
               Add Complaint
             </button>
           )
         }
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{complaint.subject}</h3>
                  <p className="text-sm text-gray-500">ID: #{complaint._id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  complaint.isResolved 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {complaint.isResolved ? 'Resolved' : 'Pending'}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{complaint.description}</p>
              <hr className="border-t-2 border-gray-400 mb-4" />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {complaint.date}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleResolve(complaint._id)} className="text-indigo-600 hover:text-indigo-800">
                    {complaint.isResolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">New Complaint</h2>
                <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Proof (Image/Video)</label>
  <input
    type="file"
    name="proof"
    accept="image/*, video/*"
    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
    onChange={(e) => setFile(e.target.files[0])} // Handle file selection
  />
</div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      required
                      rows="4"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">House ID/Identifier</label>
                    <input
                      type="text"
                      name="byHouse"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Complaint; */}
