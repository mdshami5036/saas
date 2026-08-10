import axios from 'axios';

const getLiveApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('custom_backend_url');
    if (customUrl) return customUrl;
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:5000/api/v1';
    }
  }
  return 'https://saas-backend-production-5c3e.up.railway.app/api/v1';
};

const API_BASE_URL = getLiveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Auth Token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tenant_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept Auth Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('tenant_token');
    }
    return Promise.reject(error);
  }
);

export default api;
