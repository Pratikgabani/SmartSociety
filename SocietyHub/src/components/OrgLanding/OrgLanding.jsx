import React, { useState, useEffect, useContext } from 'react';
import ImageSlider from '../ImgSlider/ImgSlider';
import { Link, useNavigate } from "react-router-dom";
import UserContext from '../../context/UserContext';

// Simple SVG Icons for Mobile Menu
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

function OrgLanding() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // For mobile navigation
  const navigate = useNavigate();
  const { rolee } = useContext(UserContext);
  useEffect(() => {
    if (rolee == "admin" || rolee == "user") {
      setIsLoggedIn(true);
      navigate('/layout/Dashboard');
    } else if (rolee == "security") {
      setIsLoggedIn(true);
      navigate('/layout/Visitor');
    } else {
      setIsLoggedIn(false);
    }
  }, [rolee, navigate]); // Added navigate to dependency array, though it's stable. [] is also fine.

  return (
    <div className='bg-white min-h-screen w-full font-raleway overflow-x-hidden'>
      {/* Main content wrapper, adjusted height for first section */}
      <div className='w-full flex flex-col justify-center items-center '>
        {/* Nav Bar */}
        <nav className='w-full bg-white mb-3 flex flex-col md:flex-row justify-between md:items-center py-4 md:py-6 px-4 sm:px-6 lg:px-14 rounded-xl shadow-lg sticky top-0 z-50'>
          <div className='flex justify-between items-center w-full md:w-auto'>
            <div className='font-bold text-3xl sm:text-4xl text-blue-600 font-raleway'>ResiHub</div>
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-800 hover:text-blue-600 focus:outline-none p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>

          <div className={`w-full md:flex md:items-center md:w-auto ${mobileMenuOpen ? 'block' : 'hidden'} mt-4 md:mt-0`}>
            <ul className='flex flex-col md:flex-row md:items-center gap-y-3 md:gap-x-4 lg:gap-x-6 text-base lg:text-lg scroll-smooth text-center md:text-left'>
              {['Home', 'Features', 'Benefits', 'Pricing', 'Testimonials', 'Contact'].map((item) => (
                <li key={item} className='cursor-pointer hover:text-blue-700 font-semibold relative text-gray-800 px-2 after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-1 after:bg-blue-600 after:rounded-full after:transition-all after:duration-300 after:ease-in-out hover:after:w-full hover:after:left-0'>
                  <a href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}>{item}</a>
                </li>
              ))}
            </ul>
            <div className='mt-4 md:mt-0 md:ml-6 w-full md:w-auto'>
              {!isLoggedIn && (
                <div className="w-full flex justify-center md:justify-end">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="bg-blue-600 text-white font-bold rounded-3xl py-2 px-4 sm:px-6 text-sm md:text-base lg:text-lg border-white w-full md:w-auto">
                      Login
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* First part - Hero Section */}
        <div id='home' className='w-full max-w-6xl mx-auto my-10 lg:my-16 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center  pt-8 pb-8'> {/* Adjusted min-height calculation */}
          <div className='p-2 sm:p-5 w-full lg:w-1/2 text-center lg:text-left'>
            <div className='mb-5 mt-8 sm:mt-12'>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-700 ">
                Smart Society Management System
              </h1>
            </div>
            <div className='mb-7'>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 animate__animated animate__fadeInUp animate__delay-1s">
                Streamline your residential community with digital solutions for bookings, complaints, visitor management, and more.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:space-x-4 lg:space-x-6 mt-5 justify-center lg:justify-start">
              {!rolee && (
                <div className='flex gap-4'>
                  <Link to="/register" className="bg-blue-600 text-white text-sm sm:text-base lg:text-lg px-4 py-2 sm:px-6 sm:py-3 rounded-md hover:bg-blue-700 text-center">
                    Join an Existing Society
                  </Link>

                  <Link to="/SocietyDetails" className="bg-green-600 text-white text-sm sm:text-base lg:text-lg px-4 py-2 sm:px-6 sm:py-3 rounded-md hover:bg-green-700 text-center">
                    Create a New Society
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className='hidden lg:block mt-8 lg:mt-0 lg:ml-4 w-full max-w-lg mx-auto lg:w-1/2'>
            <ImageSlider />
          </div>

        </div>
      </div>

      {/* Second part - Features */}
      <div id='features' className='text-gray-200 bg-[url(/bgSociety.png)] bg-cover bg-center py-10 sm:py-16'>
        <div className='px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24'>
          <h2 className='text-center text-2xl sm:text-3xl md:text-4xl font-bold mt-7 text-pretty'>Comprehensive Society Management Features</h2>
          <p className='text-center text-md sm:text-lg md:text-xl mt-4 text-pretty mb-7 sm:mb-10'>Everything you need to manage your residential community efficiently</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-5 mb-2 text-black'>
            {/* Feature Card 1 */}
            <div className='bg-gray-100 shadow-xl rounded-xl px-5 py-4 sm:px-7 min-h-[180px] sm:min-h-52 flex flex-col'>
              <svg fill="#ffffff" className='w-10 h-10 mb-2 self-start' viewBox="-4.8 -4.8 33.60 33.60" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="0.48"><g id="SVGRepo_bgCarrier" strokeWidth="0"><rect x="-4.8" y="-4.8" width="33.60" height="33.60" rx="4.704" fill="#2563eb" strokeWidth="0"></rect></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M19,4H17V3a1,1,0,0,0-2,0V4H9V3A1,1,0,0,0,7,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V12H20Zm0-9H4V7A1,1,0,0,1,5,6H7V7A1,1,0,0,0,9,7V6h6V7a1,1,0,0,0,2,0V6h2a1,1,0,0,1,1,1Z"></path></g></svg>
              <h3 className='text-lg sm:text-xl my-2 font-bold'>Bookings</h3>
              <p className='text-sm sm:text-base my-2 flex-grow'>Easy booking system for community amenities like clubhouse, gym, and party halls.</p>
            </div>
            {/* Feature Card 2 */}
            <div className='bg-gray-100 shadow-xl rounded-xl px-5 py-4 sm:px-7 min-h-[180px] sm:min-h-52 flex flex-col'>
              <svg fill="#ffffff" className='w-10 h-10 mb-2 self-start' viewBox="-3.2 -3.2 22.40 22.40" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="0.16"><g id="SVGRepo_bgCarrier" strokeWidth="0"><rect x="-3.2" y="-3.2" width="22.40" height="22.40" rx="3.136" fill="#2563eb" strokeWidth="0"></rect></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="m13.58 11.6-1.33-2.18V6.33A4.36 4.36 0 0 0 10 2.26a2.45 2.45 0 0 0 0-.38A1.94 1.94 0 0 0 8 0a1.94 1.94 0 0 0-2 1.88 1.64 1.64 0 0 0 0 .38 4.36 4.36 0 0 0-2.25 4.07v3.09L2.42 11.6a1.25 1.25 0 0 0 1.06 1.9h1.77A2.68 2.68 0 0 0 8 16a2.68 2.68 0 0 0 2.75-2.5h1.77a1.25 1.25 0 0 0 1.06-1.9zM7.25 1.88A.7.7 0 0 1 8 1.25a.7.7 0 0 1 .75.63 6 6 0 0 0-.75 0 5.9 5.9 0 0 0-.75 0zM8 14.75a1.44 1.44 0 0 1-1.5-1.25h3A1.44 1.44 0 0 1 8 14.75zm-4.52-2.5 1.34-2.17.18-.31V6.33a4 4 0 0 1 .6-2.12A2.68 2.68 0 0 1 8 3.12a2.68 2.68 0 0 1 2.4 1.09 4 4 0 0 1 .6 2.12v3.44l.18.31 1.34 2.17z"></path></g></svg>
              <h3 className='text-lg sm:text-xl my-2 font-bold'>Complaint Management</h3>
              <p className='text-sm sm:text-base my-2 flex-grow'>Track and resolve residents complaints efficiently</p>
            </div>
            {/* Feature Card 3 */}
            <div className='bg-gray-100 shadow-xl rounded-xl px-5 py-4 sm:px-7 min-h-[180px] sm:min-h-52 flex flex-col'>
              <svg fill="#ffffff" className='w-10 h-10 mb-2 self-start' viewBox="-127.61 -127.61 727.84 727.84" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="6.616624"><g id="SVGRepo_bgCarrier" strokeWidth="0"><rect x="-127.61" y="-127.61" width="727.84" height="727.84" rx="101.8976" fill="#2563eb" strokeWidth="0"></rect></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M289.966,231.969c0-59.62,10.963-111.865,29.163-149.142c-106.982,61.473-200.795,65.399-247.864,68.235 c-26.466,1.594-50.836,18.818-63.507,45.789c-10.328,21.985-10.267,47.902-0.288,70.044 c12.575,27.909,37.087,46.209,63.794,45.979c4.422-0.038,9.716,0.029,15.604,0.228c-9.535,42.911,15.044,88.307,59.25,107.464 c13.51,5.855,27.754,8.798,41.875,8.798c11.005,0,21.937-1.788,32.38-5.394c24.149-8.327,42.817-25.308,52.563-47.798 c2.269-5.231,3.807-10.71,4.981-16.27c13.534,6.253,27.315,13.293,41.251,21.284C300.946,343.904,289.966,291.633,289.966,231.969 z M254.87,368.344c-7.524,17.356-22.052,30.499-40.919,37.01c-19.177,6.615-40.494,5.596-60.004-2.866 c-36.58-15.848-56.599-53.562-47.13-88.204c37.589,3.05,91.884,12.199,152.715,37.529 C258.702,357.498,257.161,363.056,254.87,368.344z"></path> </g> </g> <g> <g> <path d="M391.137,43.253c-32.566,0-60.587,44.358-73.632,108.315c43.489,1.036,78.566,36.668,78.566,80.402 c0,43.733-35.079,79.356-78.567,80.392c13.043,63.959,41.065,108.319,73.633,108.319c45,0,81.479-84.491,81.479-188.714 S436.137,43.253,391.137,43.253z"></path> </g> </g> </g></svg>
              <h3 className='text-lg sm:text-xl my-2 font-bold'>Events & Announcements</h3>
              <p className='text-sm sm:text-base my-2 flex-grow'>Organize and manage community events. Broadcast important announcements and notices to residents instantly</p>
            </div>
            {/* Feature Card 4 */}
            <div className='bg-gray-100 shadow-xl rounded-xl px-5 py-4 sm:px-7 min-h-[180px] sm:min-h-52 flex flex-col'>
              <svg className='w-10 h-10 mb-2 self-start' viewBox="-3.6 -3.6 31.20 31.20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)" strokeWidth="0.00024"><g id="SVGRepo_bgCarrier" strokeWidth="0"><rect x="-3.6" y="-3.6" width="31.20" height="31.20" rx="4.368" fill="#2563eb" strokeWidth="0"></rect></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12.052 1.25H11.948C11.0495 1.24997 10.3003 1.24995 9.70552 1.32991C9.07773 1.41432 8.51093 1.59999 8.05546 2.05546C7.59999 2.51093 7.41432 3.07773 7.32991 3.70552C7.27259 4.13189 7.25637 5.15147 7.25179 6.02566C5.22954 6.09171 4.01536 6.32778 3.17157 7.17157C2 8.34315 2 10.2288 2 14C2 17.7712 2 19.6569 3.17157 20.8284C4.34314 22 6.22876 22 9.99998 22H14C17.7712 22 19.6569 22 20.8284 20.8284C22 19.6569 22 17.7712 22 14C22 10.2288 22 8.34315 20.8284 7.17157C19.9846 6.32778 18.7705 6.09171 16.7482 6.02566C16.7436 5.15147 16.7274 4.13189 16.6701 3.70552C16.5857 3.07773 16.4 2.51093 15.9445 2.05546C15.4891 1.59999 14.9223 1.41432 14.2945 1.32991C13.6997 1.24995 12.9505 1.24997 12.052 1.25ZM15.2479 6.00188C15.2434 5.15523 15.229 4.24407 15.1835 3.9054C15.1214 3.44393 15.0142 3.24644 14.8839 3.11612C14.7536 2.9858 14.5561 2.87858 14.0946 2.81654C13.6116 2.7516 12.964 2.75 12 2.75C11.036 2.75 10.3884 2.7516 9.90539 2.81654C9.44393 2.87858 9.24644 2.9858 9.11612 3.11612C8.9858 3.24644 8.87858 3.44393 8.81654 3.9054C8.771 4.24407 8.75661 5.15523 8.75208 6.00188C9.1435 6 9.55885 6 10 6H14C14.4412 6 14.8565 6 15.2479 6.00188ZM12 9.25C12.4142 9.25 12.75 9.58579 12.75 10V10.0102C13.8388 10.2845 14.75 11.143 14.75 12.3333C14.75 12.7475 14.4142 13.0833 14 13.0833C13.5858 13.0833 13.25 12.7475 13.25 12.3333C13.25 11.9493 12.8242 11.4167 12 11.4167C11.1758 11.4167 10.75 11.9493 10.75 12.3333C10.75 12.7174 11.1758 13.25 12 13.25C13.3849 13.25 14.75 14.2098 14.75 15.6667C14.75 16.857 13.8388 17.7155 12.75 17.9898V18C12.75 18.4142 12.4142 18.75 12 18.75C11.5858 18.75 11.25 18.4142 11.25 18V17.9898C10.1612 17.7155 9.25 16.857 9.25 15.6667C9.25 15.2525 9.58579 14.9167 10 14.9167C10.4142 14.9167 10.75 15.2525 10.75 15.6667C10.75 16.0507 11.1758 16.5833 12 16.5833C12.8242 16.5833 13.25 16.0507 13.25 15.6667C13.25 15.2826 12.8242 14.75 12 14.75C10.6151 14.75 9.25 13.7903 9.25 12.3333C9.25 11.143 10.1612 10.2845 11.25 10.0102V10C11.25 9.58579 11.5858 9.25 12 9.25Z" fill="#ffffff"></path> </g></svg>
              <h3 className='text-lg sm:text-xl my-2 font-bold'>Payments</h3>
              <p className='text-sm sm:text-base my-2 flex-grow'>Secure payment gateway for maintainance and other charges</p>
            </div>
            {/* Feature Card 5 */}
            <div className='bg-gray-100 shadow-xl rounded-xl px-5 py-4 sm:px-7 min-h-[180px] sm:min-h-52 flex flex-col'>
              <svg className='w-10 h-10 mb-2 self-start' version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="-58.74 -58.74 411.19 411.19" xmlSpace="preserve" fill="#ffffff" stroke="#ffffff" strokeWidth="0.00293709"><g id="SVGRepo_bgCarrier" strokeWidth="0"><rect x="-58.74" y="-58.74" width="411.19" height="411.19" rx="57.5666" fill="#2563eb" strokeWidth="0"></rect></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M251.742,58.307c0,0,0-2.502,0-5.58s-0.386-9.894-3.878-13.168c-1.757-1.648-4.297-2.904-7.93-2.904 h-19.668c0,0-10.481,0-10.481,9.834V56.98c0,11.166-20.511,10.878-20.511,10.878l-84.469,0.044c0,0-20.897-0.462-20.897-9.589 V44.954c0,0,0.658-8.501-10.492-8.501H52.449c0,0-10.514,0-10.514,9.159v12.706c0,0,0.375,5.461-8.126,8.246 c-6.478,2.121-20.641,0.109-27.489,5.972C2.768,75.57,0,80.65,0,89.097v147.839c0,0,0.647,20.32,20.973,20.32h250.436 c0,0,22.3-1.305,22.3-19.662V88.45c0,0-0.68-20.309-21.647-20.309C272.062,68.135,251.742,66.803,251.742,58.307z M220.26,57.627 c0-5.776,4.068-10.487,9.834-10.487h0.658c5.798,0,10.508,4.71,10.508,10.487v20.989c0,5.776-4.373,10.481-10.171,10.481h-0.658 c-5.798,0-10.171-4.699-10.171-10.481V57.627z M184.335,162.525h52.449c2.888,0,5.232,2.339,5.232,5.254 c0,2.888-2.344,5.238-5.232,5.238h-52.449c-2.888,0-5.254-2.35-5.254-5.238C179.081,164.863,181.447,162.525,184.335,162.525z M241.701,189.405c0,3.089-2.491,4.911-5.564,4.911h-51.144c-3.073,0-5.575-1.822-5.575-4.911c0-3.073,2.497-5.575,5.575-5.575 h51.144C239.21,183.829,241.701,186.331,241.701,189.405z M89.674,99.627c16.176,0,29.289,14.354,29.289,33.711 c0,19.363-13.114,35.077-29.289,35.077s-29.278-15.713-29.278-35.077C60.395,113.981,73.498,99.627,89.674,99.627z M52.764,57.072 c0-5.776,4.036-9.834,9.834-9.834h0.658c5.798,0,10.16,4.052,10.16,9.834v21.544c0,5.776-4.71,10.481-10.481,10.481H62.25 c-5.765,0-9.486-4.699-9.486-10.481C52.764,78.616,52.764,57.072,52.764,57.072z M144.489,212.64 c-2.567,3.688-8.322,3.198-8.322,3.198H44.133c0,0-6.211,0.408-8.947-3.361c-1.474-2.034-0.451-6.162,0.566-8.469l2.48-5.64 c0,0,6.842-15.306,14.637-24.182c4.786-5.439,10.481-4.199,14.163-2.431c2.268,1.088,4.835,4.264,6.706,5.945 c2.584,2.317,7.141,4.95,14.598,5.096h4.574c7.452-0.141,12.009-2.779,14.588-5.096c1.876-1.681,4.368-4.95,6.614-6.075 c3.383-1.692,8.523-2.73,13.184,2.567c7.8,8.877,13.968,24.465,13.968,24.465l2.535,5.532 C144.848,206.467,145.925,210.573,144.489,212.64z M237.285,214.968h-53.439c-2.807,0-5.075-2.252-5.075-5.069 c0-2.812,2.268-5.096,5.075-5.096h53.439c2.779,0,5.075,2.284,5.075,5.096C242.359,212.716,240.064,214.968,237.285,214.968z"></path> </g> </g></svg>
              <h3 className='text-lg sm:text-xl my-2 font-bold'>Visitors</h3>
              <p className='text-sm sm:text-base my-2 flex-grow'>Track, Approve & Securely Manage Community Visitors!</p>
            </div>
            {/* Feature Card 6 */}
            <div className='bg-gray-100 shadow-xl rounded-xl px-5 py-4 sm:px-7 min-h-[180px] sm:min-h-52 flex flex-col'>
              <svg className='w-10 h-10 mb-2 self-start' fill="#ffffff" viewBox="-3.36 -3.36 30.72 30.72" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="0.312"><g id="SVGRepo_bgCarrier" strokeWidth="0"><rect x="-3.36" y="-3.36" width="30.72" height="30.72" rx="4.3008" fill="#2563eb" strokeWidth="0"></rect></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M7 11h7v2H7zm0-4h10.97v2H7zm0 8h13v2H7zM4 4h2v16H4z"></path></g></svg>
              <h3 className='text-lg sm:text-xl my-2 font-bold'>Polls</h3>
              <p className='text-sm sm:text-base my-2 flex-grow'>Know about your residents interests and thinking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Third part - Benefits */}
      <div id='benefits' className='pb-12 sm:pb-16 bg-white'>
        <div className='px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-10 sm:py-12'>
          <h1 className='text-center text-2xl sm:text-3xl md:text-4xl font-bold mt-7 text-pretty text-gray-700'>Why Choose Our Solutions</h1>
          <p className='text-center text-md sm:text-lg md:text-xl mt-4 text-pretty mb-7 sm:mb-10 text-gray-600'>Transform your society management with these key benefits</p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
            {[
              { title: "Increased Efficiency", desc: "Automate routine tasks and reduce administrative burden with our streamlined digital solutions.", points: ["Reduced paperwork", "Time-Saving Automation", "Digital payments"], icon: "/efficiency-system-production-productivity-svgrepo-com.svg" },
              { title: "Enhanced Security", desc: "Robust security features to protect your community and manage access control effectively.", points: ["Digital visitor tracking", "Emergency response system", "Community forums"], icon: "/security-verified-solid-svgrepo-com.svg" },
              { title: "Better Communication", desc: "Foster community engagement with integrated communication tools.", points: ["Real-time notifications", "Event announcements", "Conduct transparent society elections"], icon: "/communication-3-svgrepo-com.svg" }
            ].map((benefit, index) => (
              <div key={index} className='border-2 border-gray-200 px-4 py-4 sm:px-6 sm:py-6 rounded-xl flex flex-col sm:flex-row gap-3 sm:gap-4 items-start bg-gray-100'>
                <img src={benefit.icon} className='w-8 h-8 sm:w-10 sm:h-10 mt-1 flex-shrink-0' alt={`${benefit.title} icon`} />
                <div className='flex-grow'>
                  <h2 className='text-lg sm:text-xl my-1 sm:my-2 font-bold text-gray-800'>{benefit.title}</h2>
                  <p className='text-sm sm:text-base text-gray-600'>{benefit.desc}</p>
                  <ul className='flex flex-col gap-2 pt-3 pb-2 sm:pb-4'>
                    {benefit.points.map((point, pIndex) => (
                      <li key={pIndex} className='flex gap-2 items-center text-sm text-gray-700'>
                        <svg className='w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0' viewBox="-13.6 -13.6 197.20 197.20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#2563eb" strokeWidth="12.41"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M142.196 30.4125C142.586 30.0637 142.897 29.6356 143.109 29.1567C143.32 28.6778 143.427 28.1592 143.422 27.6357C143.417 27.1122 143.3 26.5959 143.079 26.1213C142.858 25.6467 142.538 25.2248 142.141 24.8838C141.722 24.5249 141.307 24.1678 140.895 23.8127C137.751 21.1093 134.5 18.3102 131.1 15.9225C105.123 -2.36044 78.1316 -2.4633 50.8803 7.23287C26.2068 16.0055 10.3619 33.5563 3.77909 59.3882C-3.56415 88.249 2.86618 113.71 22.9048 135.073C23.4261 135.625 23.9582 136.177 24.4895 136.704C35.2539 147.469 48.6614 154.115 59.2847 158.739C63.8445 160.731 87.2404 163.149 93.5707 162.206C131.19 156.588 155.946 135.37 164.569 99.8725C166.215 92.9194 167.035 85.7962 167.011 78.6508C166.974 71.1466 165.712 63.6988 163.275 56.6012C163.097 56.0703 162.805 55.5851 162.418 55.1805C162.031 54.7759 161.56 54.4618 161.037 54.2606C160.515 54.0595 159.954 53.9764 159.396 54.0171C158.838 54.0579 158.295 54.2216 157.808 54.4965L157.706 54.5547C156.931 54.9984 156.336 55.7005 156.027 56.5381C155.717 57.3757 155.712 58.2954 156.012 59.1364C158.212 65.2371 159.334 71.674 159.327 78.1592C159.251 85.9394 158.198 93.6792 156.192 101.197C150.248 122.8 136.038 138.545 112.75 149.315C89.0741 160.65 55.1215 149.19 46.0879 143.226C36.1031 136.4 27.3663 127.908 20.2596 118.121C9.11418 102.34 6.61369 79.6587 12.6028 58.9229C15.4055 49.3489 20.3036 40.5185 26.9421 33.0722C33.5806 25.6259 41.793 19.7503 50.9838 15.8714C74.8941 5.93474 98.8852 4.18192 122.285 19.0635C125.422 21.061 133.422 27.3424 137.465 30.5501C138.143 31.0882 138.99 31.3691 139.855 31.3432C140.721 31.3172 141.549 30.986 142.194 30.4082L142.196 30.4125Z" fill="#2563eb"></path> <path d="M74.6287 104.313C76.2312 102.79 77.1115 102.019 77.9173 101.177C103.753 74.1855 132.047 49.8851 160.508 25.7727C161.584 24.8619 162.685 23.7 163.958 23.3737C165.493 22.9815 167.996 23.4326 168.682 24.2661C169.133 24.8821 169.418 25.6035 169.509 26.3612C169.601 27.1189 169.496 27.8875 169.206 28.5932C168.537 30.3474 166.907 31.8498 165.429 33.1629C156.607 41.0019 147.538 48.5708 138.872 56.5716C120.756 73.3024 102.756 90.1576 84.8704 107.137C77.0334 114.561 74.0173 114.862 66.8059 106.929C62.0589 101.705 47.7328 84.0973 43.3455 78.5495C42.7256 77.6872 42.1735 76.7781 41.6941 75.8305C40.7045 74.0756 40.0576 72.1419 42.0246 70.7814C44.2158 69.2662 45.7707 70.8473 47.0696 72.4937C48.384 74.1607 49.5048 75.9916 50.9121 77.5713C55.2811 82.4737 69.908 99.1421 74.6287 104.313Z" fill="#2563eb"></path> </g></svg>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fourth part - Pricing */}
      <div id='pricing' className='px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-12 sm:py-16 md:py-20 mb-4 bg-[url(/bgSociety.png)] bg-cover bg-center min-h-screen text-gray-200'>
        <h1 className='text-center font-bold text-2xl sm:text-3xl md:text-4xl'>Simple & Transparent Pricing</h1>
        <h2 className='text-center text-md sm:text-lg md:text-xl mt-4 text-pretty mb-12 sm:mb-16 md:mb-20'>Choose the perfect plan for you</h2>
        <div className='flex flex-col lg:flex-row gap-8 justify-center items-center lg:items-stretch'>
          {[
            { name: "Basic", price: "₹999", desc: "Perfect for small societies", features: ["Visitor Management", "Complaint Management", "Basic Announcements", "5GB Storage"], popular: false },
            { name: "Pro", price: "₹1999", desc: "Ideal for medium societies", features: ["Everything in Basic", "Facility Booking", "Event Management", "Payment Gateway", "20GB Storage"], popular: true },
            { name: "Enterprise", price: "₹2999", desc: "For large societies", features: ["Everything in Pro", "Advanced Analytics", "24/7 Support", "Unlimited Storage"], popular: false }
          ].map((plan, index) => (
            <div key={index} className={`w-full max-w-sm md:max-w-md lg:w-1/3 border-2 ${plan.popular ? 'border-blue-500 bg-blue-700' : 'border-gray-500 bg-[rgba(57,77,105,0.5)] backdrop-blur-sm'} px-6 sm:px-8 md:px-10 py-8 rounded-xl flex flex-col`}>
              <h2 className={`text-center font-bold text-xl sm:text-2xl py-4 ${plan.popular ? 'text-white' : 'text-gray-100'}`}>{plan.name}</h2>
              <div className={`text-center text-4xl sm:text-5xl font-bold pb-4 ${plan.popular ? 'text-white' : 'text-gray-100'}`}>{plan.price}<span className='text-lg sm:text-xl font-semibold'>/month</span></div>
              <div className={`text-center pb-4 ${plan.popular ? 'text-gray-200' : 'text-gray-300'}`}>{plan.desc}</div>
              <ul className='flex flex-col gap-3 pb-4 mb-6 flex-grow'>
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className='flex gap-2 items-center'>
                    <div className={`flex-shrink-0 w-5 h-5 ${plan.popular ? 'bg-white text-blue-700' : 'bg-blue-600 text-white'} rounded-full flex items-center justify-center`}>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className={`${plan.popular ? 'text-gray-100' : 'text-gray-200'} text-sm sm:text-base`}>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`px-5 py-3 w-full ${plan.popular ? 'bg-white text-blue-700 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'} rounded-lg font-semibold transition-colors`}>Get Started</button>
            </div>
          ))}
        </div>
      </div>

      {/* Fifth part - Testimonials */}
      <div id='testimonials' className='py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white'>
        <div className='text-2xl sm:text-3xl md:text-4xl font-bold text-center text-pretty text-gray-700 mb-5 mt-5'>What Our Users Say</div>
        <div className='text-center text-md sm:text-lg md:text-xl mt-4 text-pretty mb-7 sm:mb-10 text-gray-600'>Trusted by residential societies across the country</div>
        <div className='flex flex-wrap gap-8 sm:gap-10 justify-center items-stretch mt-12 '>
          {[
            { quote: "The event management feature has brought our community closer. We've seen increased participation in social activities since implementing this system.", name: "Anita Menon", role: "Cultural Secretary" },
            { quote: "The digital payment system has made maintenance fee collection hassle-free. Residents love the convenience, and our accounts are always up to date.", name: "Sneha Patel", role: "Society President" },
            { quote: "The society management system has completely transformed how we handle our community operations. Everything from visitor management to complaints is now streamlined and efficient.", name: "Rajesh Kumar", role: "Treasurer" }
          ].map((testimonial, index) => (
            <div key={index} className='bg-gray-100 shadow-lg p-6 sm:p-8 w-full max-w-md md:w-[calc(33.333%-2rem)] rounded-xl min-h-[280px] sm:min-h-64 relative flex flex-col'>
              <div className="absolute -top-3 sm:-top-4 left-6 sm:left-8">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.70.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003z"></path>
                </svg>
              </div>
              <p className='font-raleway text-gray-700 text-sm sm:text-base flex-grow pt-4'>{testimonial.quote}</p>
              <div className='flex items-center gap-3 mt-4 sm:mt-6'>
                <img src="./user-circle-svgrepo-com.svg" className='w-10 h-10 sm:w-12 sm:h-12' alt="User avatar" />
                <div>
                  <h2 className='text-base sm:text-lg font-semibold text-gray-800'>{testimonial.name}</h2>
                  <p className='text-sm sm:text-md text-gray-600'>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='text-center mt-10 sm:mt-12'>
          <button className='bg-blue-600 text-white rounded-lg px-5 py-3 sm:p-4 text-sm sm:text-base hover:bg-blue-700 transition-colors'>View more testimonials</button>
        </div>
      </div>

      {/* Sixth part - Contact & Footer */}
      <div id='contact' className="bg-[url(/bgSociety.png)] bg-cover bg-center">
        <div className='py-10 sm:py-12 md:py-16 px-4 sm:p-7 text-gray-200'>
          <div className='text-center font-bold text-2xl sm:text-3xl md:text-4xl'>Get in touch with us</div>
          <div className='text-center text-md sm:text-lg md:text-xl mt-4 text-pretty mb-12 sm:mb-16 md:mb-20'>Have questions? We'd love to answer that!</div>
          <div className='flex flex-col lg:flex-row gap-8 lg:gap-10 justify-center items-center lg:items-start max-w-6xl mx-auto'>
            <div className="w-full lg:w-1/2 max-w-xl shadow-black shadow-md rounded-xl p-6 sm:p-8 bg-gray-200 bg-opacity-90 backdrop-blur-sm">
              <form className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-black mb-1 sm:mb-2">First Name</label>
                    <input type="text" id="firstName" className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter first name" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-black mb-1 sm:mb-2">Last Name</label>
                    <input type="text" id="lastName" className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter last name" />
                  </div>
                </div>
                <div>
                  <label htmlFor="emailAddress" className="block text-sm font-medium text-black mb-1 sm:mb-2">Email Address</label>
                  <input type="email" id="emailAddress" className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter email address" />
                </div>
                <div>
                  <label htmlFor="societyName" className="block text-sm font-medium text-black mb-1 sm:mb-2">Society Name</label>
                  <input type="text" id="societyName" className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter society name" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black mb-1 sm:mb-2">Message</label>
                  <textarea id="message" rows="4" className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your message..."></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2.5 sm:py-3 font-medium hover:bg-blue-700 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
            <div className='w-full lg:w-auto flex flex-col gap-8'>
              <div className="w-full max-w-md mx-auto lg:mx-0 p-6 bg-gray-200 bg-opacity-90 backdrop-blur-sm text-black rounded-lg shadow-md shadow-black">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  {[
                    { icon: "https://www.svgrepo.com/show/533288/phone-incoming.svg", label: "Phone", value: "+91 123 456 7890" },
                    { icon: "https://www.svgrepo.com/show/511917/email-1572.svg", label: "Email", value: "support@resihub.com" },
                    { icon: "https://www.svgrepo.com/show/493957/address.svg", label: "Address", value: "123 Tech Park, Silicon Valley, Bangalore, Karnataka 560001" }
                  ].map((info, index) => (
                    <div key={index} className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-blue-100">
                        <img src={info.icon} className='h-5 w-5 sm:h-6 sm:w-6' alt={`${info.label} icon`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">{info.label}</p>
                        <p className="text-gray-500 text-xs sm:text-sm">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full max-w-md mx-auto lg:mx-0 bg-gray-200 bg-opacity-90 backdrop-blur-sm shadow-md shadow-black rounded-xl p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">Business Hours</h3>
                <div className="space-y-2 text-sm sm:text-base">
                  <p className="text-black">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-black">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-black">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-12 sm:pt-16 pb-8 bg-[rgb(40,55,80)] text-gray-300"> {/* Slightly darker footer bg */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 sm:pb-12 border-b border-neutral-700 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-xl font-bold mb-4 text-white">ResiHub</h3>
                <p className="mb-6 text-gray-400 text-sm max-w-sm mx-auto md:mx-0">
                  We are a dedicated platform designed to streamline society management, helping residents
                  with communication, maintenance requests, and community engagement. Our goal is to make
                  society living hassle-free and organized.
                </p>
                <div className="flex space-x-4 justify-center md:justify-start">
                  {[
                    { href: "#", src: "https://www.svgrepo.com/show/521654/facebook.svg", alt: "Facebook" },
                    { href: "#", src: "https://www.svgrepo.com/show/521900/twitter.svg", alt: "Twitter" },
                    { href: "#", src: "https://www.svgrepo.com/show/458756/insta.svg", alt: "Instagram" }
                  ].map(social => (
                    <a key={social.alt} href={social.href} className="text-gray-400 hover:text-blue-500 transition-colors">
                      <img className='h-7 w-7 sm:h-8 sm:w-8' src={social.src} alt={social.alt} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  {['Visitor Management', 'Complaint System', 'Facility Booking', 'Event Management', 'Payment Gateway', 'Polls'].map(link => (
                    <li key={link}><a href="/login" className="hover:text-blue-400 transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <h3 className="font-semibold text-white mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                  <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 text-center">
              <p className="text-gray-400 text-xs sm:text-sm">© {new Date().getFullYear()} ResiHub. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrgLanding;