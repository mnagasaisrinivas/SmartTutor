
import axios, { AxiosRequestConfig } from 'axios';
import { isTokenNearExpiry } from '@/lib/utils';

// Use environment variable for production, fallback to empty string for Vite proxy in dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.map((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const refreshToken = async () => {
  try {
    const response = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
    const newToken = response.data.token;
    if (newToken) {
      localStorage.setItem('token', newToken);
      return newToken;
    }
    return null;
  } catch (_error) {
    return null;
  }
};

// Request Interceptor: Proactive Refresh + Add Authorization header
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');
    
    // Proactive Check: If token exists and is about to expire (within 1 min)
    if (token && isTokenNearExpiry(token, 1)) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshToken();
        isRefreshing = false;
        
        if (newToken) {
          token = newToken;
          onRefreshed(newToken);
        } else {
          // If refresh fails proactively, we might want to clear and redirect
          // but usually we can just let it fail at the 401 response interceptor
          localStorage.removeItem('token');
        }
      } else {
        // If already refreshing, wait for it
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken: string) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(config);
          });
        });
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Reactive Refresh (for 401s)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config as AxiosRequestConfig & { _retry?: boolean };

    if (response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const newToken = await refreshToken();
      isRefreshing = false;

      if (newToken) {
        onRefreshed(newToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } else {
        refreshSubscribers = [];
        localStorage.removeItem('token');
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
