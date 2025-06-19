import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { set } from 'mongoose';
import { HashLoader } from 'react-spinners';

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
    const [loading, setLoading] = useState(true);

    
// Reusable components
const SummaryCard = ({ title, value, icon, link }) => (
  <div className='bg-white rounded-xl shadow-sm p-5 transition-transform hover:scale-[1.02]'>
    <div className='flex justify-between items-start'>
      <h3 className='text-gray-500 text-sm font-medium'>{title}</h3>
      <div className='p-2 bg-blue-50 rounded-lg text-blue-600'>
        {icon}
      </div>
    </div>
    <div className='mt-3 flex items-end justify-between'>
      <span className='text-3xl font-bold text-gray-800'>{value}</span>
      <a href={link} className='text-blue-500 text-sm font-medium flex items-center'>
        View all
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </div>
);

const DashboardSection = ({ title, icon, children, link }) => (
  <div className='bg-white rounded-xl shadow-sm p-5'>
    <div className='flex justify-between items-center mb-5'>
      <div className='flex items-center'>
        <span className='text-blue-600'>{icon}</span>
        <h3 className='ml-2 text-lg font-semibold text-gray-800'>{title}</h3>
      </div>
      <a href={link} className='text-blue-500 text-sm font-medium flex items-center'>
        View all
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
    <div>
      {children}
    </div>
  </div>
);
    // Fetch data from the backend
    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/visitor/getActiveVisitorsByUserId", { withCredentials: true });
                setLoading(false);
                // console.log(response.data.data)
                setVisitors(response.data.data);
            } catch (error) {
                console.error("Error fetching visitors:", error);
            }
        };
        const societyDet = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/societyDetail/getSocietyDetail", { withCredentials: true });
                setLoading(false);
                // console.log("soc" + response.data)
                // console.log(response.data.data[0].societyName)
                setSociety(response.data.data[0].societyName);
            } catch (error) {
                console.error("Error fetching society name:", error);
            }
        }
        const fetchComplaints = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/complain/getAllComplains`, { withCredentials: true });
                setLoading(false);
                // console.log(response.data.data)
                setComplaints(response.data.data);
            } catch (error) {
                console.error("Error fetching visitors:", error);
            }
        }
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/events/getAllEvent`, { withCredentials: true });
                setLoading(false);
                // console.log(response.data.data)
                setEvents(response.data.data);
            } catch (error) {
                console.error("Error fetching visitors:", error);
            }
        }
        const fetchPolls = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/polls/getAllPolls`, { withCredentials: true });
                setLoading(false);
                // console.log(response.data.data)
                setPolls(response.data.data);
            } catch (error) {
                console.error("Error fetching visitors:", error);
            }
        }
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/booking/getBookingsByUserId`, { withCredentials: true });
                setLoading(false);
                // console.log(response.data.data)
                setBookings(response.data.data);
            } catch (error) {
                console.error("Error fetching visitors:", error);
            }
        }
        const fetchNotices = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/notices/getNotices`, { withCredentials: true });
                setLoading(false);
                // console.log(response.data.data)
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

    if (loading) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <HashLoader size={60} color="#2563eb" loading={loading} />
            <p className="mt-4 text-lg text-gray-700">Loading...</p>
          </div>
        );
      }
   return (
  <div className='bg-gray-50 min-h-screen'>
    <div className='p-5 max-w-7xl mx-auto'>
      {/* Header Section */}
      <div className='flex justify-between items-start mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Society Dashboard</h1>
          <p className='text-gray-600 mt-2'>Welcome to {society}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center min-h-screen">
                <HashLoader size={60} color="#2563eb" loading={loading} />
                <p className="mt-4 text-lg text-gray-700">Loading...</p>
              </div>
      ) : (
        <div className='space-y-8'>
          {/* Summary Cards */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <SummaryCard 
              title="Visitors Today" 
              value={visitors.length} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              link="/layout/visitor"
            />
            
            <SummaryCard 
              title="Active Notices" 
              value={notices.length} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              }
              link="/layout/notice"
            />
            
            <SummaryCard 
              title="Open Complaints" 
              value={complaints.length} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
              link="/layout/complaint"
            />
            
            <SummaryCard 
              title="Upcoming Events" 
              value={events.length} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              link="/layout/event"
            />
          </div>

          {/* Dashboard Sections */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Visitors */}
            <DashboardSection 
              title="Recent Visitors" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              link="/layout/visitor"
            >
              <div className='space-y-4'>
                {visitors.slice(0, 4).map((visitor) => (
                  <div className='flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
                    <div className='bg-blue-100 p-2 rounded-full mr-3'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-gray-800 truncate'>{visitor.visitorName}</p>
                      <p className='text-sm text-gray-500 truncate'>Phone: {visitor.visitorPhone}</p>
                    </div>
                    <div className='text-sm text-gray-500 whitespace-nowrap ml-2'>
                      {new Date(visitor.visitDate).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                ))}
              </div>
            </DashboardSection>
            
            {/* Notices */}
            <DashboardSection 
              title="Latest Notices" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              }
              link="/layout/notice"
            >
              <div className='space-y-4'>
                {notices.slice(0, 3).map((notice) => (
                  <div className='p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
                    <div className='flex justify-between items-start'>
                      <h4 className='font-semibold text-gray-800'>{notice.topic}</h4>
                      <span className='text-sm text-gray-500 ml-2'>
                        {new Date(notice.Date).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                    <p className='mt-2 text-gray-600 text-sm line-clamp-2'>
                      {notice.description}
                    </p>
                  </div>
                ))}
              </div>
            </DashboardSection>
            
            {/* Complaints */}
            <DashboardSection 
              title="Recent Complaints" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
              link="/layout/complaint"
            >
              <div className='space-y-4'>
                {complaints.slice(0, 3).map((complain) => (
                  <div className='p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
                    <div className='flex justify-between'>
                      <h4 className='font-semibold text-gray-800'>{complain.subject}</h4>
                      <span className='px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full'>
                        In Progress
                      </span>
                    </div>
                    <div className='mt-2 flex items-center text-sm text-gray-600'>
                      <span>Flat {complain.byHouse}</span>
                      <span className='mx-2'>•</span>
                      <span>{new Date(complain.date).toLocaleDateString("en-GB")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardSection>
            
            {/* Events */}
            <DashboardSection 
              title="Upcoming Events" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              link="/layout/event"
            >
              <div className='space-y-4'>
                {events.slice(0, 2).map((event) => (
                  <div className='p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
                    <div className='flex justify-between'>
                      <h4 className='font-semibold text-gray-800'>{event.eventName}</h4>
                      <span className='text-sm font-medium text-blue-600'>
                        ₹{event.amtPerPerson}
                      </span>
                    </div>
                    <div className='mt-2 flex items-center text-sm text-gray-600'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className='truncate'>{event.venue}</span>
                    </div>
                    <div className='mt-2 flex items-center text-sm text-gray-500'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(event.eventDate).toLocaleDateString("en-GB")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardSection>
            
            {/* Polls */}
            <DashboardSection 
              title="Active Polls" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              link="/layout/poll"
            >
              <div className='space-y-4'>
                {polls.slice(0, 2).map((poll) => (
                  <div className='p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
                    <h4 className='font-semibold text-gray-800 mb-3'>{poll.question}</h4>
                    <div className='w-full bg-gray-200 rounded-full h-2.5'>
                      <div className='bg-blue-600 h-2.5 rounded-full' style={{ width: `${Math.min(100, poll.totalVotes)}%` }}></div>
                    </div>
                    <div className='mt-2 flex justify-between text-sm text-gray-600'>
                      <span>{poll.totalVotes} votes</span>
                      <span>{new Date(poll.date).toLocaleDateString("en-GB")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardSection>
            
            {/* Bookings */}
            <DashboardSection 
              title="Recent Bookings" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
              link="/layout/booking"
            >
              <div className='space-y-4'>
                {bookings.slice(0, 2).map((booking) => (
                  <div className='p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
                    <div className='flex justify-between'>
                      <h4 className='font-semibold text-gray-800'>{booking.bookingType}</h4>
                      <span className='px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full'>
                        Confirmed
                      </span>
                    </div>
                    <div className='mt-2 flex justify-between text-sm text-gray-600'>
                      <div className='flex items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{booking.duration} hours</span>
                      </div>
                      <span>{new Date(booking.date).toLocaleDateString("en-GB")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardSection>
          </div>
        </div>
      )}
    </div>
  </div>
);



  




}
export default dashboard