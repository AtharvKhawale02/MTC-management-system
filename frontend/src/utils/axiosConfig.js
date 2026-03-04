import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

//  REQUEST INTERCEPTOR: Automatically add token to every request
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

// RESPONSE INTERCEPTOR: Handle 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Just return successful responses
    return response;
  },
  (error) => {
    // Check if error is 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login only if not already there
      if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;