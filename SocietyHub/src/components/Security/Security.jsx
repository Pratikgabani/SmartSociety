
import React, { useState } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import building1 from './../../assets/Rectangle95.png';
import building2 from './../../assets/Rectangle97.jpg';
function SecurityRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    societyId: '',
    securityPass: '',
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://resihub.onrender.com/api/v1/security/registerSecurity', formData);
      setSuccessMessage('Registration successful!');
      setErrorMessage('');
      setFormData({
        societyId: formData.societyId,
        securityPass: formData.securityPass,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error during registration:', error);
      setErrorMessage('Failed to register');
      setSuccessMessage('');
    }
  };   



return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 font-raleway">
    <Toaster />
    <div className="bg-white rounded-lg shadow-lg p-8 md:flex w-11/12 max-w-5xl">
      {/* Left Form Section */}
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-4 ">Security Register</h1>

        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-gray-700 font-semibold">Society ID *</label>
            <input
              type="text"
              name="societyId"
              value={formData.societyId}
              onChange={handleChange}
              placeholder="Enter Society ID"
              required
              className="w-full px-3 py-2 border rounded-lg "
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 font-semibold">Security Pass *</label>
            <input
              type="text"
              name="securityPass"
              value={formData.securityPass}
              onChange={handleChange}
              placeholder="Enter Security Pass"
              required
              className="w-full px-3 py-2 border rounded-lg "
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 font-semibold">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 border rounded-lg "
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 font-semibold">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2 border rounded-lg "
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white mt-5 py-2 font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-4">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 font-bold ">
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:flex md:w-1/2 md:flex-col md:gap-4 md:pl-6">
        <img src={building1} alt="Building 1" className="rounded-lg h-72" />
        <img src={building2} alt="Building 2" className="rounded-lg h-72" />
      </div>
    </div>
  </div>
);

}

export default SecurityRegister;
