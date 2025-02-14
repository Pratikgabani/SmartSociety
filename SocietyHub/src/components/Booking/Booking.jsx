import axios from "axios";
import { set } from "mongoose";
import React, { useEffect, useState } from "react";

const Booking = () => {
  const [venues, setVenues] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [formData, setFormData] = useState({
    bookingType: "",
    bookDescription: "",
    duration: "",
    date: "",
  });
  const [myBooking, setMyBooking] = useState([])

  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/booking/getVenue", { withCredentials: true });
        setVenues(response.data.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };
    fetchVenues();
  }, []);

  // Fetch my bookings
  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/booking/getBookingsByUserId", { withCredentials: true });
        console.log(response.data.data)
        setMyBooking(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchMyBookings()
  }, [])

  // Delete booking
  const handleDelete = async (bookingId) => {
    try {
     const response = await axios.delete(`http://localhost:8000/api/v1/booking/delete/${bookingId}`, { withCredentials: true });
     setMyBooking(myBooking.filter(booking => booking._id !== bookingId))
      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };
  const handleBookNow = (venue) => {
    setSelectedVenue(venue);
    setIsFormOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the venue's name as bookingType
      const response = await axios.post(
        "http://localhost:8000/api/v1/booking/new-booking",
        { ...formData, bookingType: selectedVenue.venue },  // Corrected here
        { withCredentials: true }
      );

      alert("Booking created successfully!");
      setMyBooking([...myBooking, response.data.data]);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Venue Bookings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Available Venues</h2>
            <button className="text-blue-600 hover:underline">View Calendar</button>
          </div>
          {venues.map((venue) => (
            <div key={venue._id} className="border rounded-lg p-4 mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{venue.venue}</h3>
                <p className="text-sm text-gray-600">{venue.description}</p>
                <p className="text-sm text-gray-600">Capacity: {venue.capacity}</p>
                <p className="text-sm text-gray-600">₹{venue.price} per day</p>
                <div className="mt-2 space-x-2">
                  {venue.amenities.map((amenity, idx) => (
                    <span key={idx} className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleBookNow(venue)}
                className="mt-4 sm:mt-0 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-blue-800 mt-8 mb-4">My Bookings</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {myBooking.map((booking) => (
            
            <div key={booking._id} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold">{booking.bookingType}</h3>
              <p className="text-gray-600">{booking.description}</p>
              <p className="text-gray-600">Duration: {booking.duration} hours</p>
              <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
              <p className="text-gray-600">Status : {(new Date(booking.date) >= Date.now()) ? "Upcoming" : "Completed"}</p>
              {new Date(booking.date) >= Date.now() && (
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete Booking
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Book {selectedVenue?.venue}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="bookDescription"
                  value={formData.bookDescription}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Duration (in hours)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div>
        Booking guidelines
      </div>
    </div>
  );
};

export default Booking;
