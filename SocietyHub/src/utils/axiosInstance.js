import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_URL_BACKEND}/api/v1`,
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
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