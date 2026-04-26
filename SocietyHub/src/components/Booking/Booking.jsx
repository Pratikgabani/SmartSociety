import axios from "../../axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { HashLoader } from 'react-spinners';
import UserContext from "../../context/UserContext.js";

const Booking = () => {
  const [venues, setVenues] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVenueFormOpen, setIsVenueFormOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [formData, setFormData] = useState({
    bookingType: "",
    bookDescription: "",
    duration: "",
    date: "",
  });
  const [venueFormData, setVenueFormData] = useState({
    venue: "",
    description: "",
    amenities: [],
    capacity: "",
    price: "",
    societyId: ""
  });
  const [amenityInput, setAmenityInput] = useState("");
  const [myBooking, setMyBooking] = useState([]);
  const [bookingOrders, setBookingOrders] = useState([]);
  const [myPastBooking, setMyPastBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [previousData, setPreviousData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [selectedRefundOrderId, setSelectedRefundOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState("venues");
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, id: null, venueName: "" });
  const { rolee } = useContext(UserContext);
  const navigate = useNavigate();

  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/booking/getVenue`, { withCredentials: true });
        setVenues(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, []);

  // Fetch my bookings
  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/booking/getUpcomingBookingsByUserId`, { withCredentials: true });
        setMyBooking(response.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyBookings();
  }, []);

  useEffect(() => {
    let isMounted = true;
    let isFetching = false;

    const fetchMyBookingOrders = async () => {
      if (isFetching) return;
      isFetching = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/booking/orders/me`, { withCredentials: true });
        if (isMounted) {
          setBookingOrders(response.data.data || []);
        }
      } catch (error) {
        console.log("Error fetching booking orders", error);
      } finally {
        isFetching = false;
      }
    };

    fetchMyBookingOrders();
    const intervalId = setInterval(fetchMyBookingOrders, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Past bookings
  useEffect(() => {
    const fetchMyPastBookings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/booking/getPastBookingsByUserId`, { withCredentials: true });
        setMyPastBooking(response.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyPastBookings();
  }, []);

  const isPaidBookingOrderStatus = (status) => {
    return [
      "succeeded",
      "Paid",
      "Refund Initiated",
      "Refund_Initiated",
      "Refund_Pending_Approval",
      "Refunded",
    ].includes(status);
  };

  const isBookingHistoryVisibleStatus = (status) => {
    return status === "succeeded" || status === "Paid";
  };

  const fetchPreviousData = async () => {
    try {
      const stripTopLevelId = (rows = []) =>
        rows.map((row) => {
          if (!row || typeof row !== "object") return row;
          const { _id, ...rest } = row;
          return rest;
        });

      if (rolee === "admin") {
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/booking/all-Bookings`, { withCredentials: true });
        const adminHistory = response.data.data || [];
        const adminHistoryWithoutId = stripTopLevelId(adminHistory);
        setPreviousData(adminHistoryWithoutId);
        navigate("/history", { state: { data: adminHistoryWithoutId } });
        setIsModalOpen(true);
        return;
      }

      const [bookingResponse, orderResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/booking/getBookingsByUserId`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/booking/orders/me`, { withCredentials: true }),
      ]);

      const userBookings = bookingResponse.data.data || [];
      const userBookingOrders = orderResponse.data.data || [];
      setBookingOrders(userBookingOrders);

      const paidBookingIds = new Set(
        userBookingOrders
          .filter((order) => isBookingHistoryVisibleStatus(order?.status))
          .map((order) => order?.bookingId?._id || order?.bookingId?.id || order?.bookingId)
          .filter(Boolean)
          .map((id) => id.toString())
      );

      const paidBookingHistory = userBookings.filter((booking) =>
        paidBookingIds.has((booking?._id || booking?.id || "").toString())
      );

      const paidBookingHistoryWithoutId = stripTopLevelId(paidBookingHistory);
      setPreviousData(paidBookingHistoryWithoutId);
      navigate("/history", { state: { data: paidBookingHistoryWithoutId } });
      setIsModalOpen(true);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleDelete = (bookingId) => {
    setConfirmModal({ open: true, type: "booking", id: bookingId, venueName: "" });
  };

  const isBookingPaid = (bookingId) => {
    const order = getBookingOrder(bookingId);
    return Boolean(order && isPaidBookingOrderStatus(order.status));
  };

  const getBookingReceiptUrl = (bookingId) => {
    const match = getBookingOrder(bookingId);
    return match?.receiptUrl || null;
  };

  const getBookingOrder = (bookingId) => {
    const normalizedBookingId = (bookingId || "").toString();
    return bookingOrders.find((order) => {
      const orderBookingId = order?.bookingId?._id || order?.bookingId?.id || order?.bookingId;
      return orderBookingId && orderBookingId.toString() === normalizedBookingId;
    });
  };

  const handleRequestRefundClick = (orderId) => {
    setSelectedRefundOrderId(orderId);
    setRefundReason("");
    setIsRefundModalOpen(true);
  };

  const submitRefundRequest = async (e) => {
    e.preventDefault();
    if (!refundReason.trim()) return toast.error("Reason is required");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/refunds/${selectedRefundOrderId}`,
        { reason: refundReason, orderType: "BookingOrder" },
        { withCredentials: true }
      );
      toast.success(response.data?.message || "Refund requested successfully");
      setIsRefundModalOpen(false);
      try {
        if (response.status === 200) {
          setBookingOrders((prev) =>
            prev.map((order) =>
              order._id === selectedRefundOrderId
                ? { ...order, status: "Refund Initiated" }
                : order
            )
          );
        } else {
          const bookRes = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/booking/orders/me`, { withCredentials: true });
          setBookingOrders(bookRes.data.data || []);
        }
      } catch (refreshErr) {
        console.error("Order status refresh failed (non-critical):", refreshErr);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit refund request");
    }
  };

  const handleBookNow = (venue) => {
    setSelectedVenue(venue);
    setIsFormOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "duration" && value > 18) {
      toast.error("Booking duration cannot exceed 18 hours!");
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleVenueInputChange = (e) => {
    const { name, value } = e.target;
    setVenueFormData({ ...venueFormData, [name]: value });
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() !== "") {
      setVenueFormData({
        ...venueFormData,
        amenities: [...venueFormData.amenities, amenityInput.trim()],
      });
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (index) => {
    const updatedAmenities = venueFormData.amenities.filter((_, i) => i !== index);
    setVenueFormData({ ...venueFormData, amenities: updatedAmenities });
  };

  const handleVenueSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/booking/createVenue`,
        { ...venueFormData },
        { withCredentials: true }
      );
      toast.success("Venue created successfully!");
      setVenues([...venues, response.data.data]);
      setIsVenueFormOpen(false);
    } catch (error) {
      console.error("Error creating venue:", error);
      toast.error("Failed to create venue!");
    }
  };

  const handleDeleteVenue = (venueId, venueName) => {
    setConfirmModal({ open: true, type: "venue", id: venueId, venueName });
  };

  const confirmDelete = async () => {
    const { type, id } = confirmModal;
    setConfirmModal({ open: false, type: null, id: null, venueName: "" });
    try {
      if (type === "booking") {
        await axios.delete(`${import.meta.env.VITE_URL_BACKEND}/api/v1/booking/delete/${id}`, { withCredentials: true });
        setMyBooking(prev => prev.filter(b => b._id !== id));
        toast.success("Reservation cancelled successfully!");
      } else if (type === "venue") {
        await axios.delete(`${import.meta.env.VITE_URL_BACKEND}/api/v1/booking/deleteVenue/${id}`, { withCredentials: true });
        setVenues(prev => prev.filter(v => v._id !== id));
        toast.success("Venue deleted successfully!");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Action failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/booking/new-booking`,
        { ...formData, bookingType: selectedVenue.venue },
        { withCredentials: true }
      );
      toast.success("Booking created successfully!");
      setMyBooking([...myBooking, response.data.data]);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking!");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <HashLoader size={60} color="#2563eb" loading={loading} />
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  const tabs = [
    { id: "venues", label: "Available Venues", count: venues.length },
    { id: "upcoming", label: "My Bookings", count: myBooking.filter(b => getBookingOrder(b._id)?.status !== 'Refunded').length },
    { id: "past", label: "Past Bookings", count: myPastBooking.filter(b => isBookingHistoryVisibleStatus(getBookingOrder(b._id || b.id)?.status)).length },
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4 md:py-8 md:px-6 font-sans text-gray-900 bg-gray-50 min-h-screen">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 m-0 tracking-[-0.3px]">Venue Bookings</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-0">Reserve society spaces for events and gatherings</p>
        </div>
        <button
          onClick={fetchPreviousData}
          className="w-full sm:w-auto py-[9px] px-[18px] bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap"
        >
          History
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-200/60 p-1 rounded-xl border border-gray-200/80 w-full sm:w-max max-w-full mb-7 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-row items-center gap-2 py-1.5 px-4 font-semibold text-sm cursor-pointer transition-all duration-300 rounded-lg whitespace-nowrap border border-transparent ${
                isActive
                  ? "bg-white text-blue-700 shadow-sm border-gray-200/50"
                  : "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`inline-flex flex-row items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-xs font-medium ${
                isActive ? "bg-blue-100/80 text-blue-700" : "bg-gray-300/60 text-gray-600"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">

        {/* AVAILABLE VENUES */}
        {activeTab === "venues" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 m-0">Available Venues</h2>
                <p className="text-sm text-gray-400 mt-[3px] mb-0">Browse and reserve spaces for your next event</p>
              </div>
              {rolee === "admin" && (
                <button
                  onClick={() => setIsVenueFormOpen(true)}
                  className="w-full sm:w-auto py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors"
                >
                  + Add Venue
                </button>
              )}
            </div>

            {venues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-[72px] px-6 text-center">
                <span className="text-5xl mb-3">🏛️</span>
                <p className="text-lg font-semibold text-gray-700 m-0">No venues available</p>
                <p className="text-sm text-gray-400 mt-1.5 mb-0">Check back later or contact your admin</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {venues.map((venue) => (
                  <div key={venue._id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] transition-shadow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900 m-0">{venue.venue}</h3>
                      {rolee === "admin" && (
                        <button
                          onClick={() => handleDeleteVenue(venue._id, venue.venue)}
                          className="bg-transparent hover:bg-red-100 border-none text-red-500 cursor-pointer p-1.5 rounded-md transition-colors flex items-center"
                        >
                          <Trash2 strokeWidth={2.5} className="w-[18px] h-[18px]" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed m-0">{venue.description}</p>
                    <div className="flex flex-row gap-2 flex-wrap">
                      <span className="py-1 px-2.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">👥 {venue.capacity} guests</span>
                      <span className="py-1 px-2.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">₹{venue.price}/day</span>
                    </div>
                    {venue.amenities.length > 0 && (
                      <div className="flex flex-row flex-wrap gap-1.5">
                        {venue.amenities.map((amenity, idx) => (
                          <span key={idx} className="py-[3px] px-[9px] bg-gray-100 text-gray-600 rounded-md text-xs">{amenity}</span>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => handleBookNow(venue)}
                      className="mt-1 py-2.5 px-0 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors w-full flex justify-center items-center"
                    >
                      Reserve Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* UPCOMING BOOKINGS */}
        {activeTab === "upcoming" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 m-0">Upcoming Bookings</h2>
                <p className="text-sm text-gray-400 mt-[3px] mb-0">Manage your scheduled reservations</p>
              </div>
            </div>

            {myBooking.filter(b => getBookingOrder(b._id)?.status !== 'Refunded').length === 0 ? (
              <div className="flex flex-col items-center justify-center py-[72px] px-6 text-center">
                <span className="text-5xl mb-3">📅</span>
                <p className="text-lg font-semibold text-gray-700 m-0">No upcoming bookings</p>
                <p className="text-sm text-gray-400 mt-1.5 mb-0">Browse available venues and make your first reservation</p>
                <button
                  onClick={() => setActiveTab("venues")}
                  className="mt-3 py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors"
                >
                  Browse Venues
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {myBooking
                  .filter(booking => getBookingOrder(booking._id)?.status !== 'Refunded')
                  .map((booking) => {
                    const isUpcoming = new Date(booking.date) >= Date.now();
                    const order = getBookingOrder(booking._id);
                    return (
                      <div key={booking._id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] transition-shadow">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h3 className="text-base font-medium text-gray-900 m-0">{booking.bookingType}</h3>
                            <p className="text-[0.82rem] text-gray-500 mt-[3px] mb-0">{booking.bookDescription}</p>
                          </div>
                          <span className={isUpcoming ? "py-[3px] px-2.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold whitespace-nowrap" : "py-[3px] px-2.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold whitespace-nowrap"}>
                            {isUpcoming ? 'Upcoming' : 'Completed'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 py-3 border-y border-gray-100">
                          <div className="flex flex-col gap-0.5 flex-1">
                            <span className="text-xs text-gray-400 uppercase tracking-[0.5px]">Duration</span>
                            <span className="text-sm font-semibold text-gray-900">{booking.duration} hrs</span>
                          </div>
                          <div className="w-px h-[30px] bg-gray-200" />
                          <div className="flex flex-col gap-0.5 flex-1">
                            <span className="text-xs text-gray-400 uppercase tracking-[0.5px]">Date</span>
                            <span className="text-sm font-semibold text-gray-900">{new Date(booking.date).toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>
                        {isUpcoming && (
                          <div className="flex gap-2 items-start">
                            <button
                              onClick={() => handleDelete(booking._id)}
                              className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap"
                            >
                              Cancel
                            </button>
                            {isBookingPaid(booking._id) ? (
                              <div className="flex flex-col gap-1.5 flex-1">
                                {getBookingReceiptUrl(booking._id) ? (
                                  <>
                                    <a
                                      href={getBookingReceiptUrl(booking._id)}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="block py-[7px] px-2.5 border border-blue-600 hover:bg-blue-50 text-blue-600 rounded-md text-xs font-semibold text-center no-underline transition-colors"
                                    >
                                      View Receipt
                                    </a>
                                    {order?.status === 'succeeded' && (
                                      <button
                                        onClick={() => handleRequestRefundClick(order._id)}
                                        className="block w-full py-[7px] px-2.5 bg-transparent hover:bg-orange-50 border border-orange-500 text-orange-700 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                                      >
                                        Request Refund
                                      </button>
                                    )}
                                    {(order?.status === 'Refund Initiated' || order?.status === 'Refund_Initiated' || order?.status === 'Refund_Pending_Approval') && (
                                      <span className="block py-[7px] px-2.5 bg-orange-50 text-orange-700 rounded-md text-xs font-semibold text-center">Refund Pending</span>
                                    )}
                                    {order?.status === 'Refunded' && (
                                      <span className="block py-[7px] px-2.5 bg-emerald-50 text-emerald-800 rounded-md text-xs font-semibold text-center">Refunded</span>
                                    )}
                                  </>
                                ) : (
                                  <span className="block py-[7px] px-2.5 bg-gray-50 text-gray-400 rounded-md text-xs text-center">Receipt unavailable</span>
                                )}
                              </div>
                            ) : (
                              <Link
                                to={`/layout/payBooking/${booking._id}`}
                                className="flex flex-row items-center justify-center flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-md text-xs font-semibold cursor-pointer no-underline transition-colors text-center"
                              >
                                Pay Now
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </section>
        )}

        {/* PAST BOOKINGS */}
        {activeTab === "past" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 m-0">Past Bookings</h2>
                <p className="text-sm text-gray-400 mt-[3px] mb-0">Your completed and paid reservations</p>
              </div>
            </div>

            {myPastBooking.filter(b => isBookingHistoryVisibleStatus(getBookingOrder(b._id || b.id)?.status)).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-[72px] px-6 text-center">
                <span className="text-5xl mb-3">🗂️</span>
                <p className="text-lg font-semibold text-gray-700 m-0">No past bookings</p>
                <p className="text-sm text-gray-400 mt-1.5 mb-0">Your completed reservations will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {myPastBooking
                  .filter(booking => isBookingHistoryVisibleStatus(getBookingOrder(booking._id || booking.id)?.status))
                  .map((booking) => {
                    const isUpcoming = new Date(booking.date) >= Date.now();
                    return (
                      <div key={booking._id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] transition-shadow">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h3 className="text-base font-medium text-gray-900 m-0">{booking.bookingType}</h3>
                            <p className="text-[0.82rem] text-gray-500 mt-[3px] mb-0">{booking.bookDescription}</p>
                          </div>
                          <span className={isUpcoming ? "py-[3px] px-2.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold whitespace-nowrap" : "py-[3px] px-2.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold whitespace-nowrap"}>
                            {isUpcoming ? "Upcoming" : "Completed"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 py-3 border-y border-gray-100">
                          <div className="flex flex-col gap-0.5 flex-1">
                            <span className="text-xs text-gray-400 uppercase tracking-[0.5px]">Duration</span>
                            <span className="text-sm font-semibold text-gray-900">{booking.duration} hrs</span>
                          </div>
                          <div className="w-px h-[30px] bg-gray-200" />
                          <div className="flex flex-col gap-0.5 flex-1">
                            <span className="text-xs text-gray-400 uppercase tracking-[0.5px]">Date</span>
                            <span className="text-sm font-semibold text-gray-900">{new Date(booking.date).toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>
                        {isUpcoming && (
                          <div className="flex gap-2 items-start">
                            <button
                              onClick={() => handleDelete(booking._id)}
                              className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap"
                            >
                              Cancel
                            </button>
                            <button className="flex flex-row items-center justify-center flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-md text-xs font-semibold cursor-pointer transition-colors text-center">
                              Pay Now
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </section>
        )}
      </div>

      {/* BOOKING FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[520px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-900 m-0">Reserve {selectedVenue?.venue}</h2>
              <button onClick={() => setIsFormOpen(false)} className="bg-transparent border-none text-lg text-gray-400 hover:text-gray-600 cursor-pointer p-1 leading-none">✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex flex-col">
                <label className="block text-[0.82rem] font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Event Description</label>
                <input
                  type="text"
                  name="bookDescription"
                  value={formData.bookDescription}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border transition-colors bg-gray-50 focus:border-blue-500 focus:bg-white"
                  placeholder="e.g. Annual Society Meeting"
                  required
                />
              </div>
              <div className="mb-4 flex flex-col">
                <label className="block text-[0.82rem] font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Duration (hours)</label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  max="18"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border transition-colors bg-gray-50 focus:border-blue-500 focus:bg-white"
                  placeholder="1–18 hours"
                  required
                />
              </div>
              <div className="mb-4 flex flex-col">
                <label className="block text-[0.82rem] font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Booking Date</label>
                <input
                  type="date"
                  name="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border transition-colors bg-gray-50 focus:border-blue-500 focus:bg-white"
                  required
                />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-4 my-1">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-[0.4px] m-0 mb-2">📋 Reservation Guidelines</p>
                <ul className="m-0 pl-4 flex flex-col gap-1 text-xs text-slate-500 leading-relaxed list-disc">
                  <li>Book at least <strong>24 hours</strong> in advance</li>
                  <li>Cancellations need <strong>12 hours</strong> notice for a full refund</li>
                  <li>Max duration is <strong>18 hours</strong> per booking</li>
                  <li>Arrive <strong>30 minutes</strong> before your scheduled time</li>
                </ul>
              </div>
              <div className="flex justify-end gap-2.5 mt-6">
                <button type="button" onClick={() => setIsFormOpen(false)} className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors">Cancel</button>
                <button type="submit" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors">Confirm Reservation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD VENUE FORM MODAL */}
      {isVenueFormOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[460px] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-900 m-0">Add New Venue</h2>
              <button onClick={() => setIsVenueFormOpen(false)} className="bg-transparent border-none text-lg text-gray-400 hover:text-gray-600 cursor-pointer p-1 leading-none">✕</button>
            </div>
            <form onSubmit={handleVenueSubmit}>
              <div className="mb-4 flex flex-col">
                <label className="block text-[0.82rem] font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Venue Name</label>
                <input type="text" name="venue" value={venueFormData.venue} onChange={handleVenueInputChange} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border transition-colors bg-gray-50 focus:border-blue-500 focus:bg-white" required />
              </div>
              <div className="mb-4 flex flex-col">
                <label className="block text-[0.82rem] font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Description</label>
                <input type="text" name="description" value={venueFormData.description} onChange={handleVenueInputChange} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border transition-colors bg-gray-50 focus:border-blue-500 focus:bg-white" required />
              </div>
              <div className="mb-4 flex flex-col">
                <label className="block text-[0.82rem] font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Amenities</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    className="flex-1 py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border transition-colors bg-gray-50 focus:border-blue-500 focus:bg-white"
                    placeholder="e.g. Projector"
                  />
                  <button type="button" onClick={handleAddAmenity} className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 transition-colors text-white border-none rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap">Add</button>
                </div>
                {venueFormData.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {venueFormData.amenities.map((amenity, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {amenity}
                        <button type="button" onClick={() => handleRemoveAmenity(index)} className="bg-transparent border-none text-gray-400 hover:text-red-500 cursor-pointer p-0 text-[0.7rem] leading-none">✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 mb-4">
                <div className="flex flex-col flex-1">
                  <label className="block text-[0.82rem] font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Capacity</label>
                  <input type="number" name="capacity" value={venueFormData.capacity} onChange={handleVenueInputChange} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border transition-colors bg-gray-50 focus:border-blue-500 focus:bg-white" required />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="block text-[0.82rem] font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Price (₹/day)</label>
                  <input type="number" name="price" value={venueFormData.price} onChange={handleVenueInputChange} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border transition-colors bg-gray-50 focus:border-blue-500 focus:bg-white" required />
                </div>
              </div>
              <div className="flex justify-end gap-2.5 mt-6">
                <button type="button" onClick={() => setIsVenueFormOpen(false)} className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors">Cancel</button>
                <button type="submit" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors">Create Venue</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:pt-8 sm:pb-7 sm:px-7 w-full max-w-[380px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 m-0 mb-2">
              {confirmModal.type === "venue" ? "Delete Venue?" : "Cancel Reservation?"}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed m-0 mb-6">
              {confirmModal.type === "venue"
                ? <></>
                : "Are you sure you want to cancel this reservation? This action cannot be undone."}
              {confirmModal.type === "venue" && <>Are you sure you want to delete <strong>{confirmModal.venueName}</strong>? This cannot be undone.</>}
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setConfirmModal({ open: false, type: null, id: null, venueName: "" })}
                className="flex-1 py-2.5 px-0 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
              >
                No, Keep it
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 px-0 bg-red-600 hover:bg-red-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REFUND MODAL */}
      {isRefundModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[460px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-900 m-0">Request Refund</h2>
              <button onClick={() => setIsRefundModalOpen(false)} className="bg-transparent border-none text-lg text-gray-400 hover:text-gray-600 cursor-pointer p-1 leading-none">✕</button>
            </div>
            <form onSubmit={submitRefundRequest}>
              <div className="mb-4 flex flex-col">
                <label className="block text-[0.82rem] font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Reason for Refund</label>
                <textarea
                  name="refundReason"
                  rows="4"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Please provide a valid reason..."
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border transition-colors bg-gray-50 focus:border-blue-500 focus:bg-white resize-y font-sans"
                  required
                />
              </div>
              <div className="flex justify-end gap-2.5 mt-6">
                <button type="button" onClick={() => setIsRefundModalOpen(false)} className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors">Cancel</button>
                <button type="submit" className="py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;