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
    <div className='bg-white h-screen w-dvh font-raleway '>
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

        <div className=' h-3/4 w-[80%] flex '>
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

{/* Second part  */}
      <div className='text-gray-200 bg-[rgb(88,123,193)]'>
        <div className='px-32 py-6'>
          <h2 className='text-center text-4xl font-bold mt-7 text-pretty'>Comprehensive Society Management  Features</h2>
          <p className='text-center text-xl mt-4 text-pretty mb-7'>Everything you need to manage your residential community efficiently</p>
          <div className='grid md:grid-cols-3 gap-8 mt-5 mb-2 text-black'>
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
              <h2 className='text-xl my-2 font-bold'>Events & Announcements</h2>
              <p className='text-lg my-2 '> Organize and manage community events . Broadcast important announcements and notices to residents instantly</p>
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
              <img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-10 h-10 ' alt="" />
              <h2 className='text-xl my-2 font-bold'>Polls</h2>
              <p className='text-lg my-2 '>Know about your residents interests and thinking </p>
            </div>
          </div>
        </div>
      </div>

{/* Third part */}
      <div className='pb-12'>
        <div className='px-32 py-6'>
        <h1 className='text-center text-4xl font-bold mt-7 text-pretty text-gray-600'>Why Choose Our Solutions</h1>
        <p className='text-center text-xl mt-4 text-pretty mb-7'>Transform your society management with these key benefits</p>
        <div className='grid md:grid-cols-3 gap-8'>
          <div className='border-2 px-6 py-2 rounded-xl flex gap-2 items-start'>
            <img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-10 h-10 ' alt="" />
            <div>
              <h2 className='text-xl my-2 font-bold'>Increased Efficiency </h2>
            <div className = ''>Automate routine tasks and reduce administrative burden with our streamlined digital solutions.</div>
            <ul className='flex flex-col gap-3 pb-4'>
              <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Reduced paperwork</li>
              <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Time-Saving Automation</li>
              <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Digital payments</li>
            </ul>
            </ div>
          </div>
          <div className='border-2 px-6 py-2 rounded-xl flex items-start'>
          <svg fill="#ffffff" height="50px" width="80px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-57.85 -57.85 329.97 329.97" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-57.85" y="-57.85" width="329.97" height="329.97" rx="49.4955" fill="#2563eb" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M196.926,55.171c-0.11-5.785-0.215-11.25-0.215-16.537c0-4.142-3.357-7.5-7.5-7.5c-32.075,0-56.496-9.218-76.852-29.01 c-2.912-2.832-7.546-2.831-10.457,0c-20.354,19.792-44.771,29.01-76.844,29.01c-4.142,0-7.5,3.358-7.5,7.5 c0,5.288-0.104,10.755-0.215,16.541c-1.028,53.836-2.436,127.567,87.331,158.682c0.796,0.276,1.626,0.414,2.456,0.414 c0.83,0,1.661-0.138,2.456-0.414C199.36,182.741,197.954,109.008,196.926,55.171z M107.131,198.812 c-76.987-27.967-75.823-89.232-74.79-143.351c0.062-3.248,0.122-6.396,0.164-9.482c30.04-1.268,54.062-10.371,74.626-28.285 c20.566,17.914,44.592,27.018,74.634,28.285c0.042,3.085,0.102,6.231,0.164,9.477C182.961,109.577,184.124,170.844,107.131,198.812 z"></path> <path d="M132.958,81.082l-36.199,36.197l-15.447-15.447c-2.929-2.928-7.678-2.928-10.606,0c-2.929,2.93-2.929,7.678,0,10.607 l20.75,20.75c1.464,1.464,3.384,2.196,5.303,2.196c1.919,0,3.839-0.732,5.303-2.196l41.501-41.5 c2.93-2.929,2.93-7.678,0.001-10.606C140.636,78.154,135.887,78.153,132.958,81.082z"></path> </g> </g></svg>
            <div>
              <h2 className='text-xl my-2 font-bold'>Enhanced Security</h2>
            <div className = ''>Robust security features to protect your community and manage access control effectively.</div>
            <ul className='flex flex-col gap-3 pb-4'>
              <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Digital visitor tracking</li>
              <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Emergency response system</li>
              <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Community forums</li>
            </ul>
            </ div>
          </div>
          <div className='border-2 px-6 py-2 rounded-xl flex items-start'>
          <svg viewBox="-5.4 -5.4 30.80 30.80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-5.4" y="-5.4" width="30.80" height="30.80" rx="4.0040000000000004" fill="#2563eb" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>communication / 8 - communication, account, profile, person, user icon</title> <g id="Free-Icons" stroke-width="1.7600000000000002" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"> <g transform="translate(-1265.000000, -82.000000)" id="Group" stroke="#ffffff" stroke-width="1.7600000000000002"> <g transform="translate(1263.000000, 80.000000)" id="Shape"> <path d="M12,13 C9.23857625,13 7,10.7614237 7,8 C7,5.23857625 9.23857625,3 12,3 C14.7614237,3 17,5.23857625 17,8 C17,10.7614237 14.7614237,13 12,13 Z M12,16 C17.1428571,16 20.1428571,17.6666667 21,21 L3,21 C3.85714286,17.6666667 6.85714286,16 12,16 Z"> </path> </g> </g> </g> </g></svg>
            <div>
              <h2 className='text-xl my-2 font-bold'>Better Communication</h2>
            <div className = ''>Foster community engagement with integrated communication tools.</div>
            <ul className='flex flex-col gap-3 pb-4'>
              <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Real-time notifications</li>
              <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Event announcements</li>
              <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt = "" />Conduct transparent society elections</li>
            </ul>
            </ div>
          </div>
        </div>            
        </div>
      </div>

