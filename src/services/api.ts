import axios from 'axios';

// Resolve base API from Vite env with sensible default
const isProd = import.meta.env.PROD;
const defaultUrl = isProd ? 'https://langal-production.up.railway.app/api' : 'http://127.0.0.1:8000/api';

export const API_URL = (
    (import.meta as unknown as { env?: Record<string, string | undefined> })?.env?.VITE_API_URL
    || (import.meta as unknown as { env?: Record<string, string | undefined> })?.env?.VITE_API_BASE
    || defaultUrl
).replace(/\/$/, '');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Accept': 'application/json',
    },
});

// Add a request interceptor to attach the token and set Content-Type
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Only set Content-Type to JSON if not sending FormData
        // FormData needs multipart/form-data which axios sets automatically
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
