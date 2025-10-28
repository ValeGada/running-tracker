import axios from 'axios';
import { Run, User } from '../types';

// API base URL - replace with your actual backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls (mock for now)
export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    // Mock implementation
    return {
      id: '1',
      email,
      name: 'John Doe',
    };
  },
  
  register: async (name: string, email: string, password: string): Promise<User> => {
    // Mock implementation
    return {
      id: '1',
      email,
      name,
    };
  },
  
  logout: async (): Promise<void> => {
    // Mock implementation
  },
};

// Run API calls (mock for now)
export const runApi = {
  getRuns: async (): Promise<Run[]> => {
    // Mock implementation - returns empty array
    return [];
  },
  
  saveRun: async (run: Run): Promise<Run> => {
    // Mock implementation
    return run;
  },
  
  deleteRun: async (runId: string): Promise<void> => {
    // Mock implementation
  },
};

export default api;
