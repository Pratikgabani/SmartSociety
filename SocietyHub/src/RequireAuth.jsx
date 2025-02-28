import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  // Check if user is authenticated (Example: Using localStorage or Context API)
  const isAuthenticated = localStorage.getItem("user"); // Assume token is stored after login

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
