import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, History, Trash } from 'lucide-react';
import { useIntelligence } from '../hooks/useIntelligence';
import { QueryBuilder } from '../components/intelligence/QueryBuilder';
import { SavedViewsPanel } from '../components/intelligence/SavedViewsPanel';
import { ComparisonPanel } from '../components/intelligence/ComparisonPanel';
import { BulkOperationsToolbar } from '../components/intelligence/BulkOperationsToolbar';
import { SearchSuggestions } from '../components/intelligence/SearchSuggestions';
import { QueryGroup, SavedView, FilterRule } from '../types/intelligence';

export const DataIntelligence: React.FC = () => {
  const {
    savedViews,
    searchHistory,
    suggestions,
    searchResult,
    comparisonResult,
    isLoading,
    error,
    executeSearch,
    executeComparison,
    saveNewView,
    toggleFavoriteView,
    renameSavedView,
    deleteSavedView,
    clearSearchHistory,
    executeBulk,
    clearComparison,
  } = useIntelligence();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [queryGroup, setQueryGroup] = useState<QueryGroup>({
    logicalOperator: 'AND',
    rules: [],
  });

  // Pagination & Sorting state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Row selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFiltersBuilder, setShowFiltersBuilder] = useState(false);

  // Debounced search trigger
  const runSearch = useCallback(() => {
    executeSearch({
      searchTerm,
      queryGroup,
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }, [searchTerm, queryGroup, page, limit, sortBy, sortOrder, executeSearch]);

  // Trigger search on parameter changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      runSearch();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, queryGroup, page, limit, sortBy, sortOrder, runSearch]);

  const handleApplySavedView = (view: SavedView) => {
    setQueryGroup(view.filters);
    setShowFiltersBuilder(true);
  };

  const handleSaveCurrentView = async (name: string) => {
    try {
      await saveNewView(name, queryGroup);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleSuggestionSelect = (val: string, field?: string) => {
    if (field) {
      // Add suggestion as query builder rule
      const newRule = { field, operator: 'EQUALS' as const, value: val };
      setQueryGroup((prev) => ({
        ...prev,
        rules: [...prev.rules, newRule],
      }));
      setShowFiltersBuilder(true);
    } else {
      // Fill main text search
      setSearchTerm(val);
    }
    setShowSuggestions(false);
  };

  // Quick Filter Chips trigger
  const handleQuickFilter = (type: string) => {
    const today = new Date().toISOString().split('T')[0];
    let newRule: FilterRule | null = null;

    switch (type) {
      case 'TODAY':
        newRule = { field: 'date', operator: 'EQUALS', value: today };
        break;
      case 'THIS_MONTH': {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
        newRule = { field: 'date', operator: 'BETWEEN', value: [startOfMonth, today] };
        break;
      }
      case 'INCOME':
        newRule = { field: 'type', operator: 'EQUALS', value: 'INCOME' };
        break;
      case 'EXPENSE':
        newRule = { field: 'type', operator: 'EQUALS', value: 'EXPENSE' };
        break;
      case 'LARGE':
        newRule = { field: 'amount', operator: 'GREATER_THAN', value: 5000 };
        break;
      default:
        break;
    }

    if (newRule) {
      setQueryGroup((prev) => ({
        ...prev,
        rules: [...prev.rules, newRule],
      }));
      setShowFiltersBuilder(true);
    }
  };

  const handleSort = (field: string) => {
    const order = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(field);
    setSortOrder(order);
  };

  // Row selection handlers
  const handleSelectAll = (checked: boolean, list: { id: string }[]) => {
    if (checked) {
      setSelectedIds(list.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (checked: boolean, id: string) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((rowId) => rowId !== id)));
  };

  // Execute bulk operation
  const handleBulkAction = async (
    action: 'DELETE' | 'EXPORT' | 'CATEGORY' | 'ARCHIVE' | 'RESTORE',
    categoryId?: string
  ) => {
    try {
      const res = await executeBulk(selectedIds, action, categoryId);
      if (res.success) {
        setSelectedIds([]);
        runSearch();

        // If action is export, download file client side
        if (action === 'EXPORT' && res.data) {
          const headers = ['Date', 'Title', 'Category', 'Type', 'Amount', 'Payment Method'];
          const csvRows = [headers.join(',')];
          (res.data as { date: string; title: string; categoryName?: string; type: string; amount: number; paymentMethod: string }[]).forEach((t) => {
            csvRows.push(
              `"${new Date(t.date).toLocaleDateString()}","${t.title.replace(/"/g, '""')}","${t.categoryName || ''}","${t.type}",${t.amount},"${t.paymentMethod}"`
            );
          });
          const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `bulk_export_${Date.now()}.csv`);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      }
    } catch (err) {
      // Handled inside hook
    }
  };

  const categoriesList = suggestions?.categories || [];
  const paymentMethodsList = suggestions?.paymentMethods || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Title */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Data Intelligence Center
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Perform multidimensional querying, build search matrices, construct visual query rules, and compare records.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-4 text-xs text-rose-600 dark:text-rose-450">
          {error}
        </div>
      )}

      {/* Quick Filters Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
          Quick Filters:
        </span>
        <button
          onClick={() => handleQuickFilter('TODAY')}
          className="h-6 px-3 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-[10px] text-slate-700 dark:text-slate-350 transition-colors"
        >
          Today
        </button>
        <button
          onClick={() => handleQuickFilter('THIS_MONTH')}
          className="h-6 px-3 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-[10px] text-slate-700 dark:text-slate-350 transition-colors"
        >
          This Month
        </button>
        <button
          onClick={() => handleQuickFilter('INCOME')}
          className="h-6 px-3 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-[10px] text-slate-700 dark:text-slate-350 transition-colors"
        >
          Income
        </button>
        <button
          onClick={() => handleQuickFilter('EXPENSE')}
          className="h-6 px-3 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-[10px] text-slate-700 dark:text-slate-350 transition-colors"
        >
          Expense
        </button>
        <button
          onClick={() => handleQuickFilter('LARGE')}
          className="h-6 px-3 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-[10px] text-slate-700 dark:text-slate-350 transition-colors"
        >
          Large (&gt; $5000)
        </button>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Search, QueryBuilder, & Grid (Left) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search bar container */}
          <div className="relative">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm px-4 h-12 flex items-center gap-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Type keywords (title, description, category, payment method) to instant search..."
                className="w-full bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <button
                onClick={() => setShowFiltersBuilder(!showFiltersBuilder)}
                className={`h-8 w-8 rounded-xl border flex items-center justify-center transition-colors ${
                  showFiltersBuilder || queryGroup.rules.length > 0
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-650 dark:border-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-400'
                    : 'border-slate-250 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
                title="Toggle visual filter rules"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>

            {showSuggestions && (
              <SearchSuggestions
                suggestions={suggestions}
                searchTerm={searchTerm}
                onSelectSuggestion={handleSuggestionSelect}
                onClose={() => setShowSuggestions(false)}
              />
            )}
          </div>

          {/* Collapsible Visual Query Builder panel */}
          {(showFiltersBuilder || queryGroup.rules.length > 0) && (
            <QueryBuilder
              categories={categoriesList}
              paymentMethods={paymentMethodsList}
              budgets={[]} // Will be mapped below if present
              queryGroup={queryGroup}
              onChange={setQueryGroup}
            />
          )}

          {/* Search History Row */}
          {searchHistory.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 overflow-x-auto py-1 flex-1">
                <History className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Recent:</span>
                {searchHistory.slice(0, 5).map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setSearchTerm(h.query)}
                    className="h-6 px-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-350 transition-colors shrink-0"
                  >
                    {h.query}
                  </button>
                ))}
              </div>
              <button
                onClick={clearSearchHistory}
                className="text-[10px] text-rose-500 hover:text-rose-600 flex items-center gap-1 shrink-0"
              >
                <Trash className="h-3 w-3" />
                <span>Clear</span>
              </button>
            </div>
          )}

          {/* Transactions DataGrid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={
                          searchResult?.transactions.length > 0 &&
                          selectedIds.length === searchResult?.transactions.length
                        }
                        onChange={(e) =>
                          handleSelectAll(e.target.checked, searchResult?.transactions || [])
                        }
                        className="rounded border-slate-200 dark:border-slate-850 text-indigo-650"
                      />
                    </th>
                    <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('date')}>
                      <div className="flex items-center gap-1.5">
                        <span>Date</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('title')}>
                      <div className="flex items-center gap-1.5">
                        <span>Title Description</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('categoryName')}>
                      <div className="flex items-center gap-1.5">
                        <span>Category</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4 cursor-pointer text-right" onClick={() => handleSort('amount')}>
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Amount</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {isLoading && (!searchResult || searchResult.transactions.length === 0) ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="py-4 px-4">
                          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-full" />
                        </td>
                      </tr>
                    ))
                  ) : !searchResult || searchResult.transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-4 text-center text-slate-400">
                        No transactions found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    searchResult.transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(tx.id)}
                            onChange={(e) => handleSelectRow(e.target.checked, tx.id)}
                            className="rounded border-slate-200 dark:border-slate-850 text-indigo-650"
                          />
                        </td>
                        <td className="py-3 px-4 text-slate-550 dark:text-slate-400">
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-semibold text-slate-755 dark:text-slate-200">
                              {tx.title}
                            </span>
                            {tx.description && (
                              <p className="text-[10px] text-slate-400 truncate max-w-xs">{tx.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{
                              backgroundColor: `${tx.categoryColor}15`,
                              color: tx.categoryColor,
                            }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tx.categoryColor }} />
                            {tx.categoryName}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-550 dark:text-slate-400 truncate max-w-[80px]">
                          {tx.paymentMethod}
                        </td>
                        <td className={`py-3 px-4 text-right font-bold ${
                          tx.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-755 dark:text-slate-200'
                        }`}>
                          {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            {searchResult && searchResult.pagination.totalPages > 1 && (
              <div className="bg-slate-50/50 dark:bg-slate-900/30 px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap">
                <span className="text-[10px] text-slate-400">
                  Showing page {searchResult.pagination.page} of {searchResult.pagination.totalPages} (
                  {searchResult.pagination.total} total items)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white text-slate-500 hover:text-slate-850 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    disabled={page === searchResult.pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white text-slate-500 hover:text-slate-850 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panels (Right) */}
        <div className="lg:col-span-4 space-y-6">
          <SavedViewsPanel
            views={savedViews}
            onApply={handleApplySavedView}
            onDelete={deleteSavedView}
            onToggleFavorite={toggleFavoriteView}
            onRename={renameSavedView}
            onSaveCurrent={handleSaveCurrentView}
          />

          <ComparisonPanel
            categories={categoriesList}
            budgets={[]} // Left blank or fetch budgets list if needed
            comparisonResult={comparisonResult}
            onCompare={executeComparison}
            onClear={clearComparison}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Bulk actions popup toolbar */}
      <BulkOperationsToolbar
        selectedIds={selectedIds}
        categories={categoriesList}
        onAction={handleBulkAction}
        onClearSelection={() => setSelectedIds([])}
        isLoading={isLoading}
      />
    </div>
  );
};
export default DataIntelligence;
