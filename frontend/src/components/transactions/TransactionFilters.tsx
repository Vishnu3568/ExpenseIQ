import React from 'react';
import { Search, Grid, List, ArrowUpDown } from 'lucide-react';
import { Category } from '../../types/category';

interface TransactionFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  typeFilter: 'all' | 'INCOME' | 'EXPENSE';
  setTypeFilter: (val: 'all' | 'INCOME' | 'EXPENSE') => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  paymentFilter: string;
  setPaymentFilter: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  sortBy: 'date' | 'amount' | 'title';
  setSortBy: (val: 'date' | 'amount' | 'title') => void;
  sortDir: 'asc' | 'desc';
  setSortDir: (val: 'asc' | 'desc') => void;
  viewMode: 'grid' | 'table';
  setViewMode: (val: 'grid' | 'table') => void;
  categories: Category[];
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
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
  viewMode,
  setViewMode,
  categories,
}) => {
  const toggleSortDir = () => {
    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
  };

  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Wallet', 'Other'];

  return (
    <div className="p-5 bg-card border rounded-2xl shadow-sm mb-6 space-y-4 text-left">
      {/* Search & Layout Toggles */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions by title or description..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none transition-colors focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Sorting Direction Toggle */}
          <button
            onClick={toggleSortDir}
            className="flex items-center justify-center h-10 w-10 border rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title={`Sort: ${sortDir === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="h-4.5 w-4.5" />
          </button>

          {/* Grid/Table View toggles */}
          <div className="flex rounded-lg border bg-background p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Table view"
            >
              <List className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Grid panel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        {/* Type selector */}
        <div className="flex flex-col text-left">
          <label className="text-xs font-semibold text-muted-foreground mb-1">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | 'INCOME' | 'EXPENSE')}
            className="h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none cursor-pointer focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>

        {/* Category selector */}
        <div className="flex flex-col text-left">
          <label className="text-xs font-semibold text-muted-foreground mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none cursor-pointer focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type === 'INCOME' ? 'In' : 'Out'})
              </option>
            ))}
          </select>
        </div>

        {/* Payment selector */}
        <div className="flex flex-col text-left">
          <label className="text-xs font-semibold text-muted-foreground mb-1">Payment Method</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none cursor-pointer focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Methods</option>
            {paymentMethods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Sort parameters */}
        <div className="flex flex-col text-left">
          <label className="text-xs font-semibold text-muted-foreground mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'title')}
            className="h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none cursor-pointer focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="title">Title</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="flex flex-col text-left">
          <label className="text-xs font-semibold text-muted-foreground mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col text-left">
          <label className="text-xs font-semibold text-muted-foreground mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};
