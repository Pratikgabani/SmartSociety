import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SocietyDetails from './components/SocietyDetail/SocietyDetail.jsx';
import { createBrowserRouter,createRoutesFromElements } from "react-router-dom";
import { Route, RouterProvider, BrowserRouter } from "react-router-dom";
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Landing from './components/Landing/Landing.jsx';
import Payment from './components/Payment/Payment.jsx';
import Visitor from './components/Visitor/Visitor.jsx';
import Complaint from './components/Complaint/Complaint.jsx';
import { Toaster } from 'react-hot-toast';
import Booking from './components/Booking/Booking.jsx';
import PollApp from './components/polls/polls.jsx';
import Event from './components/Event/Event.jsx';
import SecurityRegister from './components/Security/Security.jsx';
import Announcements from './components/Notice/Notice.jsx';
import OrgLanding from './components/OrgLanding/OrgLanding.jsx';
import Dashboard from   './components/dashboard/dashboard.jsx';
import App from './App.jsx';
import Layout from "./Layout.jsx"
import RequireAuth from './RequireAuth.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element= {< OrgLanding/>} />
    <Route path="Login" element={<Login />} />
    <Route path="Register" element={<Register />} />
    <Route path = "SocietyDetails" element = {<SocietyDetails/>} />
    <Route element={<RequireAuth />}>
    <Route path="Layout" element={<Layout/>} >
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard/>} />
    <Route path='OrgLanding' element={<OrgLanding/>} />
    <Route path="Landing" element={<Landing />} />
    <Route path ="Securityregister" element={<SecurityRegister />} />
     <Route path="Payment" element={<Payment />} />
     <Route path="Visitor" element={<Visitor />} />
    <Route path = "Poll" element = {<PollApp />} />
    <Route path = "Complaint" element= {<Complaint />} />
    <Route path = "Booking" element = {<Booking/>} />
    <Route path = "Event" element = {<Event/>} />
    
    <Route path = "Notice" element = {<Announcements/>} />
    
    </Route>
    </Route>
    <Route path="*" element={<OrgLanding />} />
    </>
     )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router} />
  
   </StrictMode>
)



// import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
// import Dashboard from "./components/dashboard/dashboard.jsx";
// import Polls from "./components/polls/polls.jsx";
// import Payment from "./components/Payment/Payment.jsx"

// export default function App() {
//     return (
//         <Router>
//             <div className="flex">
//                 {/* Sidebar - Fixed */}
//                 <div className="w-64 h-screen fixed bg-gray-800 text-white p-4">
//                     <h2 className="text-xl font-bold mb-4">My Sidebar</h2>
//                     <ul>
//                         <li>
//                             <NavLink 
//                                 to="/" 
//                                 className={({ isActive }) => 
//                                     `block p-3 rounded-lg cursor-pointer transition-colors ${
//                                         isActive ? "bg-gray-600 text-yellow-300" : "hover:bg-gray-700"
//                                     }`
//                                 }
//                             >
//                                 Dashboard
//                             </NavLink>
//                         </li>
//                         <li>
//                             <NavLink 
//                                 to="/polls" 
//                                 className={({ isActive }) => 
//                                     `block p-3 rounded-lg cursor-pointer transition-colors ${
//                                         isActive ? "bg-gray-600 text-yellow-300" : "hover:bg-gray-700"
//                                     }`
//                                 }
//                             >
//                                 Profile
//                             </NavLink>
//                         </li>
//                         <li>
//                             <NavLink 
//                                 to="/payments" 
//                                 className={({ isActive }) => 
//                                     `block p-3 rounded-lg cursor-pointer transition-colors ${
//                                         isActive ? "bg-gray-600 text-yellow-300" : "hover:bg-gray-700"
//                                     }`
//                                 }
//                             >
//                                 Settings
//                             </NavLink>
//                         </li>
//                     </ul>
//                 </div>

//                 {/* Main Content - Page Section */}
//                 <div className="ml-64 p-6 w-full">
//                     <Routes>
//                         <Route path="/" element={<Dashboard />} />
//                         <Route path="/polls" element={<Polls />} />
//                         <Route path="/payments" element={<Payment />} />
//                     </Routes>
//                 </div>
//             </div>
//         </Router>
//     );
// }
