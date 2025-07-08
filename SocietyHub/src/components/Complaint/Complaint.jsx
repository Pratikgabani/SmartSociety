import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "../../axios";
import { HashLoader } from 'react-spinners'
function Complaint() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [previousData, setPreviousData] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
        setComplaints(response.data.data);
        // if (response.data.data.length === 0) {
        //   toast.error("No complaints found!");
        // }
      } catch (error) {
        console.error("Error fetching complaints:", error);
        // toast.error("Failed to fetch complaints");
      }
    };

    fetchComplaints();
  }, [refresh]);

  const handleHistoryClick = async () => {
    try {
      // admin nu logic and user logic separate krna hai
      const response = await axios.get("http://localhost:8000/api/v1/complain/getComplains", {
        withCredentials: true,
      });
      setPreviousData(response.data.data);
      navigate("/history", { state: { data: response.data.data } });
    } catch (error) {
      console.error("Error fetching history:", error);
      // toast.error("Failed to fetch history");
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <HashLoader size={60} color="#2563eb" loading={loading} />
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container relative mx-auto px-4 py-8 bg-gray-100">
      <Toaster />
      <h1 className="text-3xl font-bold mb-2">Complaints </h1>
      <p className="text-gray-600 mb-6 text-lg">
        Easily submit, track, and resolve resident complaints for a hassle-free living experience.
      </p>

      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold mt-4">Active Complaints</div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow hover:bg-blue-700"
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
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-4 border border-gray-100">
            <h3 className="text-lg font-medium mb-2">Add a Complaint</h3>
            <form onSubmit={handleSubmit} className="bg-white  space-y-4">
              <div>
                <label className="block font-semibold mb-1">Subject</label>
                <input
                  placeholder="Enter subject"
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
                  placeholder="Enter description"
                  type="text"
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
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
  {complaints.map((complaint) => (
    <div
      key={complaint._id}
      className="bg-white p-6 rounded-md shadow-md h-full flex flex-col justify-between"
    >
      <div>
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

        <p className="text-gray-700 mt-2">
          {complaint.description.length > 100
            ? complaint.description.slice(0, 100) + "..."
            : complaint.description}
        </p>

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
      </div>

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
