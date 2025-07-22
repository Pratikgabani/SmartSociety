import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../context/UserContext";
import axios from "axios";
function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    "Dashboard",
    "Booking",
    "Event",
    "Payment",
    "Visitor",
    "Poll",
    "Complaint",
    "Notice",
  ];
  const {rolee , setRolee} = useContext(UserContext);
  // Extract tab from URL
  const getTabFromPath = () => {
    const pathParts = location.pathname.split("/");
    const tabFromURL = pathParts[pathParts.length - 1]; // Last part of the URL
    return menuItems.includes(tabFromURL) ? tabFromURL : "Page not found"; // Default to Dashboard if invalid
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]); // Update activeTab whenever the URL changes

  // const clickEvent = (item) => {
  //   setActiveTab(item);
  //   if(item === "logout"){
  //     // localStorage.removeItem("user");
  //     setRolee("");
  //     navigate("/");
  //   }
  //   else{
  //     navigate(`/layout/${item}`);
  //   }

   
  // };
const clickEvent = async (item) => {
    setActiveTab(item);

    if (item === "logout") {
        try {
            await axios.post("https://resihub.onrender.com/api/v1/users/logout", {}, { withCredentials: true });
            setRolee("");
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    } else {
        navigate(`/layout/${item}`);
    }
};

  // const secure = localStorage.getItem("user");
  // const role = secure ? JSON.parse(secure).data.user.role : null;
  

  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-4">
      <h2 className="text-3xl font-bold my-4">ResiHub</h2>
      <ul className="space-y-2">
        { rolee !== "security" && menuItems.map((item) => (
          <li
            key={item}
            onClick={() => clickEvent(item)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              activeTab === item
                ? "bg-gray-600 text-yellow-300" // Active tab color
                : "hover:bg-gray-700"
            }`}
          >
            {item}
          </li>
        ))}
        {
          rolee === "security" && 
          <div 
          key={"Visitor"} onClick={() => clickEvent("Visitor")} className={`p-3 rounded-lg cursor-pointer transition-colors ${activeTab === "Visitor" ? "bg-gray-600 text-yellow-300" : "hover:bg-gray-700"}`}>
            Visitors
          </div>
          
        }
        <div key={"logout"} onClick={() => clickEvent("logout")} className={`p-3 rounded-lg cursor-pointer transition-colors ${activeTab === "logout" ? "bg-gray-600 text-yellow-300" : "hover:bg-gray-700"}`}>Logout</div>
      </ul>
    </div>
  );
}

export default SideBar;
