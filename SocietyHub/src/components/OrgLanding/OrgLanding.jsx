import React from 'react'
import ImageSlider from '../ImgSlider/ImgSlider';
import { useState,useEffect } from 'react';
import {Link,useNavigate} from "react-router-dom"
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
        <div className='bg-white h-screen w-dvh'>
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
                                                  !token &&  <Link to = "/register" className="bg-blue-500 text-white text-lg px-6 py-3 rounded-md mb-2 hover:bg-blue-600">
                                                  Join an Existing Society
                                                </Link>
                                                 }
                                                </div>
                                                
                                                <div className="flex flex-col items-center">
                                                  <Link to = "/SocietyDetails"  className="bg-green-500 text-white text-lg px-6 py-3 rounded-md mb-2 hover:bg-green-600" >
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
            <div className='bg-slate-100  p-5 '>
                <h2 className='text-center text-5xl mt-7 text-pretty text-gray-600'>Comprehensive society management system features</h2>
                <p className='text-center text-4xl mt-4 text-pretty mb-7'>Everything you need to manage your residential community efficiently</p>
                <div className='grid md:grid-cols-3 gap-8 mt-5 mb-2'>
                    <div className='bg-white shadow-md rounded-md p-5'>
                        <img src='https://www.svgrepo.com/show/533403/calendar-xmark.svg' className='w-10 h-10 ' alt="" />
                        <h2 className='text-3xl my-2'>Bookings</h2>
                        <p className='text-lg my-2'>Easy booking system for community amenities like community hall,swimming pool,lawn etc.</p>
                    </div>
                    <div className='bg-white shadow-md  rounded-md p-5'>
                        <img src='https://www.svgrepo.com/show/532089/bell-alt.svg' className='w-10 h-10 ' alt="" />
                        <h2 className='text-3xl my-2'>Complains</h2>
                        <p className='text-lg my-2'>Track and resolve residents complains efficiently</p>
                    </div>
                    <div className='bg-white shadow-md rounded-md p-5'>
                        <img src='https://www.svgrepo.com/show/263899/announcement-megaphone.svg' className='w-10 h-10 ' alt="" />
                        <h2 className='text-3xl my-2'>Announcements</h2>
                        <p className='text-lg my-2'>Broadcast important announcements and notices to residents instantly</p>
                    </div>
                    <div className='bg-white shadow-md rounded-md p-5'>
                        <img src='https://www.svgrepo.com/show/495139/card-tick.svg' className='w-10 h-10 ' alt="" />
                        <h2 className='text-3xl my-2'>Payments</h2>
                        <p className='text-lg my-2'>Secure paymnet gateway for maintainance and other charges</p>
                    </div>
                    <div className='bg-white shadow-md rounded-md p-5'>
                        <img src='https://www.svgrepo.com/show/498972/people.svg' className='w-10 h-10 ' alt="" />
                        <h2 className='text-3xl my-2'>Visitors</h2>
                        <p className='text-lg my-2'>Proper management of visitors </p>
                    </div>
                    <div className='bg-white shadow-md rounded-md p-5'>
                        <img src='https://www.svgrepo.com/show/533381/calendar-alt.svg' className='w-10 h-10 ' alt="" />
                        <h2 className='text-3xl my-2'>Events</h2>
                        <p className='text-lg my-2'>Organize and manage community events </p>
                    </div>
                    <div className='bg-white shadow-md rounded-md p-5'>
                        <img src='https://www.svgrepo.com/show/334183/poll.svg' className='w-10 h-10 ' alt="" />
                        <h2 className='text-3xl my-2'>Polls</h2>
                        <p className='text-lg my-2'>know about your residents interests and thinking </p>
                    </div>
                </div>
            </div>
            <div className='bg-slate-300 p-5'>
                <div className='text-7xl text-center text-pretty text-gray-600 mb-5 mt-5'>What our Users say</div>
                <div className='text-4xl text-center text-pretty text-gray-600 mt-4'>Trust by residential societies all over the country</div>
                <div className='flex flex-wrap gap-10 justify-center items-center mt-12 '>
                    <div className='bg-white shadow-md rounded p-8 w-80 '>
                        <p className='font-raleway'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe ex eum adipisci animi quo odio consectetur eveniet nobis, ut distinctio?</p>
                        <h2 className='text-2xl font-semibold'>Saras tapore</h2>
                        <p className='text-lg font-semibold'>Lorem, ipsum dolor.</p>
                    </div>
                    <div className='bg-white shadow-md rounded p-8 w-80'>
                        <p className='font-raleway'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe ex eum adipisci animi quo odio consectetur eveniet nobis, ut distinctio?</p>
                        <h2 className='text-2xl font-semibold'>Saras tapore</h2>
                        <p className='text-lg font-semibold'>Lorem, ipsum dolor.</p>
                    </div>
                    <div className='bg-white shadow-md rounded p-8 w-80'>
                        <p className='font-raleway'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe ex eum adipisci animi quo odio consectetur eveniet nobis, ut distinctio?</p>
                        <h2 className='text-2xl font-semibold'>Saras tapore</h2>
                        <p className='text-lg font-semibold'>Lorem, ipsum dolor.</p>
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
            <footer  className="bg-gray-200 pt-16 pb-8">
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
