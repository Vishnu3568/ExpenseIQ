/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import notificationService from '../services/notificationService';
import { NotificationItem, PaginatedResult } from '../types/notification';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (filters?: Record<string, unknown>) => Promise<PaginatedResult<NotificationItem>>;
  refreshUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  archiveNotification: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  archiveAllRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationService.getUnreadCount();
      if (res.success) {
        setUnreadCount(res.data.count);
      }
    } catch (err) {
      console.error('[NotificationProvider]: Failed to fetch unread count:', err);
    }
  }, [isAuthenticated]);

  const fetchNotifications = useCallback(
    async (filters?: Record<string, unknown>): Promise<PaginatedResult<NotificationItem>> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await notificationService.getNotifications(filters);
        if (res.success) {
          setNotifications(res.data.items);
          return res.data;
        }
        throw new Error('Failed to retrieve notifications');
      } catch (err: unknown) {
        const errorLike = err as { response?: { data?: { message?: string } }; message?: string };
        const errMsg = errorLike.response?.data?.message || errorLike.message || 'Failed to retrieve notifications';
        setError(errMsg);
        throw new Error(errMsg);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const markAsRead = async (id: string) => {
    try {
      const res = await notificationService.markAsRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, status: 'READ' as const, readAt: res.data.readAt } : n))
        );
        await refreshUnreadCount();
      }
    } catch (err) {
      console.error('[NotificationProvider]: Failed to mark notification read:', err);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      const res = await notificationService.markAsUnread(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, status: 'UNREAD' as const, readAt: undefined } : n))
        );
        await refreshUnreadCount();
      }
    } catch (err) {
      console.error('[NotificationProvider]: Failed to mark notification unread:', err);
    }
  };

  const archiveNotification = async (id: string) => {
    try {
      const res = await notificationService.archiveNotification(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, status: 'ARCHIVED' as const, archivedAt: res.data.archivedAt } : n))
        );
        await refreshUnreadCount();
      }
    } catch (err) {
      console.error('[NotificationProvider]: Failed to archive notification:', err);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await notificationService.markAllRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, status: 'READ' as const, readAt: new Date().toISOString() })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('[NotificationProvider]: Failed to mark all read:', err);
    }
  };

  const archiveAllRead = async () => {
    try {
      const res = await notificationService.archiveAllRead();
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.status === 'READ' ? { ...n, status: 'ARCHIVED' as const, archivedAt: new Date().toISOString() } : n))
        );
        await refreshUnreadCount();
      }
    } catch (err) {
      console.error('[NotificationProvider]: Failed to archive all read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await notificationService.deleteNotification(id);
      if (res.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        await refreshUnreadCount();
      }
    } catch (err) {
      console.error('[NotificationProvider]: Failed to delete notification:', err);
    }
  };

  // Sync unread counts and setup periodic check
  useEffect(() => {
    if (isAuthenticated) {
      refreshUnreadCount();
      // Setup low-frequency refresh timer (every 60 seconds)
      const interval = setInterval(refreshUnreadCount, 60000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, refreshUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        error,
        fetchNotifications,
        refreshUnreadCount,
        markAsRead,
        markAsUnread,
        archiveNotification,
        markAllRead,
        archiveAllRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
