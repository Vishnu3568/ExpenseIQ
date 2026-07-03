import React, { useState } from 'react';
import { Plus, ListFilter, Search, CalendarDays, HelpCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useCategories';
import { useBudgets } from '../hooks/useBudgets';
import { BudgetOverview } from '../components/budgets/BudgetOverview';
import { BudgetCard } from '../components/budgets/BudgetCard';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { BudgetProgress, BudgetPayload } from '../types/budget';

export const Budgets: React.FC = () => {
  const { user } = useAuth();
  const { rawCategories } = useCategories();

  // Load budgets operations hooks
  const {
    progressList,
    overview,
    isLoading,
    createBudget,
    updateBudget,
    deleteBudget,
  } = useBudgets();

  // Layout dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetProgress | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string>('');

  // Filtering states
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'OVERALL' | 'CATEGORY'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'>('ACTIVE');

  const currencySymbol = user?.currency === 'INR' ? '₹' : '$';

  const handleCreateSubmit = async (payload: BudgetPayload) => {
    setSubmitError('');
    try {
      await createBudget(payload);
      setIsCreateOpen(false);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSubmitError((err as any).message || 'Failed to create budget');
    }
  };

  const handleEditSubmit = async (payload: BudgetPayload) => {
    if (!editingBudget) return;
    setSubmitError('');
    try {
      await updateBudget(editingBudget.id, payload);
      setEditingBudget(null);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSubmitError((err as any).message || 'Failed to update budget');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteBudget(deletingId);
      setDeletingId(null);
    } catch (err) {
      // Handled by hook
    }
  };

  // Filter budgets list
  const filteredBudgets = progressList.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.category?.name && b.category.name.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || b.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Smart Budgets
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Plan spending, track limits, and analyze your financial health score.
          </p>
        </div>

        <Button
          onClick={() => {
            setSubmitError('');
            setIsCreateOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Create Budget</span>
        </Button>
      </div>

      {/* 1. Overview Panels */}
      <BudgetOverview
        overview={overview}
        currencySymbol={currencySymbol}
        isLoading={isLoading}
      />

      {/* 2. Filters Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search budgets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Filter select tags */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <ListFilter className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'ALL' | 'OVERALL' | 'CATEGORY')}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="CATEGORY">Category Budgets</option>
            <option value="OVERALL">Overall Monthly</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED')}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
            <option value="ALL">All Statuses</option>
          </select>
        </div>
      </div>

      {/* 3. Main Content: Budgets Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-56 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredBudgets.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-12 text-center shadow-sm">
          <HelpCircle className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            No Budgets Found
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto mt-2">
            Get started by creating a limit budget for your shopping categories or monthly overall spend.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBudgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              currencySymbol={currencySymbol}
              onEditClick={(b) => {
                setSubmitError('');
                setEditingBudget(b);
              }}
              onDeleteClick={(id) => setDeletingId(id)}
            />
          ))}
        </div>
      )}

      {/* 4. Budget Calendar range view block */}
      {!isLoading && filteredBudgets.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-800/50 pb-4 mb-4">
            <CalendarDays className="h-5 w-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              Budget Period Timelines
            </h3>
          </div>

          <div className="space-y-4">
            {filteredBudgets.map((b) => {
              const startStr = new Date(b.startDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const endStr = new Date(b.endDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100/60 transition-colors">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {b.name}
                    </span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      Target limit: {currencySymbol}{Number(b.amount).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {startStr} – {endStr}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Budget Modal - Create Overlay */}
      {isCreateOpen && (
        <BudgetModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateSubmit}
          categories={rawCategories}
          error={submitError || undefined}
        />
      )}

      {/* 6. Budget Modal - Edit Overlay */}
      {editingBudget && (
        <BudgetModal
          isOpen={!!editingBudget}
          onClose={() => setEditingBudget(null)}
          onSubmit={handleEditSubmit}
          budget={editingBudget}
          categories={rawCategories}
          error={submitError || undefined}
        />
      )}

      {/* 7. Delete Confirmation Dialog Overlay */}
      {deletingId && (
        <Modal
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          title="Delete Budget"
        >
          <div className="space-y-4 pt-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this budget? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <Button variant="outline" onClick={() => setDeletingId(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                Delete Budget
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default Budgets;
