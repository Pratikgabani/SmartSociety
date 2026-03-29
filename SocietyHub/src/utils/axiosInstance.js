import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_URL_BACKEND}/api/v1`,
  withCredentials: true,
});

// Routes that are public — never attempt a token refresh for these
const PUBLIC_ROUTES = [
  "/users/login",
  "/users/register",
  "/users/send-otp",
  "/users/verify-otp",
  "/users/complete-registration",
  "/users/refresh-token",
];

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const requestPath = originalRequest?.url || "";

    // Skip refresh logic for public / auth routes
    const isPublicRoute = PUBLIC_ROUTES.some(route => requestPath.includes(route));

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isPublicRoute
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/users/refresh-token");
        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        // Optionally: redirect to login or show error
      }
    }
    return Promise.reject(error);
  }
);

export default api;