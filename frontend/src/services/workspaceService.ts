import apiClient from './apiClient';
import {
  UserProfileResponse,
  WorkspacePreferencesResponse,
  DashboardPreferences,
  ExportPreferences,
  NotificationPreferences,
  SecurityInfoResponse,
} from '../types/workspace';

export const workspaceService = {
  async getProfile(): Promise<{ success: boolean; data: UserProfileResponse }> {
    const res = await apiClient.get('/workspace/profile');
    return res.data;
  },

  async updateProfile(data: {
    name: string;
    email: string;
    phoneNumber?: string;
    bio?: string;
    avatarUrl?: string;
  }): Promise<{ success: boolean; data: UserProfileResponse }> {
    const res = await apiClient.put('/workspace/profile', data);
    return res.data;
  },

  async updatePassword(data: { oldPassword: string; newPasswordHash: string }): Promise<{ success: boolean }> {
    // Note: Parameter backend payload is { oldPassword, newPassword }
    const res = await apiClient.put('/workspace/password', {
      oldPassword: data.oldPassword,
      newPassword: data.newPasswordHash,
    });
    return res.data;
  },

  async getPreferences(): Promise<{ success: boolean; data: WorkspacePreferencesResponse }> {
    const res = await apiClient.get('/workspace/preferences');
    return res.data;
  },

  async updatePreferences(data: WorkspacePreferencesResponse): Promise<{ success: boolean; data: unknown }> {
    const res = await apiClient.put('/workspace/preferences', data);
    return res.data;
  },

  async getTheme(): Promise<{ success: boolean; data: { theme: string } }> {
    const res = await apiClient.get('/workspace/theme');
    return res.data;
  },

  async updateTheme(theme: string): Promise<{ success: boolean; data: { theme: string } }> {
    const res = await apiClient.put('/workspace/theme', { theme });
    return res.data;
  },

  async getDashboard(): Promise<{ success: boolean; data: DashboardPreferences }> {
    const res = await apiClient.get('/workspace/dashboard');
    return res.data;
  },

  async updateDashboard(data: DashboardPreferences): Promise<{ success: boolean; data: unknown }> {
    const res = await apiClient.put('/workspace/dashboard', data);
    return res.data;
  },

  async getExport(): Promise<{ success: boolean; data: ExportPreferences }> {
    const res = await apiClient.get('/workspace/export');
    return res.data;
  },

  async updateExport(data: ExportPreferences): Promise<{ success: boolean; data: unknown }> {
    const res = await apiClient.put('/workspace/export', data);
    return res.data;
  },

  async getNotifications(): Promise<{ success: boolean; data: NotificationPreferences }> {
    const res = await apiClient.get('/workspace/notifications');
    return res.data;
  },

  async updateNotifications(data: NotificationPreferences): Promise<{ success: boolean; data: unknown }> {
    const res = await apiClient.put('/workspace/notifications', data);
    return res.data;
  },

  async getSecurity(): Promise<{ success: boolean; data: SecurityInfoResponse }> {
    const res = await apiClient.get('/workspace/security');
    return res.data;
  },

  async deleteAccount(): Promise<{ success: boolean }> {
    const res = await apiClient.delete('/workspace/account');
    return res.data;
  },

  async purgeTransactions(): Promise<{ success: boolean }> {
    const res = await apiClient.delete('/workspace/data/transactions');
    return res.data;
  },

  async resetDemoData(): Promise<{ success: boolean }> {
    const res = await apiClient.post('/workspace/data/reset-demo');
    return res.data;
  },

  async exportPersonalData(): Promise<Blob> {
    const res = await apiClient.get('/workspace/data/export', {
      responseType: 'blob',
    });
    return res.data;
  },
};

export default workspaceService;
