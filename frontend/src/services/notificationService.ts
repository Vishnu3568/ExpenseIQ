import apiClient from './apiClient';
import {
  NotificationItem,
  ActivityEventItem,
  AuditLogItem,
  PaginatedResult,
} from '../types/notification';

export const notificationService = {
  // 1. Notifications endpoints
  async getNotifications(filters?: {
    status?: 'UNREAD' | 'READ' | 'ARCHIVED';
    type?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ success: boolean; data: PaginatedResult<NotificationItem> }> {
    const res = await apiClient.get('/api/notifications', { params: filters });
    return res.data;
  },

  async getUnreadCount(): Promise<{ success: boolean; data: { count: number } }> {
    const res = await apiClient.get('/api/notifications/unread-count');
    return res.data;
  },

  async markAsRead(id: string): Promise<{ success: boolean; data: NotificationItem }> {
    const res = await apiClient.patch(`/api/notifications/${id}/read`);
    return res.data;
  },

  async markAsUnread(id: string): Promise<{ success: boolean; data: NotificationItem }> {
    const res = await apiClient.patch(`/api/notifications/${id}/unread`);
    return res.data;
  },

  async archiveNotification(id: string): Promise<{ success: boolean; data: NotificationItem }> {
    const res = await apiClient.patch(`/api/notifications/${id}/archive`);
    return res.data;
  },

  async markAllRead(): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post('/api/notifications/mark-all-read');
    return res.data;
  },

  async archiveAllRead(): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post('/api/notifications/archive-all-read');
    return res.data;
  },

  async deleteNotification(id: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete(`/api/notifications/${id}`);
    return res.data;
  },

  // 2. Activity endpoints
  async getActivities(filters?: {
    module?: string;
    eventType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: PaginatedResult<ActivityEventItem> }> {
    const res = await apiClient.get('/api/activity', { params: filters });
    return res.data;
  },

  // 3. Audit endpoints
  async getAuditLogs(filters?: {
    module?: string;
    action?: string;
    outcome?: 'SUCCESS' | 'FAILURE';
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: PaginatedResult<AuditLogItem> }> {
    const res = await apiClient.get('/api/audit-logs', { params: filters });
    return res.data;
  },
};

export default notificationService;
