import React, { useState } from 'react';
import axios from '../../axios';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import * as Yup from 'yup';

const SocietyDetails = () => {
  const navigate = useNavigate();
  const [society, setSociety] = useState({
    societyId: '',
    societyName: '',
    societyAddress: '',
    adminPass: '',
    securityPass: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const validationSchema = Yup.object({
    adminPass: Yup.string()
      .min(8, 'Admin Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Admin Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('Admin Password is required'),

    securityPass: Yup.string()
      .min(8, 'Security Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Security Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('Security Password is required'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      await validationSchema.validate(society, { abortEarly: false });
      const response = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/societyDetail/createSocietyDetail`,
        { ...society },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Society details submitted successfully!');
      navigate('/register');
    } catch (error) {
      const errors = {};
      if (error.inner) {
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setFormErrors(errors);
      }
      console.log(error);
    }
  };

  // Shared input & error classes (same as Register page)
  const inputCls = 'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-sm';
  const errCls = 'text-red-500 text-xs font-semibold mt-1 pl-1';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FE] font-raleway p-4">
      <Toaster />
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 w-full max-w-md transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-5">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Society Details</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Register your society to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Society ID</label>
            <input
              type="text"
              name="societyId"
              value={society.societyId}
              onChange={(e) => setSociety({ ...society, societyId: e.target.value })}
              placeholder="Enter Society ID"
              required
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Society Name</label>
            <input
              type="text"
              name="societyName"
              value={society.societyName}
              onChange={(e) => setSociety({ ...society, societyName: e.target.value })}
              placeholder="Enter Society Name"
              required
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Society Address</label>
            <input
              type="text"
              name="societyAddress"
              value={society.societyAddress}
              onChange={(e) => setSociety({ ...society, societyAddress: e.target.value })}
              placeholder="Enter Society Address"
              required
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Admin Password</label>
            <input
              type="password"
              name="adminPass"
              value={society.adminPass}
              onChange={(e) => setSociety({ ...society, adminPass: e.target.value })}
              placeholder="Enter Admin Password"
              required
              className={inputCls}
            />
            {formErrors.adminPass && (
              <p className={errCls}>{formErrors.adminPass}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Security Password</label>
            <input
              type="password"
              name="securityPass"
              value={society.securityPass}
              onChange={(e) => setSociety({ ...society, securityPass: e.target.value })}
              placeholder="Enter Security Password"
              required
              className={inputCls}
            />
            {formErrors.securityPass && (
              <p className={errCls}>{formErrors.securityPass}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 mt-1 font-medium rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
          >
            Submit
          </button>
        </form>

        <div className="text-center mt-5">
          <p className="text-sm text-gray-600 font-medium">
            Go to{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocietyDetails;

