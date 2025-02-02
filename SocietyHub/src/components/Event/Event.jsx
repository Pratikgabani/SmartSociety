import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";


function Event() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false)
 
  // Check token
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

      // Update state with the new event data
      setEvents(events.map(event => 
        event._id === eventId ? { ...event, totalHouseReady: response.data.data.totalHouseReady } : event
      ));
    } catch (error) {
      console.error("Error toggling response:", error);
    }
  };
  
  

  return (
    <div>
      {isLoggedIn ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">Events</h1>
          <p>Stay updated with society events and celebrations</p>
          <h3 className="text-2xl font-semibold">Upcoming Events</h3>
          <div className="flex flex-wrap justify-center items-center mt-4">
            {loading ? (
              <p>Loading...</p>
            ) : events.length === 0 ? (
              <p>No events found</p>
            ) : (
              events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-lg shadow-md p-4 m-4 w-1/4"
                >
                  <div className="flex items-center justify-between text-gray-600 text-sm">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm">
                      {event.category}
                    </span>
                    <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-xl font-bold mt-3">{event.eventName}</h2>
                  <p className="text-gray-700 mt-1">{event.description}</p>
                  <div className="mt-3 text-gray-600 text-base flex items-center gap-2">
                    <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-gray-600 text-base flex items-center gap-10">
                    <div className="flex items-center gap-1">
                      <IoLocationOutline />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaRegClock />
                      <span>{event.time}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base mt-2">
                    <strong>Amount per person:</strong> ₹{event.amtPerPerson}
                  </p>
                  <div className="mt-2">
                    <strong>No. of Houses Ready:</strong> {event.totalHouseReady}
                  </div>
                  <button
                    onClick={() =>
                      { 
                        handleToggleReady(event._id)
                        setIsReady(!isReady)
                      }}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                  >
                    {isReady ? "I am not ready" : "I am ready"}
                  </button>

                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <p>You are not logged in</p>
      )}
    </div>
  );
}


export default Event;