// import { useContext } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import UserContext from "./context/UserContext.js";

// // const rolee = useContext(UserContext)
// const RequireAuth = () => {
//   const {rolee , setRolee } = useContext(UserContext);
//   // Check if user is authenticated (Example: Using localStorage or Context API)
//   const isAuthenticated = rolee // Assume token is stored after login
// //here outlet is used to render child routes...that is first child, here as we have ste the index element to dashboard, it will render dashboard component
//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };


// export default RequireAuth;



import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "./context/UserContext.js";
import { HashLoader } from "react-spinners";
const RequireAuth = () => {
  const { rolee, loading } = useContext(UserContext);

  if (loading) {
    return <div className="col-span-full flex flex-col items-center justify-center min-h-[50vh]">
      <HashLoader size={60} color="#2563eb" loading={loading} />
      <p className="mt-4 text-lg text-gray-700">Loading...</p>
    </div>; // Optional: Show spinner
  }

  const isAuthenticated = !!rolee;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
