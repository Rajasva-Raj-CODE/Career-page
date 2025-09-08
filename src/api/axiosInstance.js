import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add interceptors for auth, error handling
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
  }
  return config;
});
export default axiosInstance;