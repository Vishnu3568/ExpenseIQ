import { useState, useEffect, useCallback } from 'react';
import { Budget, BudgetProgress, BudgetOverview, BudgetPayload } from '../types/budget';
import { budgetService } from '../services/budgetService';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [progressList, setProgressList] = useState<BudgetProgress[]>([]);
  const [overview, setOverview] = useState<BudgetOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [budgetsRes, progressRes, overviewRes] = await Promise.all([
        budgetService.getAll(),
        budgetService.getProgress(),
        budgetService.getOverview(),
      ]);

      setBudgets(budgetsRes.data);
      setProgressList(progressRes.data);
      setOverview(overviewRes.data);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || 'Failed to fetch budget details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBudget = async (payload: BudgetPayload) => {
    setError('');
    try {
      await budgetService.create(payload);
      await fetchAll();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errMsg = (err as any).response?.data?.message || 'Failed to create budget';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const updateBudget = async (id: string, payload: Partial<BudgetPayload>) => {
    setError('');
    try {
      await budgetService.update(id, payload);
      await fetchAll();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errMsg = (err as any).response?.data?.message || 'Failed to update budget';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const deleteBudget = async (id: string) => {
    setError('');
    try {
      await budgetService.delete(id);
      await fetchAll();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errMsg = (err as any).response?.data?.message || 'Failed to delete budget';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    budgets,
    progressList,
    overview,
    isLoading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    refetch: fetchAll,
  };
}
export default useBudgets;
