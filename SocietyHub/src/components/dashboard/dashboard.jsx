import React, { useState, useEffect, useContext } from 'react'
import axios from '../../axios'
import { set } from 'mongoose';
import { HashLoader } from 'react-spinners';
import UserContext from '../../context/UserContext';
import { Navigate, useNavigate } from 'react-router-dom';

function dashboard() {
  const [visitors, setVisitors] = useState([]);
  const [events, setEvents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [polls, setPolls] = useState([]);
  const [society, setSociety] = useState("");
  const [notices, setNotices] = useState([]);
  // const [payments , setPayments] = useState([]);
  // const user = JSON.parse(localStorage.getItem("user"));
  // const houseNo = user?.data?.user?.houseNo
  const {rolee , setRolee } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        <a href={link} className='text-blue-600 text-sm font-medium flex items-center'>
          View all
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );

  const DashboardSection = ({ title, icon, children, link }) => (
    <div className='bg-white rounded-xl shadow-sm p-5 max-h-[300px] overflow-auto'>
      <div className='flex justify-between items-center mb-5'>
        <div className='flex items-center'>
          <span className='text-blue-600'>{icon}</span>
          <h3 className='ml-2 text-lg font-semibold text-gray-800'>{title}</h3>
        </div>
        <a href={link} className='text-blue-600 text-sm font-medium flex items-center'>
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
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/payment/getPayments", {

          withCredentials: true,
        });
        setLoading(false);
        // console.log(response.data.data)
        setPayments(response.data.data);
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
    fetchPayments();
  }, []);

  useEffect(() => {
    if(rolee === "security") {
      navigate("/layout/Visitor");
    }
  } , [rolee , navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <HashLoader size={60} color="#2563eb" loading={loading} />
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    );
  }
  return (
    <div className='bg-gray-100 min-h-screen'>
      <div className='p-5 max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='flex justify-between items-start mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
            <p className='text-gray-600 text-lg mt-2'>Welcome to <span className='font-semibold'>{society}</span></p>
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
                title="Visitors "
                value={visitors.length}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                link="/layout/Visitor"
              />

              <SummaryCard
                title="Active Notices"
                value={notices.length}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                }
                link="/layout/Notice"
              />

              <SummaryCard
                title="Open Complaints"
                value={complaints.length}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                }
                link="/layout/Complaint"
              />

              <SummaryCard
                title=" Events"
                value={events.length}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                link="/layout/Event"
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
                  {visitors.length === 0 && <p className='text-gray-600'>No Recent visitors found.</p>}
                  {visitors.slice(0, 4).map((visitor) => (
                    <div className='flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
                      <div className='bg-blue-100 p-2 rounded-full mr-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-gray-800 truncate'>{visitor.visitorName}</p>
                        <p className='text-sm text-gray-600 truncate'>Phone: {visitor.visitorPhone}</p>
                      </div>
                      <div className='text-sm text-gray-600 whitespace-nowrap ml-2'>
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
                  {notices.length === 0 && <p className='text-gray-600'>No Notices found.</p>}
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
                  {complaints.length === 0 && <p className='text-gray-600'>No Complaints found.</p>}
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
                  {events.length === 0 && <p className='text-gray-600'>No Events found.</p>}
                  {events.slice(0, 2).map((event) => (
                    <div className='p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
                      <div className='flex justify-between'>
                        <h4 className='font-semibold text-gray-800'>{event.eventName}</h4>
                        <span className='text-sm font-medium '>
                          ₹{event.amtPerPerson}
                        </span>
                      </div>
                      <div className='mt-2 flex items-center text-sm text-gray-600'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className='truncate'>{event.venue}</span>
                        <span className='mx-2'>•</span>
                        <span> {new Date(event.eventDate).toLocaleDateString("en-GB")}</span>
                      </div>
                      <div className='mt-2 flex items-center text-sm text-gray-500'>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardSection>

              {/* Payments */}

              {/* Polls */}
              <DashboardSection
                title="Active Polls"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
                link="/layout/Poll"
              >
                <div className='space-y-4'>
                  {polls.length === 0 && <p className='text-gray-600'>No Polls found.</p>}
                  {polls.slice(0, 2).map((poll) => (
                    <div className='p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
                      <div className='flex justify-between'>
                        <h4 className='font-semibold text-gray-800 mb-3'>{poll.question}</h4>
                        <span className='text-sm  text-gray-600'>{new Date(poll.date).toLocaleDateString("en-GB")}</span>
                      </div>
                      {/* <div className='w-full bg-gray-200 rounded-full h-2.5'>
                      <div className='bg-blue-600 h-2.5 rounded-full' style={{ width: `${Math.min(100, poll.totalVotes)}%` }}></div>
                    </div> */}
                      <div className='flex justify-between text-sm text-gray-600'>
                        <span>{poll.totalVotes} votes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardSection>

              {/* Bookings */}
              {/* <DashboardSection 
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
            </DashboardSection> */}
              <DashboardSection
                title="Recent Payments"
                icon={
                  <svg className='w-6 h-6' fill="#2563eb" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M200.533,25.6h-42.667c-4.71,0-8.533,3.814-8.533,8.533s3.823,8.533,8.533,8.533h42.667c4.71,0,8.533-3.814,8.533-8.533 S205.244,25.6,200.533,25.6z"></path> <path d="M132.267,25.6h-8.533c-4.71,0-8.533,3.814-8.533,8.533s3.823,8.533,8.533,8.533h8.533c4.71,0,8.533-3.814,8.533-8.533 S136.977,25.6,132.267,25.6z"></path> <rect x="354.133" y="290.133" width="93.867" height="42.667"></rect> <path d="M499.2,153.6v-8.533c0-18.825-15.309-34.133-34.133-34.133h-153.6V51.2V33.809C311.467,15.164,296.303,0,277.666,0 H55.134C36.497,0,21.333,15.164,21.333,33.809V51.2v25.6c-4.71,0-8.533,3.814-8.533,8.533v8.533c0,4.719,3.823,8.533,8.533,8.533 v8.533c-4.71,0-8.533,3.814-8.533,8.533V128c0,4.719,3.823,8.533,8.533,8.533v8.533c-4.71,0-8.533,3.814-8.533,8.533v8.533 c0,4.719,3.823,8.533,8.533,8.533v273.067v34.458c0,18.645,15.164,33.809,33.801,33.809h222.532 c18.637,0,33.801-15.164,33.801-33.809v-34.458V384h153.6c18.825,0,34.133-15.309,34.133-34.133v-128H149.333V204.8H499.2 v-34.133H149.333V153.6H499.2z M337.067,281.6c0-4.719,3.823-8.533,8.533-8.533h110.933c4.71,0,8.533,3.814,8.533,8.533v59.733 c0,4.719-3.823,8.533-8.533,8.533H345.6c-4.71,0-8.533-3.814-8.533-8.533V281.6z M38.4,33.809 c0-9.233,7.509-16.742,16.734-16.742h222.532c9.225,0,16.734,7.509,16.734,16.742V51.2h-256V33.809z M144.06,494.933H55.134 c-9.225,0-16.734-7.509-16.734-16.742v-34.458h105.66c-7.168,6.263-11.793,15.352-11.793,25.6S136.892,488.67,144.06,494.933z M166.4,486.4c-9.412,0-17.067-7.654-17.067-17.067c0-9.412,7.654-17.067,17.067-17.067c9.412,0,17.067,7.654,17.067,17.067 C183.467,478.746,175.812,486.4,166.4,486.4z M294.4,478.191c0,9.233-7.509,16.742-16.734,16.742H188.74 c7.168-6.263,11.793-15.351,11.793-25.6s-4.625-19.337-11.793-25.6H294.4V478.191z M302.345,298.667h-16.478 c-4.71,0-8.533-3.814-8.533-8.533s3.823-8.533,8.533-8.533h16.478c4.71,0,8.533,3.814,8.533,8.533 S307.055,298.667,302.345,298.667z M246.801,247.467h55.543c4.71,0,8.533,3.814,8.533,8.533s-3.823,8.533-8.533,8.533h-55.543 c-4.71,0-8.533-3.814-8.533-8.533S242.091,247.467,246.801,247.467z M174.933,247.467H217.6c4.71,0,8.533,3.814,8.533,8.533 s-3.823,8.533-8.533,8.533h-42.667c-4.71,0-8.533-3.814-8.533-8.533S170.223,247.467,174.933,247.467z M174.933,281.6h84.156 c4.719,0,8.533,3.814,8.533,8.533s-3.814,8.533-8.533,8.533h-84.156c-4.71,0-8.533-3.814-8.533-8.533 S170.223,281.6,174.933,281.6z M132.267,145.067v8.533v17.067V204.8v17.067v128c0,18.825,15.309,34.133,34.133,34.133h128v42.667 h-256v-358.4h256v42.667h-128C147.575,110.933,132.267,126.242,132.267,145.067z"></path> </g> </g> </g> </g></svg>
                }
                link="/layout/Payment"
              >
                <div className='space-y-4'>
                  {payments.slice(0, 2).map((payment) => (
                    <div
                      key={payment._id}
                      className='p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'
                    >
                      <div className='flex justify-between items-center'>
                        <h4 className='font-semibold text-gray-800'>{payment.description}</h4>

                        <div className="flex font-semibold items-center text-gray-800">
                          <span className='text-sm font-medium '>₹</span>
                          <span>{payment.amount}</span>
                        </div>
                      </div>
                      {/* <span
            className={`px-2 py-1 text-xs rounded-full ${
              payment.status === 'Paid'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {payment.status}
          </span> */}


                      {/* <div className='text-right'>
            <span className='font-medium'>Payment:</span>{" "}
            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString("en-GB") : "—"}
          </div> */}
                      <div className='text-sm text-gray-600 mt-2'>
                        <span className=''>Due:</span>{" "}
                        {new Date(payment.dueDate).toLocaleDateString("en-GB")}
                      </div>
                      {/* <div className='text-right'>
            <button
              className='text-blue-600 hover:underline text-sm font-medium'
              onClick={() => handlePay(payment._id)}
              disabled={payment.status === 'Paid'}
            >
              {payment.status === 'Paid' ? "Paid" : "Pay Now"}
            </button>
          </div> */}
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