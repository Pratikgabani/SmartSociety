import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  // Check if user is authenticated (Example: Using localStorage or Context API)
  const isAuthenticated = localStorage.getItem("user"); // Assume token is stored after login
//here outlet is used to render child routes...that is first child, here as we have ste the index element to dashboard, it will render dashboard component
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};


export default RequireAuth;
