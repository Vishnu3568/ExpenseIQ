import apiClient from './apiClient';
import {
  OverviewData,
  MonthlyBreakdownItem,
  WeeklyBreakdownItem,
  CategoryBreakdownItem,
  StatisticsData,
  CashflowItem,
} from '../types/insight';
import { Transaction } from '../types/transaction';

export const insightService = {
  /**
   * Fetch overview totals metrics.
   */
  async getOverview(): Promise<{ success: boolean; data: OverviewData }> {
    const response = await apiClient.get<{ success: boolean; data: OverviewData }>('/api/insights/overview');
    return response.data;
  },

  /**
   * Fetch monthly breakdowns list.
   */
  async getMonthlyBreakdown(): Promise<{ success: boolean; data: MonthlyBreakdownItem[] }> {
    const response = await apiClient.get<{ success: boolean; data: MonthlyBreakdownItem[] }>('/api/insights/monthly');
    return response.data;
  },

  /**
   * Fetch weekly breakdowns list.
   */
  async getWeeklyBreakdown(): Promise<{ success: boolean; data: WeeklyBreakdownItem[] }> {
    const response = await apiClient.get<{ success: boolean; data: WeeklyBreakdownItem[] }>('/api/insights/weekly');
    return response.data;
  },

  /**
   * Fetch category allocation breakdowns.
   */
  async getCategoryBreakdown(): Promise<{ success: boolean; data: CategoryBreakdownItem[] }> {
    const response = await apiClient.get<{ success: boolean; data: CategoryBreakdownItem[] }>('/api/insights/category-breakdown');
    return response.data;
  },

  /**
   * Fetch recent transactions.
   */
  async getRecent(limit?: number): Promise<{ success: boolean; data: Transaction[] }> {
    const response = await apiClient.get<{ success: boolean; data: Transaction[] }>('/api/insights/recent', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Fetch advanced statistics highlights.
   */
  async getStatistics(): Promise<{ success: boolean; data: StatisticsData }> {
    const response = await apiClient.get<{ success: boolean; data: StatisticsData }>('/api/insights/statistics');
    return response.data;
  },

  /**
   * Fetch chronological cashflow list.
   */
  async getCashflow(): Promise<{ success: boolean; data: CashflowItem[] }> {
    const response = await apiClient.get<{ success: boolean; data: CashflowItem[] }>('/api/insights/cashflow');
    return response.data;
  },
};
