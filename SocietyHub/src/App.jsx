import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Payment from "./components/Payment/Payment.jsx"
import Polls from "./components/polls/polls.jsx"
import Visitor from "./components/Visitor/Visitor.jsx";
import Notice from "./components/Notice/Notice.jsx"
import Event from "./components/Event/Event.jsx";
import Booking from "./components/Booking/Booking.jsx";
import Complaint from "./components/Complaint/Complaint.jsx";

export default function App() {
    return (
        <Router>
            <div className="flex">
                {/* Sidebar - Fixed */}
                <div className="w-64 h-screen fixed bg-gray-800 text-white p-4">
                    <h2 className="text-xl font-bold mb-4">My Sidebar</h2>
                    <ul>
                        <li>
                            <NavLink 
                                to="/" 
                                className={({ isActive }) => 
                                    `block p-3 rounded-lg cursor-pointer transition-colors ${
                                        isActive ? "bg-gray-600 text-yellow-300" : "hover:bg-gray-700"
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/profile" 
                                className={({ isActive }) => 
                                    `block p-3 rounded-lg cursor-pointer transition-colors ${
                                        isActive ? "bg-gray-600 text-yellow-300" : "hover:bg-gray-700"
                                    }`
                                }
                            >
                                Profile
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/settings" 
                                className={({ isActive }) => 
                                    `block p-3 rounded-lg cursor-pointer transition-colors ${
                                        isActive ? "bg-gray-600 text-yellow-300" : "hover:bg-gray-700"
                                    }`
                                }
                            >
                                Settings
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* Main Content - Page Section */}
                <div className="ml-64 p-6 w-full">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
