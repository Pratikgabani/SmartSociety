import React,{ useState,useEffect} from 'react'
import { IoMdArrowDropdown } from "react-icons/io";
import dropDown from './../../assets/dropDown.png'
import logo from './../../assets/logo.png'
import ShinyText from '../ReactBit/Shiny';
import ImageSlider from '../ImgSlider/ImgSlider';
import { SplitText } from '../ReactBit/SplitText';
import support from './../../assets/support.png'
import Userfriendly from './../../assets/Userfriendly.png'
import communityBuiild from './../../assets/communityBuild.png'
// import Rectangle96 from './../../assets/Rectangle96.avif'
// import Rectangle97 from './../../assets/Rectangle97.jpg'
import betterCommunication from './../../assets/betterCommunication.png'
import transparency from './../../assets/transparency.png'
import tickMark from './../../assets/Group92.png'
import Dropdown from '../Dropdown';
import Card from '../Card';
import SpotlightCard from '../SpotlightCard';
import { Link } from 'react-router-dom';
import axios from 'axios';


function Landing() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // token
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/users/logout", {
        withCredentials: true,
      });
      // toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      // toast.error(error.response.data.errors || "Error in logging out");
    }
  };


  return (
    <>
      <div className='min-h-screen bg-[#F5F9FC] flex justify-center border-2 font-raleway  '>

        <div className="container w-11/12 border-2 border-black">
          <nav className="text-[18px] border-b border-gray-200 text-white shadow-md mt-3 py-3">
            <div className="container mx-auto flex justify-between items-center px-4">
              <a href="/" className="text-xl font-bold text-black"> <img className="h-8" src="#" alt="Resihub" /> </a>
              <ul className="flex gap-9 items-center">
                <li className="text-black hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out">Home</li>
                <li className="text-black hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out"><Dropdown /></li>
                <li className="text-black hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out">Pricing</li>
                <li className="text-black hover:text-[#005B96] font-medium cursor-pointer transition duration-200 ease-in-out">About Us</li>
              </ul>
              <div className="space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-transparent text-black text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-transparent text-black text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Login
                </Link>
                <Link
                  to={"/register"}
                  className="bg-transparent text-black text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
            </div>
          </nav>

          <div className='mt-10 '>
            <div className='flex justify-between'>
            <div className="ml-10 leftPart">
              <h1 className='text-[48px] font-bold'>Simplify Society Living with</h1>
              <h1 className='text-[#005B96] text-[48px] font-bold '><SplitText text="ResiHub !" className="custom-class" delay={150} /></h1>
              <ul className='flex flex-col gap-3 text-lg  '>
                <li className='flex items-center text-[16px] w-[440px] line-height-[10px]'><img src={tickMark} alt="" />Streamline society communication with instant updates and announcements.</li>
                <li className='flex items-center text-[16px] w-[440px] line-height-[10px]'><img src={tickMark} alt="" />Manage finances securely with easy online payment and tracking.</li>
                <li className='flex items-center text-[16px] w-[440px]'><img src={tickMark} alt="" />Organize and optimize resources efficiently in one centralized system.</li>
                <li className='flex items-center text-[16px] w-[440px]'><img src={tickMark} alt="" />Simplify everyday management tasks with automation and user-friendly tools.</li>
                <li className='pt-9'>
                  <a href='#' className='text-black text-xl font-semibold cursor-pointer border transition ease-in-out duration-300 border-black py-[14px] px-4 rounded-full hover:bg-[#005B96] hover:text-white'>Let's explore</a></li>
              </ul>
            </div>

            <div className="rightPart mr-10">
              <ImageSlider />
            </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-[68px] bg-[#F5F9FC] border-none"> <div className=" p-8 rounded-lg  max-w-lg text-center">
              <h1 className="text-5xl font-bold mb-4"> Why <span className="text-[#005B96]">ResiHub</span>? </h1>
              <ul className="text-left space-y-4 mt-7">
                <li> <span className="font-semibold text-xl"> <img className='w-16  ' src={communityBuiild} alt="" /> Better Communication:</span>  </li>
                <li> <span className="font-semibold text-xl"><img className='w-16' src={transparency} alt="" />Transparency:</span> Track finances and records in real time. </li>
                <li> <span className="font-semibold text-xl"><img className='w-16' src={support} alt="" />24/7 Support:</span> Save time with automation of daily tasks. </li>
                <li> <span className="font-semibold text-xl"> <img className='w-16' src={betterCommunication} alt="" />Community Building:</span> Create a strong sense of belonging with engaging tools and features. </li>
                <li><span className='font-semibold text-xl'><img className='w-16' src={Userfriendly} alt="" />User-Friendly Interface :</span></li>
              </ul> </div> </div>

                                 <div className='flex flex-col items-center justify-center mt-10'>
                                    <h1 className='text-[48px]  font-bold'>About us</h1>
                                    <p className='text-[16px] w-[740px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta explicabo distinctio saepe nobis facere alias iusto quasi reprehenderit ullam necessitatibus officia optio dolore possimus error tempore, soluta iure accusamus enim veritatis qui sapiente architecto. Quidem architecto voluptate vero dolorum inventore!</p>
                                 </div>
                             <div >
                                <h1 className='text-[48px] font-bold text-blue-500 text-center mt-10'>Features</h1>
                                 <div className='flex  items-center justify-center mt-10 gap-5 flex-wrap'>
                                 <SpotlightCard className="custom-spotlight-card bg-[#005B96] max-w-sm h-[150px]  hidden-scrollbar " spotlightColor="rgba()">
  <i class="fa fa-lock"></i>
  <h2>Card title</h2>
  <description  >Our state of the artOur state of tOur state of the artOur state of tOur state of the artOur state of tOur state of the artOur state of tOur state of the artOur state of the artOur state of the artOur state of the artOur state of the artOur state of the artOur state of the artOur state of the artOur state of the artLearnLearn moreLearn moreLearn moreLearn moremoreLearn moreLearn moreLearn more </description>
  <button>Learn </button>
</SpotlightCard>
<SpotlightCard className="custom-spotlight-card bg-[#005B96] max-w-sm h-[150px]  hidden-scrollbar" spotlightColor="rgba(0, 229, 155, 0.2)">
  <i class="fa fa-lock"></i>
  <h2>Card title</h2>
  <description >Our state of the artLearnLearn moreLearn moreLearn moreLearn moreOur state of the artLearnLearn moreLearn moreLearn moreLearn moreOur state of the artLearnLearn moreLearn moreLearn moreLearn more </description>
  <button>Learn </button>
</SpotlightCard>
<SpotlightCard className="custom-spotlight-card bg-[#005B96] max-w-sm h-[150px] hidden-scrollbar " spotlightColor="rgba(0, 229, 155, 0.2)">
  <i class="fa fa-lock"></i>
  <h2>Card title</h2>
  <description >Our state of the artLearnLearn moreLearn moreLearn moreLearn more </description>
  <button>Learn </button>
</SpotlightCard>
<SpotlightCard className="custom-spotlight-card bg-[#005B96] max-w-sm h-[150px]  hidden-scrollbar" spotlightColor="rgba(0, 229, 155, 0.2)">
  <i class="fa fa-lock"></i>
  <h2>Card title</h2>
  <description >Our state of the artLearnLearn moreLearn moreLearn moreLearn more </description>
  <button>Learn </button>
</SpotlightCard>
<SpotlightCard className="custom-spotlight-card bg-[#005B96] max-w-sm h-[150px]  hidden-scrollbar" spotlightColor="rgba(0, 229, 155, 0.2)">
  <i class="fa fa-lock"></i>
  <h2>Card title</h2>
  <description >Our state of the artLearnLearn moreLearn moreLearn moreLearn more </description>
  <button>Learn </button>
</SpotlightCard>
<SpotlightCard className="custom-spotlight-card bg-[#005B96] max-w-sm h-[150px]  hidden-scrollbar" spotlightColor="rgba(0, 229, 155, 0.2)">
  <i class="fa fa-lock"></i>
  <h2>Card title</h2>
  <description >Our state of the artLearnLearn moreLearn moreLearn moreLearn more </description>
  <button>Learn away</button>
</SpotlightCard>
                                    
                        </div>
                      </div>
                  </div>
                </div>
            </div>
        </>
    )
}

export default Landing
