import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import {Toaster , toast} from 'react-hot-toast'
function Event() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readyState, setReadyState] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false); // To toggle form
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    eventDate: "",
    venue: "",
    amtPerPerson: "",
    description: "",
    time: "",
    lastDateOfPay: "",
    category: ""
  });

  // Fetch user info from localStorage
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
      const user = JSON.parse(token);
      setIsAdmin(user.data.user.role === "admin");
    }
  }, []);

  // Fetch events
  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/events/getAllEvent",
          { withCredentials: true }
        );

        setEvents(response.data.data);
        setLoading(false);

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

    getEvents();
  }, []);

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
    setNewEvent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission to create a new event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/events/createEvent",
        newEvent,
        { withCredentials: true }
      );

      setEvents([...events, response.data.data]); // Add the new event to the state
      setShowAddEventForm(false); // Hide form after successful submission
      toast.success("Event created successfully");
      setNewEvent({
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
          <h1 className="text-4xl font-bold text-gray-800">Events</h1>
          <p className="text-gray-600 text-lg">Stay updated with society events and celebrations</p>

          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-semibold mt-4">Upcoming Events</h3>
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
            <form className="bg-white p-6 rounded-lg shadow-lg mt-6" onSubmit={handleAddEvent}>
              <h2 className="text-2xl font-bold mb-4">Create New Event</h2>

              {["eventName", "eventDate", "venue", "amtPerPerson", "description", "time", "lastDateOfPay", "category"].map((field) => (
                <div className="mb-4" key={field}>
                  <label className="block text-gray-700 font-semibold capitalize">
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                  </label>
                  <input
                    type={field.includes("Date") ? "text" : field.includes("time") ? "time" : "text"}
                    name={field}
                    value={newEvent[field]}
                    onChange={handleInputChange}
                    placeholder={field.includes("Date") ? "YYYY-MM-DD" : ""}
                    className="w-full p-2 border rounded-lg"
                    pattern={field.includes("Date") ? "\\d{4}-\\d{2}-\\d{2}" : undefined} // Enforce date format
                    required
                  />
                </div>
              ))}

              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg mt-4">
                Create Event
              </button>
            </form>
          )}

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
                    <span className={`px-3 py-1  ${event.category === "Festival" ? "text-purple-700 bg-purple-100"  : event.category === "Meeting" ? "bg-teal-100 text-teal-700" : "text-pink-700 bg-pink-100"} bg-blue-100 text-blue-800 rounded-full text-sm font-medium`}>
                      {event.category}
                    </span>

                    </div>

                    <p className="text-gray-600 line-clamp-2 min-h-[40px]">
                      {event.description}
                    </p>

                    <div className="flex items-center text-gray-600">
                      <BsCalendar2Date className="mr-2" />
                      <span>{new Date(event.eventDate).toLocaleDateString()}</span>
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
                      Last Date to Pay: {new Date(event.lastDateOfPay).toLocaleDateString()}
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
                      {readyState[event._id] ? "I am not ready" : "I am ready"}
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
        </div>
      ) : (
        <p className="text-gray-600">You are not logged in</p>
      )}
    </div>
  );
}

export default Event;