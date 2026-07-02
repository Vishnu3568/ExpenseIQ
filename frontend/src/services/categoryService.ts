import apiClient from './apiClient';
import { Category, CategoryPayload, CategoryQueryParams } from '../types/category';

export const categoryService = {
  /**
   * Fetch all categories matching search and filter query criteria.
   */
  async getCategories(params?: CategoryQueryParams): Promise<{ success: boolean; categories: Category[] }> {
    const response = await apiClient.get<{ success: boolean; categories: Category[] }>('/api/categories', {
      params,
    });
    return response.data;
  },

  /**
   * Fetch a single category by ID.
   */
  async getCategoryById(id: string): Promise<{ success: boolean; category: Category }> {
    const response = await apiClient.get<{ success: boolean; category: Category }>(`/api/categories/${id}`);
    return response.data;
  },

  /**
   * Create a new custom category.
   */
  async createCategory(payload: CategoryPayload): Promise<{ success: boolean; category: Category }> {
    const response = await apiClient.post<{ success: boolean; category: Category }>('/api/categories', payload);
    return response.data;
  },

  /**
   * Update an existing custom category.
   */
  async updateCategory(id: string, payload: CategoryPayload): Promise<{ success: boolean; category: Category }> {
    const response = await apiClient.put<{ success: boolean; category: Category }>(`/api/categories/${id}`, payload);
    return response.data;
  },

  /**
   * Delete a custom category.
   */
  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/api/categories/${id}`);
    return response.data;
  },

  /**
   * Archive a custom category.
   */
  async archiveCategory(id: string): Promise<{ success: boolean; category: Category }> {
    const response = await apiClient.patch<{ success: boolean; category: Category }>(`/api/categories/${id}/archive`);
    return response.data;
  },

  /**
   * Restore an archived custom category.
   */
  async restoreCategory(id: string): Promise<{ success: boolean; category: Category }> {
    const response = await apiClient.patch<{ success: boolean; category: Category }>(`/api/categories/${id}/restore`);
    return response.data;
  },
};
