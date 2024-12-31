import React from 'react';
import logo from './../../assets/logo.png';
import building1 from './../../assets/Rectangle95.png';
import building2 from './../../assets/Rectangle99.png';
function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-raleway">
      <div className="bg-white rounded-lg shadow-lg p-8  md:flex w-11/12 max-w-4xl">
      {/* Left Form Section */}
        <div className="md:w-1/2">
          <a href='/'>
          <img  src={logo} alt="Nova Vista" className="mx-auto mb-4 " />
          </a>
          
          <h1 className="text-3xl font-bold  mb-4 cursor-pointer">Login</h1>
        
        <form>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Block</label>
            <input
              type="text"
              placeholder="A, B, C, etc."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">House no.</label>
            <input
              type="text"
              placeholder="102, 405, etc."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="John@12deo5"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
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

