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
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  const role = user?.data?.user?.role;
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [error, setError] = useState("");
 ;
 const navigate = useNavigate(); 

  useEffect(() => {
    const fetchPayData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/v1/payment/payPayment/${paymentId}`,
          {},
          {
           
            withCredentials: true, // Include cookies if needed
          }
        );
        // console.log(response.data.payment);
        setPayment(response.data.payment);
        setClientSecret(response.data.clientSecret);
        setLoading(false);
      } catch (error) {
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
    } else {
      console.log("[PaymentMethod Created]", paymentMethod);
    }
    if (!clientSecret) {
      console.log("No client secret found");
      setLoading(false);
      return;
    }
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            house: user?.user?.houseNo,
            block : user?.user?.block,
            email: user?.user?.email,
          },
        },
      });
    if (confirmError) {
      setCardError(confirmError.message);
    } else if (paymentIntent.status === "succeeded") {
      // console.log("Payment succeeded: ", paymentIntent);
      setCardError("your payment id: ", paymentIntent.id);
      const paymentInfo = {
        email: user?.data.user.email,
        userId: user.data.user._id,
        paymentId : paymentId,
        paymentDoneId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
        
        societyId : user?.data?.user?.societyId,
        paidOn : new Date(),

      
      };
      // console.log("Payment info: ", paymentInfo);
      await axios
        .post("http://localhost:8000/api/v1/order", paymentInfo, {
         
          withCredentials: true,
        })
        .then((response) => {
          // console.log(response.data);
          toast.success("Payment Successful");
          navigate("/layout/payment");
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
      <Toaster />
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
              <p className="text-red-500 font-bold">${payment.amount }</p>
            </div>
            <div className="flex items-center text-center space-x-2 mt-2">
              <h1 className="text-gray-600 text-md">Payment name :</h1>
              <p className="text-red-500 font-bold">{payment.description}</p>
            </div>
          </div>
  
          {/* Payment Form Section */}
          <div className="w-full sm:w-1/2 lg:w-1/3 mt-10">
            <div className="bg-white shadow-md rounded-lg p-6 w-full">
              <h2 className="text-lg font-semibold mb-4">Process your Payment!</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-2" htmlFor="card-number">
                  Credit/Debit Card
                </label>
                <form onSubmit={handlePurchase}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          "::placeholder": {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!stripe || loading} // Disable button when loading
                    className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                  >
                    {loading ? 'Processing...' : 'Pay'}
                  </button>
                </form>
                {cardError && (
                  <p className="text-red-500 font-semibold text-xs mt-2">
                    {cardError}
                  </p>
                )}
              </div>
              <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                <span className="mr-2">🅿️</span> Other Payments Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
  
}

export default Buy
