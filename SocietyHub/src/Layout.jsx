import React from 'react'
import Dashboard from './components/dashboard/dashboard'
import { Outlet } from 'react-router-dom'
import SideBar from './components/SideBar/SideBar.jsx'
function Layout() {
  return (
    <div className='flex'>
        <SideBar/>
        <Outlet/>
    </div>
  )
}

export default Layout