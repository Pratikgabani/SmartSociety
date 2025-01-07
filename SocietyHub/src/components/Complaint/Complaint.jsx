import React from 'react'
import { useState } from 'react';
import { Search, Plus, Clock, X, AlertCircle, CheckCircle2 } from 'lucide-react';


function Complaint() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [complaints, setComplaints] = useState([
    {
      id: '1',
      title: 'Water Leakage',
      description: 'Continuous water leakage in bathroom ceiling',
      status: 'pending',
      priority: 'high',
      date: new Date().toLocaleDateString(),
      images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format']
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newComplaint = {
      id: (complaints.length + 1).toString(),
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      status: 'pending',
      date: new Date().toLocaleDateString()
    };
    setComplaints([...complaints, newComplaint]);
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Complaints Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Actions Bar */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

        {/* Complaints List */}
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{complaint.title}</h3>
                  <p className="text-sm text-gray-500">ID: #{complaint.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  complaint.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {complaint.status === 'pending' ? 'Pending' : 'Resolved'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{complaint.description}</p>
              {complaint.images && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    {complaint.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image}
                        alt={`Complaint ${complaint.id} image ${index + 1}`}
                        className="rounded-lg w-full h-48 object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {complaint.date}
                </div>
                <div className="flex gap-2">
                  {/* <span className={`flex items-center px-2 py-1 rounded ${
                    complaint.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}> */}
                    {/* <AlertCircle className="w-4 h-4 mr-1" />
                    {complaint.priority} */}
                  {/* </span> */}
                  <button className="text-blue-600 hover:text-blue-800">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Complaint Form Modal */}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
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


   
  


export default Complaint