{/* Fourth part  */}
      <div className='px-32 py-20 mb-4 bg-[rgb(88,123,193)] min-h-screen text-gray-200'>
        <h1 className='text-center font-bold text-4xl'>Simple & Transparent Pricing</h1>
        <h2 className='text-center text-xl mt-4 text-pretty mb-20'>Choose the perfect plan for you </h2>
        <div className='flex gap-8 justify-center'>
        <div className='border-2 px-14 py-2 min-h-96 rounded-xl '>
          <h2 className='text-center font-bold text-2xl py-4'>Basic</h2>
          <div className='text-center text-5xl font-bold pb-4'>₹999<span className='text-xl font-semibold'>/month</span></div>
          <div className='text-center pb-4'>Perfect for small societies</div>
          <ul className='flex flex-col gap-3 pb-4'>
            <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Visitor Management</li>
            <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Complaint Management</li>
            <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Basic Announcements</li>
            <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />5GB Storage</li>
          </ul>
          <button className='px-5 py-3 w-full bg-blue-600 text-white rounded-lg mb-4 '>Get Started</button>
        </div>
        <div className='border-2 px-14 py-2 min-h-96 rounded-xl'>
          <h2 className='text-center font-bold text-2xl py-4'>Pro</h2>
          <div className='text-5xl font-bold pb-4'>₹1999<span className='text-xl font-semibold'>/month</span></div>
          <div className='text-center pb-4'>Ideal for medium societies</div>
          <ul className='flex flex-col gap-3 pb-4'>
            <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Everything in Basic</li>
            <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Facility Booking</li>
            <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Event Management</li>
            <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Payment Gateway</li>
            <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />20GB Storage</li>
          </ul>
          <button className='px-5 py-3 w-full bg-blue-600 text-white rounded-lg mb-4  '>Get Started</button>
        </div>
        <div className='border-2 px-14 py-2 min-h-96 rounded-xl'>
          <h2 className='text-center font-bold text-2xl py-4'>Enterprise</h2>
          <div className='text-5xl font-bold pb-4'>₹2999<span className='text-xl font-semibold'>/month</span></div>
          <div className='text-center pb-4'>For large societies</div>
          <ul className='flex flex-col gap-3 pb-4'>
            <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Everything in Pro</li>
            <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Advanced Analytics</li>
            <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />24/7 Support</li>
            <li className='flex gap-1 items-center'><img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-5 h-5' alt="" />Unlimited Storage</li>
          </ul>
          <button className='px-5 py-3 w-full bg-blue-600 text-white rounded-lg mb-4 '>Get Started</button>
        </div>
        </div>
      </div >

