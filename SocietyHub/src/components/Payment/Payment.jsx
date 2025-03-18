import React, { useEffect, useState } from "react";
import axios from "axios";
import PreviousDataModal from '../history/PreviousDataModal ';
import { X } from "lucide-react"; // Import cross icon
import { RiDeleteBin6Fill, RiDeleteBinLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const PaymentSection = () => {
  const [payments, setPayments] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newPayment, setNewPayment] = useState({ description: "", amount: "", dueDate: "" });
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  


  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  const role = user?.data?.user?.role;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [previousData, setPreviousData] = useState([]);
  const [fetchAgain, setFetchAgain] = useState([]);
  const [kaam, setKaam] = useState([]);
  useEffect(() => {

    const fetchTimeAndDate = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/purchase/getAllPurchases", { withCredentials: true });
        // Update API URL) // Update API URL
        setKaam(response.data.data);

        // Open modal after fetching
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchTimeAndDate();
    fetchPayments();

  }, []);




  const fetchPayments = async () => {
    setLoading(true);
    try {


      const response = await axios.get("http://localhost:8000/api/v1/payment/getPayments", {

        withCredentials: true,
      });
      setPayments(response.data.data);
      // console.log(payments[0].paidBy.includes(user.data.user._id));
      // if(payments[0].paidBy.includes(user.data.user._id)){
      //   setIsPaid(true);
      // }
      // if(payments.paidBy.some(id => id.$oid === user.data.user._Id)){

      // }

    } catch (error) {
      console.error("Error fetching payments:", error);
    }
    setLoading(false);
  };

  const fetchAgainData = async (a) => {

    try {
      const response = await axios.get("http://localhost:8000/api/v1/payment/getAdminData", { withCredentials: true });
      // Update API URL) // Update API URL
      setFetchAgain(response.data.data);

      setIsAdminModalOpen(true); // Open modal after fetching
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPreviousData = async (a) => {

    try {
      const response = await axios.get("http://localhost:8000/api/v1/purchase/getAllPurchases", { withCredentials: true });
      // Update API URL) // Update API URL
      setPreviousData(response.data.data);

      setIsModalOpen(true); // Open modal after fetching
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const deletePayment = async (paymentId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/payment/deletePayment/${paymentId}`, {
        withCredentials: true,
      });
      toast.success("Payment deleted successfully!");
      setPayments(payments.filter((payment) => payment._id !== paymentId));
      fetchPayments();
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const handleNewPaymentChange = (e) => {
    setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
  };

  const paymentStatus = (payId) => {
    if (kaam.length > 0) {
      if (kaam.some(purchase => purchase.paymentId._id === payId)) {
        return "Paid";
      }
    }
  }
  const paymentDateLaao = (payId) => {
    if (kaam.length > 0) {
      if (kaam.some(purchase => purchase.paymentId._id === payId)) {
        const date = kaam.find(purchase => purchase.paymentId._id === payId).paidOn;
        return new Date(date).toLocaleDateString("en-GB");
      }
    }
  }

  const addPayment = async () => {
    try {
      await axios.post("http://localhost:8000/api/v1/payment/createPayment", newPayment, {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      });
      setShowAdminForm(false);
      setNewPayment({ description: "", amount: "", dueDate: "" });
      fetchPayments();
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full  ">
        <h1 className="text-3xl font-bold text-gray-800">Payments </h1>
        <p className="text-gray-600 text-lg">Securely pay society maintenance and other charges online with ease</p>
        {role === "admin" && (
          <div className="mb-4 text-right">
            <button onClick={() => setShowAdminForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Create New Payment
            </button>
          </div>
        )}

        {showAdminForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">Admin: Add Payment</h2>
              <input type="text" name="description" value={newPayment.description} onChange={handleNewPaymentChange} placeholder="Description" className="p-2  border rounded w-full mb-2" />
              <input type="number" name="amount" value={newPayment.amount} onChange={handleNewPaymentChange} placeholder="Amount" className="p-2 border rounded w-full mb-2" />
              <input type="date" name="dueDate" value={newPayment.dueDate} onChange={handleNewPaymentChange} className="p-2 border rounded w-full mb-2" />
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowAdminForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                <button onClick={addPayment} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Payment</button>
              </div>
            </div>
          </div>
        )}

        {loading ? <p className="text-center text-gray-500">Loading...</p> : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Payment Date</th>
                <th className="border border-gray-300 px-4 py-2">Due Date</th>
                {/* <th className="border border-gray-300 px-4 py-2">Receipt</th> */}
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2 text-center">{payment.description}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">₹{payment.amount}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center ">{paymentStatus(payment._id)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{paymentDateLaao(payment._id)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{new Date(payment.dueDate).toLocaleDateString()}</td>
                  {/* <td className="border border-gray-300 px-4 py-2 text-center">
                    {payment.receipt ? <a href={payment.receipt} target="_blank" className="text-blue-600 underline">View</a> : "-"}
                  </td> */}
                  <td className="border border-gray-300 px-4 flex justify-around py-2 text-center">
                    {/* {payment.status === "Pending" && (
                      <button onClick={() => markAsPaid(payment._id)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Pay Now</button>
                    )} */}
                    {

                      <Link
                        to={`/layout/payPayment/${payment._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Pay
                      </Link>
                    }
                    {role === "admin" && (
                      <button onClick={() => deletePayment(payment._id)} className="text-red-600 hover:text-red-800">
                        <RiDeleteBin6Fill size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div><button onClick={fetchPreviousData} className='absolute top-8 right-5 rounded-lg px-3 py-2 bg-blue-400'>History</button>
        <PreviousDataModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={previousData}
        />
      </div>
      <div><button onClick={fetchAgainData} className='absolute top-8 right-32 rounded-lg px-3 py-2 bg-blue-400'>All data</button>
        <PreviousDataModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          data={fetchAgain}
        />
      </div>
    </div>
  );
};

export default PaymentSection;
