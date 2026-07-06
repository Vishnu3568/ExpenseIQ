import { useState, useCallback, useEffect } from 'react';
import intelligenceService from '../services/intelligenceService';
import {
  QueryGroup,
  SavedView,
  SearchHistoryItem,
  SuggestionsResponse,
  ComparisonPayload,
  ComparisonResult,
  AdvancedSearchPayload,
} from '../types/intelligence';

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useIntelligence = () => {
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionsResponse | null>(null);
  const [searchResult, setSearchResult] = useState<{
    transactions: unknown[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  } | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadSuggestions = useCallback(async () => {
    try {
      const res = await intelligenceService.getSuggestions();
      if (res.success) {
        setSuggestions(res.data);
      }
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    }
  }, []);

  const loadSavedViews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await intelligenceService.getViews();
      if (res.success) {
        setSavedViews(res.data);
      }
    } catch (err) {
      setError((err as AxiosErrorLike).response?.data?.message || 'Failed to load saved views');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSearchHistory = useCallback(async () => {
    try {
      const res = await intelligenceService.getHistory();
      if (res.success) {
        setSearchHistory(res.data);
      }
    } catch (err) {
      console.error('Failed to load search history:', err);
    }
  }, []);

  const executeSearch = useCallback(async (payload: AdvancedSearchPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await intelligenceService.search(payload);
      if (res.success) {
        setSearchResult(res.data);
        if (payload.searchTerm) {
          // Reload history to show the newly added query
          await loadSearchHistory();
        }
      }
    } catch (err) {
      setError((err as AxiosErrorLike).response?.data?.message || 'Search execution failed');
    } finally {
      setIsLoading(false);
    }
  }, [loadSearchHistory]);

  const executeComparison = useCallback(async (payload: ComparisonPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await intelligenceService.compare(payload);
      if (res.success) {
        setComparisonResult(res.data);
      }
    } catch (err) {
      setError((err as AxiosErrorLike).response?.data?.message || 'Comparison failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveNewView = useCallback(async (name: string, filters: QueryGroup, isFavorite = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await intelligenceService.saveView({ name, filters, isFavorite });
      if (res.success) {
        await loadSavedViews();
        return res.data;
      }
    } catch (err) {
      setError((err as AxiosErrorLike).response?.data?.message || 'Failed to save view configuration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadSavedViews]);

  const toggleFavoriteView = useCallback(async (id: string, isFavorite: boolean) => {
    try {
      const res = await intelligenceService.updateView(id, { isFavorite });
      if (res.success) {
        setSavedViews((prev) =>
          prev.map((v) => (v.id === id ? { ...v, isFavorite: res.data.isFavorite } : v))
        );
      }
    } catch (err) {
      setError((err as AxiosErrorLike).response?.data?.message || 'Failed to update view');
    }
  }, []);

  const renameSavedView = useCallback(async (id: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await intelligenceService.updateView(id, { name });
      if (res.success) {
        setSavedViews((prev) =>
          prev.map((v) => (v.id === id ? { ...v, name: res.data.name } : v))
        );
      }
    } catch (err) {
      setError((err as AxiosErrorLike).response?.data?.message || 'Failed to rename saved view');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSavedView = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await intelligenceService.deleteView(id);
      if (res.success) {
        setSavedViews((prev) => prev.filter((v) => v.id !== id));
      }
    } catch (err) {
      setError((err as AxiosErrorLike).response?.data?.message || 'Failed to delete saved view');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearchHistory = useCallback(async () => {
    try {
      const res = await intelligenceService.clearHistory();
      if (res.success) {
        setSearchHistory([]);
      }
    } catch (err) {
      console.error('Failed to clear search history:', err);
    }
  }, []);

  const executeBulk = useCallback(async (
    ids: string[],
    action: 'DELETE' | 'EXPORT' | 'CATEGORY' | 'ARCHIVE' | 'RESTORE',
    categoryId?: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await intelligenceService.bulk(ids, action, categoryId);
      return res;
    } catch (err) {
      const msg = (err as AxiosErrorLike).response?.data?.message || 'Bulk operation execution failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadSuggestions();
    loadSavedViews();
    loadSearchHistory();
  }, [loadSuggestions, loadSavedViews, loadSearchHistory]);

  return {
    savedViews,
    searchHistory,
    suggestions,
    searchResult,
    comparisonResult,
    isLoading,
    error,
    setError,
    loadSuggestions,
    loadSavedViews,
    loadSearchHistory,
    executeSearch,
    executeComparison,
    saveNewView,
    toggleFavoriteView,
    renameSavedView,
    deleteSavedView,
    clearSearchHistory,
    executeBulk,
    clearComparison: () => setComparisonResult(null),
  };
};
export default useIntelligence;
