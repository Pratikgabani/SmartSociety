import React, { useState } from "react";

const PaymentSection = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      description: "Monthly Maintenance",
      amount: "₹2000",
      status: "Paid",
      paymentDate: "2025-02-10 14:30",
      dueDate: "2025-02-15",
      receipt: "#12345",
    },
    {
      id: 2,
      description: "Parking Charges",
      amount: "₹500",
      status: "Pending",
      paymentDate: "-",
      dueDate: "2025-02-20",
      receipt: "-",
    },
  ]);

  const [isAdmin, setIsAdmin] = useState(true);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newPayment, setNewPayment] = useState({ description: "", amount: "", dueDate: "" });

  const handleNewPaymentChange = (e) => {
    setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
  };

  const addPayment = () => {
    setPayments([...payments, { ...newPayment, id: payments.length + 1, status: "Pending", paymentDate: "-", receipt: "-" }]);
    setNewPayment({ description: "", amount: "", dueDate: "" });
    setShowAdminForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-6">
      <div className="w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-blue-800 mb-6">Payment Section</h1>
        {isAdmin && (
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
              <div className="space-y-4">
                <input type="text" name="description" value={newPayment.description} onChange={handleNewPaymentChange} placeholder="Description" className="p-2 border rounded w-full" />
                <input type="number" name="amount" value={newPayment.amount} onChange={handleNewPaymentChange} placeholder="Amount" className="p-2 border rounded w-full" />
                <input type="date" name="dueDate" value={newPayment.dueDate} onChange={handleNewPaymentChange} className="p-2 border rounded w-full" />
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setShowAdminForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                  <button onClick={addPayment} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Payment</button>
                </div>
              </div>
            </div>
          </div>
        )}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
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
              <tr key={payment.id} className="border border-gray-300">
                <td className="border border-gray-300 px-4 py-2">{payment.description}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{payment.amount}</td>
                <td className={`border border-gray-300 px-4 py-2 text-center ${payment.status === "Paid" ? "text-green-600" : "text-red-600"}`}>{payment.status}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{payment.paymentDate}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{payment.dueDate}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {payment.receipt !== "-" ? <a href="#" className="text-blue-600 underline">{payment.receipt}</a> : "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {payment.status === "Pending" && <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Pay Now</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentSection;


