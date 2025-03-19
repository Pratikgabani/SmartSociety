import React from 'react'
import Dashboard from './components/dashboard/dashboard'
import { Outlet } from 'react-router-dom'
import SideBar from './components/SideBar/SideBar.jsx'
import { Toaster } from 'react-hot-toast'
function Layout() {
  return (
    <div className='flex'>
        <Toaster/>
       <div className='fixed'> <SideBar/></div>
        <div className='ml-64 w-full'><Outlet/></div>
    </div>
  )
}

export default Layout
