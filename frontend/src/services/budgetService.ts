import apiClient from './apiClient';
import { Budget, BudgetProgress, BudgetOverview, BudgetPayload } from '../types/budget';

export const budgetService = {
  /**
   * Fetch all budgets
   */
  async getAll(): Promise<{ success: boolean; data: Budget[] }> {
    const response = await apiClient.get<{ success: boolean; data: Budget[] }>('/api/budgets');
    return response.data;
  },

  /**
   * Fetch budget by ID
   */
  async getById(id: string): Promise<{ success: boolean; data: Budget }> {
    const response = await apiClient.get<{ success: boolean; data: Budget }>(`/api/budgets/${id}`);
    return response.data;
  },

  /**
   * Create a new budget
   */
  async create(payload: BudgetPayload): Promise<{ success: boolean; data: Budget }> {
    const response = await apiClient.post<{ success: boolean; data: Budget }>('/api/budgets', payload);
    return response.data;
  },

  /**
   * Update an existing budget
   */
  async update(id: string, payload: Partial<BudgetPayload>): Promise<{ success: boolean; data: Budget }> {
    const response = await apiClient.put<{ success: boolean; data: Budget }>(`/api/budgets/${id}`, payload);
    return response.data;
  },

  /**
   * Delete a budget
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/api/budgets/${id}`);
    return response.data;
  },

  /**
   * Fetch budgets progress calculations
   */
  async getProgress(): Promise<{ success: boolean; data: BudgetProgress[] }> {
    const response = await apiClient.get<{ success: boolean; data: BudgetProgress[] }>('/api/budgets/progress');
    return response.data;
  },

  /**
   * Fetch budget overview aggregates
   */
  async getOverview(): Promise<{ success: boolean; data: BudgetOverview }> {
    const response = await apiClient.get<{ success: boolean; data: BudgetOverview }>('/api/budgets/overview');
    return response.data;
  },
};
