import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "../../axios";
import PreviousDataModal from '../history/PreviousDataModal ';
import { Plus, X } from "lucide-react"; // Import cross icon
import { RiDeleteBin6Fill, RiDeleteBinLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HashLoader } from 'react-spinners'
import UserContext from "../../context/UserContext";

// 🔥 Memoization Implementation for Payment Rows
const PaymentRow = React.memo(({ payment, status, payDate, receiptUrl, rolee, onDelete }) => (
  <tr className="border border-gray-300">
    <td className="border border-gray-300 px-4 py-2 text-center">
      {payment.description}
    </td>
    <td className="border border-gray-300 px-4 py-2 text-center">
      ₹{payment.amount}
    </td>
    <td
      className={
        status === "Paid"
          ? "border border-gray-300 px-4 py-2 text-center text-green-600 font-semibold"
          : "border border-gray-300 px-4 py-2 text-center text-red-600 font-semibold"
      }
    >
      {status}
    </td>
    <td className="border border-gray-300 px-4 py-2 text-center">
      {payDate}
    </td>
    <td className="border border-gray-300 px-4 py-2 text-center">
      {new Date(payment.dueDate).toLocaleDateString("en-GB")}
    </td>
    <td className="border border-gray-300 px-4 flex justify-around py-2 text-center">
      {status !== "Paid" && (
        <Link
          to={`/layout/payPayment/${payment._id}`}
          className="bg-blue-600 text-white px-6 py-1 rounded-lg font-semibold hover:bg-blue-700"
        >
          Pay
        </Link>
      )}
      {status === "Paid" && (
        <div className="flex justify-center items-center">
          {receiptUrl ? (
            <a
              href={receiptUrl}
              target="_blank"
              rel="noreferrer"
              className="border border-blue-600 text-blue-600 px-4 py-1 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              View Receipt
            </a>
          ) : (
            <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-lg text-sm font-semibold cursor-not-allowed whitespace-nowrap">Receipt unavailable</span>
          )}
        </div>
      )}
      {rolee === "admin" && (
        <button
          onClick={() => onDelete(payment._id)}
          className="text-red-500 hover:bg-red-100 p-2 rounded-md transition-colors"
        >
          <RiDeleteBin6Fill size={20} />
        </button>
      )}
    </td>
  </tr>
));

const PaymentSection = () => {
  const [payments, setPayments] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newPayment, setNewPayment] = useState({ description: "", amount: "", dueDate: "" });
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  
  const navigate = useNavigate();

  // const user = JSON.parse(localStorage.getItem("user"));
  // const token = user?.token;
  // const role = user?.data?.user?.role;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [previousData, setPreviousData] = useState([]);
  const [fetchAgain, setFetchAgain] = useState([]);
  const [kaam, setKaam] = useState([]);
  const {rolee} = useContext(UserContext)
  
  // 🔥 Pagination States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/purchase/getAllPurchases`, { withCredentials: true });
      setKaam(response.data.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    fetchPayments(page === 1, page === 1, page);
  }, [page]);

  useEffect(() => {
    const url = `${import.meta.env.VITE_URL_BACKEND}/api/v1/payment/stream`;
    const es = new EventSource(url, { withCredentials: true });

    es.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "payment_intent.succeeded") {
          fetchPurchases();
          fetchPayments(false);
        }
      } catch (err) {
        console.error("SSE parse error", err);
      }
    };

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
    };
  }, []);

  const fetchPayments = async (showLoader = true, reset = true, pageNum = 1) => {
    if (showLoader) setLoading(true);
    if (!reset) setIsFetchingMore(true);

    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/payment/getPayments?page=${pageNum}&limit=15`, {
        withCredentials: true,
      });
      
      const { data: fetchedPayments, hasMore: morePayments } = response.data.data;
      
      if (reset) {
        setPayments(fetchedPayments);
      } else {
        setPayments(prev => {
          // Smart logic to prevent duplicate key renders in React StrictMode
          const existingIds = new Set(prev.map(p => p._id));
          const uniqueNew = fetchedPayments.filter(p => !existingIds.has(p._id));
          return [...prev, ...uniqueNew];
        });
      }
      setHasMore(morePayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }

    if (showLoader) setLoading(false);
    if (!reset) setIsFetchingMore(false);
  };

  // 🔥 Intelligent Infinite Scroll Handler
  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    // If user smoothly scrolls within 50px of the container's bottom edge
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      if (hasMore && !isFetchingMore && !loading) {
        setPage((prev) => prev + 1);
      }
    }
  };

  const fetchAgainData = async (a) => {

    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/payment/getAdminData`, { withCredentials: true });
      // Update API URL) // Update API URL
      setFetchAgain(response.data.data);
     navigate("/history", { state: { data: response.data.data } });
      setIsAdminModalOpen(true); // Open modal after fetching
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPreviousData = async (a) => {

    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/purchase/getAllPurchases`, { withCredentials: true });
      // Update API URL) // Update API URL
      setPreviousData(response.data.data);
    navigate("/history", { state: { data: response.data.data } });
      setIsModalOpen(true); // Open modal after fetching
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // 🔥 useCallback applied to ensure memoized rows do not re-render uselessly
  const deletePayment = useCallback(async (paymentId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL_BACKEND}/api/v1/payment/deletePayment/${paymentId}`, {
        withCredentials: true,
      });
      toast.success("Payment deleted successfully!");
      setPayments((prev) => prev.filter((payment) => payment._id !== paymentId));
      // fetchPayments is not wrapped in useCallback, so calling it inside a useCallback could be tricky.
      // But we just successfully updated local state, we'll omit fetchPayments() here to prevent dependencies.
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  }, []);

  const handleNewPaymentChange = (e) => {
    setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
  };

  // const paymentStatus = (payId) => {
  //   if (kaam.length > 0) {
      
  //     if (kaam.some(purchase => purchase.paymentId._id === payId)) {
  //       return "Paid";
  //     }else return "Pending"
  //   }
  // }
  // const paymentDateLaao = (payId) => {
  //   if (kaam.length > 0) {
  //     console.log(kaam);
  //     if (kaam.some(purchase => purchase.paymentId_id === payId)) {
  //       const date = kaam.find(purchase => purchase.paymentId._id === payId).paidOn;
  //       return new Date(date).toLocaleDateString("en-GB");
  //     }
  //   }
  // }
