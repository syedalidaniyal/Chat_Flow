'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<string, { email: string; password: string; username: string; avatar: string }> = {
  '1': { email: 'alex@example.com', password: 'password123', username: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  '2': { email: 'sam@example.com', password: 'password123', username: 'Sam Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const foundUser = Object.entries(MOCK_USERS).find(
        ([_, userData]) => userData.email === email && userData.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      const [userId, userData] = foundUser;
      setUser({
        id: userId,
        email: userData.email,
        username: userData.username,
        avatar: userData.avatar,
        status: 'online',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const userExists = Object.values(MOCK_USERS).some(u => u.email === email);
      if (userExists) {
        throw new Error('Email already exists');
      }

      const newId = (Math.max(...Object.keys(MOCK_USERS).map(Number)) + 1).toString();
      MOCK_USERS[newId] = { email, password, username, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}` };

      setUser({
        id: newId,
        email,
        username,
        avatar: MOCK_USERS[newId].avatar,
        status: 'online',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
