import React, { useState, useEffect } from 'react'
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
    const [notices, setNotices] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const houseNo = user?.data?.user?.houseNo

    // Fetch data from the backend
    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/visitor/getActiveVisitorsByUserId", { withCredentials: true });
                console.log(response.data.data)
                setVisitors(response.data.data);
            } catch (error) {
                console.error("Error fetching visitors:", error);
            }
        };
        const societyDet = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/societyDetail/getSocietyDetail", { withCredentials: true });
                console.log("soc" + response.data)
                console.log(response.data.data[0].societyName)
                setSociety(response.data.data[0].societyName);
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
        const fetchNotices = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/notices/getNotices`, { withCredentials: true });
                console.log(response.data.data)
                setNotices(response.data.data);
            } catch (error) {
                console.error("Error fetching visitors:", error);
            }
        }
        fetchVisitors();
        fetchNotices();
        fetchComplaints();
        fetchEvents();
        fetchPolls();
        fetchBookings();
        societyDet();
    }, []);

    return (
        <div className='bg-gray-50' >

            <div className='p-5'>
                <div className='font-bold text-3xl'>Dashboard</div>
                <p className=' text-xl mt-3'>Welcome to {society}</p>
                <div className='grid md:grid-cols-3 sm:grid-cols-2 gap-5'>

                    <div className='mt-8 relative bg-slate-200 rounded-md p-3'>
                        <span className='text-xl font-semibold text-gray-700'>Visitor Management</span>
                        {/* <span className='rounded-lg absolute top-3 right-3 bg-green-500 px-2 py-0.5'>5 today</span> */}
                        <ul className='mt-9 h-48 overflow-y-auto hidden-scrollbar'>
                            {visitors.map((visitor) => (
                                <li className=' flex gap-2 p-2 mt-3 hover:bg-[#b1efe7] text-gray-800 rounded-md border-l-4 border-[#31bcc3] bg-white transition duration-300 shadow-sm'>
                                    <img className='h-8 mt-2 w-8 ml-2' src="https://www.svgrepo.com/show/506667/person.svg" alt="" />
                                    <div>
                                        <div className='text-lg text-gray-600 font-medium'>{visitor.visitorName}</div>
                                        <div className='text-sm text-gray-600 font-medium'>Arrived at {new Date(visitor.visitDate).toLocaleDateString("en-GB")
                                        } - phone {visitor.visitorPhone}</div>
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
                    <div className='mt-8 bg-slate-200 relative rounded-md p-3'>
                        <span className='text-xl font-semibold text-gray-700'>Notices</span>
                        {/* <span className='rounded-lg px-2 absolute right-3 top-3 ml-7 py-0.5 bg-red-400'>80% collected</span> */}
                        <ul className="mt-9 h-48 overflow-y-scroll hidden-scrollbar">
                            {notices.slice(0, 2).map((notices, index) => (
                                <li
                                    key={index}
                                    className="p-4 mt-3 hover:bg-[#eab0d1] text-gray-800 rounded-md border-l-4 border-[#d533ca] bg-white transition duration-300 shadow-sm"
                                >
                                    <div className="text-lg text-gray-600 font-medium">{notices.topic}</div>
                                    <div className="text-sm text-gray-600 font-medium">
                                        Date: {new Date(notices.Date).toLocaleDateString("en-GB")}
                                    </div>
                                    <div className="mt-1 text-gray-600 font-medium">
                                        Description : {notices.description}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className='flex items-center justify-center mt-4'>
                            <a href='/layout/notice' className='text-center font-semibold text-blue-500'>View All Notices</a>
                            <img className='h-7 w-7' src="https://www.svgrepo.com/show/459575/right-arrow.svg" alt="" />
                        </div>
                    </div>
                    <div className='mt-8 bg-slate-200 relative rounded-md p-3'>
                        <span className='text-xl font-semibold text-gray-700'>Complains</span>
                        {/* <span className='rounded-lg absolute top-3 right-3 px-2 ml-7 py-0.5 bg-red-400'>1 Unresolved</span> */}
                        <ul className='mt-9 h-48 overflow-y-auto hidden-scrollbar'>
                            {
                                complaints.slice(0, 2).map((complain) => (
                                    <li className=' p-4 mt-3 hover:bg-[#b1ecb7] text-gray-800 rounded-md border-l-4 border-[#2ab12f] bg-white transition duration-300 shadow-sm'>
                                        <div>
                                            <div className='text-lg text-gray-600 font-medium'>{complain.subject}</div>
                                            <div className='text-sm text-gray-600 font-medium'> Date: {new Date(complain.date).toLocaleDateString("en-GB")
                                            } - flat {complain.byHouse}</div>
                                            <div className='text-sm text-gray-600 font-medium'>
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
                    <div className='mt-8 bg-slate-200 relative rounded-md p-3'>
                        <span className='text-xl font-semibold text-gray-700'>Upcoming Events</span>
                        {/* <span className='rounded-lg absolute top-3 right-3 px-2 ml-7 py-0.5 bg-red-400'>2 this week</span> */}
                        <ul className='mt-9 h-48 overflow-y-auto hidden-scrollbar'>
                            {
                                events.slice(0, 2).map((event) => (
                                    <li className=' p-4 mt-3 hover:bg-[#deb98a] text-gray-800 rounded-md border-l-4 border-[#ae8b2b] bg-white transition duration-300 shadow-sm'>

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

                    <div className="mt-8 bg-slate-200 relative rounded-md p-3">
                        {/* Section Title */}
                        <span className="text-xl font-semibold text-gray-700">Active Polls</span>

                        {/* Polls List */}
                        <ul className="mt-9 h-48 overflow-y-scroll hidden-scrollbar">
                            {polls.slice(0, 2).map((poll, index) => (
                                <li
                                    key={index}
                                    className="p-4 mt-3 hover:bg-[#eea2a2] text-gray-800 rounded-md border-l-4 border-[#d55933] bg-white transition duration-300 shadow-sm"
                                >
                                    <div className="text-lg text-gray-600 font-medium">{poll.question}</div>
                                    <div className="text-sm text-gray-600 font-medium">
                                        Date: {new Date(poll.date).toLocaleString("en-GB")}
                                    </div>
                                    <div className="mt-1 text-gray-600 font-medium">
                                        Total votes: {poll.totalVotes}
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



                    <div className='mt-8 relative bg-slate-200 rounded-md p-3'>
                        <span className='text-xl font-semibold text-gray-700'>Premises Bookings</span>
                        {/* <span className='rounded-lg absolute top-3 right-3 bg-green-500 px-2 py-0.5'>3 in this week</span> */}
                        <ul className='mt-9 h-48 overflow-y-scroll hidden-scrollbar'>
                            {
                                bookings.slice(0, 2).map((booking) => (
                                    <li className='p-4 mt-3 hover:bg-[#dee37f] text-gray-800 rounded-md border-l-4 border-[#b8bf2e] bg-white transition duration-300 shadow-sm'>

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