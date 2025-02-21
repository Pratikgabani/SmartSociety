// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { toast } from "react-hot-toast"; // Import react-hot-toast
// import { Toaster } from "react-hot-toast";
// const Booking = () => {
//   const [venues, setVenues] = useState([]);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [selectedVenue, setSelectedVenue] = useState(null);
//   const [formData, setFormData] = useState({
//     bookingType: "",
//     bookDescription: "",
//     duration: "",
//     date: "",
//   });
//   const [myBooking, setMyBooking] = useState([]);

//   // Fetch venues
//   useEffect(() => {
//     const fetchVenues = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/api/v1/booking/getVenue", { withCredentials: true });
//         setVenues(response.data.data);
//         // toast.success("Venues fetched successfully!"); // Toast for success
//       } catch (error) {
//         console.error("Error fetching venues:", error);
//         toast.error("Failed to fetch venues!"); // Toast for error
//       }
//     };
//     fetchVenues();
//   }, []);

//   // Fetch my bookings
//   useEffect(() => {
//     const fetchMyBookings = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/api/v1/booking/getBookingsByUserId", { withCredentials: true });
//         setMyBooking(response.data.data);
//         if(response.data.data.length === 0) toast.error("No bookings found!");
//         // toast.success("Bookings fetched successfully!"); // Toast for success
//       } catch (error) {
//         console.log(error);
//         // toast.error("Failed to fetch bookings!"); // Toast for error
//       }
//     };
//     fetchMyBookings();
//   }, []);

//   // Delete booking
//   const handleDelete = async (bookingId) => {
//     try {
//       const response = await axios.delete(`http://localhost:8000/api/v1/booking/delete/${bookingId}`, { withCredentials: true });
//       setMyBooking(myBooking.filter((booking) => booking._id !== bookingId));
//       toast.success("Booking deleted successfully!"); // Toast for success
//     } catch (error) {
//       console.error("Error deleting booking:", error);
//       toast.error("Failed to delete booking!"); // Toast for error
//     }
//   };

//   const handleBookNow = (venue) => {
//     setSelectedVenue(venue);
//     setIsFormOpen(true);
//   };

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Send the venue's name as bookingType
//       const response = await axios.post(
//         "http://localhost:8000/api/v1/booking/new-booking",
//         { ...formData, bookingType: selectedVenue.venue }, // Corrected here
//         { withCredentials: true }
//       );

//       toast.success("Booking created successfully!"); // Toast for success
//       setMyBooking([...myBooking, response.data.data]);
//       setIsFormOpen(false);
//     } catch (error) {
//       console.error("Error creating booking:", error);
//       toast.error("Failed to create booking!"); // Toast for error
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
//       <Toaster />
//       <h1 className="text-3xl font-bold text-blue-800 mb-6">Venue Bookings</h1>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">Available Venues</h2>
//             <button className="text-blue-600 hover:underline">View Calendar</button>
//           </div>
//           {venues.map((venue) => (
//             <div key={venue._id} className="border rounded-lg p-4 mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
//               <div>
//                 <h3 className="text-lg font-bold text-gray-800">{venue.venue}</h3>
//                 <p className="text-sm text-gray-600">{venue.description}</p>
//                 <p className="text-sm text-gray-600">Capacity: {venue.capacity}</p>
//                 <p className="text-sm text-gray-600">₹{venue.price} per day</p>
//                 <div className="mt-2 space-x-2">
//                   {venue.amenities.map((amenity, idx) => (
//                     <span key={idx} className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
//                       {amenity}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//               <button
//                 onClick={() => handleBookNow(venue)}
//                 className="mt-4 sm:mt-0 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
//               >
//                 Book Now
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div>
//         <h2 className="text-2xl font-bold text-blue-800 mt-8 mb-4">My Bookings</h2>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {myBooking.map((booking) => (
//             <div key={booking._id} className="bg-white shadow rounded-lg p-6">
//               <h3 className="text-lg font-semibold">{booking.bookingType}</h3>
//               <p className="text-gray-600">{booking.description}</p>
//               <p className="text-gray-600">Duration: {booking.duration} hours</p>
//               <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
//               <p className="text-gray-600">Status: {new Date(booking.date) >= Date.now() ? "Upcoming" : "Completed"}</p>
//               {new Date(booking.date) >= Date.now() && (
//                 <button
//                   onClick={() => handleDelete(booking._id)}
//                   className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//                 >
//                   Delete Booking
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Booking Form Modal */}
//       {isFormOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">Book {selectedVenue?.venue}</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                 <input
//                   type="text"
//                   name="bookDescription"
//                   value={formData.bookDescription}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Duration (in hours)</label>
//                 <input
//                   type="number"
//                   name="duration"
//                   value={formData.duration}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Date</label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//                   required
//                 />
//               </div>
//               <div className="flex justify-end space-x-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsFormOpen(false)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//       <div>Booking guidelines</div>
//     </div>
//   );
// };

// export default Booking;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const Booking = () => {
  // ... [Keep all the existing state and logic the same]
  const [venues, setVenues] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [formData, setFormData] = useState({
    bookingType: "",
    bookDescription: "",
    duration: "",
    date: "",
  });
  const [myBooking, setMyBooking] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      const token = localStorage.getItem("user");
      if (token) {
        setIsLoggedIn(true);
      }
    }, []);
  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/booking/getVenue", { withCredentials: true });
        setVenues(response.data.data);
        // toast.success("Venues fetched successfully!"); // Toast for success
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
        const response = await axios.get("http://localhost:8000/api/v1/booking/getBookingsByUserId", { withCredentials: true });
        setMyBooking(response.data.data);
        if(response.data.data.length === 0) toast.error("No bookings found!");
        // toast.success("Bookings fetched successfully!"); // Toast for success
      } catch (error) {
        console.log(error);
        // toast.error("Failed to fetch bookings!"); // Toast for error
      }
    };
    fetchMyBookings();
  }, []);

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

  const handleBookNow = (venue) => {
    setSelectedVenue(venue);
    setIsFormOpen(true);
  };

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
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the venue's name as bookingType
      const response = await axios.post(
        "http://localhost:8000/api/v1/booking/new-booking",
        { ...formData, bookingType: selectedVenue.venue }, // Corrected here
        { withCredentials: true }
      );

      toast.success("Booking created successfully!"); // Toast for success
      setMyBooking([...myBooking, response.data.data]);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking!"); // Toast for error
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <Toaster />
     {
      isLoggedIn  ? (
        <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 font-[Poppins] text-center">
          Venue Reservations
        </h1>

        {/* Available Venues Section */}
        <section className="mb-12">
            <h2 className="text-2xl mb-6 font-semibold text-gray-800">Available Spaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div 
                key={venue._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{venue.venue}</h3>
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
            ))}
          </div>
        </section>

        {/* My Bookings Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Reservations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBooking.map((booking) => (
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
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        new Date(booking.date) >= Date.now() 
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
                      Event Date
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
    </div>
  );
};

export default Booking;