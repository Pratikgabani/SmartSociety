import React from 'react'
import { IoMdArrowDropdown } from "react-icons/io";
import dropDown from './../../assets/dropDown.png'
import logo from './../../assets/logo.png'
import ShinyText from '../ReactBit/Shiny';
import { SplitText } from '../ReactBit/SplitText';

import tickMark from './../../assets/Group92.png'
function Landing() {
  return (
    <>
    <div className='min-h-screen bg-[#F5F9FC] flex justify-center border-2 border-blue-500 '>
        <div className="container w-11/12 border-2 border-black">
        <nav className='flex justify-between items-center mt-6  py-3 text-lg border-2 border-red-500 '>
            <img className='cursor-pointer' href='/' src='#'alt="Resihub"/>
            <ul className='flex gap-9 items-center '>
                <li className='hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out'>Home</li>
                <li className='hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out flex items-center'>Features <IoMdArrowDropdown /></li>
                <li className='hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out'>Pricing</li>
                <li className='hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out'>About Us</li>
            </ul>
            <a className=' cursor-pointer text-black  font-semibold py-1 px-4 rounded-3xl border-2 border-black trasnsition duration-300 ease-in-out hover:text-[white] hover:bg-[#005B96]  hover:border-[#005B96] hover:border-2  '>Login
            </a>
        </nav>

        <div className='mt-10 '>
            <div className="leftPart">
                <h1 className='text-[48px] font-bold'>Simplify Society Living with</h1>
                <h1 className='text-[#005B96] text-[48px] font-bold '><SplitText text="ResiHub !" className="custom-class" delay={150} /></h1>
                <ul className='flex flex-col gap-3'>
                    <li className='flex items-center text-[16px] w-[440px]'><img src={tickMark} alt="" />Streamline society communication with instant updates and announcements.</li>
                    <li className='flex items-center text-[16px] w-[440px]'><img src={tickMark} alt=""/>Manage finances securely with easy online payment and tracking.</li>
                    <li className='flex items-center text-[16px] w-[440px]'><img src={tickMark} alt=""/>Organize and optimize resources efficiently in one centralized system.</li>
                    <li className='flex items-center text-[16px] w-[440px]'><img src={tickMark} alt=""/>Simplify everyday management tasks with automation and user-friendly tools.</li>
                </ul>
            </div>
            <div className="rightPart">
                <img  alt="" />
            </div>
        </div>
        </div>
          </div>
    </>
  )
}

export default Landing
