import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";

function Event() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readyState, setReadyState] = useState({});
  const [isAdmin , setIsAdmin] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
      const user = JSON.parse(token);  
      setIsAdmin(user.role === "admin");  
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(token);
  }, []);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/events/getAllEvent",
          { withCredentials: true }
        );

        setEvents(response.data.data);
        setLoading(false);

        const initialReadyState = response.data.data.reduce((acc, event) => {
          acc[event._id] = false;
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Need to add the field for pay now with the option i m ready*/}
      {isLoggedIn ? (
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Events</h1>
          <p className="text-gray-600 text-lg">Stay updated with society events and celebrations</p>
          <h3 className="text-3xl font-semibold mt-8">Upcoming Events</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {loading ? (
              <p>Loading...</p>
            ) : events.length === 0 ? (
              <p>No events found</p>
            ) : (
              events.map((event) => (
                <div key={event._id} className="bg-white rounded-lg shadow-lg p-6 border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                      {event.category}
                    </span>
                    <span className="text-gray-500 text-sm">{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{event.eventName}</h2>
                  <p className="text-gray-600 mt-2">{event.description}</p>
                  <div className="mt-4 flex items-center text-gray-600">
                    <FaRegClock className="mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="mt-2 flex items-center text-gray-600">
                    <IoLocationOutline className="mr-2" />
                    <span>{event.venue}</span>
                  </div>
                  <p className="mt-3 text-gray-700 font-semibold">Amount per person: ₹{event.amtPerPerson}</p>
                  <p className="text-gray-700">No. of Houses Ready: {event.totalHouseReady}</p>
                  <button
                    onClick={() => handleToggleReady(event._id)}
                    className={`w-full mt-4 py-2 rounded-lg font-bold text-white ${
                      readyState[event._id] ? "bg-green-500 hover:bg-green-600" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {readyState[event._id] ? "I am ready" : "I am not ready "}
                  </button>
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