{/* Fifth part */}
      <div className=' p-5'>
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

      {/* Sixth part */}
      <div className="bg-[url(/bgSociety.png)]">

      
      <div className='bg-[rgb(88,123,193)] p-7 text-gray-200 '>
        <div className='text-center font-bold text-4xl'>Get in touch with us</div>
        <div className='text-center text-xl mt-4 text-pretty mb-20'>Have questions? We'd love to answer that!</div>
        <div className='flex gap-10 justify-center items-center'>
          <div className="shadow-black shadow-md rounded-xl p-8 bg-gray-200">
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
            <div className="max-w-md p-6 bg-gray-200  text-black rounded-lg shadow-md shadow-black">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

              <div className="space-y-4">

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center  rounded-lg">
                    <img src="https://www.svgrepo.com/show/533288/phone-incoming.svg" className='h-7 w-7' alt="" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-400">+91 123 456 7890</p>
                  </div>
                </div>


                <div class="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                    <img className='h-7 w-7' src="https://www.svgrepo.com/show/511917/email-1572.svg" alt="" />
                  </div>
                  <div>
                    <p class="font-medium">Email</p>
                    <p class="text-gray-400">support@societyos.com</p>
                  </div>
                </div>


                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 flex items-center justify-center  rounded-lg">
                    <img className='h-7 w-7' src="https://www.svgrepo.com/show/493957/address.svg" alt="" />
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
            <div className="bg-gray-200 shadow-md shadow-black mt-10 rounded-xl p-8">
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
      
      <div className="pt-16 pb-8 bg-[rgb(57,77,105)] text-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-3 gap-8 pb-12 border-b border-neutral-700 text-center md:text-left">
  
      <div className="flex flex-col items-center md:items-start">
        <h3 className="text-xl font-bold mb-4">ResiHub</h3>
        <p className="mb-6 text-gray-400 max-w-sm">
          We are a dedicated platform designed to streamline society management, helping residents 
          with communication, maintenance requests, and community engagement. Our goal is to make 
          society living hassle-free and organized.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-[#27AE60]">
            <img className='h-8 w-8' src="https://www.svgrepo.com/show/521654/facebook.svg" alt="Facebook" />
          </a>
          <a href="#" className="hover:text-[#27AE60]">
            <img className='h-8 w-8' src="https://www.svgrepo.com/show/521900/twitter.svg" alt="Twitter" />
          </a>
          <a href="#" className="hover:text-[#27AE60]">
            <img className='h-8 w-8' src="https://www.svgrepo.com/show/458756/insta.svg" alt="Instagram" />
          </a>
        </div>
      </div>


      <div className="flex flex-col items-center">
        <h3 className="font-semibold mb-4">Quick Links</h3>
        <ul className="space-y-3">
          <li><a href="/visitor" className="hover:text-[#27AE60] transition-colors">Visitor Management</a></li>
          <li><a href="/complaint" className="hover:text-[#27AE60] transition-colors">Complaint System</a></li>
          <li><a href="/booking" className="hover:text-[#27AE60] transition-colors">Facility Booking</a></li>
          <li><a href="/event" className="hover:text-[#27AE60] transition-colors">Event Management</a></li>
          <li><a href="/payment" className="hover:text-[#27AE60] transition-colors">Payment Gateway</a></li>
          <li><a href="/poll" className="hover:text-[#27AE60] transition-colors">Polls</a></li>
        </ul>
      </div>


      <div className="flex flex-col items-center md:items-start">
        <h3 className="font-semibold mb-4">Legal</h3>
        <ul className="space-y-3">
          <li><a href="#" className="hover:text-[#27AE60]">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-[#27AE60]">Terms of Service</a></li>
          <li><a href="#" className="hover:text-[#27AE60]">Contact</a></li>
        </ul>
      </div>
    </div>


    <div className="pt-8 text-center">
      <p className="text-gray-400">© 2025 ResiHub. All rights reserved.</p>
    </div>
  </div>
</div>

      </div>
    </div>
  )
}

export default OrgLanding
