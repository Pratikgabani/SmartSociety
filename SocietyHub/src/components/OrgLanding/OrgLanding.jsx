import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import UserContext from '../../context/UserContext';
import finalLogo from './../../assets/finalLogo.svg';
import { motion } from "framer-motion";
import GlowCard from './GlowCard';

const testimonials = [
  { text: "This society management system revolutionized our operations, streamlining maintenance fee collection and visitor tracking. Highly recommend!", image: "https://randomuser.me/api/portraits/women/1.jpg", name: "Anita Menon", role: "Cultural Secretary" },
  { text: "Implementing this hub was smooth and quick. The user-friendly interface made community training and complaint filing effortless.", image: "https://randomuser.me/api/portraits/men/2.jpg", name: "Sneha Patel", role: "Society President" },
  { text: "The support team is exceptional, guiding us through setup and providing ongoing assistance for all our clubhouse event bookings.", image: "https://randomuser.me/api/portraits/women/3.jpg", name: "Rajesh Kumar", role: "Treasurer" },
  { text: "This seamless integration enhanced our daily operations and overall security efficiency. The digital visitor pass is top-notch.", image: "https://randomuser.me/api/portraits/men/4.jpg", name: "Vikram Reddy", role: "Security Head" },
  { text: "Its robust features for announcements and quick polls have completely transformed how we take major decisions in our society.", image: "https://randomuser.me/api/portraits/women/5.jpg", name: "Pooja Sharma", role: "RWA Member" },
  { text: "The visitor management feature exceeded expectations. It improved security and overall peace of mind for all flat owners.", image: "https://randomuser.me/api/portraits/women/6.jpg", name: "Neha Gupta", role: "Resident" },
  { text: "Our day-to-day functions improved massively with a user-friendly app design and extremely positive resident feedback.", image: "https://randomuser.me/api/portraits/men/7.jpg", name: "Arjun Das", role: "Facility Manager" },
  { text: "They delivered a digital solution that completely replaced our manual registers and reduced the RWA's administrative burden.", image: "https://randomuser.me/api/portraits/women/8.jpg", name: "Kavita Singh", role: "Secretary" },
  { text: "Using this system, our society funds are easily trackable, and residents are more punctual with their monthly maintenance dues.", image: "https://randomuser.me/api/portraits/men/9.jpg", name: "Rohan Desai", role: "Auditor" },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{ duration: props.duration || 10, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        className="flex flex-col gap-6 pb-6 shrink-0"
      >
        {[...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div className="p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] max-w-xs w-full bg-white flex flex-col hover:-translate-y-1 transition-all duration-300" key={i}>
                <div className="text-slate-600 text-sm sm:text-base leading-relaxed flex-grow">"{text}"</div>
                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-50">
                  <img src={image} alt={name} className="h-11 w-11 rounded-full object-cover shadow-sm ring-2 ring-slate-50" />
                  <div className="flex flex-col">
                    <div className="font-semibold tracking-tight text-slate-800 leading-tight">{name}</div>
                    <div className="text-slate-500 text-xs font-medium tracking-tight mt-0.5">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]}
      </motion.div>
    </div>
  );
};

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

