import React,{useState} from 'react'
import VisitorActive from './VisitorActive'
import VisitorRecent from './VisitorRecent'
function Visitor() {

   
  
  
  const [activeVisitors, setActiveVisitors] = useState([
    {
      id: 1,
      username: "Rahul Kumar",
      phoneNo: "+91 98765 43210",
      purpose: "House Help",
      checkIn: {
        time: "10:30 AM",
        date: "Today"
      },
      Active: true
    },
    {
      id: 2,
      username: "Anita Desai",
      phoneNo: "+91 87654 32109",
      purpose: "Meeting",
      checkIn: {
        time: "11:45 AM",
        date: "Today"
      },
      Active: true
    },
    {
      id: 3,
      username: "Vikram Singh",
      phoneNo: "+91 76543 21098",
      purpose: "Delivery",
      checkIn: {
        time: "09:15 AM",
        date: "Today"
      },
      Active: true
    }
  ])
  
  
  const [recentVisitors, setRecentVisitors] = useState( [
    {
      id: 4,
      name: "Priya Singh",
      phone: "+91 98765 43211",
      purpose: "Delivery",
      visitDate: {
        date: "Yesterday",
        time: "2:30 PM"
      },
      duration: "15 mins"
    },
    {
      id: 5,
      name: "Amit Patel",
      phone: "+91 87654 32110",
      purpose: "Maintenance",
      visitDate: {
        date: "2 days ago",
        time: "10:00 AM"
      },
      duration: "45 mins"
    },
    {
      id: 6,
      name: "Sneha Gupta",
      phone: "+91 76543 21099",
      purpose: "Interview",
      visitDate: {
        date: "3 days ago",
        time: "3:00 PM"
      },
      duration: "60 mins"
    }
  ]);
const handleCheckOut = (id) => {
  setActiveVisitors(activeVisitors.filter((user) => user.id !== id));
  setRecentVisitors(recentVisitors.concat(activeVisitors.find((user) => user.id === id)));
  
};
  

  return (
    <div className="p-6 min-h-screen bg-gray-100">
    {/* Header Section */}
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
      <p className="text-gray-600">Manage and track your visitors</p>
    </div>

    {/* Search and Add Section */}
    <div className="flex gap-4 mb-8">
      <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        + Add New Visitor
      </button>
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search visitors..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    {/* Active Visitors Section */}
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Visitors</h2>
   
   {activeVisitors.map((visitor) => (
        <VisitorActive
          key={visitor.id}
          username={visitor.username}
          phoneNo={visitor.phoneNo}
          purpose={visitor.purpose}
          checkIn={visitor.checkIn.time}
          checkDay={visitor.checkIn.date}
          Active={visitor.Active}
          onCheckOut={() => handleCheckOut(visitor.id)}
        />
      ))}
    {/* Recent Visitors Section */}
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Visitors</h2>
    
    {recentVisitors.map((visitor) => (
      
        <VisitorRecent
          key={visitor.id}
         name={visitor.name}
          phone={visitor.phone}
          purpose={visitor.purpose}
          checkIn={visitor.visitDate.time}
          checkDay={visitor.visitDate.date}
          duration={visitor.duration}
        />
    ))}
  </div>
  )
}

export default Visitor


