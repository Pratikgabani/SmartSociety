// import React from 'react'
// import Dashboard from './components/dashboard/dashboard'
// import { Outlet } from 'react-router-dom'
// import SideBar from './components/SideBar/SideBar.jsx'
// import { Toaster } from 'react-hot-toast'
// function Layout() {
//   return (
//     <div className='flex'>
//         <Toaster/>
//        <div className='fixed'> <SideBar/></div>
//         <div className='ml-64 w-full'><Outlet/></div>
//     </div>
//   )
// }



// export default Layout
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './components/SideBar/SideBar.jsx'
import { Toaster } from 'react-hot-toast'
import { Menu, X } from 'lucide-react'

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
        <h1 className='text-3xl font-bold'>ResiHub</h1>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#111827] text-white z-40
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

      {/* Main Content Area */}
      <div className='md:ml-64 pt-20 md:pt-4 p-4'>
        <Outlet />
      </div>
    </div>
  )
}

// function Layout() {
//   return (
//     <div className="flex">
//       <SideBar />
//       <div className="ml-0 md:ml-64 w-full transition-all">
//         <Outlet />
//       </div>
//     </div>
//   );
// }

export default Layout
