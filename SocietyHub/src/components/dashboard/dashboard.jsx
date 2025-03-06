import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { set } from 'mongoose';


function dashboard() {
    const [visitors, setVisitors] = useState([]);
    const [events, setEvents] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [payments, setPayments] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [polls, setPolls] = useState([]);
    const [society, setSociety] = useState("");
       const user = JSON.parse(localStorage.getItem("user"));
       const houseNo = user?.data?.user?.houseNo

    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/visitor/getActiveVisitorsByUserId/${houseNo}`, { withCredentials: true });
                console.log(response.data.data)
                setVisitors(response.data.data);
            } catch (error) {
                console.error("Error fetching visitors:", error);
            }
        };
        const societyDet = async () => {
         try {
            const response = await axios.get(`http://localhost:8000/api/v1/societyDetail/getSocietyDetail`, { withCredentials: true });
            console.log( "soc" + response.data)
            setSociety(response.data.societyName);
         } catch (error) {
            console.error("Error fetching society name:", error);
         }   
        }
       const fetchComplaints = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/complain/getAllComplains`, { withCredentials: true });
            console.log(response.data.data)
            setComplaints(response.data.data);
        } catch (error) {
            console.error("Error fetching visitors:", error);
        }
       }
       const fetchEvents = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/events/getAllEvent`, { withCredentials: true });
            console.log(response.data.data)
            setEvents(response.data.data);
        } catch (error) {
            console.error("Error fetching visitors:", error);
        }
       }
       const fetchPolls = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/polls/getAllPolls`, { withCredentials: true });
            console.log(response.data.data)
            setPolls(response.data.data);
        } catch (error) {
            console.error("Error fetching visitors:", error);
        }
       }
       const fetchBookings = async () => {
        try {    
            const response = await axios.get(`http://localhost:8000/api/v1/booking/getBookingsByUserId`, { withCredentials: true });
            console.log(response.data.data)
            setBookings(response.data.data);
        } catch (error) {
            console.error("Error fetching visitors:", error);
        }
       }
       fetchBookings();
       fetchPolls();
       fetchEvents();
       fetchComplaints();
        fetchVisitors();
        societyDet();
        }, []);

    return (
        <div >
           
            <div className='p-5'>
                <div className='font-bold text-3xl'>Dashboard</div>
                <p className=' text-xl mt-3'>Welcome to Resident management system</p>
                <div className='grid md:grid-cols-3 sm:grid-cols-2 gap-8'>

                    <div className='mt-8 relative bg-slate-100 rounded-md p-2'>
                        <span className='text-lg font-semibold text-gray-700'>Visitor Management</span>
                        {/* <span className='rounded-lg absolute top-3 right-3 bg-green-500 px-2 py-0.5'>5 today</span> */}
                        <ul className='mt-9 h-48 overflow-y-auto hidden-scrollbar'>
                           { visitors.map((visitor) => (
                               <li className=' flex gap-2 p-2 mt-3 bg-[#F4E1D2] text-gray-800 rounded-md border-l-4 border-[#E2B887] hover:bg-white transition duration-300 shadow-sm'>
                               <img className='h-8 mt-2 w-8 ml-2' src="https://www.svgrepo.com/show/506667/person.svg" alt="" />
                               <div>
                                   <div className='text-lg text-gray-600 font-medium'>{visitor.visitorName}</div>
                                   <div className='text-sm text-gray-600 font-medium'>Arrived at {visitor.visitTime} - phone {visitor.visitorPhone}</div>
                               </div>
                           </li>
                           ))
                               }

                        </ul>
                        <div className='flex gap-2 justify-center items-center mt-4'>
                            <a href='/layout/visitor' className='text-center font-semibold text-blue-500'>View all Visitors</a>
                            <img className='h-7 w-7 ' src="https://www.svgrepo.com/show/459575/right-arrow.svg" alt="" />
                        </div>
                    </div>
                    <div className='mt-8 bg-slate-100 relative rounded-md p-2'>
                        <span className='text-lg font-semibold text-gray-700'>Payments</span>
                        {/* <span className='rounded-lg px-2 absolute right-3 top-3 ml-7 py-0.5 bg-red-400'>80% collected</span> */}
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
                        <span className='text-lg font-semibold text-gray-700'>Complains</span>
                        {/* <span className='rounded-lg absolute top-3 right-3 px-2 ml-7 py-0.5 bg-red-400'>1 Unresolved</span> */}
                        <ul className='mt-9 h-48 overflow-y-auto hidden-scrollbar'>
                            {
                                complaints.slice(0, 2).map((complain) => (
                                    <li className=' p-4 mt-3 bg-[#F4E1D2] text-gray-800 rounded-md border-l-4 border-[#E2B887] hover:bg-white transition duration-300 shadow-sm'>
                                <div>
                                    <div className='text-lg text-gray-600 font-medium'>{complain.subject}</div>
                                    <div className='text-sm text-gray-600 font-medium'>Date: {complain.date} - flat {complain.byHouse}</div>
                                    <div className=  'text-sm text-gray-600 font-medium'>
                                    InProgress
                                </div>
                                </div>
                                
                            </li>
                                ))
                            }
                           
                        </ul>
                        <div className='flex items-center justify-center mt-4'>
                            <a href="/layout/complaint" className="text-center font-semibold text-blue-500" >View all Complains</a>
                            <img className='h-7 w-7' src="https://www.svgrepo.com/show/459575/right-arrow.svg" alt="" />
                        </div>
                    </div>
                    <div className='mt-8 bg-slate-100 relative rounded-md p-2'>
                        <span className='text-lg font-semibold text-gray-700'>Upcoming Events</span>
                        {/* <span className='rounded-lg absolute top-3 right-3 px-2 ml-7 py-0.5 bg-red-400'>2 this week</span> */}
                        <ul className='mt-9 h-48 overflow-y-auto hidden-scrollbar'>
                        {
                            events.slice(0, 2).map((event) => (
                                <li className=' p-4 mt-3 bg-[#F4E1D2] text-gray-800 rounded-md border-l-4 border-[#E2B887] hover:bg-white transition duration-300 shadow-sm'>

                                <div className='text-lg text-gray-600 font-medium'>{event.eventName}</div>
                                <div className='text-sm text-gray-600 font-medium'>date : {new Date(event.eventDate).toLocaleDateString("en-GB")} - amt :{event.amtPerPerson}</div>
                                <div className='text-sm text-gray-600 font-medium' >
                                    {event.venue}
                                </div>
                            </li>
                            ))
                        }
                            
                        </ul>
                        <div className='flex gap-2 justify-center items-center mt-4'>
                            <a href='/layout/event' className='text-center font-semibold text-blue-500'>View all Events</a>
                            <img className='h-7 w-7 ' src="https://www.svgrepo.com/show/459575/right-arrow.svg" alt="" />
                        </div>
                    </div>
                    {/* <div className='mt-8 bg-slate-100 relative rounded-md p-2'>
                        <span className='mr-20 ml-3 absolute top-3 left-3 font-medium'>Active Polls </span> */}
                        {/* <span className='rounded-lg absolute top-3 right-3 px-2 ml-7 py-0.5 bg-red-400'>2 Poll</span> */}
                        {/* <ul className='mt-16'>
                          {
                            polls.slice(0, 2).map((poll) => (
                                <li className=' p-2 w-80 mt-3 mx-5 relative bg-blue-300 rounded-md hover:bg-white'>

                                <div className='text-balance font-semibold'>{poll.question}</div>
                                <div>Date : {new Date(poll.date).toLocaleString("en-GB", { 
                                    day: "2-digit", 
                                    month: "short", 
                                    year: "numeric", 
                                    hour: "2-digit", 
                                    minute: "2-digit",
                                    hour12: true
                                  })} </div>
                                <div className='relative' >
                                    <span className='text-green-500 '>Total votes :{poll.totalVotes}</span>
                                    
                                </div>
                            </li>
                            ))
                          }
                            
                        </ul>
                        <div className='flex gap-2 justify-center items-center mt-4'>
                            <a href='/layout/poll' className='text-center font-semibold text-blue-500'>view all Polls</a>
                            <img className='h-7 w-7 ' src="https://www.svgrepo.com/show/459575/right-arrow.svg" alt="" />
                        </div>
                    </div> */}
                  <div className="mt-8 bg-slate-100 relative rounded-md p-2">
    {/* Section Title */}
    <span className="text-lg font-semibold text-gray-700">Active Polls</span>

    {/* Polls List */}
    <ul className="mt-8 h-48 overflow-y-scroll hidden-scrollbar">
        {polls.slice(0, 2).map((poll, index) => (
            <li 
                key={index} 
                className="p-4 mt-3 bg-[#F4E1D2] text-gray-800 rounded-md border-l-4 border-[#E2B887] hover:bg-white transition duration-300 shadow-sm"
            >
                <div className="text-lg text-gray-600 font-medium">{poll.question}</div>
                <div className="text-sm text-gray-600 font-medium">
                    📅 Date: {new Date(poll.date).toLocaleString("en-GB", { 
                        day: "2-digit", 
                        month: "short", 
                        year: "numeric", 
                        hour: "2-digit", 
                        minute: "2-digit",
                        hour12: true
                    })}
                </div>
                <div className="mt-1 text-gray-600 font-medium">
                    ✅ Total votes: {poll.totalVotes}
                </div>
            </li>
        ))}
    </ul>

    {/* View All Polls Link */}
    <div className="flex justify-center items-center gap-2 mt-4">
        <a href="/layout/poll" className="text-center font-semibold text-blue-500">
            View all Polls
        </a>
        <img className="h-7 w-7" src="https://www.svgrepo.com/show/459575/right-arrow.svg" alt="arrow" />
    </div>
</div>



                    <div className='mt-8 relative bg-slate-100 rounded-md p-2'>
                        <span className='text-lg font-semibold text-gray-700'>Premises Bookings</span>
                        {/* <span className='rounded-lg absolute top-3 right-3 bg-green-500 px-2 py-0.5'>3 in this week</span> */}
                        <ul className='mt-9 h-48 overflow-y-scroll hidden-scrollbar'>
                        {
                            bookings.slice(0, 2).map((booking) => (
                                <li className='p-4 mt-3 bg-[#F4E1D2] text-gray-800 rounded-md border-l-4 border-[#E2B887] hover:bg-white transition duration-300 shadow-sm'>
                                
                                <div>
                                    <div className='text-lg text-gray-600 font-medium'>{booking.bookingType}</div>
                                    <div className='text-sm text-gray-600 font-medium'>Date: {new Date(booking.date).toLocaleDateString("en-GB")} duration: {booking.duration} hours</div>
                                </div>
                            </li>
                            ))
                        }
                          

                        </ul>
                        <div className='flex gap-2 justify-center items-center mt-4'>
                            <a href='/layout/booking' className='text-center font-semibold text-blue-500'>View all Bookings</a>
                            <img className='h-7 w-7 ' src="https://www.svgrepo.com/show/459575/right-arrow.svg" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default dashboard