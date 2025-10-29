import axios from 'axios';
import { Run, User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL - using localhost for development
// For React Native, localhost might not work, use your machine's IP address
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:3000';

console.log('🔧 API Configuration:', {
  API_BASE_URL,
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV
});

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // You might want to redirect to login here
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authApi = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;
      
      // Store token
      await AsyncStorage.setItem('authToken', access_token);
      
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
        token: access_token,
      };
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      });
      
      // Better error handling
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('Something went wrong, please try again later');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  },
  
  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { access_token, user } = response.data;
      
      // Store token
      await AsyncStorage.setItem('authToken', access_token);
      
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
        token: access_token,
      };
    } catch (error) {
      console.error('Register error:', error);
      throw new Error('Registration failed');
    }
  },
  
  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('authToken');
  },
  
  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get('/users/profile/me');
      return {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        avatar: response.data.avatar,
      };
    } catch (error) {
      console.error('Get profile error:', error);
      throw new Error('Failed to get profile');
    }
  },
};

// Run API calls
export const runApi = {
  getRuns: async (): Promise<Run[]> => {
    try {
      const response = await api.get('/runs/my-runs');
      return response.data.map((run: any) => ({
        id: run.id,
        userId: run.userId,
        startTime: new Date(run.startTime).getTime(),
        endTime: new Date(run.endTime).getTime(),
        distance: run.distance,
        duration: run.duration,
        averagePace: run.averagePace,
        maxSpeed: run.maxSpeed,
        calories: run.calories,
        route: run.route || [],
        status: run.status,
      }));
    } catch (error) {
      console.error('Get runs error:', error);
      throw new Error('Failed to get runs');
    }
  },
  
  saveRun: async (run: Omit<Run, 'id'>): Promise<Run> => {
    try {
      const response = await api.post('/runs', {
        startTime: new Date(run.startTime).toISOString(),
        endTime: new Date(run.endTime).toISOString(),
        distance: run.distance,
        duration: run.duration,
        averagePace: run.averagePace,
        maxSpeed: run.maxSpeed,
        calories: run.calories,
        route: run.route,
        status: run.status,
      });
      
      return {
        id: response.data.id,
        userId: response.data.userId,
        startTime: new Date(response.data.startTime).getTime(),
        endTime: new Date(response.data.endTime).getTime(),
        distance: response.data.distance,
        duration: response.data.duration,
        averagePace: response.data.averagePace,
        maxSpeed: response.data.maxSpeed,
        calories: response.data.calories,
        route: response.data.route || [],
        status: response.data.status,
      };
    } catch (error) {
      console.error('Save run error:', error);
      throw new Error('Failed to save run');
    }
  },
  
  deleteRun: async (runId: string): Promise<void> => {
    try {
      await api.delete(`/runs/${runId}`);
    } catch (error) {
      console.error('Delete run error:', error);
      throw new Error('Failed to delete run');
    }
  },
  
  getStats: async (): Promise<any> => {
    try {
      const response = await api.get('/runs/stats/me');
      return response.data;
    } catch (error) {
      console.error('Get stats error:', error);
      throw new Error('Failed to get stats');
    }
  },
};

export default api;
