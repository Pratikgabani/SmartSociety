import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EventBuy = () => {
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [eventData, setEventData] = useState({});
  const [cardError, setCardError] = useState("");
  const [error, setError] = useState("");
  const [user , setUser] = useState({});
  // const user = JSON.parse(localStorage.getItem("user"));
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async()=>{
      try {
        const res = await axios.get("https://resihub.onrender.com/api/v1/users/currentUser", { withCredentials: true });
        console.log(res.data.data)
        setUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  } , [])

  // ✅ Fetch Event Payment Intent & Event Details
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.post(
          `https://resihub.onrender.com/api/v1/events/payEvent/${eventId}`,
          {},
          { withCredentials: true }
        );
        setEventData(response.data.event);
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch event details. Either event doesn't exist or you already paid.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  // ✅ Handle Stripe Payment
  const handleEventPayment = async (e) => {
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
          email: user?.email,
          userId: user?._id,
          eventId,
          paymentDoneId: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
          paidOn: new Date(),
          societyId: user?.societyId,
        };

        await axios.post("https://resihub.onrender.com/api/v1/events/save-event-order", paymentInfo, {
          withCredentials: true,
        });

        navigate("/layout/event");
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
          <h1 className="text-xl font-semibold underline">Event Payment Details</h1>
          <p><strong>Event Name:</strong> {eventData.eventName}</p>
          <p><strong>Description:</strong> {eventData.description}</p>
          <p><strong>Date:</strong> {new Date(eventData.eventDate).toLocaleDateString()}</p>
          <p><strong>Amount:</strong> ₹{eventData.amtPerPerson}</p>
        </div>

        {/* Payment Form */}
        <div className="w-full sm:w-1/2 lg:w-1/3 mt-10">
          <div className="bg-white shadow-md rounded-lg p-6 w-full">
            <h2 className="text-lg font-semibold mb-4">Pay for this Event</h2>
            <form onSubmit={handleEventPayment}>
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
};

export default EventBuy;
