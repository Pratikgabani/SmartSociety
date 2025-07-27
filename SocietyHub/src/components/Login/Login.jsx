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
            "https://resihub.onrender.com/api/v1/users/login",
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
            "https://resihub.onrender.com/api/v1/users/login",
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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white mt-5 py-2 font-bold rounded-lg hover:bg-blue-700"
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
    </div>

  );
}

export default Login;

