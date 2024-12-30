import React from 'react'
import { IoMdArrowDropdown } from "react-icons/io";
import dropDown from './../../assets/dropDown.png'
import logo from './../../assets/logo.png'
import ShinyText from '../ReactBit/Shiny';
import { SplitText } from '../ReactBit/SplitText';

import tickMark from './../../assets/Group92.png'
import Dropdown from '../Dropdown';
import Card from '../Card';
import SpotlightCard from '../SpotlightCard';
function Landing() {
    return (
        <>
            <div className='min-h-screen bg-[#F5F9FC] flex justify-center border-2 border-blue-500 '>
                <div className="container w-11/12 border-2 border-black">

                    <nav className=" border-b border-gray-200 text-white shadow-md py-3">
                        <div className="container mx-auto flex justify-between items-center px-4">
                            <a href="/" className="text-xl font-bold text-black"> <img className="h-8" src="#" alt="Resihub" /> </a>
                            <ul className="flex gap-9 items-center">
                                <li className="text-black hover:text-blue-400 font-medium cursor-pointer transition duration-200 ease-in-out">Home</li>
                                <li className="text-black hover:text-blue-400 font-medium cursor-pointer transition duration-200 ease-in-out"> <Dropdown /> </li>
                                <li className="text-black hover:text-blue-400 font-medium cursor-pointer transition duration-200 ease-in-out">Pricing</li>
                                <li className="text-black hover:text-blue-400 font-medium cursor-pointer transition duration-200 ease-in-out">About Us</li>
                            </ul> <a className="text-black bg-gray-100 hover:text-white hover:bg-blue-500 font-semibold py-2 px-4 rounded-full border border-black hover:border-blue-500 transition duration-300 ease-in-out" href="/login"> Login </a>
                        </div>
                    </nav>


                    <div className='mt-10 '>
                        <div className=" ml-10 leftPart">
                            <h1 className='text-[48px] font-bold'>Simplify Society Living with</h1>
                            <h1 className='text-[#005B96] text-[48px] font-bold '><SplitText text="ResiHub !" className="custom-class" delay={150} /></h1>
                            <ul className='flex flex-col gap-3'>
                                <li className='flex items-center text-[16px] w-[440px]'><img src={tickMark} alt="" />Streamline society communication with instant updates and announcements.</li>
                                <li className='flex items-center text-[16px] w-[440px]'><img src={tickMark} alt="" />Manage finances securely with easy online payment and tracking.</li>
                                <li className='flex items-center text-[16px] w-[440px]'><img src={tickMark} alt="" />Organize and optimize resources efficiently in one centralized system.</li>
                                <li className='flex items-center text-[16px] w-[440px]'><img src={tickMark} alt="" />Simplify everyday management tasks with automation and user-friendly tools.</li>
                                <li><button className='text-[#005B96] text-xl font-semibold border border-[#005B96] py-2 px-4 rounded-full hover:bg-blue-500 hover:text-white'>Let's explore</button></li>
                            </ul>
                        </div>
                       
                        <div className="flex flex-col items-center justify-center mt-10 bg-[#F5F9FC] border-none"> <div className=" p-8 rounded-lg  max-w-lg text-center">
                             <h1 className="text-5xl font-bold mb-4"> Why <span className="text-blue-600">ResiHub</span>? </h1> 
                             <ul className="text-left space-y-4 mt-7">
                                 <li> <span className="font-semibold text-xl">Better Communication:</span> Eliminate misunderstandings with instant notifications and updates. </li> 
                                 <li> <span className="font-semibold text-xl">Transparency:</span> Track finances and records in real time. </li>
                                  <li> <span className="font-semibold text-xl">Efficiency:</span> Save time with automation of daily tasks. </li>
                                   <li> <span className="font-semibold text-xl">Community Building:</span> Create a strong sense of belonging with engaging tools and features. </li>
                                 </ul> </div> </div>

                                 <div className='flex flex-col items-center justify-center mt-10'>
                                    <h1 className='text-[48px]  font-bold'>About us</h1>
                                    <p className='text-[16px] w-[740px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta explicabo distinctio saepe nobis facere alias iusto quasi reprehenderit ullam necessitatibus officia optio dolore possimus error tempore, soluta iure accusamus enim veritatis qui sapiente architecto. Quidem architecto voluptate vero dolorum inventore!</p>
                                 </div>
                             <div >
                                <h1 className='text-[48px] font-bold text-blue-500 text-center mt-10'>Features</h1>
                                 <div className='flex  items-center justify-center mt-10 gap-5 flex-wrap'>
                                 <SpotlightCard className="custom-spotlight-card bg-[#005B96] max-w-sm overflow-hidden" spotlightColor="rgba(0, 229, 155, 0.2)">
  <i class="fa fa-lock"></i>
  <h2>Card title</h2>
  <description className="overflow-hidden" >Our state of the artLearnLearn moreLearn moreLearn moreLearn more </description>
  <button>Learn </button>
</SpotlightCard>
<SpotlightCard className="custom-spotlight-card bg-[#005B96] max-w-sm" spotlightColor="rgba(0, 229, 155, 0.2)">
  <i class="fa fa-lock"></i>
  <h2>Card title</h2>
  <description >Our state of the artLearnLearn moreLearn moreLearn moreLearn more </description>
  <button>Learn </button>
</SpotlightCard>
<SpotlightCard className="custom-spotlight-card bg-[#005B96] max-w-sm" spotlightColor="rgba(0, 229, 155, 0.2)">
  <i class="fa fa-lock"></i>
  <h2>Card title</h2>
  <description >Our state of the artLearnLearn moreLearn moreLearn moreLearn more </description>
  <button>Learn </button>
</SpotlightCard>
<SpotlightCard className="custom-spotlight-card bg-[#005B96] max-w-sm" spotlightColor="rgba(0, 229, 155, 0.2)">
  <i class="fa fa-lock"></i>
  <h2>Card title</h2>
  <description >Our state of the artLearnLearn moreLearn moreLearn moreLearn more </description>
  <button>Learn </button>
</SpotlightCard>
<SpotlightCard className="custom-spotlight-card bg-[#005B96] max-w-sm" spotlightColor="rgba(0, 229, 155, 0.2)">
  <i class="fa fa-lock"></i>
  <h2>Card title</h2>
  <description >Our state of the artLearnLearn moreLearn moreLearn moreLearn more </description>
  <button>Learn </button>
</SpotlightCard>
<SpotlightCard className="custom-spotlight-card bg-[#005B96] max-w-sm" spotlightColor="rgba(0, 229, 155, 0.2)">
  <i class="fa fa-lock"></i>
  <h2>Card title</h2>
  <description >Our state of the artLearnLearn moreLearn moreLearn moreLearn more </description>
  <button>Learn </button>
</SpotlightCard>
                                    
                                 </div></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Landing
