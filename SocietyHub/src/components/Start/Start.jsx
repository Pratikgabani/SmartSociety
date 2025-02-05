// import React from "react";
// import { Link } from "react-router-dom"; // Assuming you have some CSS file to style


// const StartPage = () => {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen text-center">
//       <h1 className="text-5xl font-bold mb-4">Welcome to ResiHub!</h1>
//       <p className="text-xl mb-8">
//         Choose one of the options below to get started.
//       </p>
      
//       <div className="flex space-x-8">
//         <div className="flex flex-col items-center">
//           <Link to="/landing" className="bg-blue-500 text-white text-lg px-6 py-3 rounded-md mb-2 hover:bg-blue-600">Join an Existing Society</Link>
//           <p className="text-sm">
//             Streamline your experience by joining an already established society.
//           </p>
//         </div>
        
//         <div className="flex flex-col items-center">
//           <Link to="/visitor" className="bg-green-500 text-white text-lg px-6 py-3 rounded-md mb-2 hover:bg-green-600">Create a New Society</Link>
//           <p className="text-sm">
//             Start fresh and build a new society with our easy-to-use tools.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StartPage;
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


const Start = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const hasVisited = localStorage.getItem("hasVisited");
  //   if (hasVisited) {
  //     navigate("/Landing");
  //   }
  // }, [navigate]);

  
  // const handleJoinSociety = () => {
  //   localStorage.setItem("hasVisited", true);
  //   navigate("/landing");
  // };

  // const handleCreateSociety = () => {
  //   localStorage.setItem("hasVisited", true);
  //   navigate("/SocietyDetails");
  // };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold mb-4">Welcome to ResiHub!</h1>
      <p className="text-xl mb-8">
        Choose one of the options below to get started.
      </p>
      
      <div className="flex space-x-8">
        <div className="flex flex-col items-center">
          <Link to = "/register" className="bg-blue-500 text-white text-lg px-6 py-3 rounded-md mb-2 hover:bg-blue-600">
            Join an Existing Society
          </Link>
          <p className="text-sm">
            Streamline your experience by joining an already established society.
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <Link to = "/SocietyDetails"  className="bg-green-500 text-white text-lg px-6 py-3 rounded-md mb-2 hover:bg-green-600" >
            Create a New Society
          </Link>
          <p className="text-sm">
            Start fresh and build a new society with our easy-to-use tools.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Start;

