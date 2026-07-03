import { useState, useEffect, useCallback } from 'react';
import {
  OverviewData,
  MonthlyBreakdownItem,
  WeeklyBreakdownItem,
  CategoryBreakdownItem,
  StatisticsData,
  CashflowItem,
} from '../types/insight';
import { Transaction } from '../types/transaction';
import { insightService } from '../services/insightService';

/**
 * Hook for Overview metrics
 */
export function useInsightOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await insightService.getOverview();
      setData(res.data);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || 'Failed to fetch overview metrics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

/**
 * Hook for Monthly breakdown
 */
export function useInsightMonthly() {
  const [data, setData] = useState<MonthlyBreakdownItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await insightService.getMonthlyBreakdown();
      setData(res.data);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || 'Failed to fetch monthly breakdown');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

/**
 * Hook for Weekly breakdown
 */
export function useInsightWeekly() {
  const [data, setData] = useState<WeeklyBreakdownItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await insightService.getWeeklyBreakdown();
      setData(res.data);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || 'Failed to fetch weekly breakdown');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

/**
 * Hook for Category breakdown
 */
export function useInsightCategoryBreakdown() {
  const [data, setData] = useState<CategoryBreakdownItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await insightService.getCategoryBreakdown();
      setData(res.data);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || 'Failed to fetch category breakdown');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

/**
 * Hook for Recent Transactions
 */
export function useInsightRecent(limit: number = 10) {
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await insightService.getRecent(limit);
      setData(res.data);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || 'Failed to fetch recent transactions');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

/**
 * Hook for advanced Statistics highlights
 */
export function useInsightStatistics() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await insightService.getStatistics();
      setData(res.data);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || 'Failed to fetch financial statistics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

/**
 * Hook for Cashflow trends
 */
export function useInsightCashflow() {
  const [data, setData] = useState<CashflowItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await insightService.getCashflow();
      setData(res.data);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || 'Failed to fetch cashflow data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
