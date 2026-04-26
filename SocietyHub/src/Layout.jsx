
import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './components/SideBar/SideBar.jsx'
import { Toaster } from 'react-hot-toast'
import { Menu, X } from 'lucide-react'

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768
      setIsDesktop(desktop)
      // Auto-close mobile sidebar when switching to desktop
      if (desktop) setIsSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isSidebarOpen && !isDesktop) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isSidebarOpen, isDesktop])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Toaster />

      {/* Mobile Topbar */}
      <div className='md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-4 py-3 z-50'>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
        >
          {isSidebarOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
        </button>
        <h1 className='text-xl font-semibold text-gray-900 tracking-tight'>ResiHub</h1>
        {/* Spacer to center the title */}
        <div className="w-10" />
      </div>

      {/* Mobile Backdrop overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] md:hidden'
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Wrapper — tracks hover to sync main content margin on desktop */}
      <div
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        <SideBar isMobileOpen={isSidebarOpen} closeMobile={closeSidebar} />
      </div>

      {/* Main Content Area */}
      <div
        className='pt-[72px] md:pt-4 p-4 transition-all duration-300 ease-in-out'
        style={{ marginLeft: isDesktop ? (isSidebarHovered ? '240px' : '76px') : '0px' }}
      >
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
