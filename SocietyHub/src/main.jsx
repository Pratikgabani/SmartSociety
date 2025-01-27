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
    <Route path="/" element={<Landing />} />
      <Route path="Login" element={<Login />} />
     <Route path="Register" element={<Register />} />
<<<<<<< HEAD
     <Route path="Payment" element={<Payment />} />
     <Route path="Visitor" element={<Visitor />} />
=======
    <Route path = "Complaint" element= {<Complaint />} />
    <Route path = "Payment" element = {<Payment />} />
>>>>>>> 033604e1f9c5fe85d0fa0ed01a5bc0e9aa4a9fba
    </>
     )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
