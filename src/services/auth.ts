import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Set the auth token in axios headers
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Register a new user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/register', data);
    const { token, user } = response.data;
    setAuthToken(token);
    return { success: true, message: 'Registration successful', token, user };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Login user
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', data);
    const { token, user } = response.data;
    setAuthToken(token);
    return { success: true, message: 'Login successful', token, user };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Get current user
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    setAuthToken(token);
    const response = await api.get('/auth/me');
    return response.data.user;
  } catch (error) {
    setAuthToken(null);
    return null;
  }
};

// Validate token
export const validateToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    setAuthToken(token);
    await api.get('/auth/me');
    return true;
  } catch (error) {
    setAuthToken(null);
    return false;
  }
};

// Logout user
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    setAuthToken(null);
    localStorage.removeItem('user');
  }
};

// Update user profile
export const updateProfile = async (data: any) => {
  try {
    const response = await api.put('/user/profile', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Profile update failed');
  }
};

// Change password
export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
  try {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Password change failed');
  }
};

export default api; 