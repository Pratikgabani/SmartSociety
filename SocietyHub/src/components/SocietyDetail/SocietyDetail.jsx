import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const SocietyDetails = () => {
    const navigate = useNavigate();
  const [society, setSociety] = useState({
    societyId: '',
    societyName: '',
    societyAddress: '',
    adminPass: '',
    securityPass: ''
  });

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/societyDetail/createSocietyDetail",
        {
          ...society
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Start successful: ", response.data);
      // toast.success(response.data.message);
      navigate("/register");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "start failed!!!");
      }
    }
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full"  >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Society Details Form</h1>
        <div className="mb-4">
          <label className="block font-semibold text-gray-600">Society ID</label>
          <input
            type="text"
            name="societyId"
            value={society.societyId}
            onChange={(e)=>{setSociety({...society, societyId: e.target.value})}}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-600">Society Name</label>
          <input
            type="text"
            name="societyName"
            value={society.societyName}
            onChange={(e)=>{setSociety({...society, societyName: e.target.value})}}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-600">Society Address</label>
          <input
            type="text"
            name="societyAddress"
            value={society.societyAddress}
            onChange={(e)=>{setSociety({...society, societyAddress: e.target.value})}}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-600">Admin Pass</label>
          <input
            type="text"
            name="adminPass"
            value={society.adminPass}
            onChange={(e)=>{setSociety({...society, adminPass: e.target.value})}}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-600">Security Pass</label>
          <input
            type="text"
            name="securityPass"
            value={society.securityPass}
            onChange={(e)=>{setSociety({...society, securityPass: e.target.value})}}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded font-semibold">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SocietyDetails;
