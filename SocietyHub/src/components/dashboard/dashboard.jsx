import React from 'react'

// function dashboard() {
//   return (
//     <div className='flex'>
//         <div className='h-screen w-64 bg-slate-500'>
//             <div className='text-3xl ml-5 mt-5 font-medium position-relative text-black'>Resident management</div>
//             <div className='flex mt-12 ml-2 mr-2 p-2.5 rounded-md gap-3 hover:bg-slate-700'>
//                 <img className='h-7 w-7' src="https://www.svgrepo.com/show/535439/home-1.svg" alt="" />
//                 <div className='text-xl font-medium'>Dashboard</div>
//             </div>
//             <div onClick={} className='flex mt-2  ml-2 mr-2 p-2.5 rounded-md gap-3  hover:bg-slate-700'>
//                 <img className='h-7 w-7' src="https://www.svgrepo.com/show/533403/calendar-xmark.svg" alt="" />
//                 <div className='text-xl font-medium'>Bookings</div>
//             </div>
//             <div className='flex mt-2  ml-2 mr-2 p-2.5 rounded-md gap-3 hover:bg-slate-700'>
//                 <img className='h-7 w-7' src="https://www.svgrepo.com/show/533381/calendar-alt.svg" alt="" />
//                 <div className='text-xl font-medium'>Events</div>
//             </div>
//             <div className='flex mt-2  ml-2 mr-2 p-2.5 rounded-md gap-3 hover:bg-slate-700'>
//                 <img className='h-7 w-7' src="https://www.svgrepo.com/show/263899/announcement-megaphone.svg" alt="" />
//                 <div className='text-xl font-medium'>Notices</div>
//             </div>
//             <div className='flex mt-2  ml-2 mr-2 p-2.5 rounded-md gap-3 hover:bg-slate-700'>
//                 <img className='h-7 w-7' src="https://www.svgrepo.com/show/498972/people.svg" alt="" />
//                 <div className='text-xl font-medium'>Visitors</div>
//             </div>
//             <div className='flex mt-2  ml-2 mr-2 p-2.5 rounded-md gap-3 hover:bg-slate-700'>
//                 <img className='h-7 w-7' src="https://www.svgrepo.com/show/495139/card-tick.svg" alt="" />
//                 <div className='text-xl font-medium'>Payment</div>
//             </div>
//             <div className='flex mt-2  ml-2 mr-2 p-2.5 rounded-md gap-3 hover:bg-slate-700'>
//                 <img className='h-7 w-7' src="https://www.svgrepo.com/show/334183/poll.svg" alt="" />
//                 <div className='text-xl font-medium'>Polls</div>
//             </div>
//         </div>
//         <div >
//             helo
//         </div>
//     </div>
//   )
// }


import { useState } from "react";

