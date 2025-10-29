import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { login, logout, setLoading } from '../store/authSlice';
import { authApi } from '../services/api';
import { User } from '../types';

// Custom hook for authentication
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, user, loading } = useSelector((state: RootState) => state.auth);
  
  // Real login function with backend integration
  const handleLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      dispatch(setLoading(true));
      
      // Real API call to backend
      const { user } = await authApi.login(email, password);
      
      dispatch(login(user));
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  // Real register function with backend integration
  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      dispatch(setLoading(true));
      
      // Real API call to backend
      const { user } = await authApi.register(name, email, password);
      
      dispatch(login(user));
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  // Real logout function with backend integration
  const handleLogout = async (): Promise<void> => {
    try {
      await authApi.logout();
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return {
    isLoggedIn,
    user,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};
