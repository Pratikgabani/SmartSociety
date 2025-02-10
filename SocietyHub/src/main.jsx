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
import Start from './components/Start/Start.jsx';
import SecurityRegister from './components/Security/Security.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    
    <Route path="/" element={<Landing/>} />
    <Route path="Landing" element={<Landing />} />
      <Route path="Login" element={<Login />} />
     <Route path="Register" element={<Register />} />
   <Route path ="Securityregister" element={<SecurityRegister />} />
     <Route path="Payment" element={<Payment />} />
     <Route path="Visitor" element={<Visitor />} />
    <Route path = "Poll" element = {<PollApp />} />
    <Route path = "Complaint" element= {<Complaint />} />
    <Route path = "Booking" element = {<Booking/>} />
    <Route path = "Event" element = {<Event/>} />
    <Route path = "SocietyDetails" element = {<SocietyDetails/>} />
    </>
     )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router} />
   </StrictMode>
)
