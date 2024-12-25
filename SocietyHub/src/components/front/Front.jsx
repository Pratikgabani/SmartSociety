import React from 'react';
import logo from './../../assets/logo.png'; // Adjust the path based on your folder structure
import apartment from './../../assets/Rectangle99.png'; // Adjust the path based on your folder structure
import { Link } from 'react-router-dom';
import img1 from './../../assets/Rectangle95.png'
import img2 from './../../assets/Rectangle99.png'

const Front = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="flex items-center  p-4 ">
        <div className="flex items-center ">
          <img src={logo} alt="Nova Vista Logo" className="h-15 mr-2 " />
          
        </div>
      </header>
      <main className="flex mt-10 justify-center">
        <div >
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Collaborate with <span className="text-blue-500">your.</span>
        </h2>
        <p className="text-lg text-gray-600 mb-6">Connect with your neighbors and stay</p>
        <div className="flex flex-col items-center w-full mb-6">
         <a href="/register" className="w-full max-w-xs p-2 mb-2 text-center text-white bg-blue-500 rounded-3xl hover:bg-blue-600 " > <button  className='hover:underline'>Register</button></a>
          <a href="/login" className="w-full max-w-xs p-2 mb-2 text-center text-white bg-blue-500 rounded-3xl hover:bg-blue-600 " > <button  className='hover:underline '>Login</button></a>
          <p className="text-gray-600 mb-2">Or with</p>
          <button className="w-full max-w-xs p-2 mb-2 text-white bg-gray-500 hover:bg-gray-600 rounded-3xl">Continue with Mobile</button>
          <button className="w-full max-w-xs p-2 mb-2 text-white bg-gray-500 hover:bg-gray-600 rounded-3xl">Continue with Google</button>
        </div>
        </div>
        <div>
        <div className="flex items-center justify-center w-full mb-6">
          <img src={apartment} alt="Apartment Building" className="w-full max-w-md rounded-lg shadow-lg" />
        </div>
        <div className="text-left w-full max-w-4xl">
          <p className=" mb-2 text-lg font-semibold text-gray-500">Welcome to Nova Vista, your trusted partner in comprehensive residential management solutions.</p>
          <p className="text-gray-500 text-lg font-semibold">Whether you're a homeowner, landlord, or tenant, we simplify property management with a range of services tailored to meet your unique needs.</p>
        </div>
        </div>
      
      </main>
    </div>

  //   <div className="min-h-screen flex items-center justify-center bg-gray-100">
      


  //     </div>
  );
};

export default Front;
