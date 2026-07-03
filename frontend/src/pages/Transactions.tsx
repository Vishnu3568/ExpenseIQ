import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Landmark,
  CalendarDays,
  Plus,
  ArrowLeft,
  ArrowRight,
  EyeOff
} from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionCard } from '../components/transactions/TransactionCard';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Transaction, TransactionPayload } from '../types/transaction';

export const Transactions: React.FC = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  // Load Transactions & Categories Hooks
  const {
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
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const { rawCategories } = useCategories();

  // Layout & Dialog States
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [formError, setFormError] = useState<string>('');

  const handleOpenCreate = () => {
    setActiveTransaction(null);
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (transaction: Transaction) => {
    setActiveTransaction(transaction);
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleOpenView = (transaction: Transaction) => {
    setActiveTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const handleFormSubmit = async (data: TransactionPayload) => {
    setFormError('');
    try {
      if (activeTransaction) {
        await updateTransaction(activeTransaction.id, data);
      } else {
        await createTransaction(data);
      }
      setIsFormModalOpen(false);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any).response?.data?.message || 'Transaction submission failed.';
      setFormError(msg);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction record? This action cannot be undone.')) {
      try {
        await deleteTransaction(id);
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        alert((err as any).response?.data?.message || 'Failed to delete transaction');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const statsCards = [
    {
      title: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      icon: <TrendingUp className="h-6 w-6 text-emerald-500" />,
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Total Expense',
      value: formatCurrency(summary.totalExpense),
      icon: <TrendingDown className="h-6 w-6 text-rose-500" />,
      bg: 'bg-rose-500/10',
    },
    {
      title: 'Net Balance',
      value: formatCurrency(summary.netBalance),
      icon: <Landmark className="h-6 w-6 text-indigo-500" />,
      bg: 'bg-indigo-500/10',
    },
    {
      title: 'Transactions (Month)',
      value: summary.thisMonthCount,
      icon: <CalendarDays className="h-6 w-6 text-amber-500" />,
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-1">
            Track, filter, and audit your personal finance inflows and outlays.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center h-10 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 shadow-sm active:scale-95 transition-all text-sm self-start sm:self-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </button>
      </div>

      {/* Aggregate Statistics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((card) => (
          <div
            key={card.title}
            className="flex items-center p-6 bg-card border rounded-2xl shadow-sm space-x-4"
          >
            <div className={`p-3 rounded-2xl ${card.bg}`}>{card.icon}</div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">{card.title}</div>
              <div className="text-2xl font-bold text-foreground mt-0.5">{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters, Searches, Toggles */}
      <TransactionFilters
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDir={sortDir}
        setSortDir={setSortDir}
        viewMode={viewMode}
        setViewMode={setViewMode}
        categories={rawCategories}
      />

      {/* Primary Listing section */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading transactions...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-center font-medium">
          {error}
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card border rounded-2xl shadow-sm text-center">
          <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
            <EyeOff className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No transactions found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            We couldn't locate any transaction entries matching your filters. Record a new inflow or outflow to get started.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center h-9 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all text-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {viewMode === 'table' ? (
            <TransactionTable
              transactions={transactions}
              onView={handleOpenView}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              currency={currency}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {transactions.map((t) => (
                <TransactionCard
                  key={t.id}
                  transaction={t}
                  onView={handleOpenView}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  currency={currency}
                />
              ))}
            </div>
          )}

          {/* Pagination Footer Panel */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between p-4 bg-card border rounded-2xl shadow-sm">
              <span className="text-sm text-muted-foreground font-medium">
                Showing {transactions.length} of {pagination.total} records
              </span>
              <div className="flex items-center space-x-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-lg border bg-background hover:bg-secondary transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Previous page"
                >
                  <ArrowLeft className="h-4.5 w-4.5" />
                </button>
                <span className="text-sm font-semibold">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  disabled={page === pagination.pages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-lg border bg-background hover:bg-secondary transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Next page"
                >
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Record Creation Modal dialog */}
      <TransactionModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        transaction={activeTransaction}
        categories={rawCategories}
        existingTransactions={transactions}
        error={formError}
      />

      {/* Details View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Transaction Audit Details"
      >
        {activeTransaction && (
          <div className="space-y-4 text-left">
            <div>
              <span className="text-xs font-semibold text-muted-foreground block uppercase">Title</span>
              <span className="text-lg font-bold text-foreground block mt-0.5">{activeTransaction.title}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-muted-foreground block uppercase">Amount</span>
                <span
                  className={`text-base font-extrabold block mt-0.5 ${
                    activeTransaction.type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {activeTransaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(activeTransaction.amount)}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground block uppercase">Category</span>
                <span className="text-sm font-bold text-foreground block mt-0.5">
                  {activeTransaction.category?.name || 'Uncategorized'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-muted-foreground block uppercase">Date</span>
                <span className="text-sm font-semibold text-muted-foreground block mt-0.5">
                  {formatDate(activeTransaction.date)}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground block uppercase">Payment Method</span>
                <span className="text-sm font-semibold text-muted-foreground block mt-0.5">
                  {activeTransaction.paymentMethod}
                </span>
              </div>
            </div>

            {activeTransaction.description && (
              <div>
                <span className="text-xs font-semibold text-muted-foreground block uppercase">Description</span>
                <p className="text-sm text-foreground mt-1 p-3 bg-secondary/35 rounded-lg border leading-relaxed">
                  {activeTransaction.description}
                </p>
              </div>
            )}

            {activeTransaction.notes && (
              <div>
                <span className="text-xs font-semibold text-muted-foreground block uppercase">Internal Notes</span>
                <p className="text-sm text-foreground mt-1 p-3 bg-secondary/35 rounded-lg border leading-relaxed">
                  {activeTransaction.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button type="button" onClick={() => setIsViewModalOpen(false)}>
                Close Details
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
