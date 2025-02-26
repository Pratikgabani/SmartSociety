import React,{ useState} from 'react';
import logo from './../../assets/logo.png';
import building1 from './../../assets/Rectangle95.png';
import building2 from './../../assets/Rectangle99.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  

  const handleSubmit = async (e) => {
    e.preventDefault();
      if(role === "security"){
        try {
          const response = await axios.post(
            "http://localhost:8000/api/v1/security/loginSecurity",
            {
              email,
              password,
              role
            },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          localStorage.setItem("user", JSON.stringify(response.data));
            navigate("/Visitor");
          
          console.log("Login successful: ", response.data);
         
          
        } catch (error) {
          if (error.response) {
            setErrorMessage(error.response.data.errors || "Login failed!!!");
          }
        }
      }
      else{
        try {
          const response = await axios.post(
            "http://localhost:8000/api/v1/users/login",
            {
              email,
              password,
              
            },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        
          console.log("Login successful: ", response.data);
          
          localStorage.setItem("user", JSON.stringify(response.data));
          navigate("/OrgLanding");
        } catch (error) {
          if (error.response) {
            setErrorMessage(error.response.data.errors || "Login failed!!!");
          }
        }
      }
   
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-raleway">
      <div className="bg-white rounded-lg shadow-lg p-8  md:flex w-11/12 max-w-4xl">
      {/* Left Form Section */}
        <div className="md:w-1/2">
          <a href='/'>
          <img  src={logo} alt="Nova Vista" className="mx-auto mb-4 " />
          </a>
          
          <h1 className="text-3xl font-bold  mb-4 cursor-pointer">Login</h1>
        
        <form onSubmit={handleSubmit}>
         
          <div className="mb-4">
            <label className="block font-medium text-gray-700">email</label>
            <input
              type="text"
              placeholder="John@12deo5"
              className="w-full px-3 py-2 border rounded-lg"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              id='email'
              required
            />
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="John@12deo5"
              className="w-full px-3 py-2 border rounded-lg"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              id='password'
              required
            />
          </div>
          <div className="mb-6">
  <label className="block font-medium text-gray-700">ROLE</label>
  <select
    className="w-full px-3 py-2 border rounded-lg"
    value={role}
    onChange={(e) => setRole(e.target.value)}
    required
  >
    <option value="" disabled>Select a role</option>
    <option value="security">Security</option>
    <option value="admin">Admin</option>
    <option value="user">User</option>
  </select>
</div>

          
          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          <button
            type="submit"
            className="w-full bg-[#005B96] text-white py-2 font-bold rounded-lg hover:bg-[#005B96]"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="text-[#005B96] font-bold">
              Register
            </a>
          </p>
        </div>
        <div className="text-center mt-4 cursor-pointer">
          <p>Or with</p>
          <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg mt-2 hover:bg-gray-300">
            Continue with Mobile
          </button>
          <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg mt-2 hover:bg-gray-300">
            Continue with Google
          </button>
        </div>
      </div>

{/* Right Image Section */}
      <div className="hidden md:flex md:w-1/2 md:flex-col md:gap-4 md:pl-6">
        <img src={building1} alt="Building 1" className=" rounded-lg " />
        <img src={building2} alt="Building 2" className=" rounded-lg" />
        </div>
      </div>
    </div>
    
  );
}

export default Login;

