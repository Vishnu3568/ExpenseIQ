/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import workspaceService from '../services/workspaceService';
import {
  UserProfileResponse,
  WorkspacePreferencesResponse,
  DashboardPreferences,
  ExportPreferences,
  NotificationPreferences,
} from '../types/workspace';

interface WorkspaceContextType {
  profile: UserProfileResponse | null;
  preferences: WorkspacePreferencesResponse | null;
  theme: string;
  dashboard: DashboardPreferences | null;
  exportPrefs: ExportPreferences | null;
  notifications: NotificationPreferences | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: {
    name: string;
    email: string;
    phoneNumber?: string;
    bio?: string;
    avatarUrl?: string;
  }) => Promise<UserProfileResponse>;
  updatePreferences: (data: WorkspacePreferencesResponse) => Promise<void>;
  updateTheme: (theme: string) => Promise<void>;
  updateDashboard: (data: DashboardPreferences) => Promise<void>;
  updateExport: (data: ExportPreferences) => Promise<void>;
  updateNotifications: (data: NotificationPreferences) => Promise<void>;
  refreshAllSettings: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [preferences, setPreferences] = useState<WorkspacePreferencesResponse | null>(null);
  const [theme, setTheme] = useState<string>('system');
  const [dashboard, setDashboard] = useState<DashboardPreferences | null>(null);
  const [exportPrefs, setExportPrefs] = useState<ExportPreferences | null>(null);
  const [notifications, setNotifications] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAllSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profRes, prefRes, themeRes, dashRes, expRes, notifRes] = await Promise.all([
        workspaceService.getProfile(),
        workspaceService.getPreferences(),
        workspaceService.getTheme(),
        workspaceService.getDashboard(),
        workspaceService.getExport(),
        workspaceService.getNotifications(),
      ]);

      if (profRes.success) setProfile(profRes.data);
      if (prefRes.success) setPreferences(prefRes.data);
      if (themeRes.success) setTheme(themeRes.data.theme);
      if (dashRes.success) setDashboard(dashRes.data);
      if (expRes.success) setExportPrefs(expRes.data);
      if (notifRes.success) setNotifications(notifRes.data);
    } catch (err) {
      console.error('Failed to load workspace settings:', err);
      setError((err as Error).message || 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync theme to DOM
  const applyTheme = useCallback((themeName: string) => {
    const root = window.document.documentElement;
    if (themeName === 'dark') {
      root.classList.add('dark');
    } else if (themeName === 'light') {
      root.classList.remove('dark');
    } else if (themeName === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, []);

  // Listen to system prefers-color-scheme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, applyTheme]);

  // Initial load
  useEffect(() => {
    refreshAllSettings();
  }, [refreshAllSettings]);

  // Apply theme whenever theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const handleUpdateProfile = async (data: {
    name: string;
    email: string;
    phoneNumber?: string;
    bio?: string;
    avatarUrl?: string;
  }) => {
    setError(null);
    try {
      const res = await workspaceService.updateProfile(data);
      if (res.success) {
        setProfile(res.data);
        return res.data;
      }
      throw new Error('Profile update failed');
    } catch (err) {
      setError((err as Error).message || 'Failed to update profile');
      throw err;
    }
  };

  const handleUpdatePreferences = async (data: WorkspacePreferencesResponse) => {
    setError(null);
    try {
      const res = await workspaceService.updatePreferences(data);
      if (res.success) {
        setPreferences(data);
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to update preferences');
      throw err;
    }
  };

  const handleUpdateTheme = async (themeName: string) => {
    setError(null);
    try {
      const res = await workspaceService.updateTheme(themeName);
      if (res.success) {
        setTheme(themeName);
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to update theme');
      throw err;
    }
  };

  const handleUpdateDashboard = async (data: DashboardPreferences) => {
    setError(null);
    try {
      const res = await workspaceService.updateDashboard(data);
      if (res.success) {
        setDashboard(data);
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to update dashboard preferences');
      throw err;
    }
  };

  const handleUpdateExport = async (data: ExportPreferences) => {
    setError(null);
    try {
      const res = await workspaceService.updateExport(data);
      if (res.success) {
        setExportPrefs(data);
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to update export preferences');
      throw err;
    }
  };

  const handleUpdateNotifications = async (data: NotificationPreferences) => {
    setError(null);
    try {
      const res = await workspaceService.updateNotifications(data);
      if (res.success) {
        setNotifications(data);
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to update notification preferences');
      throw err;
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        profile,
        preferences,
        theme,
        dashboard,
        exportPrefs,
        notifications,
        isLoading,
        error,
        updateProfile: handleUpdateProfile,
        updatePreferences: handleUpdatePreferences,
        updateTheme: handleUpdateTheme,
        updateDashboard: handleUpdateDashboard,
        updateExport: handleUpdateExport,
        updateNotifications: handleUpdateNotifications,
        refreshAllSettings,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
