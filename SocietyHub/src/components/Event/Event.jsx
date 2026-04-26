import axios from "../../axios";
import React, { useContext, useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";

function Event() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pastData, setPastData] = useState([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [paymentStatusMap, setPaymentStatusMap] = useState({});
  const [eventOrders, setEventOrders] = useState([]);
  const [paymentStatusLoading, setPaymentStatusLoading] = useState(true);
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    venue: "",
    amtPerPerson: "",
    description: "",
    time: "",
    lastDateOfPay: "",
    category: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [selectedRefundOrderId, setSelectedRefundOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();
  const { rolee } = useContext(UserContext);

  useEffect(() => {
    const getUpcomingEvents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_BACKEND}/api/v1/events/getUpcomingEvents`,
          { withCredentials: true }
        );
        setEvents(response.data.data);
        setLoading(false);
      } catch (error) {
        console.log("Error in getting events", error);
        setLoading(false);
      }
    };
    getUpcomingEvents();
  }, []);

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_BACKEND}/api/v1/events/getPastEvents`,
          { withCredentials: true }
        );
        setPastData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.log("Error in getting events", error);
        setLoading(false);
      }
    };
    fetchPastEvents();
  }, []);

  useEffect(() => {
    const fetchPaymentStatuses = async () => {
      const statusMap = {};
      setLoading(true);
      for (let event of events) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_URL_BACKEND}/api/v1/events/paymentStatus/${event._id}`,
            { withCredentials: true }
          );
          statusMap[event._id] = response.data.data;
        } catch (error) {
          console.log("Error fetching payment status for event", event._id, error);
          statusMap[event._id] = false;
        }
      }
      setPaymentStatusMap(statusMap);
      setLoading(false);
    };

    if (events.length > 0) {
      fetchPaymentStatuses();
    }
  }, [events]);

  useEffect(() => {
    let isMounted = true;
    let isFetching = false;

    const fetchEventOrders = async () => {
      if (isFetching) return;
      isFetching = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/events/orders/me`, { withCredentials: true });
        if (isMounted) {
          setEventOrders(response.data.data || []);
        }
      } catch (error) {
        console.log("Error fetching event orders", error);
      } finally {
        isFetching = false;
      }
    };

    fetchEventOrders();
    const intervalId = setInterval(fetchEventOrders, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const isPaidEventOrderStatus = (status) => {
    return [
      "succeeded",
      "Refund Initiated",
      "Refund_Initiated",
      "Refund_Pending_Approval",
      "Refunded",
    ].includes(status);
  };

  const getOrderEventId = (order) => {
    return order?.eventId?._id || order?.eventId?.id || order?.eventId;
  };

  const getEventOrder = (eventId) => {
    const normalizedEventId = (eventId || "").toString();
    return eventOrders.find((order) => {
      const orderEventId = getOrderEventId(order);
      return orderEventId && orderEventId.toString() === normalizedEventId;
    });
  };

  const hasAttendedEventOrder = (eventId) => {
    const order = getEventOrder(eventId);
    return Boolean(order && order.status === "succeeded");
  };

  const getReceiptUrl = (eventId) => {
    const match = getEventOrder(eventId);
    return match?.receiptUrl || null;
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
      const response = await axios.post(`${import.meta.env.VITE_URL_BACKEND}/api/v1/refunds/${selectedRefundOrderId}`, {
        reason: refundReason,
        orderType: "EventOrder"
      }, { withCredentials: true });
      toast.success(response.data?.message || "Refund requested successfully");
      setIsRefundModalOpen(false);
      const res = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/events/orders/me`, { withCredentials: true });
      setEventOrders(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit refund request");
    }
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
        const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/events/getAllEvent`, { withCredentials: true });
        const adminEventHistoryWithoutId = stripTopLevelId(response.data.data || []);
        navigate("/history", { state: { data: adminEventHistoryWithoutId } });
        setIsModalOpen(true);
        return;
      }

      const [eventResponse, orderResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/events/getAllEvent`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/events/orders/me`, { withCredentials: true }),
      ]);

      const userEvents = eventResponse.data.data || [];
      const userEventOrders = orderResponse.data.data || [];
      setEventOrders(userEventOrders);

      const paidEventIds = new Set(
        userEventOrders
          .filter((order) => isPaidEventOrderStatus(order?.status))
          .map((order) => getOrderEventId(order))
          .filter(Boolean)
          .map((id) => id.toString())
      );

      const paidEventHistory = userEvents.filter((event) =>
        paidEventIds.has((event?._id || event?.id || "").toString())
      );

      const paidEventHistoryWithoutId = stripTopLevelId(paidEventHistory);
      navigate("/history", { state: { data: paidEventHistoryWithoutId } });
      setIsModalOpen(true);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/events/createEvent`,
        formData,
        { withCredentials: true }
      );
      setEvents([...events, response.data.data]);
      setShowAddEventForm(false);
      toast.success("Event created successfully");
      setFormData({
        eventName: "",
        eventDate: "",
        venue: "",
        amtPerPerson: "",
        description: "",
        time: "",
        lastDateOfPay: "",
        category: ""
      });
    } catch (error) {
      toast.error("Failed to create event");
      console.error("Error creating event:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/events/deleteEvent/${eventId}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setEvents(events.filter(event => event._id !== eventId));
        toast.success("Event deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete event");
      console.error("Error deleting event:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <HashLoader size={52} color="#2563eb" loading={loading} />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading events…</p>
      </div>
    );
  }

  const getCategoryClass = (cat) => {
    if (cat === "Festival") return "bg-violet-100 text-violet-700";
    if (cat === "Meeting") return "bg-teal-100 text-teal-700";
    return "bg-pink-100 text-pink-700";
  };

  const tabs = [
    { id: "upcoming", label: "Upcoming Events", count: events.length },
    {
      id: "past",
      label: "Past Events",
      count: pastData.filter(ev => rolee === "admin" || hasAttendedEventOrder(ev._id || ev.id)).length,
    },
  ];

  const renderEventCard = (event, isPast = false) => {
    const order = getEventOrder(event._id);
    const isPaid = paymentStatusMap[event._id] === true;
    const isUnpaid = paymentStatusMap[event._id] === false;
    const isRefunded = order?.status === "Refunded";

    return (
      <div
        key={event._id || event.id || `${event.eventName}-${event.eventDate}`}
        className={`bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] transition-shadow${isPast ? " opacity-[0.82]" : ""}`}
      >
        {/* Title + category */}
        <div className="flex justify-between items-start gap-2.5">
          <h3 className="text-base font-medium text-gray-900 m-0 leading-[1.35]">{event.eventName}</h3>
          <span className={`py-[3px] px-2.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${getCategoryClass(event.category)}`}>
            {event.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-[0.84rem] text-gray-500 m-0 leading-[1.55] line-clamp-2">{event.description}</p>

        {/* Info rows */}
        <div className="flex flex-col gap-[5px] py-2.5 border-y border-gray-100">
          <div className="flex items-center gap-2 text-[0.84rem] text-gray-600">
            <BsCalendar2Date className="text-gray-400 flex-shrink-0 text-sm" />
            <span>{new Date(event.eventDate).toLocaleDateString("en-GB")}</span>
          </div>
          <div className="flex items-center gap-2 text-[0.84rem] text-gray-600">
            <FaRegClock className="text-gray-400 flex-shrink-0 text-sm" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-[0.84rem] text-gray-600">
            <IoLocationOutline className="text-gray-400 flex-shrink-0 text-sm" />
            <span>{event.venue}</span>
          </div>
        </div>

        {/* Price + last date footer */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span className="text-[0.95rem] font-medium text-gray-900">
            ₹{event.amtPerPerson} <span className="text-xs font-normal text-gray-400">/person</span>
          </span>
          <span className="text-xs text-gray-400">Pay by {new Date(event.lastDateOfPay).toLocaleDateString("en-GB")}</span>
        </div>

        {/* Action buttons */}
        {!isPast && (
          <div className="flex flex-col gap-1.5">
            {!loading && isRefunded && (
              <button type="button" disabled className="block w-full py-2 px-0 bg-gray-100 text-gray-400 border-none rounded-lg text-[0.82rem] cursor-not-allowed box-border">
                Refund Taken
              </button>
            )}

            {!loading && isUnpaid && !isRefunded && (
              <Link
                to={`/layout/payEvent/${event._id}`}
                className="block w-full py-[9px] px-0 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold text-center no-underline transition-colors box-border"
              >
                Pay Now
              </Link>
            )}

            {!loading && isPaid && !isRefunded && (
              <div className="flex flex-col gap-1.5">
                {getReceiptUrl(event._id) ? (
                  <>
                    <a
                      href={getReceiptUrl(event._id)}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full py-2 px-0 bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-600 rounded-[7px] text-[0.82rem] font-semibold text-center no-underline transition-colors box-border"
                    >
                      View Receipt
                    </a>

                    {order?.status === "succeeded" && (
                      <button
                        onClick={() => handleRequestRefundClick(getEventOrder(event._id)._id)}
                        className="block w-full py-2 px-0 bg-transparent hover:bg-orange-50 text-orange-700 border border-orange-400 rounded-[7px] text-[0.82rem] font-semibold cursor-pointer transition-colors box-border"
                      >
                        Request Refund
                      </button>
                    )}

                    {(order?.status === "Refund Initiated" || order?.status === "Refund_Initiated" || order?.status === "Refund_Pending_Approval") && (
                      <span className="block py-[7px] px-2.5 bg-orange-50 text-orange-700 rounded-[6px] text-xs font-semibold text-center">Refund Pending</span>
                    )}

                    {order?.status === "Refunded" && (
                      <span className="block py-[7px] px-2.5 bg-green-50 text-green-800 rounded-[6px] text-xs font-semibold text-center">Refunded</span>
                    )}
                  </>
                ) : (
                  <span className="block py-[7px] px-2.5 bg-gray-50 text-gray-400 rounded-[6px] text-xs text-center">Receipt unavailable</span>
                )}
              </div>
            )}

            {rolee === "admin" && (
              <button
                onClick={() => handleDeleteEvent(event._id)}
                className="block w-full py-2 px-0 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-[7px] text-[0.82rem] font-semibold cursor-pointer transition-colors box-border"
              >
                Delete Event
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const upcomingEvents = events;
  const filteredPast = pastData.filter(ev => rolee === "admin" || hasAttendedEventOrder(ev._id || ev.id));

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4 md:py-8 md:px-6 font-sans text-gray-900 bg-gray-50 min-h-screen">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 m-0 tracking-[-0.3px]">Events</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-0">Stay updated with society events and celebrations</p>
        </div>
        <div className="flex gap-2.5 items-center w-full sm:w-auto">
          <button
            onClick={fetchPreviousData}
            className="w-full sm:w-auto py-[9px] px-[18px] bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap"
          >
            History
          </button>
        </div>
      </div>

      {/* TAB BAR */}
      <div className="flex bg-gray-200/60 p-1 rounded-xl border border-gray-200/80 w-full sm:w-max max-w-full mb-6 overflow-x-auto no-scrollbar">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-1.5 px-4 font-semibold text-sm cursor-pointer transition-all duration-300 rounded-lg whitespace-nowrap border border-transparent ${
                isActive
                  ? "bg-white text-blue-700 shadow-sm border-gray-200/50"
                  : "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-xs font-medium ${
                isActive ? "bg-blue-100/80 text-blue-700" : "bg-gray-300/60 text-gray-600"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      <div className="min-h-[400px]">

        {/* UPCOMING */}
        {activeTab === "upcoming" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 m-0">Upcoming Events</h2>
                <p className="text-sm text-gray-400 mt-[3px] mb-0">Browse and register for society events</p>
              </div>
              {rolee === "admin" && (
                <button
                  onClick={() => setShowAddEventForm(!showAddEventForm)}
                  className="w-full sm:w-auto py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors"
                >
                  {showAddEventForm ? "✕ Cancel" : "+ Add Event"}
                </button>
              )}
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-[72px] px-6 text-center">
                <span className="text-5xl mb-3">🎉</span>
                <p className="text-lg font-semibold text-gray-700 m-0">No upcoming events</p>
                <p className="text-sm text-gray-400 mt-1.5 mb-0">Stay tuned — new events will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcomingEvents.map(ev => renderEventCard(ev, false))}
              </div>
            )}
          </section>
        )}

        {/* PAST */}
        {activeTab === "past" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 m-0">Past Events</h2>
                <p className="text-sm text-gray-400 mt-[3px] mb-0">Events you attended or that have ended</p>
              </div>
            </div>

            {filteredPast.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-[72px] px-6 text-center">
                <span className="text-5xl mb-3">🗂️</span>
                <p className="text-lg font-semibold text-gray-700 m-0">No past events</p>
                <p className="text-sm text-gray-400 mt-1.5 mb-0">Events you attended will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPast.map(ev => renderEventCard(ev, true))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* ADD EVENT MODAL */}
      {showAddEventForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-900 m-0">New Event</h2>
              <button onClick={() => setShowAddEventForm(false)} className="bg-transparent border-none text-lg text-gray-400 hover:text-gray-600 cursor-pointer p-1 leading-none">✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              {[
                { label: "Event Name", name: "eventName", type: "text" },
                { label: "Description", name: "description", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name} className="mb-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">{label}</label>
                  <input
                    type={type} name={name} value={formData[name]}
                    onChange={handleInputChange}
                    className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                    required
                  />
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="mb-4 flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Date</label>
                  <input type="date" name="eventDate"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.eventDate} onChange={handleInputChange}
                    className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                    required />
                </div>
                <div className="mb-4 flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Time</label>
                  <input placeholder="06:00 AM – 09:00 AM" type="text" name="time"
                    value={formData.time} onChange={handleInputChange}
                    className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                    required />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="mb-4 flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Venue</label>
                  <input type="text" name="venue" value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                    required />
                </div>
                <div className="mb-4 flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Amount / Person (₹)</label>
                  <input type="number" name="amtPerPerson" value={formData.amtPerPerson}
                    onChange={handleInputChange}
                    className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                    required />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="mb-4 flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Last Date to Pay</label>
                  <input type="date" name="lastDateOfPay"
                    min={new Date().toISOString().split("T")[0]}
                    max={formData.eventDate}
                    value={formData.lastDateOfPay} onChange={handleInputChange}
                    className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                    required />
                </div>
                <div className="mb-4 flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Category</label>
                  <input type="text" name="category" value={formData.category}
                    onChange={handleInputChange}
                    className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                    required />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 mt-6">
                <button type="button" onClick={() => setShowAddEventForm(false)} className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors">Cancel</button>
                <button type="submit" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors">Create Event</button>
              </div>
            </form>
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
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Reason for Refund</label>
                <textarea
                  name="refundReason" rows="4"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Please provide a valid reason..."
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors resize-y font-sans"
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
}

export default Event;
