import apiClient from './apiClient.js';
import { AuthResponse, RefreshResponse, User } from '../types/auth.js';

export const authService = {
  /**
   * Register a new user profile.
   */
  async register(payload: Record<string, unknown>): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', payload);
    return response.data;
  },

  /**
   * Log in user credentials.
   */
  async login(payload: Record<string, unknown>): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', payload);
    return response.data;
  },

  /**
   * Fetch current authenticated user.
   */
  async me(): Promise<{ success: boolean; user: User }> {
    const response = await apiClient.get<{ success: boolean; user: User }>('/api/auth/me');
    return response.data;
  },

  /**
   * Refresh access token session.
   */
  async refresh(): Promise<RefreshResponse> {
    const response = await apiClient.post<RefreshResponse>('/api/auth/refresh');
    return response.data;
  },

  /**
   * Log out active session.
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>('/api/auth/logout');
    return response.data;
  },
};
