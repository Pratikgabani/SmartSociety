import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
 import { createBrowserRouter,createRoutesFromElements } from "react-router-dom";
import { Route, RouterProvider } from "react-router-dom";
import Front from './components/front/front';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<Front/>} />
      
      <Route path="Login" element={<Login />} />
     <Route path="Register" element={<Register />} />
    </>
     )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
