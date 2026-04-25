
import React, { useState } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

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
      await axios.post(`${import.meta.env.VITE_URL_BACKEND}/api/v1/security/registerSecurity`, formData);
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
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FE] font-raleway p-4">
      <Toaster />
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 w-full max-w-md transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-5">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Security Register</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Register for security access</p>
        </div>

        {errorMessage && <div className="text-red-500 mb-4 text-center font-semibold text-sm">{errorMessage}</div>}
        {successMessage && <div className="text-green-600 mb-4 text-center font-semibold text-sm">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Society ID </label>
            <input
              type="text"
              name="societyId"
              value={formData.societyId}
              onChange={handleChange}
              placeholder="Enter Society ID"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Security Pass </label>
            <input
              type="text"
              name="securityPass"
              value={formData.securityPass}
              onChange={handleChange}
              placeholder="Enter Security Pass"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 mt-2 font-medium rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-5">
          <p className="text-sm text-gray-600 font-medium">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );

}

export default SecurityRegister;
