
import React, { useEffect, useState } from 'react';
import img1 from './../../assets/Rectangle95.png';
import img2 from './../../assets/Rectangle99.png';
import logo from './../../assets/logo.png';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import building1 from './../../assets/Rectangle95.png';
import building2 from './../../assets/Rectangle99.png';
import * as Yup from 'yup';
import { Phone } from 'lucide-react';


const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState([]);
  const validateObject = Yup.object({
    block: Yup.string().matches(/^[A-Za-z]$/, "Must be a single alphabet character").required('Block is required'),
    houseNo : Yup.number().min(1, 'House No must be greater than 0').max(1000, 'House No must be less than 1000').required('House No is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').max(8, 'Password must be at most 8 characters').required('Password is required'),
    societyId: Yup.string().required('Society ID is required'),
    email: Yup.string().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email').email('Invalid email').required('Email is required'),
    nameOfPersons: Yup.array().of(Yup.string().max(10, 'Name of Person must be at most 10 characters').required('Name of Person is required')),
    phoneNo  : Yup.array().of(Yup.string().matches(/^[0-9]{10}$/, "Phone number must be 10 digits").required('Phone No is required')),
    numberOfVeh: Yup.number().min(0, 'Number of Vehicles must be greater than 0').max(10, 'Number of Vehicles must be less than 10').required('Number of Vehicles is required'),
    vehicleNo: Yup.array().of(Yup.string().max(10, 'Vehicle No must be at most 10 characters').required('Vehicle No is required')),
  })
  const [formData, setFormData] = useState({
    block: '',
    houseNo: '',
    password: '',
    societyId: '',
    email: '',
    role: 'user', // Default role
    nameOfPersons: [''],
    phoneNo: [''],
    numberOfVeh: 0,
    vehicleNo: [''],
  });

 useEffect(() => {
  const token = localStorage.getItem('user');
  if (token) {
    navigate('/OrgLanding');
  }
 })  

  const handleArrayChange = (index, e, field) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const addField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const removeField = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await validateObject.validate(formData, { abortEarly: false });
      const response = await axios.post(
        'http://localhost:8000/api/v1/users/register',
        {
          ...formData,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Signup successful: ', response.data);
      // toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      // if (error.response) {
      //   setErrorMessage(error.response.data.errors || 'Signup failed!!!');
      // }

      const errors = [];
      error.inner.forEach((e) => {
        errors[e.path] = e.message;
      });
     
  setErrorMessage(errors);
  console.log('Signup failed: ', errorMessage.block);
      
      console.log('Signup failed: ', error.inner);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-raleway">
      <div className="bg-white rounded-lg shadow-lg p-8 md:flex w-11/12 max-w-4xl">
        {/* Left Form Section */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-semibold">Block</label>
                <input
                  type="text"
                  name="block"
                  value={formData.block}
                  onChange={(e)=>{setFormData({...formData, block: e.target.value})}}
                  placeholder="Block"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errorMessage && <p className="text-red-500">{errorMessage.block}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold">House No</label>
                <input
                  type="text"
                  name="houseNo"
                  value={formData.houseNo}
                  onChange={(e)=>{setFormData({...formData, houseNo: e.target.value})}}
                  placeholder="House No"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errorMessage && <p className="text-red-500">{errorMessage.houseNo}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e)=>{setFormData({...formData, password: e.target.value})}}
                  placeholder="Password"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errorMessage && <p className="text-red-500">{errorMessage.password}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold">Society ID</label>
                <input
                  type="text"
                  name="societyId"
                  value={formData.societyId}
                  onChange={(e)=>{setFormData({...formData, societyId: e.target.value})}}
                  placeholder="Society ID"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errorMessage && <p className="text-red-500">{errorMessage.societyId}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e)=>{setFormData({...formData, email: e.target.value})}}
                  placeholder="Email"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errorMessage && <p className="text-red-500">{errorMessage.email}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold">Number of Vehicles</label>
                <input
                  type="number"
                  name="numberOfVeh"
                  value={formData.numberOfVeh}
                  onChange={(e)=>{setFormData({...formData, numberOfVeh: e.target.value})}}
                  placeholder="Number of Vehicles"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errorMessage && <p className="text-red-500">{errorMessage.numberOfVeh}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="security">Security</option>
                </select>
              </div>
              {formData.role === 'admin' && (
  <div>
    <label className="block mb-1 font-semibold">rolePass</label>
    <input
      type="password"
      name="password"
      value={formData.rolePass}
      onChange={(e) => setFormData({ ...formData, rolePass: e.target.value })}
      placeholder="rolePass"
      required
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>
)}
{formData.role === 'security' && (
  navigate('/SecurityRegister')
)}
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
                    <button
                      type="button"
                      onClick={() => removeField(index, 'nameOfPersons')}
                      className="ml-2 text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField('nameOfPersons')}
                className="text-blue-500"
              >
                Add Another Person
              </button>
              {errorMessage && <p className="text-red-500">{errorMessage.nameOfPersons}</p>}
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
                      {errorMessage && <p className="text-red-500">{errorMessage.phoneNo}</p>}
                  {formData.phoneNo.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(index, 'phoneNo')}
                      className="ml-2 text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
          
              <button
                type="button"
                onClick={() => addField('phoneNo')}
                className="text-blue-500"
              >
                Add Another Phone No
              </button>
              
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
                    <button
                      type="button"
                      onClick={() => removeField(index, 'vehicleNo')}
                      className="ml-2 text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {errorMessage && <p className="text-red-500">{errorMessage.vehicleNo}</p>}
              <button
                type="button"
                onClick={() => addField('vehicleNo')}
                className="text-blue-500"
              >
                Add Another Vehicle
              </button>
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white py-2 font-bold rounded-lg w-full"
            >
              Register
            </button>
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