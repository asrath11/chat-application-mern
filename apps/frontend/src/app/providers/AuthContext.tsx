import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getMe,
  login as loginService,
  logout as logoutService,
  register as registerService,
} from '@/features/auth/services/auth.service';
import type {
  LoginCredentials,
  RegisterCredentials,
  User,
} from '@chat-app/shared-types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const STORAGE_KEYS = {
  USER: 'chat-app-user',
  AUTH_CHECKED: 'chat-app-auth-checked',
};

// Helper functions for localStorage
const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setStoredUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch {
    // Ignore localStorage errors
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    // Only show loading on first visit, not when user is already in localStorage
    return !localStorage.getItem(STORAGE_KEYS.AUTH_CHECKED);
  });

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await getMe();
      setUser(response.user);
      setStoredUser(response.user);
      localStorage.setItem(STORAGE_KEYS.AUTH_CHECKED, 'true');
    } catch {
      setUser(null);
      setStoredUser(null);
      localStorage.setItem(STORAGE_KEYS.AUTH_CHECKED, 'true');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only check auth if we haven't checked before or if no user in localStorage
    const authChecked = localStorage.getItem(STORAGE_KEYS.AUTH_CHECKED);
    const storedUser = getStoredUser();

    if (!authChecked || !storedUser) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await loginService(credentials);
    setUser(response.user);
    setStoredUser(response.user);
    localStorage.setItem(STORAGE_KEYS.AUTH_CHECKED, 'true');
  };

  const register = async (credentials: RegisterCredentials) => {
    const response = await registerService(credentials);
    setUser(response.user);
    setStoredUser(response.user);
    localStorage.setItem(STORAGE_KEYS.AUTH_CHECKED, 'true');
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
    setStoredUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_CHECKED);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
