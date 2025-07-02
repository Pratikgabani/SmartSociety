import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { HashLoader } from 'react-spinners';
import { Link } from "react-router-dom";
function Event() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [readyState, setReadyState] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [pastData, setPastData] = useState([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [paymentStatusMap, setPaymentStatusMap] = useState({});
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
  const [previousData, setPreviousData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

// Fetch payment statuses
  useEffect(() => {
  const fetchPaymentStatuses = async () => {
    const statusMap = {};
    for (let event of events) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/events/paymentStatus/${event._id}`,
          { withCredentials: true }
        );
        statusMap[event._id] = response.data.data; // true or false
      } catch (error) {
        console.log("Error fetching payment status for event", event._id, error);
        statusMap[event._id] = false; // default to unpaid on error
      }
    }
    setPaymentStatusMap(statusMap);
  };

  if (events.length > 0) {
    fetchPaymentStatuses();
  }
}, [events]);

  // Fetch user info from localStorage
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
      const user = JSON.parse(token);
      setIsAdmin(user.data.user.role === "admin");
    }
  }, []);

  // Fetch upcoming events
  useEffect(() => {
    const getUpcomingEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/events/getUpcomingEvents",
          { withCredentials: true }
        );

        setEvents(response.data.data);
        setLoading(false);
        // if (response.data.data.length === 0) {
        //   toast.error("No events found!");
        // }

        // Get user ID from localStorage
        const token = localStorage.getItem("user");
        const user = token ? JSON.parse(token) : null;
        const userId = user?.data.user._id;

      } catch (error) {
        console.log("Error in getting events", error);
        setLoading(false);
      }
    };

    getUpcomingEvents();
  }, []);

  // Fetch past events
  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/events/getPastEvents",
          { withCredentials: true }
        );
        setPastData(response.data.data);
        setLoading(false);
        // if(response.data.data.length === 0){
        //   toast.error("No events found!");
        // }
      } catch (error) {
        console.log("Error in getting events", error);
        setLoading(false);
      }
    }
    fetchPastEvents();
  }, [])

  // Fetch previous events
  const fetchPreviousData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/events/getAllEvent", { withCredentials: true })
      setPreviousData(response.data.data)
      navigate("/history", { state: { data: response.data.data } });
      setIsModalOpen(true)
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };  

  // Handle input changes for the add event form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission to create a new event
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/events/createEvent",
        formData,
        { withCredentials: true }
      );

      setEvents([...events, response.data.data]); // Add the new event to the state
      setShowAddEventForm(false); // Hide form after successful submission
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

      // console.log("Event created successfully");
    } catch (error) {
      toast.error("Failed to create event");
      console.error("Error creating event:", error);
    }
  };

  // Handle deletion of an event
  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/events/deleteEvent/${eventId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Remove the deleted event from the state
        setEvents(events.filter(event => event._id !== eventId));
        toast.success("Event deleted successfully");
        // console.log("Event deleted successfully");
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
          {isAdmin && (
            <button
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-4"
              onClick={() => setShowAddEventForm(!showAddEventForm)}
            >
              {showAddEventForm ? "Cancel" : "Add Event"}
            </button>
          )}
        </div>

        {/* Add Event Form */}
        {showAddEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-4 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">New Event</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Inputs */}
                  {[
                    { label: "Event Name", name: "eventName", type: "text" },
                    { label: "Description", name: "description", type: "text" },
                  ].map(({ label, name, type }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  ))}
                  {/* Date and Time */}
                  <div className="flex space-x-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        name="eventDate"
                        min={new Date().toISOString().split("T")[0]}
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        placeholder="06:00 AM - 09:00 AM"
                        type="text"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  {/* Venue + Amount */}
                  <div className="flex space-x-4">
                    {[
                      { label: "Venue", name: "venue", type: "text" },
                      { label: "Amount Per Person", name: "amtPerPerson", type: "number" }
                    ].map(({ label, name, type }) => (
                      <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <input
                          type={type}
                          name={name}
                          value={formData[name]}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    ))}
                  </div>
                  {/* Last Date + Category */}
                  <div className="flex space-x-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Date to Pay</label>
                      <input
                        type="date"
                        name="lastDateOfPay"
                        min={new Date().toISOString().split("T")[0]}
                        max={formData.eventDate}
                        value={formData.lastDateOfPay}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddEventForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Upcoming Events */}
       <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mt-6 px-4 sm:px-6">
  {loading ? (
    <div className="col-span-full flex flex-col items-center justify-center min-h-[50vh]">
      <HashLoader size={60} color="#2563eb" loading={loading} />
      <p className="mt-4 text-lg text-gray-700">Loading...</p>
    </div>
  ) : events.length === 0 ? (
    <p className="col-span-full text-center text-gray-500 py-10">No events found</p>
  ) : (
    events.map((event) => (
      <div
        key={event._id}
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 md:p-6 border h-full flex flex-col"
      >
        <div className="flex-grow space-y-3">
          <div className="flex justify-between items-start gap-2">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 line-clamp-2">
              {event.eventName}
            </h2>
            <span
              className={`px-2 py-1 text-xs md:text-sm ${
                event.category === "Festival"
                  ? "text-purple-700 bg-purple-100"
                  : event.category === "Meeting"
                  ? "bg-teal-100 text-teal-700"
                  : "text-pink-700 bg-pink-100"
              } rounded-full font-medium whitespace-nowrap`}
            >
              {event.category}
            </span>
          </div>

          <p className="text-sm md:text-base text-gray-600 line-clamp-3">
            {event.description}
          </p>
          
          <div className="space-y-2 text-sm md:text-base">
            <div className="flex items-center text-gray-600">
              <BsCalendar2Date className="mr-2 flex-shrink-0" />
              <span>{new Date(event.eventDate).toLocaleDateString("en-GB")}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaRegClock className="mr-2 flex-shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <IoLocationOutline className="mr-2 flex-shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            <p className="text-gray-700 font-semibold">
              Amount: ₹{event.amtPerPerson}
            </p>
            <p className="text-gray-700">
              Last Date: {new Date(event.lastDateOfPay).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          {/* Show Pay Now button only if not paid */}
          {!paymentStatusMap[event._id] && (
            <Link
              to={`/layout/payEvent/${event._id}`}
              className="flex-1 min-w-[120px] py-2 rounded-lg font-medium text-sm md:text-base text-white bg-blue-600 hover:bg-blue-700 text-center flex items-center justify-center"
            >
              Pay Now
            </Link>
          )}

          {/* Admin delete button always visible */}
          {isAdmin && (
            <button
              onClick={() => handleDeleteEvent(event._id)}
              className={`py-2 rounded-lg font-medium text-sm md:text-base text-white bg-red-600 hover:bg-red-700 ${
                !paymentStatusMap[event._id] ? "flex-1 min-w-[120px]" : "w-full"
              }`}
            >
              Delete Event
            </button>
          )}
        </div>
      </div>
    ))
  )}
</div>



        {/* Past Events */}
        <h3 className="text-2xl font-semibold mt-8">Past Events</h3>
<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mt-6 px-4 sm:px-6">
  {loading ? (
    <div className="col-span-full flex flex-col items-center justify-center min-h-[50vh]">
      <HashLoader size={60} color="#2563eb" loading={loading} />
      <p className="mt-4 text-lg text-gray-700">Loading...</p>
    </div>
  ) : pastData.length === 0 ? (
    <p className="col-span-full text-center text-gray-500 py-10">No past events found</p>
  ) : (
    pastData.map((event) => (
      <div
        key={event._id}
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 md:p-6 border h-full flex flex-col"
      >
        <div className="flex-grow space-y-3">
          <div className="flex justify-between items-start gap-2">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 line-clamp-1">
              {event.eventName}
            </h2>
            <span
              className={`px-3 py-1 text-xs md:text-sm ${
                event.category === "Festival"
                  ? "text-purple-700 bg-purple-100"
                  : event.category === "Meeting"
                  ? "bg-teal-100 text-teal-700"
                  : "text-pink-700 bg-pink-100"
              } rounded-full font-medium whitespace-nowrap`}
            >
              {event.category}
            </span>
          </div>

          <p className="text-sm md:text-base text-gray-600 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 text-sm md:text-base">
            <div className="flex items-center text-gray-600">
              <BsCalendar2Date className="mr-2 flex-shrink-0" />
              <span>{new Date(event.eventDate).toLocaleDateString("en-GB")}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaRegClock className="mr-2 flex-shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <IoLocationOutline className="mr-2 flex-shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            <p className="text-gray-700 font-semibold">
              Amount : ₹{event.amtPerPerson}
            </p>
            {/* <p className="text-gray-700">No. of Houses Ready: {event.totalHouseReady}</p> */}
            <p className="text-gray-700">
              Last Date to Pay: {new Date(event.lastDateOfPay).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>
      </div>
    ))
  )}
</div>


        {/* History Button */}
        <div>
          <button onClick={fetchPreviousData} className="absolute top-8 right-5 rounded-lg px-3 py-2 bg-blue-400">
            History
          </button>
        </div>
      </div>
    </div>
  );
}

export default Event;