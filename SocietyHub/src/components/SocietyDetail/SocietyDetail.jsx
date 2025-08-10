import React, { useState } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import building1 from './../../assets/Rectangle95.png';
import building2 from './../../assets/Rectangle97.jpg';
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
        'https://resihub2.onrender.com/api/v1/societyDetail/createSocietyDetail',
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-raleway">
      <Toaster />
      <div className="bg-white rounded-lg shadow-lg p-8 md:flex w-11/12 max-w-5xl">
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">Society Details Form</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-gray-700 font-semibold">Society ID *</label>
              <input
                type="text"
                name="societyId"
                value={society.societyId}
                onChange={(e) => setSociety({ ...society, societyId: e.target.value })}
                placeholder="Enter Society ID"
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-semibold">Society Name *</label>
              <input
                type="text"
                name="societyName"
                value={society.societyName}
                onChange={(e) => setSociety({ ...society, societyName: e.target.value })}
                placeholder="Enter Society Name"
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-semibold">Society Address *</label>
              <input
                type="text"
                name="societyAddress"
                value={society.societyAddress}
                onChange={(e) => setSociety({ ...society, societyAddress: e.target.value })}
                placeholder="Enter Society Address"
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-semibold">Admin Pass *</label>
              <input
                type="text"
                name="adminPass"
                value={society.adminPass}
                onChange={(e) => setSociety({ ...society, adminPass: e.target.value })}
                placeholder="Enter Admin Pass"
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              {formErrors.adminPass && (
                <p className="text-red-500 text-sm mt-1">{formErrors.adminPass}</p>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-semibold">Security Pass *</label>
              <input
                type="text"
                name="securityPass"
                value={society.securityPass}
                onChange={(e) => setSociety({ ...society, securityPass: e.target.value })}
                placeholder="Enter Security Pass"
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              {formErrors.securityPass && (
                <p className="text-red-500 text-sm mt-1">{formErrors.securityPass}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white mt-5 py-2 font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>

          <div className="text-center mt-4">
            <p>
              Go to{' '}
              <a href="/register" className="text-blue-600 font-bold">
                Register
              </a>
            </p>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 md:flex-col md:gap-4 md:pl-6">
          <img src={building1} alt="Building 1" className="rounded-lg h-72" />
          <img src={building2} alt="Building 2" className="rounded-lg h-72" />
        </div>
      </div>
    </div>
  );
};

export default SocietyDetails;
