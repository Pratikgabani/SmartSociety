import React from 'react'
import ImageSlider from '../ImgSlider/ImgSlider';

function OrgLanding() {
    return (
        <div className='bg-white h-screen w-dvh'>
            <div className=' h-6/7 w-dvh flex flex-col justify-center items-center '>
                <div className=' mb-2 h-1/6 w-[80%] text-4xl text-blue-400 font-raleway mt-7 ml-12'>ResiHub</div>
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
                        <div className='  flex justify-center gap-10 items-center mb-7 '>
                            <a href="#contact" class="px-8 py-3 bg-[#27AE60] text-gray-600 rounded-lg hover:bg-[#219652] transition-colors font-medium">
                                Get Started
                            </a>
                            <a href="#features" class="px-8 py-3 border-2 border-[#27AE60] text-[#27AE60] rounded-lg hover:bg-[#27AE60] hover:text-gray-600 transition-colors font-medium">
                                Learn More
                            </a>
                        </div>
                    </div>
                    <div className=' mb-4 ml-4'>
                        <ImageSlider />
                    </div>
                </div>
            </div>
            <div className='bg-slate-100  p-5 w-dvh'>
                <h2 className='text-center text-4xl  text-pretty text-gray-600'>Comprehensive society management system features</h2>
                <p className='text-center text-2xl mt-4 text-pretty'>Everything you need to manage your residential community efficiently</p>
                <div className='grid md:grid-cols-3 gap-8 mt-5 mb-2'>
                    <div className='bg-white shadow-md rounded-md p-5'>
                        <img src='https://www.svgrepo.com/show/533403/calendar-xmark.svg' className='w-10 h-10 ' alt="" />
                        <h2 className='text-3xl my-2'>Bookings</h2>
                        <p className='text-lg my-2'>Easy booking system for community amenities like community hall,swimming pool,lawn etc.</p>
                    </div>
                    <div className='bg-white shadow-md rounded-md p-5'>
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
                </div>
            </div>
            <div className='text-4xl text-gray-600 text-center mt-4'>Seamless facility booking system</div>
            <h2 className='text-2xl text-slate-800 text-center mt-3'>Book community facilities with just some clicks</h2>
            <div className='bg-white flex gap-10'>
                <div className=''>
                 <div className='h- bg-gray-400'>

                 </div>
                 <div></div>
                 <div></div>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}

export default OrgLanding
