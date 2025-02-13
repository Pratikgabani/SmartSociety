


import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react"; // Import cross icon
const PaymentSection = () => {
  const [payments, setPayments] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newPayment, setNewPayment] = useState({ description: "", amount: "", dueDate: "" });
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  const role = user?.data?.user?.role;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
    

      const response = await axios.get("http://localhost:8000/api/v1/payments/getPayments", {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      });
      setPayments(response.data.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
    setLoading(false);
  };

  const markAsPaid = async (paymentId) => {
    try {
      await axios.patch(`http://localhost:8000/api/v1/payments/markPaymentAsPaid/${paymentId}`, {}, {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      });
      fetchPayments();
    } catch (error) {
      console.error("Error marking payment as paid:", error);
    }
  };
  const deletePayment = async (paymentId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/payments/deletePayment/${paymentId}`, {
        withCredentials: true,
      });
      setPayments(payments.filter((payment) => payment._id !== paymentId));
      fetchPayments();
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const handleNewPaymentChange = (e) => {
    setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
  };

  const addPayment = async () => {
    try {
      await axios.post("http://localhost:8000/api/v1/payments/createPayment", newPayment, {
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
    <div className="min-h-screen flex flex-col bg-gray-50 p-6">
      <div className="w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-blue-800 mb-6">Payment Section</h1>

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
                <th className="border border-gray-300 px-4 py-2">Receipt</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2 text-center">{payment.description}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">₹{payment.amount}</td>
                  <td className={`border border-gray-300 px-4 py-2 text-center ${payment.status === "Paid" ? "text-green-600" : "text-red-600"}`}>{payment.status}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : "-"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{new Date(payment.dueDate).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {payment.receipt ? <a href={payment.receipt} target="_blank" className="text-blue-600 underline">View</a> : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {payment.status === "Pending" && (
                      <button onClick={() => markAsPaid(payment._id)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Pay Now</button>
                    )}
                   
                  </td>
                  {role === "admin" && (
                      <button onClick={() => deletePayment(payment._id)} className="text-red-600 hover:text-red-800">
                        <X size={20} />
                      </button>
                    )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentSection;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { X } from "lucide-react"; // Import cross icon

// const PaymentSection = () => {
//   const [payments, setPayments] = useState([]);
//   const [showAdminForm, setShowAdminForm] = useState(false);
//   const [newPayment, setNewPayment] = useState({ description: "", amount: "", dueDate: "" });
//   const [loading, setLoading] = useState(false);
  
//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user?.token;
//   const role = user?.data?.user?.role;

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   const fetchPayments = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("http://localhost:8000/api/v1/payments/getPayments", {
//         headers: { Authorization: "Bearer " + token },
//         withCredentials: true,
//       });
//       setPayments(response.data.data);
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//     }
//     setLoading(false);
//   };

//   const markAsPaid = async (paymentId) => {
//     try {
//       await axios.patch(`http://localhost:8000/api/v1/payments/markPaymentAsPaid/${paymentId}`, {}, {
//         headers: { Authorization: "Bearer " + token },
//         withCredentials: true,
//       });
//       fetchPayments();
//     } catch (error) {
//       console.error("Error marking payment as paid:", error);
//     }
//   };

//   const deletePayment = async (paymentId) => {
//     try {
//       await axios.delete(`http://localhost:8000/api/v1/payments/deletePayment/${paymentId}`, {
//         withCredentials: true,
//       });
//       setPayments(payments.filter((payment) => payment._id !== paymentId));
//       fetchPayments();
//     } catch (error) {
//       console.error("Error deleting payment:", error);
//     }
//   };

//   const createPayment = async () => {
//     try {
//       const response = await axios.post("http://localhost:8000/api/v1/payments/createPayment", newPayment, {
//         headers: { Authorization: "Bearer " + token },
//         withCredentials: true,
//       });
//       setNewPayment({ description: "", amount: "", dueDate: "" });
//       setShowAdminForm(false);
//       fetchPayments();
//     } catch (error) {
//       console.error("Error creating payment:", error);
//     }
//   };



//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 p-6">
//       <div className="w-full bg-white p-6 rounded-lg shadow-md">
//         <h1 className="text-2xl font-semibold text-center text-blue-800 mb-6">Payment Section</h1>

//         {role === "admin" && (
//           <div className="mb-4 text-right">
//             <button onClick={() => setShowAdminForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//               Create New Payment
//             </button>
//           </div>
//         )}

        

//         {loading ? (
//           <p className="text-center text-gray-500">Loading...</p>
//         ) : (
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-blue-100">
//                 <th className="border border-gray-300 px-4 py-2">Description</th>
//                 <th className="border border-gray-300 px-4 py-2">Amount</th>
//                 <th className="border border-gray-300 px-4 py-2">Status</th>
//                 <th className="border border-gray-300 px-4 py-2">Payment Date</th>
//                 <th className="border border-gray-300 px-4 py-2">Due Date</th>
//                 <th className="border border-gray-300 px-4 py-2">Receipt</th>
//                 <th className="border border-gray-300 px-4 py-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {payments.map((payment) => (
//                 <tr key={payment._id} className="border border-gray-300">
//                   <td className="border border-gray-300 px-4 py-2">{payment.description}</td>
//                   <td className="border border-gray-300 px-4 py-2 text-center">₹{payment.amount}</td>
//                   <td className={`border border-gray-300 px-4 py-2 text-center ${payment.status === "Paid" ? "text-green-600" : "text-red-600"}`}>{payment.status}</td>
//                   <td className="border border-gray-300 px-4 py-2 text-center">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : "-"}</td>
//                   <td className="border border-gray-300 px-4 py-2 text-center">{new Date(payment.dueDate).toLocaleDateString()}</td>
//                   <td className="border border-gray-300 px-4 py-2 text-center">
//                     {payment.receipt ? <a href={payment.receipt} target="_blank" className="text-blue-600 underline">View</a> : "-"}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2 text-center flex items-center justify-center space-x-2">
//                     {payment.status === "Pending" && (
//                       <button onClick={() => markAsPaid(payment._id)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Pay Now</button>
//                     )}
//                     {role === "admin" && (
//                       <button onClick={() => deletePayment(payment._id)} className="text-red-600 hover:text-red-800">
//                         <X size={20} />
//                       </button>
//                     )}
//                   </td>
//                 </tr> 
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentSection;
