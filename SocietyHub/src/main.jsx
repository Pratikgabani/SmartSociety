import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter,createRoutesFromElements } from "react-router-dom";
import { Route, RouterProvider, BrowserRouter } from "react-router-dom";
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Landing from './components/Landing/Landing.jsx';
import Payment from './components/Payment/Payment.jsx';
import Visitor from './components/Visitor/Visitor.jsx';
import Complaint from './components/Complaint/Complaint.jsx';
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    
    <Route path="/" element={<Landing />} />
      <Route path="Login" element={<Login />} />
     <Route path="Register" element={<Register />} />

     <Route path="Payment" element={<Payment />} />
     <Route path="Visitor" element={<Visitor />} />

    <Route path = "Complaint" element= {<Complaint />} />
    
    

    </>
     )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router} />
   </StrictMode>
)
