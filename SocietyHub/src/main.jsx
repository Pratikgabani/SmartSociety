import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter,createRoutesFromElements } from "react-router-dom";
import { Route, RouterProvider } from "react-router-dom";
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Landing from './components/Landing/Landing.jsx';
import Payment from './components/payment/payment.jsx';
import Visitor from './components/visitor/Visitor.jsx';
import Complaint from './components/Complaint/Complaint.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<Visitor />} />
      <Route path="Login" element={<Login />} />
     <Route path="Register" element={<Register />} />
    <Route path = "Complaint" element= {<Complaint />} />
    <Route path = "Payment" element = {<Payment />} />
    </>
     )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
