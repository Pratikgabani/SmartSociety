import React,{useState} from 'react'
import {Link,useNavigate} from "react-router-dom"

function SideBar() {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const navigate = useNavigate()
     const clickEvent = (item)=>{
        setActiveTab(item)
        navigate(`/layout/${item}`)
     }
    const menuItems = ["Dashboard", "Booking", "Event", "Payment", "Visitor", "Poll", "Complaint", "Profile", "Settings"];
  return (
    
      <div className="h-screen  w-64 bg-gray-800 text-white p-4">
                <h2 className="text-3xl font-bold mb-4">Resident Management</h2>
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item}
                            onClick={() => clickEvent(item)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${activeTab === item
                                ? "bg-gray-600 text-yellow-300" // Active tab color
                                : "hover:bg-gray-700"
                                }`}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
    
  )
}

export default SideBar
