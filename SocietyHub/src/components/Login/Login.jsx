import React from 'react';
import logo from './../../assets/logo.png';
import building1 from './../../assets/Rectangle95.png';
import building2 from './../../assets/Rectangle99.png';
function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <img src={logo} alt="Nova Vista" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Login</h1>
        </div>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Block</label>
            <input
              type="text"
              placeholder="A, B, C, etc."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">House no.</label>
            <input
              type="text"
              placeholder="102, 405, etc."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="John@12deo5"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="text-blue-500">
              Register
            </a>
          </p>
        </div>
        <div className="text-center mt-4">
          <p>Or with</p>
          <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg mt-2 hover:bg-gray-300">
            Continue with Mobile
          </button>
          <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg mt-2 hover:bg-gray-300">
            Continue with Google
          </button>
        </div>
      </div>
      <div className="hidden lg:flex flex-col ml-8 mt-4">
        <img src={building1} alt="Building 1" className=" mb-4 rounded-lg shadow-lg" />
        <img src={building2} alt="Building 2" className="mb-4  rounded-lg shadow-lg" />
        
      </div>
    </div>
  );
}

export default Login;

