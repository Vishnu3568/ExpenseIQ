import { useState, useEffect, useCallback } from 'react';
import {
  Transaction,
  TransactionPayload,
  TransactionQueryParams,
  TransactionSummary,
  PaymentMethodType,
} from '../types/transaction';
import { transactionService } from '../services/transactionService';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary>({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    thisMonthCount: 0,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Filtering, Searching, Sorting, and Pagination States
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'INCOME' | 'EXPENSE'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'title'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params: TransactionQueryParams = {
        page,
        limit,
        sortBy,
        sortDir,
      };

      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }
      if (categoryFilter !== 'all') {
        params.categoryId = categoryFilter;
      }
      if (paymentFilter !== 'all') {
        params.paymentMethod = paymentFilter as PaymentMethodType;
      }
      if (startDate) {
        params.startDate = new Date(startDate).toISOString();
      }
      if (endDate) {
        params.endDate = new Date(endDate).toISOString();
      }
      if (search.trim()) {
        params.search = search;
      }

      const res = await transactionService.getTransactions(params);
      setTransactions(res.transactions);
      setSummary(res.summary);
      setPagination(res.pagination);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, typeFilter, categoryFilter, paymentFilter, startDate, endDate, search, sortBy, sortDir]);

  // Reload when pagination or filters change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [typeFilter, categoryFilter, paymentFilter, startDate, endDate, search, sortBy, sortDir]);

  const createTransaction = async (payload: TransactionPayload) => {
    setError('');
    try {
      await transactionService.createTransaction(payload);
      await fetchTransactions();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any).response?.data?.message || 'Failed to create transaction';
      setError(msg);
      throw err;
    }
  };

  const updateTransaction = async (id: string, payload: TransactionPayload) => {
    setError('');
    try {
      await transactionService.updateTransaction(id, payload);
      await fetchTransactions();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any).response?.data?.message || 'Failed to update transaction';
      setError(msg);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    setError('');
    try {
      await transactionService.deleteTransaction(id);
      await fetchTransactions();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any).response?.data?.message || 'Failed to delete transaction';
      setError(msg);
      throw err;
    }
  };

  return {
    transactions,
    summary,
    pagination,
    isLoading,
    error,
    page,
    setPage,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    paymentFilter,
    setPaymentFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    refresh: fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
