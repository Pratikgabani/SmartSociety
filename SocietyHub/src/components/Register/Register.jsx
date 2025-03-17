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
  const [errorMessage, setErrorMessage] = useState({});
  const [formData, setFormData] = useState({
    block: '',
    houseNo: '',
    password: '',
    societyId: '',
    email: '',
    role: 'user', // Default role
    name:'',
    phoneNo: '',
    phoneNo2: '',
  });
  const validationSchema = Yup.object({
    block: Yup.string()
      .max(1, 'Block must be at most 1 character')
      .matches(/^[A-Za-z]$/, "Must be a single alphabet character")
      .required('Block is required'),

    houseNo: Yup.number()
      .typeError('House No must be a number')
      .min(1, 'House No must be greater than 0')
      .max(1000, 'House No must be less than 1000')
      .required('House No is required'),

    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
      .required('Password is required'),

    societyId: Yup.string().required('Society ID is required'),

    email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    )
    .required('Email is required'),

    name: Yup.string()
    .matches(/^[a-zA-Z]+( [a-zA-Z]+)+$/, 'Please enter your full name (first and last name required)')
    .required('Full name is required'),


    phoneNo: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone No is required'),

      // Optional
    phoneNo2: Yup.string()
    .transform((value) => (value === '' ? null : value))
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .notRequired() // Allows the field to be empty
    .nullable(), 

  });

  useEffect(() => {
    const token = localStorage.getItem('user');
    if (token) {
      navigate('/OrgLanding');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
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
      if (error.response) {
        setErrorMessage(error.response.data.errors || 'Signup failed!!!');
      }

      // const errors = {};
      // error.inner.forEach((e) => {
      //   errors[e.path] = e.message;
      // });

      setErrorMessage(error);

      console.log('Signup failed:a ', errorMessage);

      console.log('Signup failed: ', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-raleway">
      <div className="bg-white rounded-lg shadow-lg p-8 md:flex w-11/12 max-w-5xl">
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
                  onChange={(e) => { setFormData({ ...formData, block: e.target.value }) }}
                  placeholder="Block"

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
                  onChange={(e) => { setFormData({ ...formData, houseNo: e.target.value }) }}
                  placeholder="House No"

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
                  onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }}
                  placeholder="Password"

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
                  onChange={(e) => { setFormData({ ...formData, societyId: e.target.value }) }}
                  placeholder="Society ID"

                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errorMessage && <p className="text-red-500">{errorMessage.societyId}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={(e) => { setFormData({ ...formData, email: e.target.value }) }}
                  placeholder="Email"

                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errorMessage && <p className="text-red-500">{errorMessage.email}</p>}

              </div>
              <div className="">
              <label className="block mb-1 font-semibold">Full Name </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }) }}
                placeholder="Full Name"

                className="w-full p-2 border border-gray-300 rounded"
              />
              {errorMessage && <p className="text-red-500">{errorMessage.name}</p>}

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
                  <label className="block mb-1 font-semibold">Role Pass</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.rolePass}
                    onChange={(e) => setFormData({ ...formData, rolePass: e.target.value })}
                    placeholder="RolePass"

                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              )}
              {formData.role === 'security' && (
                navigate('/SecurityRegister')
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Phone No</label>
              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={(e) => { setFormData({ ...formData, phoneNo: e.target.value }) }}
                placeholder="Phone No"

                className="w-full p-2 border border-gray-300 rounded"
              />
              {errorMessage && <p className="text-red-500">{errorMessage.phoneNo}</p>}

            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">Phone No 2 (Optional)</label>
              <input
                type="text"
                name="phoneNo2"
                value={formData.phoneNo2}
                onChange={(e) => { setFormData({ ...formData, phoneNo2: e.target.value }) }}
                placeholder="Phone No 2"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errorMessage && <p className="text-red-500">{errorMessage.phoneNo2}</p>}
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white py-2 font-bold rounded-lg w-full hover:bg-blue-700"
            >
              Register
            </button>
          </form>
        </div>
        {/* Right Image Section */}
        <div className="hidden md:flex md:w-1/2 md:flex-col md:gap-4 md:pl-6">
          <img src={building1} alt="Building 1" className="rounded-lg mb-4 h-72" />
          <img src={building2} alt="Building 2" className="rounded-lg h-72" />
        </div>
      </div>
    </div>
  );
};

export default Register;