
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { User, useAuth } from '@/contexts/AuthContext';
const API_BASE_URL = '';


interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  token: string;
  user: User;
}

interface RefreshResponse {
  msg ?: string;
  token ?: string;
}

class AuthAPI {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true, // This ensures cookies are sent with requests
    });

    // Request interceptor to add Authorization header
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshResponse = await this.refreshToken();

            // Check if the refresh token itself is expired
            if (refreshResponse?.msg === "Token has expired") {
              this.logoutCallback();
              return Promise.reject(new Error("Refresh token expired"));
            }

            const newToken = refreshResponse.token;
            
            localStorage.setItem('token', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.axiosInstance.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async register(fullName: string, email: string, password: string): Promise<RegisterResponse> {
    const response = await this.axiosInstance.post('/api/auth/register', {
      fullName,
      email,
      password,
    });
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.axiosInstance.get('/api/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<RefreshResponse> {
    const response = await this.axiosInstance.post(
      '/api/auth/refresh',
      {},
      { withCredentials: true }
    );
    return response.data;
  }

  private logoutCallback: () => void = () => {};

    setLogoutCallback(callback: () => void) {
    this.logoutCallback = callback;
  }  
  

  // private logoutAndRedirect() {
  //   localStorage.removeItem("token");
  //   // Cookies are HttpOnly, so logout endpoint should clear them too
  //   fetch("/api/auth/logout", {
  //     method: "POST",
  //     credentials: "include",
  //   });
  //   window.location.href = "/login";
  // }
}

export const authAPI = new AuthAPI();
