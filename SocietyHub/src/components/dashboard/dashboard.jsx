import React, { useState, useEffect, useContext } from 'react'
import axios from '../../axios'
import { set } from 'mongoose';
import { HashLoader } from 'react-spinners';
import UserContext from '../../context/UserContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { CalendarDays, Wallet, TriangleAlert, Bell, UserCheck, BarChart2 } from "lucide-react";

function dashboard() {
  const [visitors, setVisitors] = useState([]);
  const [events, setEvents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [payments, setPayments] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [polls, setPolls] = useState([]);
  const [society, setSociety] = useState("");
  const [notices, setNotices] = useState([]);
  // const [payments , setPayments] = useState([]);
  // const user = JSON.parse(localStorage.getItem("user"));
  // const houseNo = user?.data?.user?.houseNo
  const { rolee, setRolee } = useContext(UserContext);
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
        <span className='text-3xl font-medium text-gray-800'>{value}</span>
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
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/visitor/getActiveVisitorsByUserId`, { withCredentials: true });
        setLoading(false);
        // console.log(response.data.data)
        setVisitors(response.data.data);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    };
    const societyDet = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/societyDetail/getSocietyDetail`, { withCredentials: true });
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
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/complain/getAllComplains`, { withCredentials: true });
        setLoading(false);
        // console.log(response.data.data)
        setComplaints(response.data.data);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    }
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/events/getUpcomingEvents`, { withCredentials: true });
        setLoading(false);
        // console.log(response.data.data)
        setEvents(response.data.data);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    }
    const fetchPolls = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/polls/getAllPolls`, { withCredentials: true });
        setLoading(false);
        // console.log(response.data.data)
        setPolls(response.data.data);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    }
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/booking/getBookingsByUserId`, { withCredentials: true });
        setLoading(false);
        // console.log(response.data.data)
        setBookings(response.data.data);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    }
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/notices/getNotices`, { withCredentials: true });
        setLoading(false);
        // console.log(response.data.data)
        setNotices(response.data.data);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    }
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/payment/getPayments`, {

          withCredentials: true,
        });
        setLoading(false);
        // Destructure the new paginated object layout!
        setPayments(response.data.data?.data || []);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    }
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/purchase/getAllPurchases`, {
          withCredentials: true,
        });
        setLoading(false);
        setPurchases(response.data.data || []);
      } catch (error) {
        console.error("Error fetching purchases:", error);
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
    fetchPurchases();
  }, []);

  const isPaymentPaid = (paymentId) => {
    return purchases.some((purchase) => {
      const purchasePaymentId = purchase?.paymentId?._id || purchase?.paymentId;
      return purchasePaymentId && paymentId && purchasePaymentId.toString() === paymentId.toString();
    });
  };

  const pendingPayments = payments.filter((payment) => !isPaymentPaid(payment?._id));
  const activePolls = polls.filter((poll) => poll?.isClosed !== true);

  useEffect(() => {
    if (rolee === "security") {
      navigate("/layout/Visitor");
    }
  }, [rolee, navigate]);

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
            <h1 className='text-3xl font-medium text-gray-900'>Dashboard</h1>
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
                icon={<UserCheck className="h-6 w-6" />}
                link="/layout/Visitor"
              />

              <SummaryCard
                title="Active Notices"
                value={notices.length}
                icon={<Bell className="h-6 w-6" />}
                link="/layout/Notice"
              />

              <SummaryCard
                title="Open Complaints"
                value={complaints.length}
                icon={<TriangleAlert className="h-6 w-6" />}
                link="/layout/Complaint"
              />

              <SummaryCard
                title="Upcoming Events"
                value={events.length}
                icon={<CalendarDays className="h-6 w-6" />}
                link="/layout/Event"
              />
            </div>

            {/* Dashboard Sections */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Visitors */}
              <DashboardSection
                title="Recent Visitors"
                icon={<UserCheck className="h-5 w-5" />}
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
                icon={<Bell className="h-5 w-5" />}
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
                icon={<TriangleAlert className="h-5 w-5" />}
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
                icon={<CalendarDays className="h-5 w-5" />}
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
                icon={<BarChart2 className="h-5 w-5" />}
                link="/layout/Poll"
              >
                <div className='space-y-4'>
                  {activePolls.length === 0 && <p className='text-gray-600'>No active polls found.</p>}
                  {activePolls.slice(0, 2).map((poll) => (
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
                title="Pending Payments"
                icon={<Wallet className="h-5 w-5" />}
                link="/layout/Payment"
              >
                <div className='space-y-4'>
                  {pendingPayments.length === 0 && <p className='text-gray-600'>No pending payments found.</p>}
                  {pendingPayments.slice(0, 2).map((payment) => (
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