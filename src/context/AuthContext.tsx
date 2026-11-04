'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse } from '@/types';
import { apiRequest, getToken, setToken, removeToken } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth on client mount
  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      setTokenState(savedToken);
      fetchUserProfile(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const data = await apiRequest<{ success: boolean; user: User }>('/auth/me', {
        token: authToken,
      });
      if (data?.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to restore user session:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.token && data.user) {
        setToken(data.token);
        setTokenState(data.token);
        setUser(data.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      if (data.token && data.user) {
        setToken(data.token);
        setTokenState(data.token);
        setUser(data.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const currentToken = token || getToken();
    if (currentToken) {
      await fetchUserProfile(currentToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
