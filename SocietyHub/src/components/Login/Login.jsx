import React, { useState , useContext , useEffect } from 'react';
import building1 from './../../assets/Rectangle95.png';
import building2 from './../../assets/Rectangle97.jpg';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../axios';
import * as Yup from "yup";
import { Toaster, toast } from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google'
import { googleAuth } from '../../api';
import UserContext from '../../context/UserContext.js';


function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  })
  const {rolee , setRolee} = useContext(UserContext);
  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email format'
      )
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
      .required('Password is required'),
    role: Yup.string()
      .required("Role is required")
  })
  useEffect(() => {
  if (rolee==="admin" || rolee==="user") {
    navigate("/layout/Dashboard");
  }else if(rolee==="security"){
    navigate("/layout/Visitor");
  }
}, [rolee, navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }
   
  const responseGoogle = async (authResult) => { // 2
      try {
        if (authResult["code"]) {
          const result = await googleAuth(authResult.code); 
            setRolee(result.data.data.user.role.toString());
          toast.success("Google Login Successful");
          navigate('/layout/Dashboard');
        } else {
          // console.log(authResult);
          throw new Error(authResult);
        }
      } catch (e) {
        toast.error("Google email not registered");
        console.log('Error while Google Login...', e);
      }
    };

  const googleLogin = useGoogleLogin({ // 1 
		onSuccess: responseGoogle,
		onError: responseGoogle,
		flow: "auth-code",
	});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      // console.log("Form submitted " , formData);
      if (formData.role === "security") {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_URL_BACKEND}/api/v1/users/login`,
            {
              email: formData.email,
              password: formData.password,
              role: formData.role
            },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          // console.log(response.data.data.user.role)
          setRolee(response.data.data.user.role.toString());
          toast.success("Logged in successfully");
          navigate("/layout/Visitor");
        } catch (error) {
          console.log(error)
          toast.error("error logging in");
          if (error.response) {
            setErrorMessage(error.response.data.errors || "Login failed!!!");
          }
        }
      }
      else {
        try {
          await validationSchema.validate(formData, { abortEarly: false });
          const response = await axios.post(
            `${import.meta.env.VITE_URL_BACKEND}/api/v1/users/login`,
            {
              email: formData.email,
              password: formData.password,

            },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          // console.log(response.data.data.user.role)
          setRolee(response.data.data.user.role.toString());
          toast.success("Logged in successfully");
          navigate("/layout/Dashboard");
        } catch (error) {
          toast.error("error logging in");
          if (error.response) {

            setErrorMessage(error.response.data.errors || "Login failed!!!");
          }
        }
      }
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message
      });
      setErrorMessage(newErrors)

    }


  };

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!forgotEmail) return toast.error("Please enter your email");
    setForgotLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_URL_BACKEND}/api/v1/users/forgot-password`, { email: forgotEmail });
      toast.success("OTP sent to your email");
      setForgotStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyForgotOtp = async () => {
    if (!forgotOtp) return toast.error("Please enter OTP");
    setForgotLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_URL_BACKEND}/api/v1/users/verify-forgot-password-otp`, { 
        email: forgotEmail, 
        otp: forgotOtp 
      });
      toast.success("OTP verified");
      setForgotStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return toast.error("All fields are required");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    
    // Validate password regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      return toast.error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (8-16 chars)");
    }

    setForgotLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_URL_BACKEND}/api/v1/users/reset-password`, { 
        email: forgotEmail, 
        newPassword 
      });
      toast.success("Password reset successful! Please login.");
      setIsForgotModalOpen(false);
      setForgotStep(1);
      setForgotEmail('');
      setForgotOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-raleway">
      <Toaster />
      <div className="bg-white rounded-lg shadow-lg p-8  md:flex w-11/12 max-w-5xl">
        {/* Left Form Section */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold  mb-4 cursor-pointer">Login</h1>

          <form onSubmit={handleSubmit}>

            <div className="mb-2">
              <label className="block  text-gray-700 font-semibold">Email</label>
              <input
                name='email'
                type="text"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-lg"
                onChange={handleChange}
                value={formData.email}
                id='email'
              />
              {errorMessage.email && <div className='text-red-500 mt-1'>{errorMessage.email}</div>}
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold">Password</label>
              <input
                name='password'
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded-lg"
                onChange={handleChange}
                value={formData.password}
                id='password'
              />
              {errorMessage.password && <div className='text-red-500 mt-1'>{errorMessage.password}</div>}
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold">Role</label>
              <select
                name="role"
                className="w-full px-3 py-2 border rounded-lg cursor-pointer"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="" disabled>Select a role</option>
                <option value="security">Security</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              {errorMessage.role && <div className='text-red-500 mt-1'>{errorMessage.role}</div>}
            </div>
            <div className="text-right mb-4">
              <span 
                onClick={() => setIsForgotModalOpen(true)}
                className="text-sm text-blue-600 hover:underline cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
          <div className="text-center mt-2 cursor-pointer">
            <p>Or</p>
            <button className="w-full bg-gray-200 text-gray-600 py-2 font-bold rounded-lg mt-2 hover:bg-gray-300" onClick={googleLogin}> 
              Continue with Google
            </button >
              <div className="text-center mt-4">
                <p>
                  Don't have an account?{' '}
                  <a href="/register" className="text-blue-600 font-bold">
                    Register
                  </a>
                </p>
              </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="hidden md:flex md:w-1/2 md:flex-col md:gap-4 md:pl-6">
          <img src={building1} alt="Building 1" className=" rounded-lg h-72" />
          <img src={building2} alt="Building 2" className=" rounded-lg h-72" />
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
              <button 
                onClick={() => { setIsForgotModalOpen(false); setForgotStep(1); }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {forgotStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-600">Enter your email to receive a password reset OTP.</p>
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <button 
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-400 transition"
                >
                  {forgotLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            )}

            {forgotStep === 2 && (
              <div className="space-y-4">
                <p className="text-gray-600">Enter the 6-digit code sent to <b>{forgotEmail}</b></p>
                <input 
                  type="text" 
                  placeholder="6-Digit OTP"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center tracking-widest text-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                />
                <button 
                  onClick={handleVerifyForgotOtp}
                  disabled={forgotLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-400 transition"
                >
                  {forgotLoading ? "Verifying..." : "Verify OTP"}
                </button>
                <div className="text-center">
                  <button onClick={() => setForgotStep(1)} className="text-blue-600 hover:underline text-sm">Wrong email?</button>
                </div>
              </div>
            )}

            {forgotStep === 3 && (
              <div className="space-y-4">
                <p className="text-gray-600">Create a new secure password.</p>
                <input 
                  type="password" 
                  placeholder="New Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                  onClick={handleResetPassword}
                  disabled={forgotLoading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-green-400 transition"
                >
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>

  );
}

export default Login;

