import React, { useState } from 'react';
import img1 from './../../assets/Rectangle95.png'
import img2 from './../../assets/Rectangle99.png'
import logo from './../../assets/logo.png';
import axios from 'axios';
import {Link,useNavigate} from 'react-router-dom'
import building1 from './../../assets/Rectangle95.png';
import building2 from './../../assets/Rectangle99.png';
import { toast, ToastContainer } from 'react-toastify';
const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    block: '',
    houseNo: '',
    password: '',
    societyId: '',
    email: '',
    nameOfPersons: [''],
    phoneNo: [''],
    numberOfVeh: 0,
    vehicleNo: [''],
    
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleArrayChange = (index, e, field) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const addField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeField = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        {
          ...formData
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Signup successful: ", response.data);
      // toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Signup failed!!!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-raleway">
      <div className="bg-white rounded-lg shadow-lg p-8 md:flex w-11/12 max-w-4xl">
        {/* Left Form Section */}
        <div className="md:w-1/2">
          <a href='/'>
            <img src={logo} alt="Nova Vista" className="mx-auto mb-4" />
          </a>
          <h1 className="text-3xl font-bold mb-4">Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-semibold">Block</label>
                <input type="text" name="block" value={formData.block} onChange={handleChange} placeholder="Block" required className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">House No</label>
                <input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} placeholder="House No" required className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Society ID</label>
                <input type="text" name="societyId" value={formData.societyId} onChange={handleChange} placeholder="Society ID" required className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Number of Vehicles</label>
                <input type="number" name="numberOfVeh" value={formData.numberOfVeh} onChange={handleChange} placeholder="Number of Vehicles" required className="w-full p-2 border border-gray-300 rounded" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Name of Persons</label>
              {formData.nameOfPersons.map((name, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleArrayChange(index, e, 'nameOfPersons')}
                    placeholder="Name of Person"
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {formData.nameOfPersons.length > 1 && (
                    <button type="button" onClick={() => removeField(index, 'nameOfPersons')} className="ml-2 text-red-500">Remove</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addField('nameOfPersons')} className="text-blue-500">Add Another Person</button>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Phone No</label>
              {formData.phoneNo.map((phone, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => handleArrayChange(index, e, 'phoneNo')}
                    placeholder="Phone No"
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {formData.phoneNo.length > 1 && (
                    <button type="button" onClick={() => removeField(index, 'phoneNo')} className="ml-2 text-red-500">Remove</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addField('phoneNo')} className="text-blue-500">Add Another Phone No</button>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Vehicle No</label>
              {formData.vehicleNo.map((vehicle, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => handleArrayChange(index, e, 'vehicleNo')}
                    placeholder="Vehicle No"
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {formData.vehicleNo.length > 1 && (
                    <button type="button" onClick={() => removeField(index, 'vehicleNo')} className="ml-2 text-red-500">Remove</button>
                  )}
                </div>
              ))}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              
              <button type="button" onClick={() => addField('vehicleNo')} className="text-blue-500">Add Another Vehicle</button>
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white py-2 font-bold rounded-lg w-full">Register</button>
          </form>
        </div>
        {/* Right Image Section */}
        <div className="hidden md:flex md:w-1/2 md:flex-col md:gap-4 md:pl-6">
          <img src={building1} alt="Building 1" className="rounded-lg mb-4" />
          <img src={building2} alt="Building 2" className="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Register;
