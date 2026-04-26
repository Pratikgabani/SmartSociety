import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {toast, Toaster} from "react-hot-toast";
import { Link,useNavigate,useParams } from "react-router-dom";

const Buy = () => {
  const {paymentId} = useParams();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  

  const [payment,setPayment] = useState({});
  // const user = JSON.parse(localStorage.getItem("user"));
  // const token = user?.token;
  // const role = user?.data?.user?.role;
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [error, setError] = useState("");
  const [user , setUser] = useState({});
 const navigate = useNavigate(); 

   useEffect(() => {
    const fetchUser = async()=>{
      try {
        const res = await axios.get(`/users/currentUser`, { withCredentials: true });
        console.log(res.data.data)
        setUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  } , [])

  useEffect(() => {
    let cancelled = false;
    const fetchPayData = async () => {
      try {
        const response = await axios.post(
          `/payment/payPayment/${paymentId}`,
          {},
          {
            withCredentials: true,
          }
        );
        if (cancelled) return; // StrictMode re-ran the effect — discard stale response
        setPayment(response.data.payment);
        setClientSecret(response.data.clientSecret);
        setLoading(false);
      } catch (error) {
        if (cancelled) return;
        setLoading(false);
        if (error?.response?.status === 400) {
          setError("you have already paid this payment");
            console.log(error)
        } else {
          setError(error?.response?.data?.errors);
        }
      }
    };
    fetchPayData();
    return () => { cancelled = true; }; // cleanup: marks previous effect as stale
  }, [paymentId]);

  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Element not found");
      return;
    }

    setLoading(true);
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("Cardelement not found");
      setLoading(false);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("Stripe PaymentMethod Error: ", error);
      setLoading(false);
      setCardError(error.message);
      return; // stop here, don't proceed to confirmCardPayment
    } else {
      console.log("[PaymentMethod Created]", paymentMethod);
    }
    if (!clientSecret) {
      console.log("No client secret found");
      setLoading(false);
      return;
    }
    // what does this functon do ? it confirms the card payment with the client secret and the card details, and returns a payment intent object if successful, or an error if failed 
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            // house: user?.houseNo,
            // block : user?.block,
            email: user?.email,
          },
        },
      });
    if (confirmError) {
      setCardError(confirmError.message);
    } else if (paymentIntent.status === "succeeded") {
      // console.log("Payment succeeded: ", paymentIntent);
      setCardError("");
      const paymentInfo = {
        email: user?.email,
        userId: user._id,
        paymentId : paymentId,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
        
        societyId : user?.societyId,
        paidOn : new Date(),

      
      };
      // console.log("Payment info: ", paymentInfo);
      await axios
        .post("/order", paymentInfo, {
          withCredentials: true,
        })
        .then((response) => {
          // console.log(response.data);
          toast.success("Payment Successful");
          setTimeout(() => {
            navigate("/layout/payment");
          }, 1500);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error in making payment");
        });
      // toast.success("Payment Successful");
      // navigate("/purchases");
    }
    setLoading(false);
  };

  return (
    <>
      {error ? (
        <div className="flex justify-center items-center min-h-screen p-4">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg max-w-xs w-full">
            <p className="text-lg font-semibold">{error}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row justify-center items-center my-20 mx-auto max-w-7xl px-4">
          {/* Order Details Section */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-10">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-600 text-md">Total Price</h2>
              <p className="text-red-500 font-medium">₹{payment.amount }</p>
            </div>
            <div className="flex items-center text-center space-x-2 mt-2">
              <h1 className="text-gray-600 text-md">Payment name :</h1>
              <p className="text-red-500 font-medium">{payment.description}</p>
            </div>
          </div>
  
          {/* Payment Form Section */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-10">
            <div className="bg-white shadow-md rounded-lg p-6 w-full">
              <h2 className="text-lg font-semibold mb-4">Pay for this Maintenance</h2>
              <form onSubmit={handlePurchase}>
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
      )}
    </>
  );
  
}

export default Buy
