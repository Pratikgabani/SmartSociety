import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

  const clickEvent = (item) => {
    setActiveTab(item);
    if(item === "logout"){
      localStorage.removeItem("user");
      navigate("/");
    }
    else{
      navigate(`/layout/${item}`);
    }

   
  };

  const secure = localStorage.getItem("user");
  const role = secure ? JSON.parse(secure).data.user.role : null;
  

  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-4">
      <h2 className="text-3xl font-bold mb-4">Resident Management</h2>
      <ul>
        { role !== "security" && menuItems.map((item) => (
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
          role === "security" && 
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
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Menu, X } from "lucide-react"; // For hamburger & close icons

// function SideBar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false); // Sidebar open/close state

//   const menuItems = [
//     "Dashboard",
//     "Booking",
//     "Event",
//     "Payment",
//     "Visitor",
//     "Poll",
//     "Complaint",
//     "Notice",
//   ];

//   const getTabFromPath = () => {
//     const pathParts = location.pathname.split("/");
//     const tabFromURL = pathParts[pathParts.length - 1];
//     return menuItems.includes(tabFromURL) ? tabFromURL : "Page not found";
//   };

//   const [activeTab, setActiveTab] = useState(getTabFromPath());

//   useEffect(() => {
//     setActiveTab(getTabFromPath());
//   }, [location.pathname]);

//   const clickEvent = (item) => {
//     setActiveTab(item);
//     if (item === "logout") {
//       localStorage.removeItem("user");
//       navigate("/");
//     } else {
//       navigate(`/layout/${item}`);
//     }
//     setIsOpen(false); // Close sidebar after selection (useful for mobile)
//   };

//   const secure = localStorage.getItem("user");
//   const role = secure ? JSON.parse(secure).data.user.role : null;

//   return (
//     <>
//       {/* Hamburger Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md md:hidden"
//       >
//         {isOpen ? <X size={24} /> : <Menu size={24} />}
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed h-screen bg-gray-800 text-white p-4 transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0 md:w-64 md:relative`}
//       >
//         <h2 className="text-3xl font-bold mb-4">Resident Management</h2>
//         <ul>
//           {role !== "security" &&
//             menuItems.map((item) => (
//               <li
//                 key={item}
//                 onClick={() => clickEvent(item)}
//                 className={`p-3 rounded-lg cursor-pointer transition-colors ${
//                   activeTab === item
//                     ? "bg-gray-600 text-yellow-300"
//                     : "hover:bg-gray-700"
//                 }`}
//               >
//                 {item}
//               </li>
//             ))}
//           {role === "security" && (
//             <div
//               key="Visitor"
//               onClick={() => clickEvent("Visitor")}
//               className={`p-3 rounded-lg cursor-pointer transition-colors ${
//                 activeTab === "Visitor"
//                   ? "bg-gray-600 text-yellow-300"
//                   : "hover:bg-gray-700"
//               }`}
//             >
//               Visitors
//             </div>
//           )}
//           <div
//             key="logout"
//             onClick={() => clickEvent("logout")}
//             className="p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-700"
//           >
//             Logout
//           </div>
//         </ul>
//       </div>

//       {/* Overlay for Mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 md:hidden"
//           onClick={() => setIsOpen(false)}
//         ></div>
//       )}
//     </>
//   );
// }

// export default SideBar;
