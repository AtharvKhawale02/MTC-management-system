import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
<<<<<<< HEAD
});

// Attach token from localStorage to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
=======
  withCredentials: true,
>>>>>>> b316133 (Connect backend auth and update frontend integration)
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