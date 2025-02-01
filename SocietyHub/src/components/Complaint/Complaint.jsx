import React, { useState, useEffect } from 'react';
import { Search, Plus, Clock, X } from 'lucide-react';
import axios from 'axios';





function Complaint() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/complain/getAllComplains", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const data = response.data.data
        console.log('Fetched Complaints:', data);
        setComplaints(data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setErrorMessage('Failed to fetch complaints');
      }
    };
    fetchComplaints();
  }, []);

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

      console.log('New Complaint Added:', response.data);
      setComplaints((prevComplaints) => [...prevComplaints, response.data.data]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding complaint:', error);
      setErrorMessage('Failed to add complaint');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Complaints Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Complaint
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <p className="text-sm text-red-500">ID: #{complaint._id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  complaint.isResolved 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {complaint.isResolved ? 'Resolved' : 'Pending'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{complaint.description}</p>
              <hr className="border-t-2 border-gray-400 mb-4" />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {complaint.date}
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800">View Details</button>
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
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      required
                      rows="4"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="text"
                      name="date"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={new Date().toLocaleDateString()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">House ID/Identifier</label>
                    <input
                      type="text"
                      name="byHouse"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

export default Complaint;