const paymentStatus = (payId) => {
  if (kaam.length > 0) {
    return kaam.some(purchase => purchase.paymentId && purchase.paymentId._id === payId)
      ? "Paid"
      : "Pending";
  }
  return "Pending";
};
const paymentDateLaao = (payId) => {
  if (kaam.length > 0) {
    const found = kaam.find(purchase => purchase.paymentId && purchase.paymentId._id === payId);
    if (found) {
      return new Date(found.paidOn).toLocaleDateString("en-GB");
    }
  }
  return "N/A";
};

const getPaymentReceiptUrl = (payId) => {
  if (kaam.length > 0) {
    const found = kaam.find(purchase => purchase.paymentId && purchase.paymentId._id === payId);
    return found?.receiptUrl || null;
  }
  return null;
};

  const addPayment = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_URL_BACKEND}/api/v1/payment/createPayment`, newPayment, {
        withCredentials: true,
      });
      setShowAdminForm(false);
      setNewPayment({ description: "", amount: "", dueDate: "" });
      
      // Instantly Resync and reset to page 1
      setPage(1);
      fetchPayments(true, true, 1);
      
      toast.success("Payment added successfully!");
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <HashLoader size={60} color="#2563eb" loading={loading} />
      <p className="mt-4 text-lg text-gray-700">Loading...</p>
    </div>
  );
}

return (
  <div className="container relative mx-auto px-4 py-8 bg-gray-100">
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Payments </h1>
      <p className="text-gray-600 text-lg mt-1">
        Securely pay society maintenance and other charges online with ease
      </p>

      {rolee === "admin" && (
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-2xl font-semibold mt-4">My Payments</h3>
          <button
            onClick={() => setShowAdminForm(true)}
            className="bg-blue-600 font-semibold text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            New Payment
          </button>
        </div>
      )}

      {showAdminForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-semibold text-blue-800 mb-4">
               Add Payment
            </h2>
            <div>

            <label htmlFor="description"> Description</label>
            <input
              type="text"
              name="description"
              value={newPayment.description}
              onChange={handleNewPaymentChange}
              placeholder="Description"
              className="p-2 border rounded w-full mb-2"
              />
              </div>
              <div>
            <label htmlFor="amount"> Amount</label>
            <input
              type="number"
              name="amount"
              value={newPayment.amount}
              onChange={handleNewPaymentChange}
              placeholder="Amount"
              className="p-2 border rounded w-full mb-2"
              />
              </div>
              <div>
            <label htmlFor="dueDate"> Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={newPayment.dueDate}
              onChange={handleNewPaymentChange}
              className="p-2 border rounded w-full mb-2"
              />
              </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAdminForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addPayment}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <div 
        className="overflow-x-auto overflow-y-auto mt-10 max-h-[500px] border border-gray-200 rounded-lg shadow-sm bg-white relative"
        onScroll={handleScroll}
      >
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-100">
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Payment Date</th>
              <th className="border border-gray-300 px-4 py-2">Due Date</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <PaymentRow
                key={payment._id}
                payment={payment}
                status={paymentStatus(payment._id)}
                payDate={paymentDateLaao(payment._id)}
                receiptUrl={getPaymentReceiptUrl(payment._id)}
                rolee={rolee}
                onDelete={deletePayment}
              />
            ))}
          </tbody>
        </table>
        {isFetchingMore && <div className="text-center py-4 font-semibold text-blue-600 animate-pulse">Fetching older records...</div>}
        {!hasMore && payments.length > 0 && <div className="text-center py-4 text-sm text-gray-400">You have reached the end of the records.</div>}
      </div>
    </div>

    <div>
      <button
        onClick={fetchPreviousData}
        className="absolute text-white top-8 right-5 rounded-lg px-3 py-2 bg-blue-600"
      >
        History
      </button>
    </div>

    {rolee=== "admin" && (
      <div>
        <button
          onClick={fetchAgainData}
          className="absolute top-8 right-32 rounded-lg px-3 py-2 text-white bg-blue-600"
        >
          All data
        </button>
      </div>
    )}
  </div>
);

};

export default PaymentSection;
