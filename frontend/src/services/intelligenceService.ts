import apiClient from './apiClient';
import {
  AdvancedSearchPayload,
  ComparisonPayload,
  ComparisonResult,
  SavedViewPayload,
  SavedView,
  SearchHistoryItem,
  SuggestionsResponse,
} from '../types/intelligence';

export const intelligenceService = {
  /**
   * Run advanced paginated search with AST rules
   */
  async search(payload: AdvancedSearchPayload): Promise<{
    success: boolean;
    data: {
      transactions: unknown[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    };
  }> {
    const response = await apiClient.post('/api/intelligence/search', payload);
    return response.data;
  },

  /**
   * Execute relative comparative analytics
   */
  async compare(payload: ComparisonPayload): Promise<{ success: boolean; data: ComparisonResult }> {
    const response = await apiClient.post('/api/intelligence/compare', payload);
    return response.data;
  },

  /**
   * Perform bulk actions on selected transaction IDs
   */
  async bulk(
    ids: string[],
    action: 'DELETE' | 'EXPORT' | 'CATEGORY' | 'ARCHIVE' | 'RESTORE',
    categoryId?: string
  ): Promise<{ success: boolean; message: string; data?: unknown[] }> {
    const response = await apiClient.post('/api/intelligence/bulk', { ids, action, categoryId });
    return response.data;
  },

  /**
   * Save a visual view configuration
   */
  async saveView(payload: SavedViewPayload): Promise<{ success: boolean; data: SavedView }> {
    const response = await apiClient.post('/api/intelligence/views', payload);
    return response.data;
  },

  /**
   * Fetch all saved views
   */
  async getViews(): Promise<{ success: boolean; data: SavedView[] }> {
    const response = await apiClient.get('/api/intelligence/views');
    return response.data;
  },

  /**
   * Update saved view favorite or name properties
   */
  async updateView(
    id: string,
    payload: { name?: string; isFavorite?: boolean }
  ): Promise<{ success: boolean; data: SavedView }> {
    const response = await apiClient.patch(`/api/intelligence/views/${id}`, payload);
    return response.data;
  },

  /**
   * Delete a saved view configuration
   */
  async deleteView(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/api/intelligence/views/${id}`);
    return response.data;
  },

  /**
   * Fetch recent search queries list
   */
  async getHistory(): Promise<{ success: boolean; data: SearchHistoryItem[] }> {
    const response = await apiClient.get('/api/intelligence/history');
    return response.data;
  },

  /**
   * Clears search query history log
   */
  async clearHistory(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete('/api/intelligence/history');
    return response.data;
  },

  /**
   * Retrieve autocompletion suggestions matching user ledger
   */
  async getSuggestions(): Promise<{ success: boolean; data: SuggestionsResponse }> {
    const response = await apiClient.get('/api/intelligence/suggestions');
    return response.data;
  }
};
export default intelligenceService;
