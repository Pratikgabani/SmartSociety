import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SocietyDetails from './components/SocietyDetail/SocietyDetail.jsx';
import { createBrowserRouter,createRoutesFromElements } from "react-router-dom";
import { Route, RouterProvider, BrowserRouter } from "react-router-dom";
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
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
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Buy from './components/Buy/Buy.jsx';
const stripePromise = loadStripe(
  "pk_test_51R1h8oFjDw8IkcOQVn7UvbMIuiNBki2KBzh7mjuUS5EhTAmnAksY48vDtDxrXHy7YWOQZeJ0lrozJIfDuzraVVeR00ve6RdDcA"
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element= {< OrgLanding/>} />
    <Route path="Login" element={<Login />} />
    <Route path ="Securityregister" element={<SecurityRegister />} />
    
    <Route path="Register" element={<Register />} />
    <Route path = "SocietyDetails" element = {<SocietyDetails/>} />
    <Route element={<RequireAuth />}>
    <Route path="Layout" element={<Layout/>} >
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard/>} />
    <Route path='OrgLanding' element={<OrgLanding/>} />
   
     <Route path="Payment" element={<Payment />} />
     <Route path="payPayment/:paymentId" element={<Buy />} />
  
  
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
  <Elements stripe={stripePromise}>
    <StrictMode>
  <RouterProvider router={router} />
  
   </StrictMode>
   </Elements>
)

