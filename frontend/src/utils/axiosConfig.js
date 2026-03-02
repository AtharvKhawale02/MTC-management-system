import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

//  INTERCEPTOR: Automatically add token to every request
// This runs BEFORE every request is sent
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from browser storage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;