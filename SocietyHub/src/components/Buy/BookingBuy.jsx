import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
const BookingBuy = () => {
      const { bookingId } = useParams();
      console.log("Booking ID:", bookingId);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [bookingData, setBookingData] = useState({});
  const [cardError, setCardError] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/v1/booking/payBooking/${bookingId}`,
          {},
          { withCredentials: true }
        );
        console.log("Booking Data:", response.data.bookings);
        setBookingData(response.data.bookings);
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch booking details. Either booking doesn't exist or you already paid.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);


const handleBookingPayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded properly.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Payment form not ready. Please refresh the page.");
      return;
    }

    setLoading(true);
    setCardError("");

    try {
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (paymentMethodError) {
        console.error(paymentMethodError);
        setCardError(paymentMethodError.message);
        setLoading(false);
        return;
      }

      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        console.error(confirmError);
        setCardError(confirmError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        toast.success("Payment Successful!");

        const paymentInfo = {
          email: user?.data?.user?.email,
          userId: user?.data?.user?._id,
          bookingId,
          paymentDoneId: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
          paidOn: new Date(),
          societyId: user?.data?.user?.societyId,
        };
console.log("Payment Info:", paymentInfo);
        await axios.post("http://localhost:8000/api/v1/booking/save-booking-order", paymentInfo, {
          withCredentials: true,
        });

        navigate("/layout/booking");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !clientSecret) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg max-w-xs w-full">
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }



 return (
     <>
       <Toaster />
       <div className="flex flex-col sm:flex-row justify-center items-center my-20 mx-auto max-w-7xl px-4">
         {/* Event Details */}
         <div className="w-full sm:w-1/2 lg:w-1/3 mt-10">
           <h1 className="text-xl font-semibold underline">booking Payment Details</h1>
           <p><strong>Booking type:</strong> {bookingData.bookingType}</p>
           <p><strong>Description:</strong> {bookingData.description}</p>
           <p><strong>Date:</strong> {new Date(bookingData.date).toLocaleDateString()}</p>
           {/* <p><strong>Amount:</strong> ₹99</p> */}
         </div>
 
         {/* Payment Form */}
         <div className="w-full sm:w-1/2 lg:w-1/3 mt-10">
           <div className="bg-white shadow-md rounded-lg p-6 w-full">
             <h2 className="text-lg font-semibold mb-4">Pay for this Event</h2>
             <form onSubmit={handleBookingPayment}>
               <CardElement
                 options={{
                   style: {
                     base: {
                       fontSize: '16px',
                       color: '#424770',
                       "::placeholder": { color: '#aab7c4' },
                     },
                     invalid: { color: '#9e2146' },
                   },
                 }}
               />
               <button
                 type="submit"
                 disabled={!stripe || !clientSecret || loading}
                 className={`mt-6 w-full py-2 rounded-md text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"}`}
               >
                 {loading ? 'Processing...' : 'Pay Now'}
               </button>
             </form>
             {cardError && <p className="text-red-500 text-xs mt-2">{cardError}</p>}
           </div>
         </div>
       </div>
     </>
   );
}

export default BookingBuy