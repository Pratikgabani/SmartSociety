import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import PreviousDataModal from "../history/PreviousDataModal .jsx";
// import PratikPreviousDataModal from "../history/PratikPreviousDataModel.jsx";
import { RiDeleteBin6Fill } from "react-icons/ri";

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
  })
  const [amenityInput, setAmenityInput] = useState("");
  const [myBooking, setMyBooking] = useState([]);
  const [myPastBooking, setMyPastBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [previousData, setPreviousData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  // Fetch user info from localStorage
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
      const user = JSON.parse(token);
      setIsAdmin(user.data.user.role === "admin");
    }
  }, []);

  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/booking/getVenue", { withCredentials: true });
        setVenues(response.data.data);
        setLoading(false);
        if (response.data.data.length === 0) toast.error("No Venues found!");
      } catch (error) {
        console.error("Error fetching venues:", error);
        toast.error("Failed to fetch venues!"); // Toast for error
      }
    };
    fetchVenues();
  }, []);

  // Fetch my bookings
  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/booking/getUpcomingBookingsByUserId", { withCredentials: true });
        setMyBooking(response.data.data);
        setLoading(false);

        // toast.success("Bookings fetched successfully!"); // Toast for success
      } catch (error) {
        console.log(error);
        // toast.error("Failed to fetch bookings!"); // Toast for error
      }
    };
    fetchMyBookings();
  }, []);

  // Past bookings
  useEffect(() => {
    const fetchMyPastBookings = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/booking/getPastBookingsByUserId", { withCredentials: true });
        setMyPastBooking(response.data.data);
        setLoading(false);

        // toast.success("Bookings fetched successfully!"); // Toast for success
      } catch (error) {
        console.log(error);
        // toast.error("Failed to fetch bookings!"); // Toast for error
      }
    };
    fetchMyPastBookings();
  }, []);

  // Fetch previous data (for admin only)
  const fetchPreviousData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/booking/all-Bookings", { withCredentials: true })
      setPreviousData(response.data.data)
      navigate("/history", { state: { data: response.data.data } });
      setIsModalOpen(true)
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  // Delete booking
  const handleDelete = async (bookingId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/booking/delete/${bookingId}`, { withCredentials: true });
      setMyBooking(myBooking.filter((booking) => booking._id !== bookingId));
      toast.success("Booking deleted successfully!"); // Toast for success
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking!"); // Toast for error
    }
  };

  // Book now
  const handleBookNow = (venue) => {
    setSelectedVenue(venue);
    setIsFormOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the input field is for "duration", ensure it's 18 or less
    if (name === "duration" && value > 18) {
      toast.error("Booking duration cannot exceed 18 hours!");
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle venue form input changes
  const handleVenueInputChange = (e) => {
    const { name, value } = e.target;
    setVenueFormData({
      ...venueFormData,
      [name]: value,
    });
  }

  // Add amenity
  const handleAddAmenity = () => {
    if (amenityInput.trim() !== "") {
      setVenueFormData({
        ...venueFormData,
        amenities: [...venueFormData.amenities, amenityInput.trim()],
      });
      setAmenityInput(""); // Clear input
    }
  };

  // Remove amenity
  const handleRemoveAmenity = (index) => {
    const updatedAmenities = venueFormData.amenities.filter((_, i) => i !== index);
    setVenueFormData({ ...venueFormData, amenities: updatedAmenities });
  };

  // Handle venue form submit
  const handleVenueSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/booking/createVenue",
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
  }

  // Delete venue
  const handleDeleteVenue = async (venueId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/booking/deleteVenue/${venueId}`, { withCredentials: true });
      setVenues(venues.filter((venue) => venue._id !== venueId));
      toast.success("Venue deleted successfully!"); // Toast for success
    } catch (error) {
      console.error("Error deleting venue:", error);
      toast.error("Failed to delete venue!"); // Toast for error
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the venue's name as bookingType
      const response = await axios.post(
        "http://localhost:8000/api/v1/booking/new-booking",
        { ...formData, bookingType: selectedVenue.venue }, // Corrected here
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
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <Toaster />
      {
        isLoggedIn ? (
          <div className="">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Venue Bookings
            </h1>
            <p className="text-gray-600 text-lg">Easily book society venues for your events and gatherings.</p>


            {/* Available Venues Section */}
            <section className="mb-12">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl mt-4 font-semibold text-gray-800">Available Venues</h2>
                {isAdmin && (
                  <button
                    onClick={() => setIsVenueFormOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded mt-4  mb-4"
                  >
                    Add Venue
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {loading ? (
                  <p>Loading...</p>
                ) : venues.length === 0 ? (
                  <p>No venues available.</p>
                ) :
                  (venues.map((venue) => (
                    <div
                      key={venue._id}
                      className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-3">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{venue.venue}</h3>
                          {isAdmin && (
                            <button onClick={() => handleDeleteVenue(venue._id)} className="text-red-500 hover:bg-red-100 p-2 rounded-md transition-colors">
                              <RiDeleteBin6Fill  size={20} />
                            </button>
                          )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{venue.description}</p>
                          <div className="flex gap-2 mb-4 flex-wrap">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              Capacity: {venue.capacity}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              ₹{venue.price}/day
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {venue.amenities.map((amenity, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleBookNow(venue)}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
                        >
                          Reserve Now
                        </button>
                      </div>
                    </div>
                  )))}
              </div>
            </section>

            {/* My Bookings Section */}
            {/* Upcoming Bookings */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upcoming Bookings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <p>Loading...</p>

                ) : myBooking.length === 0 ? (
                  <p>No upcoming bookings.</p>

                ) :
                  (myBooking.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {booking.bookingType}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">{booking.bookDescription}</p>
                          <div className="space-y-1 text-sm mb-4">
                            <p className="text-gray-500">
                              ⏳ Duration: {booking.duration} hours
                            </p>
                            <p className="text-gray-500 pb-2">
                              📅 Date: {new Date(booking.date).toLocaleDateString('en-GB')}
                            </p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${new Date(booking.date) >= Date.now()
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                              }`}>
                              {new Date(booking.date) >= Date.now() ? "Upcoming" : "Completed"}
                            </span>
                          </div>
                        </div>
                        {new Date(booking.date) >= Date.now() && (
                          <div className="flex justify-between">
                            <button
                              onClick={() => handleDelete(booking._id)}
                              className="mt-1 w-5/12 px-1 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              Cancel Reservation
                            </button>
                            <button className="mt-1 w-5/12 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                              Pay now
                            </button>
                          </div>

                        )}
                      </div>
                    </div>
                  )))}
              </div>
            </section>

            {/* Past Bookings */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Past Bookings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPastBooking.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {booking.bookingType}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{booking.bookDescription}</p>
                        <div className="space-y-1 text-sm mb-4">
                          <p className="text-gray-500">
                            ⏳ Duration: {booking.duration} hours
                          </p>
                          <p className="text-gray-500 pb-2">
                            📅 Date: {new Date(booking.date).toLocaleDateString()}
                          </p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${new Date(booking.date) >= Date.now()
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {new Date(booking.date) >= Date.now() ? "Upcoming" : "Completed"}
                          </span>
                        </div>
                      </div>
                      {new Date(booking.date) >= Date.now() && (
                        <div className="flex justify-between">
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="mt-1 w-5/12 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Cancel Reservation
                          </button>
                          <button className="mt-1 w-5/12 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Pay now
                          </button>
                        </div>

                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Booking Form Modal */}
            {isFormOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-4 border border-gray-100">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Reserve {selectedVenue?.venue}
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Description
                        </label>
                        <input
                          type="text"
                          name="bookDescription"
                          value={formData.bookDescription}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration (hours)
                        </label>
                        <input
                          type="number"
                          name="duration"
                          min="1"
                          max="18"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Booking Date
                        </label>
                        <input
                          type="date"
                          name="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="px-5 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Confirm Reservation
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Venue Add Form Modal */}
            {isVenueFormOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-4 border border-gray-100">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Add Venue
                  </h2>
                  <form onSubmit={handleVenueSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Venue Name
                        </label>
                        <input
                          type="text"
                          name="venue"
                          value={venueFormData.venue}
                          onChange={handleVenueInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Venue Description
                        </label>
                        <input
                          type="text"
                          name="description"
                          value={venueFormData.description}
                          onChange={handleVenueInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      {/* amenities */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Venue Amenities
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={amenityInput}
                            onChange={(e) => setAmenityInput(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter an amenity"
                          />
                          <button
                            type="button"
                            onClick={handleAddAmenity}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      {venueFormData.amenities.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Added Amenities:</p>
                          <div className="flex flex-wrap gap-2">
                            {venueFormData.amenities.map((amenity, index) => (
                              <span
                                key={index}
                                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                              >
                                {amenity}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAmenity(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Venue Capacity
                        </label>
                        <input
                          type="number"
                          name="capacity"
                          value={venueFormData.capacity}
                          onChange={handleVenueInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      {/* price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Venue Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={venueFormData.price}
                          onChange={handleVenueInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>



                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsVenueFormOpen(false)}
                        className="px-5 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Venue
                      </button>
                    </div>
                  </form>
                </div>
              </div>


            )}

            {/* Booking Guidelines */}
            <section className="bg-blue-50 rounded-xl p-6 mt-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Reservation Guidelines</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>All reservations must be made at least 24 hours in advance</li>
                <li>Cancellations require 12 hours notice for full refund</li>
                <li>Maximum reservation duration is 18 hours</li>
                <li>Please arrive 30 minutes before your scheduled time</li>
              </ul>
            </section>
          </div>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <p className="text-gray-600">Please log in to view this page.</p>
          </div>
        )
      }

      {/* History */}
      {/* {isAdmin && ( */}
        <div><button onClick={fetchPreviousData} className='absolute top-8 right-5 rounded-lg px-3 py-2 bg-blue-400'>History</button>
         
        </div>
      {/* )} */}
    </div>
  );
};

export default Booking;