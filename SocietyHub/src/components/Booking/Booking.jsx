import axios from "axios";
import React, { useEffect , useState } from "react";

const Booking = () => {

  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchVenues = async () =>{
      try {
        const response = await axios.get("http://localhost:8000/api/v1/booking/getVenue" , { withCredentials: true });
        setVenues(response.data.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    }
    fetchVenues();
  } , [])

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Venue Bookings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Venues */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Available Venues</h2>
            <button className="text-blue-600 hover:underline">View Calendar</button>
          </div>
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="border rounded-lg p-4 mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-800">{venue.venue}</h3>
                <p className="text-sm text-gray-600">{venue.description}</p>
                <p className="text-sm text-gray-600">Capacity: {venue.capacity}</p>
                <p className="text-sm text-gray-600">{venue.price}</p>
                <div className="mt-2 space-x-2">
                  {venue.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <button className="mt-4 sm:mt-0 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* Your Bookings */}
        {/* <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Upcoming</h3>
            {bookings.upcoming.map((booking, idx) => (
              <div
                key={idx}
                className="bg-blue-50 border rounded-lg p-4 mb-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-gray-800">{booking.name}</p>
                  <p className="text-sm text-gray-600">{booking.date}</p>
                  <span className="inline-block mt-1 bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded">
                    {booking.status}
                  </span>
                </div>
                <button className="text-red-500 hover:underline">Cancel</button>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Past Bookings</h3>
            {bookings.past.map((booking, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 mb-4 bg-gray-50"
              >
                <p className="font-bold text-gray-800">{booking.name}</p>
                <p className="text-sm text-gray-600">{booking.date}</p>
                <span className="inline-block mt-1 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                  {booking.status}
                </span>
              </div> */}
            {/* ))} */}
          {/* </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Booking; 
