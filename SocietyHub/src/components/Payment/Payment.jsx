import React from 'react';

const Payment = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <p className="mb-6">Manage your maintenance and event payments</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Due Payment</h2>
          <p className="text-3xl font-bold text-red-500 mb-2">₹5,000</p>
          <p className="text-gray-600 mb-4">Due Date: October 15, 2023</p>
          <p className="text-gray-600 mb-4">Late Fee: ₹500 after due date</p>
          <button className="bg-blue-600 text-white py-2 px-4 rounded">Pay Now</button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Last Payment</h2>
          <p className="text-3xl font-bold text-green-500 mb-2">₹5,000</p>
          <p className="text-gray-600 mb-4">Paid on: September 15, 2023</p>
          <p className="text-gray-600 mb-4">Transaction ID: TXN123456</p>
          <button className="border border-gray-300 py-2 px-4 rounded">Download Receipt</button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Event Fund</h2>
          <p className="text-3xl font-bold text-yellow-500 mb-2">₹1,000</p>
          <p className="text-gray-600 mb-4">Diwali Celebration Fund</p>
          <p className="text-gray-600 mb-4">Last Date: October 10, 2023</p>
          <button className="bg-blue-600 text-white py-2 px-4 rounded">Contribute</button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">DATE</th>
              <th className="py-2">DESCRIPTION</th>
              <th className="py-2">AMOUNT</th>
              <th className="py-2">STATUS</th>
              <th className="py-2">ACTION</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">Sep 15, 2023</td>
              <td className="py-2">Monthly Maintenance</td>
              <td className="py-2">₹5,000</td>
              <td className="py-2 text-green-500">Paid</td>
              <td className="py-2 text-blue-600"><button>Download Receipt</button></td>
            </tr>
            <tr>
              <td className="py-2">Aug 15, 2023</td>
              <td className="py-2">Monthly Maintenance</td>
              <td className="py-2">₹5,000</td>
              <td className="py-2 text-green-500">Paid</td>
              <td className="py-2 text-blue-600"><button>Download Receipt</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;
