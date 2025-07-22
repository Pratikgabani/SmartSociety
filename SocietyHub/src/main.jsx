import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SocietyDetails from './components/SocietyDetail/SocietyDetail.jsx';
import { createBrowserRouter,createRoutesFromElements } from "react-router-dom";
import { Route, RouterProvider, BrowserRouter } from "react-router-dom";
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Payment from './components/Payment/Payment.jsx';
import Visitor from './components/visitor/Visitor.jsx';
import Complaint from './components/Complaint/Complaint.jsx';
import { Toaster } from 'react-hot-toast';
import Booking from './components/Booking/Booking.jsx';
import PollApp from './components/polls/polls.jsx';
import Event from './components/Event/Event.jsx';
import SecurityRegister from './components/Security/Security.jsx';
import Announcements from './components/Notice/Notice.jsx';
import OrgLanding from './components/OrgLanding/OrgLanding.jsx';
import Dashboard from   './components/dashboard/dashboard.jsx';

import Layout from "./Layout.jsx"
import RequireAuth from './RequireAuth.jsx';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PageNotFound from './components/PageNotFound/PageNotFound.jsx';
import GoogleLogin from './components/Login/Login.jsx';
import Buy from './components/Buy/Buy.jsx';
import PreviousDataModal from './components/history/PreviousDataModal .jsx';
import { GoogleOAuthProvider } from "@react-oauth/google";
import EventBuy from './components/Buy/EventBuy.jsx';
import BookingBuy from './components/Buy/BookingBuy.jsx';
import UserContextProvider from './context/UserContextProvider.jsx';
const stripePromise = loadStripe(
  "pk_test_51R1h8oFjDw8IkcOQVn7UvbMIuiNBki2KBzh7mjuUS5EhTAmnAksY48vDtDxrXHy7YWOQZeJ0lrozJIfDuzraVVeR00ve6RdDcA"
);


 const GoogleAuthWrapper = ()=>( // 3
  
    <GoogleOAuthProvider clientId="553666257708-alafbipbuj60kpj25j56n3hu0l4lmld9.apps.googleusercontent.com">
      {/* <GoogleLogin></GoogleLogin> */}
      <Login />
    </GoogleOAuthProvider>
 )
// here we r using requireAuth component to protect the routes that we want to be protected, so that only authenticated users can access them
// we can use this component to wrap around the routes that we want to protect, and it will check if the user is authenticated or not

// the layout is used to provide a common layout for the application, such as the sidebar and header, and the outlet is used to render the child routes inside the layout
// the outlet is used to render the child routes inside the layout

// index element is used to set the default route for the layout, which is the dashboard in this case
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element= {< OrgLanding/>} />
    {/* <Route path="Login" element={<Login />} /> */}
    <Route path="Login" element={<GoogleAuthWrapper />} /> 
    {/* <Route path="google-login" element={<GoogleAuthWrapper />} /> */}
    <Route path ="Securityregister" element={<SecurityRegister />} />
    <Route path="history" element={<PreviousDataModal  />} />

    <Route path="Register" element={<Register />} />
    <Route path = "SocietyDetails" element = {<SocietyDetails/>} />
    
    <Route element={<RequireAuth />}>
    <Route path="Layout" element={<Layout/>} >
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard/>} />
    <Route path='OrgLanding' element={<OrgLanding/>} />
   
     <Route path="Payment" element={<Payment />} />
     <Route path="payPayment/:paymentId" element={<Buy />} />
     <Route path="payEvent/:eventId" element={<EventBuy/>} />
     <Route path="payBooking/:bookingId" element={<BookingBuy />} />
     <Route path="Visitor" element={<Visitor />} />
    <Route path = "Poll" element = {<PollApp />} />
    <Route path = "Complaint" element= {<Complaint />} />
    <Route path = "Booking" element = {<Booking/>} />
    <Route path = "Event" element = {<Event/>} />
    
    <Route path = "Notice" element = {<Announcements/>} />
    
    </Route>
    </Route>
    <Route path="*" element={<PageNotFound />} />
    </>
     )
)
// here we are using the createBrowserRouter to create a router instance, and then we are passing it to the RouterProvider component to provide the router to the application
// the RouterProvider component is used to provide the router to the application, and it will render the routes that we have defined in the router instance

// the Elements component is used to provide the stripe instance to the application, so that we can use the stripe elements in our components
// the createRoot is used to render the application to the root element in the HTML file
createRoot(document.getElementById('root')).render(
  <UserContextProvider> 

  <Elements stripe={stripePromise}>
    <StrictMode>
  <RouterProvider router={router} />
  
   </StrictMode>
   </Elements>
  </UserContextProvider>
)

