import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
  token: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
}

// Set the auth token in axios headers
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Register a new user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/register`, data);
  const { token, user } = response.data;
  setAuthToken(token);
  return { token, user };
};

// Login user
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, data);
  const { token, user } = response.data;
  setAuthToken(token);
  return { token, user };
};

// Get current user
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    setAuthToken(token);
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
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
    await axios.get(`${API_URL}/validate`);
    return true;
  } catch (error) {
    setAuthToken(null);
    return false;
  }
};

// Logout user
export const logout = () => {
  setAuthToken(null);
}; 