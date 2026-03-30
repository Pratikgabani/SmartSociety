import axios from "../../axios";
import React, { useContext, useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import { Toaster, toast } from "react-hot-toast";
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
    if(!refundReason.trim()) return toast.error("Reason is required");
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL_BACKEND}/api/v1/refunds/${selectedRefundOrderId}`, {
        reason: refundReason, 
        orderType: "EventOrder"
      }, { withCredentials: true });
      toast.success(response.data?.message || "Refund requested successfully");
      setIsRefundModalOpen(false);
      // Re-fetch to update status
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <HashLoader size={60} color="#2563eb" loading={loading} />
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container relative mx-auto px-4 py-8 bg-gray-100">
      <Toaster />
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Events</h1>
        <p className="text-gray-600 text-lg">Stay updated with society events and celebrations</p>

        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-semibold mt-4">Upcoming Events</h3>
          {rolee === "admin" && (
            <button
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-4"
              onClick={() => setShowAddEventForm(!showAddEventForm)}
            >
              {showAddEventForm ? "Cancel" : "Add Event"}
            </button>
          )}
        </div>

        {/* Event Creation Form (same as before) */}
        {showAddEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-4 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">New Event</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {[{ label: "Event Name", name: "eventName", type: "text" },
                    { label: "Description", name: "description", type: "text" }].map(({ label, name, type }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input type={type} name={name} value={formData[name]} onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required />
                    </div>
                  ))}
                  <div className="flex space-x-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input type="date" name="eventDate" min={new Date().toISOString().split("T")[0]}
                        value={formData.eventDate} onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input placeholder="06:00 AM - 09:00 AM" type="text" name="time" value={formData.time}
                        onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    {[{ label: "Venue", name: "venue", type: "text" },
                      { label: "Amount Per Person", name: "amtPerPerson", type: "number" }]
                      .map(({ label, name, type }) => (
                        <div key={name}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                          <input type={type} name={name} value={formData[name]} onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required />
                        </div>
                      ))}
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Date to Pay</label>
                      <input type="date" name="lastDateOfPay" min={new Date().toISOString().split("T")[0]} max={formData.eventDate}
                        value={formData.lastDateOfPay} onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input type="text" name="category" value={formData.category} onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddEventForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                  <button type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Event</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Events Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">{event.eventName}</h2>
                  <span className={`px-2 py-1 rounded-full text-sm ${event.category === "Festival" ? "bg-purple-100 text-purple-700"
                    : event.category === "Meeting" ? "bg-teal-100 text-teal-700"
                      : "bg-pink-100 text-pink-700"}`}>{event.category}</span>
                </div>
                <p className="text-gray-600 mt-2">{event.description}</p>
                <div className="text-sm text-gray-600 mt-4 space-y-1">
                  <div className="flex items-center"><BsCalendar2Date className="mr-2" /> {new Date(event.eventDate).toLocaleDateString("en-GB")}</div>
                  <div className="flex items-center"><FaRegClock className="mr-2" /> {event.time}</div>
                  <div className="flex items-center"><IoLocationOutline className="mr-2" /> {event.venue}</div>
                  <p>Amount: ₹{event.amtPerPerson}</p>
                  <p>Last Date: {new Date(event.lastDateOfPay).toLocaleDateString("en-GB")}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                {!loading && getEventOrder(event._id)?.status === 'Refunded' && (
                  <button
                    type="button"
                    disabled
                    className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-600 text-center cursor-not-allowed"
                  >
                    Refund taken 
                  </button>
                )}
                {!loading && paymentStatusMap[event._id] === false && getEventOrder(event._id)?.status !== 'Refunded' && (
                  <Link to={`/layout/payEvent/${event._id}`}
                    className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-center hover:bg-blue-700">Pay Now</Link>
                )}
                {!loading && paymentStatusMap[event._id] === true && getEventOrder(event._id)?.status !== 'Refunded' && (
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    {getReceiptUrl(event._id) ? (
                      <div className="flex flex-col gap-2">
                        <a
                          href={getReceiptUrl(event._id)}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold text-center hover:bg-blue-50 block transition-colors"
                        >
                          View receipt
                        </a>
                        
                        {getEventOrder(event._id)?.status === 'succeeded' && (
                          <button
                            onClick={() => handleRequestRefundClick(getEventOrder(event._id)._id)}
                            className="w-full py-2 rounded-lg bg-orange-100 text-orange-700 font-semibold text-center hover:bg-orange-200 transition-colors"
                          >
                            Request Refund
                          </button>
                        )}
                        {(getEventOrder(event._id)?.status === 'Refund Initiated' || getEventOrder(event._id)?.status === 'Refund_Initiated' || getEventOrder(event._id)?.status === 'Refund_Pending_Approval') && (
                          <span className="w-full py-2 text-sm text-orange-500 font-semibold text-center bg-orange-50 rounded-lg">Refund Pending</span>
                        )}
                        {getEventOrder(event._id)?.status === 'Refunded' && (
                          <span className="w-full py-2 text-sm text-green-500 font-semibold text-center bg-green-50 rounded-lg">Refunded</span>
                        )}
                      </div>
                    ) : (
                      <span className="w-full py-2 text-sm text-gray-500 font-semibold text-center bg-gray-100 rounded-lg cursor-not-allowed">Receipt unavailable</span>
                    )}
                  </div>
                )}
                {rolee === "admin" && (
                  <button onClick={() => handleDeleteEvent(event._id)}
                    className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Past Events */}
        <h3 className="text-2xl font-semibold mt-8">Past Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {pastData
            .filter((event) => rolee === "admin" || hasAttendedEventOrder(event._id || event.id))
            .map((event) => (
            <div key={event._id || event.id || `${event.eventName}-${event.eventDate}`} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">{event.eventName}</h2>
                <span className={`px-2 py-1 rounded-full text-sm ${event.category === "Festival" ? "bg-purple-100 text-purple-700"
                  : event.category === "Meeting" ? "bg-teal-100 text-teal-700"
                    : "bg-pink-100 text-pink-700"}`}>{event.category}</span>
              </div>
              <p className="text-gray-600 mt-2">{event.description}</p>
              <div className="text-sm text-gray-600 mt-4 space-y-1">
                <div className="flex items-center"><BsCalendar2Date className="mr-2" /> {new Date(event.eventDate).toLocaleDateString("en-GB")}</div>
                <div className="flex items-center"><FaRegClock className="mr-2" /> {event.time}</div>
                <div className="flex items-center"><IoLocationOutline className="mr-2" /> {event.venue}</div>
                <p>Amount: ₹{event.amtPerPerson}</p>
                <p>Last Date: {new Date(event.lastDateOfPay).toLocaleDateString("en-GB")}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={fetchPreviousData} className="absolute top-8 right-5 rounded-lg px-3 py-2 text-white bg-blue-600">
          History
        </button>

        {/* Refund Form Modal */}
        {isRefundModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-4 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Request Refund
              </h2>
              <form onSubmit={submitRefundRequest}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Refund
                    </label>
                    <textarea
                      name="refundReason"
                      rows="4"
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      placeholder="Please provide a valid reason..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRefundModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Event;
