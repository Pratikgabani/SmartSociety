import React from 'react';
import img1 from './../../assets/Rectangle95.png'
import img2 from './../../assets/Rectangle99.png'

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6 md:flex w-11/12 max-w-4xl">
        {/* Left Form Section */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">Register</h1>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="John Deon"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="john76d0@gmail.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="mb-4 flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Block</label>
                <input
                  type="text"
                  placeholder="A, B, C, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">House no.</label>
                <input
                  type="text"
                  placeholder="102, 405, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="John@12deo5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </button>
          </form>
          <p className="text-sm text-center mt-4">
            You have already registered?{'  '}
            <a href="#" className="text-blue-600 underline">
              Login
            </a>
          </p>
        </div>

        {/* Right Image Section */}
        <div className="hidden md:flex md:w-1/2 md:flex-col md:gap-4 md:pl-6">
          <img
            src={img1}
            alt="Apartment"
            className="rounded-lg"
          />
          <img
            src={img2}
            alt="Villa"
            className="rounded-lg"
          />
         
        </div>
      </div>
    </div>
   
  );
};

export default Register;
