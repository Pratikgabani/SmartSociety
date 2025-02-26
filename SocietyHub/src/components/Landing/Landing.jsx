


import React, { useState, useEffect } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropdown from '../Dropdown';
import ImageSlider from '../ImgSlider/ImgSlider';
import { SplitText } from '../ReactBit/SplitText';
import tickMark from './../../assets/Group92.png';
import communityBuiild from './../../assets/communityBuild.png';
import transparency from './../../assets/transparency.png';
import support from './../../assets/support.png';
import betterCommunication from './../../assets/betterCommunication.png';
import Userfriendly from './../../assets/Userfriendly.png';

function Landing() {
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
    <div className='min-h-screen bg-[#F5F9FC] flex justify-center border-2 font-raleway'>
      <div className="container w-11/12 border-2 border-black">
        <nav className="text-[18px] border-b border-gray-200 text-white shadow-md mt-3 py-3">
          <div className="container mx-auto flex justify-between items-center px-4">
            <a href="/" className="text-xl font-bold text-black"><img className="h-8" src="#" alt="Resihub" /></a>
            <ul className="flex gap-9 items-center">
              <li className="text-black  hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out ">Home</li>
              <li className="text-black hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out"><Dropdown /></li>
              <li className="text-black hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out">Pricing</li>
              <li className="text-black hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out">About Us</li>
            </ul>
            <div className="space-x-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-transparent text-black text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to={"/login"}
                    className="bg-transparent text-black text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                  >
                    Login
                  </Link>
                  
                </>
              )}
            </div>
          </div>
        </nav>

        <div className='mt-10'>
          <div className='flex justify-between'>
            <div className="ml-10 leftPart">
              <h1 className='text-[48px] font-bold'>Simplify Society Living with</h1>
              <h1 className='text-[#005B96] text-[48px] font-bold '><SplitText text="ResiHub !" className="custom-class" delay={150} /></h1>
              <ul className='flex flex-col gap-3 text-lg'>
                <li className='flex items-center text-[16px] w-[440px] line-height-[10px] '><img src={tickMark} alt="" />Streamline society communication with instant updates and announcements.</li>
                <li className='flex items-center text-[16px] w-[440px] line-height-[10px]'><img src={tickMark} alt="" />Manage finances securely with easy online payment and tracking.</li>
                <li className='flex items-center text-[16px] w-[440px]'><img src={tickMark} alt="" />Organize and optimize resources efficiently in one centralized system.</li>
                <li className='flex items-center text-[16px] w-[440px]'><img src={tickMark} alt="" />Simplify everyday management tasks with automation and user-friendly tools.</li>
                <li className='pt-9'>
                  <a href='#' className='text-black text-xl font-semibold cursor-pointer border transition ease-in-out duration-300 border-black py-[14px] px-4 rounded-full hover:bg-[#005B96] hover:text-white'>Let's explore</a>
                </li>
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
              </ul>
            </div>

            <div className="rightPart mr-10">
              <ImageSlider />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-[68px] bg-[#F5F9FC] border-none">
            <div className="p-8 rounded-lg max-w-lg text-center">
              <h1 className="text-5xl font-bold mb-4">Why <span className="text-[#005B96]">ResiHub</span>?</h1>
              <ul className="text-left space-y-4 mt-7">
                <li><span className="font-semibold text-xl"><img className='w-16' src={communityBuiild} alt="" />Better Communication:</span></li>
                <li><span className="font-semibold text-xl"><img className='w-16' src={transparency} alt="" />Transparency: Track finances and records in real time.</span></li>
                <li><span className="font-semibold text-xl"><img className='w-16' src={support} alt="" />24/7 Support: Save time with automation of daily tasks.</span></li>
                <li><span className="font-semibold text-xl"><img className='w-16' src={betterCommunication} alt="" />Community Building: Create a strong sense of belonging with engaging tools and features.</span></li>
                <li><span className='font-semibold text-xl'><img className='w-16' src={Userfriendly} alt="" />User-Friendly Interface:</span></li>
              </ul>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center mt-10'>
            <h1 className='text-[48px] font-bold'>About us</h1>
            <p className='text-[16px] w-[740px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta explicabo distinctio saepe nobis facere alias iusto quasi reprehenderit ullam necessitatibus officia optio dolore possimus error tempore, soluta iure accusamus enim veritatis qui sapiente architecto. Quidem architecto voluptate vero dolorum inventore!</p>
          </div>
        </div>
      </div>
                  
      <div>
                <h1 className='text-center text-4xl  text-pretty text-gray-600'>Why Choose Our Solution ? </h1>
            <h2 className='text-center text-2xl mt-4 text-pretty'>Transform your society management with these key benefits</h2>

            <div>
                <div className='border-2  flex items-center'>
                    <img className='w-5 h-5' src="https://www.svgrepo.com/show/533381/calendar-alt.svg" alt="" />
                    <div>
                        <h1 className='text-xl'>Increased Efficiency</h1>
                        <p>Automate routine tasks and reduce administrative burden with our streamlined digital solutions</p>
                        <ul>
                            <li>Reduced paperwork</li>
                            <li>Time-saving automation</li>
                            <li>Streamlined processes</li>
                        </ul>
                    </div>
                </div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            </div>
                <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <svg class="w-12 h-12" fill="none" stroke="#a855f7" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <svg class="w-12 h-12" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              
           
    </div>
  )
}

export default Landing;

