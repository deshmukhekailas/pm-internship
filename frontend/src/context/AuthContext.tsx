import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithOtp: (email: string, otp: string) => Promise<User>;
  sendOtp: (email: string, type: 'SIGNUP' | 'LOGIN') => Promise<{ message: string; devOtp?: string }>;
  verifyOtp: (email: string, otp: string, type: 'SIGNUP' | 'LOGIN') => Promise<{ verified: boolean }>;
  register: (data: any) => Promise<User>;
  registerWithOtp: (data: any) => Promise<User>;
  loginWithGoogle: (credential: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post('/auth/login', { email, password });
    const { user: userData, accessToken, refreshToken } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const sendOtp = async (email: string, type: 'SIGNUP' | 'LOGIN') => {
    const res = await api.post('/auth/send-otp', { email, type });
    return res.data.data;
  };

  const verifyOtp = async (email: string, otp: string, type: 'SIGNUP' | 'LOGIN') => {
    const res = await api.post('/auth/verify-otp', { email, otp, type });
    return res.data.data;
  };

  const loginWithOtp = async (email: string, otp: string): Promise<User> => {
    const res = await api.post('/auth/login-otp', { email, otp });
    const { user: userData, accessToken, refreshToken } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (data: any): Promise<User> => {
    const res = await api.post('/auth/register', data);
    const { user: userData, accessToken, refreshToken } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const registerWithOtp = async (data: any): Promise<User> => {
    const res = await api.post('/auth/register-otp', data);
    const { user: userData, accessToken, refreshToken } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const loginWithGoogle = async (credential: string): Promise<User> => {
    const res = await api.post('/auth/google', { credential });
    const { user: userData, accessToken, refreshToken } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithOtp,
        sendOtp,
        verifyOtp,
        register,
        registerWithOtp,
        loginWithGoogle,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
