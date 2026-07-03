import apiClient from './apiClient';
import {
  Transaction,
  TransactionPayload,
  TransactionQueryParams,
  TransactionsResponse,
} from '../types/transaction';

export const transactionService = {
  /**
   * Fetch paginated and filtered transactions.
   */
  async getTransactions(params?: TransactionQueryParams): Promise<TransactionsResponse> {
    const response = await apiClient.get<TransactionsResponse>('/api/transactions', {
      params,
    });
    return response.data;
  },

  /**
   * Fetch a single transaction by ID.
   */
  async getTransactionById(id: string): Promise<{ success: boolean; transaction: Transaction }> {
    const response = await apiClient.get<{ success: boolean; transaction: Transaction }>(`/api/transactions/${id}`);
    return response.data;
  },

  /**
   * Create a new transaction.
   */
  async createTransaction(payload: TransactionPayload): Promise<{ success: boolean; transaction: Transaction }> {
    const response = await apiClient.post<{ success: boolean; transaction: Transaction }>('/api/transactions', payload);
    return response.data;
  },

  /**
   * Update an existing transaction.
   */
  async updateTransaction(id: string, payload: TransactionPayload): Promise<{ success: boolean; transaction: Transaction }> {
    const response = await apiClient.put<{ success: boolean; transaction: Transaction }>(`/api/transactions/${id}`, payload);
    return response.data;
  },

  /**
   * Delete a transaction.
   */
  async deleteTransaction(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/api/transactions/${id}`);
    return response.data;
  },
};
