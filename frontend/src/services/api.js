import axios from 'axios';

const LIVE_RAILWAY_BACKEND_API = 'https://saas-production-531c.up.railway.app/api/v1';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || LIVE_RAILWAY_BACKEND_API;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tenant_token') || localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
