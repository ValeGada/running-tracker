// User and Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
}

// Run and Tracking types
export interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
  altitude?: number;
  accuracy?: number;
}

export interface Run {
  id: string;
  userId: string;
  startTime: number;
  endTime: number;
  distance: number; // in kilometers
  duration: number; // in seconds
  averagePace: number; // in minutes per kilometer
  maxSpeed: number; // in km/h
  calories: number;
  route: Location[];
  status: 'active' | 'paused' | 'completed';
}

export interface RunState {
  runs: Run[];
  currentRun: Run | null;
  isTracking: boolean;
  loading: boolean;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Settings types
export interface UserSettings {
  units: 'metric' | 'imperial';
  notifications: boolean;
  darkMode: boolean;
  autoStart: boolean;
}
