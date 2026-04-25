
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './components/SideBar/SideBar.jsx'
import { Toaster } from 'react-hot-toast'
import { Menu, X } from 'lucide-react'

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <Toaster />

      {/* Mobile Topbar */}
      <div className='md:hidden fixed top-0 left-0 right-0 bg-white shadow flex items-center justify-between p-4 z-50'>
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className='text-3xl font-medium'>ResiHub</h1>
      </div>

      {/* Sidebar Wrapper — tracks hover to sync main content margin */}
      <div
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`
          fixed top-0 left-0 h-screen z-40
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <SideBar />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden'
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Area — margin syncs with sidebar width */}
      <div
        className='pt-20 md:pt-4 p-4 transition-all duration-300 ease-in-out hidden md:block'
        style={{ marginLeft: isSidebarHovered ? '230px' : '70px' }}
      >
        <Outlet />
      </div>

      {/* Mobile main content (no sidebar margin needed) */}
      <div className='pt-20 p-4 block md:hidden'>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