function OrgLanding() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { rolee } = useContext(UserContext);

  useEffect(() => {
    if (rolee == "admin" || rolee == "user") {
      setIsLoggedIn(true);
      navigate('/layout/Dashboard');
    } else if (rolee == "security") {
      setIsLoggedIn(true);
      navigate('/layout/Visitor');
    } else {
      setIsLoggedIn(false);
    }
  }, [rolee, navigate]);

  const featureList = [
    {
      title: "Bookings",
      desc: "Easy booking system for community amenities like clubhouse, gym, and party halls.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
      bgColor: "bg-blue-50", iconColor: "text-blue-600", borderColor: "border-blue-100"
    },
    {
      title: "Complaint Management",
      desc: "Track and resolve residents' complaints efficiently and keep everyone informed in real-time.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
      bgColor: "bg-teal-50", iconColor: "text-teal-600", borderColor: "border-teal-100"
    },
    {
      title: "Events & Announcements",
      desc: "Organize community events and broadcast notices to all residents seamlessly.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><polygon points="11 19 2 12 11 5 11 19"></polygon><path d="M22 12A10 10 0 0 1 12 22a10 10 0 0 1-10-10"></path></svg>,
      bgColor: "bg-indigo-50", iconColor: "text-indigo-600", borderColor: "border-indigo-100"
    },
    {
      title: "Payments",
      desc: "Secure payment gateway for effortless maintenance and amenity charge collection.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>,
      bgColor: "bg-emerald-50", iconColor: "text-emerald-600", borderColor: "border-emerald-100"
    },
    {
      title: "Visitors",
      desc: "Track, approve, and securely manage community visitors with robust digital passes.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>,
      bgColor: "bg-purple-50", iconColor: "text-purple-600", borderColor: "border-purple-100"
    },
    {
      title: "Polls",
      desc: "Understand your residents' interests and make democratic community decisions easily.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
      bgColor: "bg-orange-50", iconColor: "text-orange-600", borderColor: "border-orange-100"
    }
  ];

  const benefitsList = [
    { title: "Increased Efficiency", desc: "Automate routine tasks and reduce administrative burden with our streamlined solutions.", points: ["Reduced paperwork", "Time-saving automation", "Digital logs"], icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> },
    { title: "Enhanced Security", desc: "Robust security features to protect your community and manage access effectively.", points: ["Digital visitor tracking", "Emergency alerts", "Secure data access"], icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg> },
    { title: "Better Communication", desc: "Foster community engagement with fully integrated communication tools.", points: ["Real-time notifications", "Event announcements", "Transparent voting"], icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> }
  ];

  return (
    <div className='bg-slate-50 min-h-screen w-full font-raleway overflow-x-hidden selection:bg-blue-100 selection:text-blue-900'>

      {/* Navigation */}
      <div className="w-full relative z-50">
        <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300 bg-transparent'>
          <div className='relative flex justify-between items-center md:justify-center md:gap-12 lg:gap-24 transition-all duration-300'>
            <div className='font-bold text-2xl sm:text-3xl text-slate-800 tracking-tight flex items-center gap-2 shrink-0 text-center md:text-left'>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center shadow-inner">
                <span className="text-white text-lg font-bold">R</span>
              </div>
              ResiHub
            </div>
            <div className="md:hidden flex justify-end">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 hover:text-blue-600 focus:outline-none p-2 transition-colors">
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>

            <div className={`absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 md:mt-0 md:static md:bg-transparent md:shadow-none md:border-none md:p-0 md:contents transition-all z-50 ${mobileMenuOpen ? 'flex flex-col' : 'hidden'}`}>
              <div className="md:flex md:justify-center">
                <ul className='flex flex-col md:flex-row items-center gap-4 lg:gap-8 text-sm font-medium text-slate-600 mb-6 md:mb-0'>
                  {['Home', 'Features', 'Benefits', 'Pricing', 'Testimonials', 'Contact'].map((item) => (
                    <li key={item} className='hover:text-blue-600 transition-colors w-full md:w-auto text-center'>
                      <a href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block py-2 md:py-0">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:flex md:justify-center shrink-0">
                {!isLoggedIn && (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full md:w-auto">
                    <button className="w-full md:w-auto bg-slate-900 text-white font-semibold rounded-xl py-2.5 px-6 text-sm hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                      Login
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <div id='home' className='relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center overflow-visible z-10 min-h-[calc(100vh-88px)]'>
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_70%,transparent_100%)] -z-10 opacity-70"></div>
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-400/20 rounded-full blur-[100px] pointer-events-none -z-10 hidden lg:block"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className='w-full max-w-5xl z-10'
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white text-blue-700 text-sm font-bold mb-10 border border-blue-200 shadow-[0_4px_14px_0_rgb(59,130,246,0.1)] cursor-default">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            <span>Welcome to ResiHub</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
            Manage Your Society with <br className="hidden sm:block" />
            <span className="text-blue-600">Seamless Elegance</span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed mb-12">
            Streamline your residential community with digital solutions for bookings, complaints, visitor management, and more.
          </p>

          {!rolee && (
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to="/register" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-blue-600 border border-blue-600 rounded-xl overflow-hidden hover:bg-blue-700 hover:shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:-translate-y-1 w-full sm:w-auto">
                Join an Existing Society
              </Link>
              <Link to="/SocietyDetails" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 transition-all duration-300 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 w-full sm:w-auto">
                Create a New Society
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Features Section */}
      <div id='features' className='bg-white py-20 sm:py-32 relative'>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none"></div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className='text-3xl sm:text-4xl font-bold text-slate-900 mb-6 tracking-tight'>Comprehensive Society Management</h2>
            <p className='text-lg text-slate-600 font-medium'>Everything you need to manage your residential community effortlessly and efficiently.</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
            {featureList.map((feature, index) => (
              <div key={index} className='group bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col'>
                <div className={`w-14 h-14 rounded-xl ${feature.bgColor} ${feature.iconColor} flex items-center justify-center mb-6 border ${feature.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className='text-xl text-slate-900 font-bold mb-3'>{feature.title}</h3>
                <p className='text-slate-600 leading-relaxed text-sm sm:text-base'>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id='benefits' className='bg-white py-20 sm:py-28 border-t border-slate-100 relative overflow-hidden'>
        {/* Decorative background shape */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-blue-50 to-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3 block">Core Benefits</span>
            <h2 className='text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight'>Why Choose Our Solutions</h2>
            <p className='text-lg text-slate-600 font-medium'>
              Transform your society management with these exclusive advantages designed for modern living.
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
            {benefitsList.map((benefit, index) => (
              <GlowCard
                key={index}
                glowColor={['blue', 'green', 'purple'][index % 3]}
                className='text-left'
              >
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 mb-5 transform group-hover:scale-110 transition-transform duration-500">
                    {benefit.icon}
                  </div>

                  <h3 className='text-xl font-bold text-slate-900 mb-3'>{benefit.title}</h3>
                  <p className='text-sm text-slate-600 leading-relaxed mb-6'>{benefit.desc}</p>

                  <ul className='flex flex-col gap-3 mt-auto'>
                    {benefit.points.map((point, pIndex) => (
                      <li key={pIndex} className='flex items-center gap-3 text-slate-700 text-sm font-medium bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-colors duration-300'>
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id='pricing' className='bg-white py-20 sm:py-32 border-t border-slate-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className='text-3xl sm:text-4xl font-bold text-slate-900 mb-6 tracking-tight'>Simple & Transparent Pricing</h2>
            <p className='text-lg text-slate-600 font-medium'>Choose the perfect plan tailored for your residential society.</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center max-w-5xl mx-auto'>
            {[
              { name: "Basic", price: "₹999", desc: "Perfect for small societies", features: ["Visitor Management", "Complaint Management", "Basic Announcements", "5GB Storage"], popular: false },
              { name: "Pro", price: "₹1999", desc: "Ideal for medium societies", features: ["Everything in Basic", "Facility Booking", "Event Management", "Payment Gateway", "20GB Storage"], popular: true },
              { name: "Enterprise", price: "₹2999", desc: "For large societies", features: ["Everything in Pro", "Advanced Analytics", "24/7 Support", "Unlimited Storage"], popular: false }
            ].map((plan, index) => (
              <div key={index} className={`relative flex flex-col p-8 sm:p-10 rounded-3xl transition-all duration-300 ${plan.popular ? 'bg-blue-600 border-none shadow-[0_20px_40px_rgb(37,99,235,0.2)] md:-translate-y-4' : 'bg-slate-50 border border-slate-200'}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-400 to-blue-400 text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-blue-50' : 'text-slate-800'}`}>{plan.name}</h3>
                <div className={`text-5xl font-extrabold mb-4 tracking-tight ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.price}<span className={`text-base font-medium ml-1 ${plan.popular ? 'text-blue-200' : 'text-slate-500'}`}>/month</span>
                </div>
                <p className={`text-sm mb-8 ${plan.popular ? 'text-blue-100' : 'text-slate-600'}`}>{plan.desc}</p>
                <ul className='flex flex-col gap-4 mb-10 flex-grow'>
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className='flex items-center gap-3'>
                      <svg className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-blue-200' : 'text-blue-600'}`} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span className={`text-sm font-medium ${plan.popular ? 'text-white' : 'text-slate-700'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/pageNotFound" className="mt-auto w-full">
                  <button className={`w-full py-3.5 px-6 rounded-xl font-bold transition-all duration-300 ${plan.popular ? 'bg-white text-blue-600 hover:bg-slate-50' : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 hover:shadow-sm'}`}>
                    Get Started
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section id='testimonials' className="bg-slate-50 py-20 sm:py-32 relative overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center justify-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 tracking-tight mb-6">
              Trusted by Communities
            </h2>
            <p className="text-center text-lg text-slate-600 font-medium">
              See what residents and committee members have to say about ResiHub.
            </p>
          </div>

          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] h-[560px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={20} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={25} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={22} />
          </div>
        </div>
      </section>

      {/* Contact & Footer */}
      <div id='contact' className="bg-white border-t border-slate-100">
        <div className='max-w-7xl mx-auto py-20 sm:py-32 px-4 sm:px-6 lg:px-8'>
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className='text-3xl sm:text-4xl font-bold text-slate-900 mb-6 tracking-tight'>Get in touch with us</h2>
            <p className='text-lg text-slate-600 font-medium'>Have questions? Our support team is here to help.</p>
          </div>

          <div className='flex flex-col lg:flex-row gap-12 lg:gap-16 items-start'>
            <div className="w-full lg:w-3/5 bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                    <input type="text" id="firstName" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors" placeholder="John" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                    <input type="text" id="lastName" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label htmlFor="emailAddress" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <input type="email" id="emailAddress" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label htmlFor="societyName" className="block text-sm font-semibold text-slate-700 mb-2">Society Name</label>
                  <input type="text" id="societyName" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors" placeholder="Palm Residency" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea id="message" rows="4" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold hover:bg-slate-800 transition-colors shadow-md shadow-slate-900/10">
                  Send Message
                </button>
              </form>
            </div>

            <div className='w-full lg:w-2/5 flex flex-col gap-8'>
              <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center h-full">
                <h3 className="text-xl font-bold text-slate-900 mb-8">Contact Information</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Phone</p>
                      <p className="text-slate-600 mt-1">+91 123 456 7890</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <p className="text-slate-600 mt-1">resihubproject@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Office</p>
                      <p className="text-slate-600 mt-1 leading-relaxed">123 Tech Park, Silicon Valley, <br />Bangalore, Karnataka 560001</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-50 text-slate-600 py-16 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between gap-12 lg:gap-8 border-b border-slate-200 pb-12">
              <div className="flex flex-col max-w-md">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg font-bold">R</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">ResiHub</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  We are a dedicated platform designed to streamline society management, ensuring communication, maintenance, and community engagement are always hassle-free.
                </p>
                <div className="flex space-x-5 mt-8">
                  {/* {['github', 'twitter', 'linkedin'].map(social => (
                    <a key={social} href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
                    </a>
                  ))} */}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-12 md:gap-24 md:items-start">
                <div className="text-left md:text-right">
                  <h3 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-wider">Solutions</h3>
                  <ul className="space-y-3 text-sm">
                    {['Visitor Management', 'Complaint System', 'Facility Booking', 'Payment Gateway'].map(link => (
                      <li key={link}><a href="/login" className="text-slate-600 hover:text-blue-600 transition-colors">{link}</a></li>
                    ))}
                  </ul>
                </div>
                <div className="text-left md:text-right">
                  <h3 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-wider">Contact Us</h3>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <a href="mailto:resihubproject@gmail.com" className="text-slate-600 hover:text-blue-600 transition-colors">
                        resihubproject@gmail.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
              <p>© {new Date().getFullYear()} ResiHub. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default OrgLanding;