import React, { useState , useContext , useEffect } from 'react';

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
    password: ''
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
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?\u0026])[A-Za-z\d@$!%*?\u0026]{8,16}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
      .required('Password is required'),
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
            const gRole = result.data?.data?.user?.role?.toString();
            if (!gRole) throw new Error("Invalid login response");
            setRolee(gRole);
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
      try {
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
        const userRole = response.data?.data?.user?.role?.toString();
        if (!userRole) {
          toast.error("Login failed — unexpected response");
          return;
        }
        setRolee(userRole);
        toast.success("Logged in successfully");
        if (userRole === "security") {
          navigate("/layout/Visitor");
        } else {
          navigate("/layout/Dashboard");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error logging in");
        if (error.response) {
          setErrorMessage(error.response.data.errors || "Login failed!!!");
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
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FE] font-raleway p-4">
      <Toaster />
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 w-full max-w-md transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-5">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Log in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">Email Address</label>
            <input
              name='email'
              type="text"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              onChange={handleChange}
              value={formData.email}
              id='email'
            />
            {errorMessage.email && <div className='text-red-500 text-xs font-semibold mt-1 pl-1'>{errorMessage.email}</div>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
              name='password'
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              onChange={handleChange}
              value={formData.password}
              id='password'
            />
            {errorMessage.password && <div className='text-red-500 text-xs font-semibold mt-1 pl-1'>{errorMessage.password}</div>}
          </div>



          <div className="flex items-center justify-end">
            <span 
              onClick={() => setIsForgotModalOpen(true)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
            >
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 mt-1 font-medium rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center space-x-4">
          <span className="block h-px w-full bg-gray-200"></span>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">OR</span>
          <span className="block h-px w-full bg-gray-200"></span>
        </div>

        <div className="mt-4">
          <button 
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-2.5 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98] shadow-sm" 
            onClick={googleLogin}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="text-center mt-5">
          <p className="text-sm text-gray-600 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Reset Password</h2>
              <button 
                onClick={() => { setIsForgotModalOpen(false); setForgotStep(1); }}
                className="text-gray-400 hover:text-gray-700 transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {forgotStep === 1 && (
              <div className="space-y-5">
                <p className="text-gray-600 text-sm font-medium">Enter your email to receive a password reset OTP.</p>
                <div>
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
                >
                  {forgotLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            )}

            {forgotStep === 2 && (
              <div className="space-y-5">
                <p className="text-gray-600 text-sm font-medium">Enter the 6-digit code sent to <b className="text-gray-900">{forgotEmail}</b></p>
                <div>
                  <input 
                    type="text" 
                    placeholder="6-Digit OTP"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center tracking-[0.5em] text-xl font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleVerifyForgotOtp}
                  disabled={forgotLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
                >
                  {forgotLoading ? "Verifying..." : "Verify OTP"}
                </button>
                <div className="text-center">
                  <button onClick={() => setForgotStep(1)} className="text-blue-600 font-semibold hover:text-blue-700 hover:underline text-sm transition-colors">Wrong email?</button>
                </div>
              </div>
            )}

            {forgotStep === 3 && (
              <div className="space-y-5">
                <p className="text-gray-600 text-sm font-medium">Create a new secure password.</p>
                <div className="space-y-4">
                  <input 
                    type="password" 
                    placeholder="New Password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input 
                    type="password" 
                    placeholder="Confirm New Password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleResetPassword}
                  disabled={forgotLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
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

