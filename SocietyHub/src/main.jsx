import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter,createRoutesFromElements } from "react-router-dom";
import { Route, RouterProvider } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Layout from "./Layout.jsx"
import RequireAuth from './RequireAuth.jsx';
import OrgLanding from './components/OrgLanding/OrgLanding.jsx';
import UserContextProvider from './context/UserContextProvider.jsx';
import Login from './components/Login/Login.jsx';

// 🔥 Lazy Loading Implementation
// Instead of downloading all these modules on initial page load, 
// they are now split into smaller JS chunks and downloaded only when the user navigates to them!
const Load = (Component) => (props) => (
  <Suspense fallback={<div className="flex h-screen items-center justify-center font-medium text-gray-500 animate-pulse">Loading Module...</div>}>
    <Component {...props} />
  </Suspense>
);

const SocietyDetails = Load(lazy(() => import('./components/SocietyDetail/SocietyDetail.jsx')));
const Register = Load(lazy(() => import('./components/Register/Register.jsx')));
const Payment = Load(lazy(() => import('./components/Payment/Payment.jsx')));
const Visitor = Load(lazy(() => import('./components/visitor/Visitor.jsx')));
const Complaint = Load(lazy(() => import('./components/Complaint/Complaint.jsx')));
const Booking = Load(lazy(() => import('./components/Booking/Booking.jsx')));
const PollApp = Load(lazy(() => import('./components/polls/polls.jsx')));
const Event = Load(lazy(() => import('./components/Event/Event.jsx')));
const SecurityRegister = Load(lazy(() => import('./components/Security/Security.jsx')));
const Announcements = Load(lazy(() => import('./components/Notice/Notice.jsx')));
const Dashboard = Load(lazy(() => import('./components/dashboard/dashboard.jsx')));
const PageNotFound = Load(lazy(() => import('./components/PageNotFound/PageNotFound.jsx')));
const Buy = Load(lazy(() => import('./components/Buy/Buy.jsx')));
const PreviousDataModal = Load(lazy(() => import('./components/history/PreviousDataModal .jsx')));
const EventBuy = Load(lazy(() => import('./components/Buy/EventBuy.jsx')));
const BookingBuy = Load(lazy(() => import('./components/Buy/BookingBuy.jsx')));
const RefundAdmin = Load(lazy(() => import('./components/RefundAdmin/RefundAdmin.jsx')));
const Profile = Load(lazy(() => import('./components/Profile/Profile.jsx')));

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


 function GoogleAuthWrapper() {
  return ( // 3

    <GoogleOAuthProvider clientId="553666257708-alafbipbuj60kpj25j56n3hu0l4lmld9.apps.googleusercontent.com">
      {/* <GoogleLogin></GoogleLogin> */}
      <Login />
    </GoogleOAuthProvider>
  );
}
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
     <Route path="payPayment/:paymentId" element={<Elements stripe={stripePromise}><Buy /></Elements>} />
     <Route path="payEvent/:eventId" element={<Elements stripe={stripePromise}><EventBuy/></Elements>} />
     <Route path="payBooking/:bookingId" element={<Elements stripe={stripePromise}><BookingBuy /></Elements>} />
     <Route path="Visitor" element={<Visitor />} />
    <Route path = "Poll" element = {<PollApp />} />
    <Route path = "Complaint" element= {<Complaint />} />
    <Route path = "Booking" element = {<Booking/>} />
    <Route path = "Event" element = {<Event/>} />
    
    <Route path = "Notice" element = {<Announcements/>} />
    <Route path="Refunds" element={<RefundAdmin />} />
    <Route path="Profile" element={<Profile />} />
    
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

    <StrictMode>
  <RouterProvider router={router} />
  
   </StrictMode>
  </UserContextProvider>
)

