/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';
import { authService } from '../services/authService';
import { setClientToken, setLogoutHandler } from '../services/apiClient';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Define clean state wipe on logout
  const handleLocalWipe = () => {
    setUser(null);
    setAccessToken(null);
    setClientToken(null);
  };

  // Auto-recovery session on mount
  useEffect(() => {
    // Bind Axios interceptor redirect back to login
    setLogoutHandler(handleLocalWipe);

    const restoreSession = async () => {
      try {
        const refreshRes = await authService.refresh();
        const token = refreshRes.accessToken;
        
        setAccessToken(token);
        setClientToken(token);

        const profileRes = await authService.me();
        setUser(profileRes.user);
      } catch (err) {
        // Suppress session recovery errors, user must log in manually
        handleLocalWipe();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login({ email, password });
      setAccessToken(res.accessToken);
      setClientToken(res.accessToken);
      setUser(res.user);
    } catch (err) {
      handleLocalWipe();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.register({ name, email, password });
      setAccessToken(res.accessToken);
      setClientToken(res.accessToken);
      setUser(res.user);
    } catch (err) {
      handleLocalWipe();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('[Auth Service]: Logout failed on server:', err);
    } finally {
      handleLocalWipe();
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
