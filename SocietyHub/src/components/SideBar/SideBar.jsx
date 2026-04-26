import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../context/UserContext";
import axios from "axios";
import {
  LayoutDashboard,
  MapPin,
  CalendarDays,
  Wallet,
  UserCheck,
  BarChart2,
  TriangleAlert,
  Bell,
  LogOut,
  ReceiptText,
  Building2,
  Menu,
  X,
  UserCircle,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard",  icon: LayoutDashboard,        roles: ["admin", "resident"] },
  { name: "Booking",    icon: MapPin,                  roles: ["admin", "resident"] },
  { name: "Event",      icon: CalendarDays,            roles: ["admin", "resident"] },
  { name: "Payment",    icon: Wallet,                  roles: ["admin", "resident"] },
  { name: "Visitor",    icon: UserCheck,               roles: ["admin", "resident", "security"] },
  { name: "Poll",       icon: BarChart2,               roles: ["admin", "resident"] },
  { name: "Complaint",  icon: TriangleAlert,           roles: ["admin", "resident"] },
  { name: "Notice",     icon: Bell,                    roles: ["admin", "resident"] },
  { name: "Refunds",    icon: ReceiptText,             roles: ["admin"] },
  { name: "Profile",    icon: UserCircle,              roles: ["admin", "resident", "security"] },
];

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { rolee, setRolee } = useContext(UserContext);

  const menuItems = NAV_ITEMS.map((i) => i.name);

  const getTabFromPath = () => {
    const pathParts = location.pathname.split("/");
    const tabFromURL = pathParts[pathParts.length - 1];
    return menuItems.includes(tabFromURL) ? tabFromURL : "Dashboard";
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const clickEvent = async (item) => {
    setActiveTab(item);
    setIsMobileOpen(false);
    if (item === "logout") {
      try {
        await axios.post(
          `${import.meta.env.VITE_URL_BACKEND}/api/v1/users/logout`,
          {},
          { withCredentials: true }
        );
        setRolee("");
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    } else {
      navigate(`/layout/${item}`);
    }
  };

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (rolee === "security") return item.roles.includes("security");
    if (rolee === "admin") return item.roles.includes("admin");
    return item.roles.includes("resident");
  });

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-[18px] left-[18px] z-40 p-2 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
      >
        <Menu size={22} strokeWidth={2.5} />
      </button>

      {/* Mobile Backdrop overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Core */}
      <div className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.04)] overflow-hidden group font-sans ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 w-[240px] md:w-[76px] md:hover:w-[240px]`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between px-4 pt-7 pb-6 border-b border-gray-100 shrink-0 whitespace-nowrap">
          <div className="flex items-center gap-3.5">
            <div className="shrink-0 w-[42px] h-[42px] bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/30">
              <Building2 size={24} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-[-0.3px] transition-all duration-300 delay-75 md:opacity-0 md:-translate-x-3 md:group-hover:opacity-100 md:group-hover:translate-x-0 opacity-100 translate-x-0">
              ResiHub
            </span>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Nav items */}
        <nav 
          className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 flex flex-col gap-1.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <div
                key={item.name}
                onClick={() => clickEvent(item.name)}
                title={item.name}
                className={`relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 whitespace-nowrap overflow-hidden border flex-shrink-0 ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 border-blue-100/60 shadow-sm" 
                    : "bg-transparent text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="shrink-0 flex items-center justify-center w-[26px] h-[26px]">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </span>
                <span className="text-sm font-semibold transition-all duration-300 delay-75 md:opacity-0 md:-translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 opacity-100 translate-x-0">
                  {item.name}
                </span>
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-blue-600 rounded-l-full" />
                )}
              </div>
            );
          })}
        </nav>

        <div className="h-px bg-gray-100 shrink-0 mx-4 my-2" />

        {/* Logout */}
        <div className="px-3 pb-6 pt-2 shrink-0">
          <div
            onClick={() => clickEvent("logout")}
            title="Logout"
            className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 whitespace-nowrap overflow-hidden text-gray-500 hover:bg-red-50 hover:text-red-600 border border-transparent"
          >
            <span className="shrink-0 flex items-center justify-center w-[26px] h-[26px]">
              <LogOut size={22} strokeWidth={2} />
            </span>
            <span className="text-sm font-semibold transition-all duration-300 delay-75 md:opacity-0 md:-translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 opacity-100 translate-x-0">
              Logout
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
