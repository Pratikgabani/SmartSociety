import React from 'react'
import { IoMdArrowDropdown } from "react-icons/io";
import dropDown from './../../assets/dropDown.png'
import logo from './../../assets/logo.png'
function Landing() {
  return (
    <>
    <div className='min-h-screen bg-[#F5F9FC]'>
        <nav className='flex justify-around items-center mt-6 py-3 text-lg border-2 border-red-500'>
            <img src={logo} alt="Logo" />
            <ul className='flex gap-6 items-center'>
                <li className='hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out'>Home</li>
                <li className='hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out flex items-center'>Features <IoMdArrowDropdown /></li>
                <li className='hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out'>Pricing</li>
                <li className='hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out'>About Us</li>
            </ul>
            <button className='bg-[#005B96]  text-white font-bold py-2 px-4 rounded-lg hover:bg-[#F5F9FC] hover:text-black hover:border-2 border-black trasnsition duration-100 ease-in-out'>
                Login
            </button>
        </nav>

        <div>
            <div className="leftPart">
                <h1 >Simplify Society Living with</h1>
                <h1> ResiHub</h1>
            </div>
        </div>
          </div>
    </>
  )
}

export default Landing
