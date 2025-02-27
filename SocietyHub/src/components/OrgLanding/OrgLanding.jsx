import React from 'react'
import ImageSlider from '../ImgSlider/ImgSlider';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
function OrgLanding() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("user");
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        // Attempt to send logout request to the server
        await axios.post(
          "http://localhost:8000/api/v1/users/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      }
    } catch (error) {
      console.error("Error in logging out:", error);
    } finally {
      // Always clear client-side authentication state
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
      navigate('/');
    }
  };


  return (
    <div className='bg-white h-screen w-dvh font-raleway'>
      <div className=' h-6/7 w-dvh flex flex-col justify-center items-center'>
        <div className=' w-[100%] flex justify-between items-center p-8  '>
          <div className=' ml-15 text-4xl text-blue-400 font-raleway '>ResiHub</div>
          <div className='space-x-4'>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-blue-300 text-black text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-blue-300 text-black text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Login
                </Link>

              </>
            )}
          </div>
        </div>

        <div className=' h-3/4 w-[80%] flex'>
          <div className=' p-5 max-h-[100%] w-1/2'>
            <div className=' mb-5 mt-12'>
              <h1 class="text-4xl md:text-6xl font-bold text-gray-600 ">
                Smart Society Management System
              </h1>
            </div>
            <div className=' mb-7'>
              <p class="text-xl textgray-text-gray-600-300 animate__animated animate__fadeInUp animate__delay-1s">
                Streamline your residential community with digital solutions for bookings, complaints, visitor management, and more.
              </p>
            </div>
            <div className="flex space-x-8  mt-5">
              <div className="flex flex-col items-center">
                {
                  !token && <Link to="/register" className="bg-blue-500 text-white text-lg px-6 py-3 rounded-md mb-2 hover:bg-blue-600">
                    Join an Existing Society
                  </Link>
                }
              </div>

              <div className="flex flex-col items-center">
                <Link to="/SocietyDetails" className="bg-green-500 text-white text-lg px-6 py-3 rounded-md mb-2 hover:bg-green-600" >
                  Create a New Society
                </Link>

              </div>
            </div>
          </div>
          <div className=' mb-4 ml-4'>
            <ImageSlider />
          </div>
        </div>
      </div>

      <div className='bg-slate-100 '>
        <div className='px-32 py-6'>
          <h2 className='text-center text-4xl font-bold mt-7 text-pretty text-gray-600'>Comprehensive Society Management  Features</h2>
          <p className='text-center text-xl mt-4 text-pretty mb-7'>Everything you need to manage your residential community efficiently</p>
          <div className='grid md:grid-cols-3 gap-8 mt-5 mb-2'>
            <div className='bg-white shadow-xl rounded-xl px-7 py-4 min-h-52'>
              <img src='https://www.svgrepo.com/show/533403/calendar-xmark.svg' className='w-10 h-10 ' alt="" />
              <h2 className='text-xl my-2 font-bold'>Bookings</h2>
              <p className='text-lg my-2 '>Easy booking system for community amenities like clubhouse, gym, and party halls.</p>
            </div>
            <div className='bg-white shadow-xl rounded-xl px-7 py-4'>
              <img src='https://www.svgrepo.com/show/532089/bell-alt.svg' className='w-10 h-10 ' alt="" />
              <h2 className='text-xl my-2 font-bold'>Complaint Management</h2>
              <p className='text-lg my-2 '>Track and resolve residents complains efficiently</p>
            </div>
            <div className='bg-white shadow-xl rounded-xl px-7 py-4'>
              <img src='https://www.svgrepo.com/show/263899/announcement-megaphone.svg' className='w-10 h-10 ' alt="" />
              <h2 className='text-xl my-2 font-bold'>Announcements</h2>
              <p className='text-lg my-2 '>Broadcast important announcements and notices to residents instantly</p>
            </div>
            <div className='bg-white shadow-xl rounded-xl px-7 py-4'>
              <img src='https://www.svgrepo.com/show/495139/card-tick.svg' className='w-10 h-10 ' alt="" />
              <h2 className='text-xl my-2 font-bold'>Payments</h2>
              <p className='text-lg my-2 '>Secure payment gateway for maintainance and other charges</p>
            </div>
            <div className='bg-white shadow-xl rounded-xl px-7 py-4'>
              <img src='https://www.svgrepo.com/show/498972/people.svg' className='w-10 h-10 ' alt="" />
              <h2 className='text-xl my-2 font-bold'>Visitors</h2>
              <p className='text-lg my-2 '>Proper management of visitors </p>
            </div>
            <div className='bg-white shadow-xl rounded-xl px-7 py-4'>
              <img src='https://www.svgrepo.com/show/533381/calendar-alt.svg' className='w-10 h-10 ' alt="" />
              <h2 className='text-xl my-2 font-bold'>Event Management</h2>
              <p className='text-lg my-2 '>Organize and manage community events </p>
            </div>
            <div className='bg-white shadow-xl rounded-xl px-7 py-4'>
              <img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-10 h-10 ' alt="" />
              <h2 className='text-xl my-2 font-bold'>Polls</h2>
              <p className='text-lg my-2 '>Know about your residents interests and thinking </p>
            </div>
          </div>
        </div>
      </div>

      <div className=''>
        <div className='px-32 py-6'>
        <h1 className='text-center text-4xl font-bold mt-7 text-pretty text-gray-600'>Why Choose Our Solutions</h1>
        <p className='text-center text-xl mt-4 text-pretty mb-7'>Transform your society management with these key benefits</p>
        <div className='grid md:grid-cols-3 gap-8'>
          <div className='border-2 px-6 py-2 rounded-xl'>
            <div className='flex items-center text-xl'>
            <img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-10 h-10 ' alt="" />
              <h2 className='text-xl my-2 font-bold'>Increased Efficiency </h2>
            </div>
            <div className = 'px-2'>Automate routine tasks and reduce administrative burden with our streamlined digital solutions.</div>
            <ul className='px-5'>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Reduced paperwork</li>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Time-Saving Automation</li>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Streamlined processes</li>
            </ul>
          </div>
          <div className='border-2 px-6 py-2 rounded-xl'>
          <div className='flex items-center text-xl'>
            <img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-10 h-10 ' alt="" />
              <h2 className='text-xl my-2 font-bold'>Increased Efficiency </h2>
            </div>
            <div className='px-2'>Automate routine tasks and reduce administrative burden with our streamlined digital solutions.</div>
            <ul className='px-5'>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Reduced paperwork</li>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Time-Saving Automation</li>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Streamlined processes</li>
            </ul>
          </div>
          <div className='border-2 px-6 py-2 rounded-xl'>
          <div className='flex items-center text-xl'>
            <img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-10 h-10 ' alt="" />
              <h2 className='text-xl my-2 font-bold'>Increased Efficiency</h2>
            </div>
            <div className='px-2'>Automate routine tasks and reduce administrative burden with our streamlined digital solutions.</div>
            <ul className='px-5'>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Reduced paperwork</li>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Time-Saving Automation</li>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Streamlined processes</li>
            </ul>
          </div>
          <div className='border-2 px-6 py-2 rounded-xl'>
          <div className='flex items-center text-xl'>
            <img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-10 h-10 ' alt="" />
              <h2 className='text-xl my-2 font-bold'>Increased Efficiency </h2>
            </div>
            <div className='px-2'>Automate routine tasks and reduce administrative burden with our streamlined digital solutions.</div>
            <ul className='px-5'>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Reduced paperwork</li>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Time-Saving Automation</li>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Streamlined processes</li>
            </ul>
          </div>
          <div className='border-2 px-6 py-2 rounded-xl'>
          <div className='flex items-center text-xl'>
            <img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-10 h-10 ' alt="" />
              <h2 className='text-xl my-2 font-bold'>Increased Efficiency </h2>
            </div>
            <div className='px-2'>Automate routine tasks and reduce administrative burden with our streamlined digital solutions.</div>
            <ul className='px-5'>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Reduced paperwork</li>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Time-Saving Automation</li>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Streamlined processes</li>
            </ul>
          </div>
          <div className='border-2 px-6 py-2 rounded-xl'>
          <div className='flex items-center text-xl'>
            <img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-10 h-10 ' alt="" />
              <h2 className='text-xl my-2 font-bold'>Increased Efficiency </h2>
            </div>
            <div className='px-2'>Automate routine tasks and reduce administrative burden with our streamlined digital solutions.</div>
            <ul className='px-5'>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Reduced paperwork</li>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Time-Saving Automation</li>
              <li className='flex items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Streamlined processes</li>
            </ul>
          </div>
        </div>            
        </div>
      </div>
      <div className='bg-slate-300 p-5'>
        <div className='text-4xl font-bold text-center text-pretty text-gray-600 mb-5 mt-5'>What Our Users Say</div>
        <div className='text-center text-xl mt-4 text-pretty mb-7'>Trusted by residential societies across the country</div>
        <div className='flex flex-wrap gap-10 justify-center items-center mt-12 '>
        <div className='bg-white shadow-md p-8 w-96 rounded-xl min-h-64 relative'>
          <div class="absolute -top-4 left-8">
            <svg class="w-8 h-8 text-[#27AE60]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.70.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003z"></path>
            </svg>
          </div>
            <p className='font-raleway min-h-32'>"The event management feature has brought our community closer. We've seen increased participation in social activities since implementing this system."</p>
            <div className='flex items-center gap-3 mt-3'>
              <img src="https://www.svgrepo.com/show/334183/poll.svg" className='w-8 h-8 ' alt="" />
              <div>
              <h2 className='text-lg font-semibold'>Anita Menon</h2>
            <p className='text-md'>Cultural Secretary</p>
              </div>
            </div> 
          </div>
          <div className='bg-white shadow-md p-8 w-96 rounded-xl min-h-64 relative'>
            <div class="absolute -top-4 left-8">
            <svg class="w-8 h-8 text-[#27AE60]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.70.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003z"></path>
            </svg>
          </div>
            <p className='font-raleway min-h-32'>"The digital payment system has made maintenance fee collection hassle-free. Residents love the convenience, and our accounts are always up to date."</p>
            <div className='flex items-center gap-3 mt-3'>
              <img src="https://www.svgrepo.com/show/334183/poll.svg" className='w-8 h-8 ' alt="" />
              <div>
              <h2 className='text-lg font-semibold'>Sneha Patel</h2>
            <p className='text-md'>Society President</p>
              </div>
            </div> 
          </div>
          <div className='bg-white shadow-md p-8 w-96 rounded-xl min-h-64 relative'>
            <div class="absolute -top-4 left-8">
            <svg class="w-8 h-8 text-[#27AE60]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.70.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003z"></path>
            </svg>
          </div>
            <p className='font-raleway min-h-32'>"The society management system has completely transformed how we handle our community operations. Everything from visitor management to complaints is now streamlined and efficient."</p>
            <div className='flex items-center gap-3 mt-3'>
              <img src="https://www.svgrepo.com/show/334183/poll.svg" className='w-8 h-8 ' alt="" />
              <div>
              <h2 className='text-lg font-semibold'>Rajesh Kumar</h2>
            <p className='text-md'>Treasurer</p>
              </div>
            </div> 
          </div>

        </div>
        <div className='text-center mt-10'>
          <button className='bg-green-400 rounded-lg p-4 text-md  hover:bg-green-500 hover:text-lg'>View more testimonials</button>
        </div>
      </div>
      <div className='bg-white p-7 '>
        <div className='text-6xl text-center text-pretty mb-7 mt-7'>Get in touch with us</div>
        <div className='text-4xl text-pretty text-center mb-7'>have questions? we will love to answer that!</div>
        <div className='flex gap-10 justify-center items-center'>
          <div className="bg-white shadow-black shadow-md rounded-xl p-8 animate__animated animate__fadeInLeft">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">First Name</label>
                  <input type="text" className="w-full bg-white border rounded-lg px-4 py-2 text-gray-600  focus:border-[#27AE60]" placeholder="Enter first name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Last Name</label>
                  <input type="text" className="w-full bg-white border rounded-lg px-4 py-2 text-gray-600 foc focus:border-[#27AE60]" placeholder="Enter last name" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Email Address</label>
                <input type="email" className="w-full bg-white border  rounded-lg px-4 py-2 text-gray-600 focus:outline-none " placeholder="Enter email address" />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Society Name</label>
                <input type="text" className="w-full bg-white border rounded-lg px-4 py-2 text-gray-600 foc focus:border-[#27AE60]" placeholder="Enter society name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Message</label>
                <textarea rows="4" className="w-full bg-white border rounded-lg px-4 py-2 text-gray-600  focus:border-[#27AE60]" placeholder="Your message..."></textarea>
              </div>

              <button className="w-full bg-[#27AE60] text-black rounded-lg py-3 font-medium hover:bg-[#219652] transition-colors" fdprocessedid="qhxte">
                Send Message
              </button>
            </form>
          </div>
          <div>
            <div className="max-w-md p-6 bg-white  text-black rounded-lg shadow-md shadow-black">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

              <div className="space-y-4">

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center  rounded-lg">
                    <img src="https://www.svgrepo.com/show/533288/phone-incoming.svg" className='h-10 w-10' alt="" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-400">+91 123 456 7890</p>
                  </div>
                </div>


                <div class="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                    <img className='h-10 w-10' src="https://www.svgrepo.com/show/511917/email-1572.svg" alt="" />
                  </div>
                  <div>
                    <p class="font-medium">Email</p>
                    <p class="text-gray-400">support@societyos.com</p>
                  </div>
                </div>


                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 flex items-center justify-center  rounded-lg">
                    <img className='h-10 w-10' src="https://www.svgrepo.com/show/493957/address.svg" alt="" />
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-400">
                      123 Tech Park, Silicon Valley
                      Bangalore, Karnataka 560001
                    </p>
                  </div>
                </div>
              </div>

            </div>
            <div className="bg-white shadow-md shadow-black mt-10 rounded-xl p-8">
              <h3 className="text-xl font-bold text-black mb-6">Business Hours</h3>
              <div className="space-y-2">
                <p className="text-black">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-black">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="text-black">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-neutral-700">

            <div>
              <h3 className="text-xl font-bold text-black mb-4">Society OS</h3>
              <p className="text-black mb-6">Smart solutions for modern residential societies.</p>
              <div className="flex space-x-4">
                <a href="" className="text-black hover:text-[#27AE60]">
                  <span className="sr-only">Facebook</span>
                  <img className='h-10 w-10' src="https://www.svgrepo.com/show/521654/facebook.svg" alt="" />
                </a>
                <a href="" className="text-black hover:text-[#27AE60]">
                  <span className="sr-only">Twitter</span>
                  <img className='h-10 w-10' src="https://www.svgrepo.com/show/521900/twitter.svg" alt="" />
                </a>
                <a href="" className="text-gray-400 hover:text-[#27AE60]">
                  <span className="sr-only">LinkedIn</span>
                  <img className='h-10 w-10' src="https://www.svgrepo.com/show/458756/insta.svg" alt="" />
                </a>
              </div>
            </div>


            <div>
              <h3 className="text-black font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
              </ul>
            </div>


            <div>
              <h3 class="text-black font-semibold mb-4">Features</h3>
              <ul class="space-y-3">
                <li><a href="/visitor" className="text-black hover:text-[#27AE60] transition-colors">Visitor Management</a></li>
                <li><a href="/complaint" className="text-black hover:text-[#27AE60] transition-colors">Complaint System</a></li>
                <li><a href="/booking" className="text-black hover:text-[#27AE60] transition-colors">Facility Booking</a></li>
                <li><a href="/event" className="text-black hover:text-[#27AE60] transition-colors">Event Management</a></li>
                <li><a href="/payment" className="text-black hover:text-[#27AE60] transition-colors">Payment Gateway</a></li>
                <li><a href="/poll" className="text-black hover:text-[#27AE60] transition-colors">Polls</a></li>
              </ul>
            </div>


            <div>
              <h3 className="text-black font-semibold mb-4">Legal</h3>
              <ul Name="space-y-3">
              </ul>
            </div>
          </div>

          <div className="pt-8 text-center">
            <p className="text-black">© 2024 Society OS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default OrgLanding