function dashboard() {
    

    return (
        <div >
            {/* <div className="h-screen w-64 bg-gray-800 text-white p-4">
                <h2 className="text-3xl font-bold mb-4">Resident Management</h2>
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item}
                            onClick={() => setActiveTab(item)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${activeTab === item
                                ? "bg-gray-600 text-yellow-300" // Active tab color
                                : "hover:bg-gray-700"
                                }`}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div> */}
            <div className='p-5'>
                <div className='font-bold text-3xl'>Dashboard</div>
                <p className=' text-xl mt-3'>Welcome to your resident management system</p>
                <div className='grid md:grid-cols-3 sm:grid-cols-2 gap-8'>

                    <div className='mt-8 relative bg-slate-100 rounded-md p-2'>
                        <span className='mr-20 ml-3 absolute top-3 left-3 font-medium'>Visitor Management</span>
                        <span className='rounded-lg absolute top-3 right-3 bg-green-500 px-2 py-0.5'>5 today</span>
                        <ul>
                            <li className='flex gap-2 p-2 mt-16 mx-5 bg-slate-300 rounded-md hover:bg-white'>
                                <img className='h-8 w-8 ml-2' src="https://www.svgrepo.com/show/506667/person.svg" alt="" />
                                <div>
                                    <div className='text-balance font-semibold'>John doe</div>
                                    <div>Arrived at 5:30 - flat 101</div>
                                </div>
                            </li>
                            <li className='flex gap-2 p-2 mt-1 mx-5 bg-slate-300 rounded-md hover:bg-white'>
                                <img className='h-8 w-8 ml-2' src="https://www.svgrepo.com/show/506667/person.svg" alt="" />
                                <div>
                                    <div className='text-balance font-semibold'>Smarth patel</div>
                                    <div>Arrived at 5:30 - flat 101</div>
                                </div>
                            </li>

                        </ul>
                        <div className='flex gap-2 justify-center items-center mt-4'>
                            <a href='#' className='text-center font-semibold text-blue-500'>view all Visitors</a>
                            <img className='h-7 w-7 ' src="https://www.svgrepo.com/show/459575/right-arrow.svg" alt="" />
                        </div>
                    </div>
                    <div className='mt-8 bg-slate-100 relative rounded-md p-2'>
                        <span className='mr-20 ml-3 absolute top-3 left-3 font-medium'>Payments</span>
                        <span className='rounded-lg px-2 absolute right-3 top-3 ml-7 py-0.5 bg-red-400'>80% collected</span>
                        <div className='relative p-1 mt-16 justify-between  rounded-md'>
                            <span>maintainance due</span>
                            <span className='text-black absolute right-3 font-medium'>₹500</span>
                        </div>
                        <div className='relative  p-1  justify-between  rounded-md'>
                            <span>collected</span>
                            <span className='text-green-500 absolute right-3 font-medium'>₹300</span>
                        </div>
                        <div className='flex items-center justify-center mt-4'>
                            <div className='text-center font-semibold text-blue-500'>Manage payments</div>
                            <img className='h-7 w-7' src="https://www.svgrepo.com/show/459575/right-arrow.svg" alt="" />
                        </div>
                    </div>
                    <div className='mt-8 bg-slate-100 relative rounded-md p-2'>
                        <span className='mr-20 ml-3 absolute top-3 left-3 font-medium'>Complains</span>
                        <span className='rounded-lg absolute top-3 right-3 px-2 ml-7 py-0.5 bg-red-400'>1 Unresolved</span>
                        <ul>
                            <li className=' p-2 w-80 mt-16 mx-5 relative bg-slate-300 rounded-md hover:bg-white'>
                                <div>
                                    <div className='text-balance font-semibold'>Smarth patel</div>
                                    <div>Arrived at 5:30 - flat 101</div>
                                </div>
                                <div className='rounded-lg absolute top-3 right-3 px-2 py-0.5  bg-red-400'>
                                    InProgress
                                </div>
                            </li>
                            <li className=' p-2 mt-1 mx-5 relative bg-slate-300 rounded-md hover:bg-white'>

                                <div>
                                    <div className='text-balance font-semibold'>Smarth patel</div>
                                    <div>Arrived at 5:30 - flat 101</div>
                                </div>
                                <div className='rounded-lg absolute top-3 right-3 px-2 py-0.5  bg-red-400'>Inprending</div>
                            </li>
                        </ul>
                        <div className='flex items-center justify-center mt-4'>
                            <div className='text-center font-semibold text-blue-500'>See all complains</div>
                            <img className='h-7 w-7' src="https://www.svgrepo.com/show/459575/right-arrow.svg" alt="" />
                        </div>
                    </div>
                    <div className='mt-8 bg-slate-100 relative rounded-md p-2'>
                        <span className='mr-20 ml-3 absolute top-3 left-3 font-medium'>Upcoming Events</span>
                        <span className='rounded-lg absolute top-3 right-3 px-2 ml-7 py-0.5 bg-red-400'>2 this week</span>
                        <ul>
                            <li className=' p-2 w-80 mt-16 mx-5 relative bg-slate-300 rounded-md hover:bg-white'>

                                <div className='text-balance font-semibold'>diwali Celebration</div>
                                <div>October 13,2024 - 5:30pm</div>
                                <div >
                                    InProgress
                                </div>
                            </li>
                            <li className=' p-2 mt-1 mx-5 relative bg-slate-300 rounded-md hover:bg-white'>


                                <div className='text-balance font-semibold'>annual Meeting</div>
                                <div>October 13,2024 - 5:30pm</div>

                                <div >Inprending</div>
                            </li>
                        </ul>
                        <div className='flex gap-2 justify-center items-center mt-4'>
                            <a href='#' className='text-center font-semibold text-blue-500'>view all events</a>
                            <img className='h-7 w-7 ' src="https://www.svgrepo.com/show/459575/right-arrow.svg" alt="" />
                        </div>
                    </div>
                    <div className='mt-8 bg-slate-100 relative rounded-md p-2'>
                        <span className='mr-20 ml-3 absolute top-3 left-3 font-medium'>Active Polls </span>
                        <span className='rounded-lg absolute top-3 right-3 px-2 ml-7 py-0.5 bg-red-400'>2 Poll</span>
                        <ul>
                            <li className=' p-2 w-80 mt-16 mx-5 relative bg-slate-300 rounded-md hover:bg-white'>

                                <div className='text-balance font-semibold'>diwali Celebration</div>
                                <div>October 13,2024 - 5:30pm</div>
                                <div className='relative' >
                                    <span className='text-green-500 '>your votes :45</span>
                                    <span className='absolute font-semibold right-1 bottom-1 text-purple-500'>total : 100</span>
                                </div>
                            </li>
                            <li className=' p-2 mt-1 mx-5 relative bg-slate-300 rounded-md hover:bg-white'>


                                <div className='text-balance font-semibold'>annual Meeting</div>
                                <div>October 13,2024 - 5:30pm</div>

                                <div className='relative' >
                                    <span className='text-green-500 font-semibold'>your votes :45</span>
                                    <span className='absolute font-semibold right-1 bottom-1 text-purple-500'>total : 100</span>
                                </div>
                            </li>
                        </ul>
                        <div className='flex gap-2 justify-center items-center mt-4'>
                            <a href='#' className='text-center font-semibold text-blue-500'>view all Polls</a>
                            <img className='h-7 w-7 ' src="https://www.svgrepo.com/show/459575/right-arrow.svg" alt="" />
                        </div>
                    </div>
                    <div className='mt-8 relative bg-slate-100 rounded-md p-2'>
                        <span className='mr-20 ml-3 absolute top-3 left-3 font-medium'>Premises Bookings</span>
                        <span className='rounded-lg absolute top-3 right-3 bg-green-500 px-2 py-0.5'>3 in this week</span>
                        <ul>
                            <li className='flex gap-2 p-2 mt-16 mx-5 bg-slate-300 rounded-md hover:bg-white'>
                                
                                <div>
                                    <div className='text-balance font-semibold'>birthday party</div>
                                    <div>October-23 Communityhall flat-202</div>
                                </div>
                            </li>
                            <li className='flex gap-2 p-2 mt-1 mx-5 bg-slate-300 rounded-md hover:bg-white'>
                               
                                <div>
                                    <div className='text-balance font-semibold'>Engagement</div>
                                    <div>October-23 Communityhall flat-202</div>
                                </div>
                            </li>

                        </ul>
                        <div className='flex gap-2 justify-center items-center mt-4'>
                            <a href='#' className='text-center font-semibold text-blue-500'>view all Bookings</a>
                            <img className='h-7 w-7 ' src="https://www.svgrepo.com/show/459575/right-arrow.svg" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default dashboard