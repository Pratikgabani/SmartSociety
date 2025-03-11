import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import {Toaster , toast} from 'react-hot-toast'
import PreviousDataModal from "../history/PreviousDataModal .jsx";
function Event() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readyState, setReadyState] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [pastData , setPastData] = useState([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false); 
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
  const [isModalOpen , setIsModalOpen] = useState(false);

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
        if(response.data.data.length === 0){
          toast.error("No events found!");
        }

        // Get user ID from localStorage
        const token = localStorage.getItem("user");
        const user = token ? JSON.parse(token) : null;
        const userId = user?.data.user._id;

        // Initialize readyState based on whether the user is in readyUsers
        const initialReadyState = response.data.data.reduce((acc, event) => {
          acc[event._id] = event.readyUsers.includes(userId);
          return acc;
        }, {});

        setReadyState(initialReadyState);
      } catch (error) {
        console.log("Error in getting events", error);
        setLoading(false);
      }
    };

    getUpcomingEvents();
  }, []);

  // Fetch past events
    useEffect(() => {
      const fetchPastEvents = async () =>{
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
    } , [])

  // Fetch previous events
  const fetchPreviousData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/events/getAllEvent", { withCredentials: true })
      setPreviousData(response.data.data)
      setIsModalOpen(true)
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  // Toggle readiness for an event
  const handleToggleReady = async (eventId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/events/toggleResponse/${eventId}`,
        {},
        { withCredentials: true }
      );

      setEvents(events.map(event =>
        event._id === eventId ? { ...event, totalHouseReady: response.data.data.totalHouseReady } : event
      ));

      setReadyState(prevState => ({
        ...prevState,
        [eventId]: !prevState[eventId]
      }));
    } catch (error) {
      console.error("Error toggling response:", error);
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
      
      console.log("Event created successfully");
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
        console.log("Event deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete event");
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      {isLoggedIn ? (
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Events</h1>
          <p className="text-gray-600 text-lg">Stay updated with society events and celebrations</p>

          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold mt-4">Upcoming Events</h3>
            {isAdmin && (
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded mt-4"
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                New Event
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Name
                    </label>
                    <input
                      type="text"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                       Date
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
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
                  <div className="flex space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Venue
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount Per Person
                    </label>
                    <input
                      type="number"
                      name="amtPerPerson"
                      value={formData.amtPerPerson}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  </div>
                  <div className="flex space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Date to Pay
                    </label>
                    <input
                      type="date"
                      name="lastDateOfPay"
                      min={new Date().toISOString().split("T")[0]}
                      max = {formData.eventDate}
                      value={formData.lastDateOfPay}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
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
                    className="px-5 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                  onClick={handleSubmit}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {loading ? (
              <p>Loading...</p>
            ) : events.length === 0 ? (
              <p>No events found</p>
            ) : (
              events.map((event) => (
                <div key={event._id} className="bg-white rounded-lg shadow-lg p-6 border h-[370px] grid grid-rows-[auto,1fr,auto] gap-4">      
                  {/* Main Content Section */}
                  <div className="space-y-2 ">
                    <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-1 min-h-[28px]">
                      {event.eventName}
                    </h2>
                    <span className={`px-3 py-1 line-clamp-1  ${event.category === "Festival" ? "text-purple-700 bg-purple-100"  : event.category === "Meeting" ? "bg-teal-100 text-teal-700" : "text-pink-700 bg-pink-100"} bg-blue-100 text-blue-800 rounded-full text-sm font-medium`}>
                      {event.category}
                    </span>

                    </div>

                    <p className="text-gray-600 line-clamp-2 min-h-[48px]">
                      {event.description}
                    </p>

                    <div className="flex items-center text-gray-600">
                      <BsCalendar2Date className="mr-2" />
                      <span>{new Date(event.eventDate).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaRegClock className="mr-2" />
                      <span>{event.time}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <IoLocationOutline className="mr-2" />
                      <span className="truncate">{event.venue}</span>
                    </div>

                    <p className="text-gray-700 font-bold min-h-[20px]">
                      Amount per person: ₹{event.amtPerPerson}
                    </p>

                    <p className="text-gray-700 min-h-[20px]">
                      No. of Houses Ready: {event.totalHouseReady}
                    </p>

                    <p className="text-gray-700 min-h-[20px]">
                      Last Date to Pay: {new Date(event.lastDateOfPay).toLocaleDateString('en-GB')}
                    </p>
                  </div>

                  {/* Buttons Section */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleReady(event._id)}
                      className={`flex-1 py-2 rounded-lg font-bold text-white ${
                        readyState[event._id]
                          ? "bg-red-600 hover:bg-red-700" // "I am ready" state
                          : "bg-green-500 hover:bg-green-600" // "I am not ready" state
                      }`}
                    >
                      {readyState[event._id] ? "I'm not ready" : "I'm ready"}
                    </button>

                    {/* Show "Pay Now" button only when user is NOT ready */}
                    {readyState[event._id] && (
                      <button className="flex-1 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700">
                        Pay Now
                      </button>
                    )}

                    {/* Delete button for admin */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="flex-1 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700"
                      >
                        Delete Event
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Past events */}
          <h3 className="text-2xl font-semibold mt-8">Past Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {loading ? (
              <p>Loading...</p>
            ) : pastData.length === 0 ? (
              <p>No events found</p>
            ) : (
              pastData.map((event) => (
                <div key={event._id} className="bg-white rounded-lg shadow-lg p-6 border h-[330px] grid grid-rows-[auto,1fr,auto] gap-4">      
                  {/* Main Content Section */}
                  <div className="space-y-2 ">
                    <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-1 min-h-[28px]">
                      {event.eventName}
                    </h2>
                    <span className={`px-3 py-1 line-clamp-1  ${event.category === "Festival" ? "text-purple-700 bg-purple-100"  : event.category === "Meeting" ? "bg-teal-100 text-teal-700" : "text-pink-700 bg-pink-100"} bg-blue-100 text-blue-800 rounded-full text-sm font-medium`}>
                      {event.category}
                    </span>

                    </div>

                    <p className="text-gray-600 line-clamp-2 min-h-[40px]">
                      {event.description}
                    </p>

                    <div className="flex items-center text-gray-600">
                      <BsCalendar2Date className="mr-2" />
                      <span>{new Date(event.eventDate).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaRegClock className="mr-2" />
                      <span>{event.time}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <IoLocationOutline className="mr-2" />
                      <span className="truncate">{event.venue}</span>
                    </div>

                    <p className="text-gray-700 font-bold min-h-[20px]">
                      Amount per person: ₹{event.amtPerPerson}
                    </p>

                    <p className="text-gray-700 min-h-[20px]">
                      No. of Houses Ready: {event.totalHouseReady}
                    </p>

                    <p className="text-gray-700 min-h-[20px]">
                      Last Date to Pay: {new Date(event.lastDateOfPay).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">You are not logged in</p>
      )}
      {/* History */}
      {isAdmin && (
            <div><button onClick={fetchPreviousData} className='absolute top-8 right-5 rounded-lg px-3 py-2 bg-blue-400'>History</button>
            <PreviousDataModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    data={previousData}
                  />
                  </div>
           )}   
    </div>
  );
}

export default Event;