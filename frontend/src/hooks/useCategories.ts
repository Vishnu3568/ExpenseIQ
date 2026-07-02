import { useState, useEffect, useMemo, useCallback } from 'react';
import { Category, CategoryPayload, CategorySummary } from '../types/category';
import { categoryService } from '../services/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Filtering, Searching, and Sorting States
  const [search, setSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'INCOME' | 'EXPENSE'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('active');
  const [sortBy, setSortBy] = useState<'name' | 'sortOrder' | 'createdAt'>('sortOrder');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Load all user + system categories (including archived ones for summary calculations)
  const fetchAllCategories = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await categoryService.getCategories({ status: 'all' });
      setCategories(res.categories);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Compute summary metrics from the complete categories list
  const summary = useMemo<CategorySummary>(() => {
    return {
      total: categories.length,
      income: categories.filter((c) => c.type === 'INCOME' && c.isActive).length,
      expense: categories.filter((c) => c.type === 'EXPENSE' && c.isActive).length,
      archived: categories.filter((c) => !c.isActive).length,
    };
  }, [categories]);

  // Apply filters, search queries, and sorting in memory for high-performance SPA UX
  const filteredCategories = useMemo(() => {
    let result = [...categories];

    // 1. Status Filter
    if (statusFilter === 'active') {
      result = result.filter((c) => c.isActive);
    } else if (statusFilter === 'archived') {
      result = result.filter((c) => !c.isActive);
    }

    // 2. Type Filter
    if (typeFilter !== 'all') {
      result = result.filter((c) => c.type === typeFilter);
    }

    // 3. Search Filter
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query)
      );
    }

    // 4. Sorting logic
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'sortOrder') {
        comparison = a.sortOrder - b.sortOrder;
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortDir === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [categories, search, typeFilter, statusFilter, sortBy, sortDir]);

  // Mutation Handlers
  const createCategory = async (payload: CategoryPayload) => {
    setError('');
    try {
      await categoryService.createCategory(payload);
      await fetchAllCategories();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any).response?.data?.message || 'Failed to create category';
      setError(msg);
      throw err;
    }
  };

  const updateCategory = async (id: string, payload: CategoryPayload) => {
    setError('');
    try {
      await categoryService.updateCategory(id, payload);
      await fetchAllCategories();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any).response?.data?.message || 'Failed to update category';
      setError(msg);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    setError('');
    try {
      await categoryService.deleteCategory(id);
      await fetchAllCategories();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any).response?.data?.message || 'Failed to delete category';
      setError(msg);
      throw err;
    }
  };

  const archiveCategory = async (id: string) => {
    setError('');
    try {
      await categoryService.archiveCategory(id);
      await fetchAllCategories();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any).response?.data?.message || 'Failed to archive category';
      setError(msg);
      throw err;
    }
  };

  const restoreCategory = async (id: string) => {
    setError('');
    try {
      await categoryService.restoreCategory(id);
      await fetchAllCategories();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any).response?.data?.message || 'Failed to restore category';
      setError(msg);
      throw err;
    }
  };

  return {
    categories: filteredCategories,
    rawCategories: categories,
    isLoading,
    error,
    summary,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    refresh: fetchAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    archiveCategory,
    restoreCategory,
  };
}
