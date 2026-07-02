import React, { useState } from 'react';
import {
  FolderOpen,
  TrendingUp,
  TrendingDown,
  Archive,
  Plus,
  Activity
} from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { CategoryFilters } from '../components/categories/CategoryFilters';
import { CategoryList } from '../components/categories/CategoryList';
import { CategoryTable } from '../components/categories/CategoryTable';
import { CategoryFormModal } from '../components/categories/CategoryFormModal';
import { Spinner } from '../components/ui/Spinner';
import { Category, CategoryPayload } from '../types/category';

export const Categories: React.FC = () => {
  const {
    categories,
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
    createCategory,
    updateCategory,
    deleteCategory,
    archiveCategory,
    restoreCategory,
  } = useCategories();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formError, setFormError] = useState<string>('');

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: CategoryPayload) => {
    setFormError('');
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
      } else {
        await createCategory(data);
      }
      setIsModalOpen(false);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any).response?.data?.message || 'Action failed. Please try again.';
      setFormError(msg);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this custom category? This action cannot be undone.')) {
      try {
        await deleteCategory(id);
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        alert((err as any).response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveCategory(id);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alert((err as any).response?.data?.message || 'Failed to archive category');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreCategory(id);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alert((err as any).response?.data?.message || 'Failed to restore category');
    }
  };

  const statsCards = [
    {
      title: 'Total Categories',
      value: summary.total,
      icon: <FolderOpen className="h-6 w-6 text-primary" />,
      bg: 'bg-primary/10',
    },
    {
      title: 'Active Income',
      value: summary.income,
      icon: <TrendingUp className="h-6 w-6 text-emerald-500" />,
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Active Expense',
      value: summary.expense,
      icon: <TrendingDown className="h-6 w-6 text-rose-500" />,
      bg: 'bg-rose-500/10',
    },
    {
      title: 'Archived Categories',
      value: summary.archived,
      icon: <Archive className="h-6 w-6 text-gray-500" />,
      bg: 'bg-gray-500/10',
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Configure transaction categories for financial budgets and reports.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center h-10 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 shadow-sm active:scale-95 transition-all text-sm self-start sm:self-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Category
        </button>
      </div>

      {/* Summary Stats Cards */}
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

      {/* Categories Search & Filters */}
      <CategoryFilters
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Content Section */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-center font-medium">
          {error}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card border rounded-2xl shadow-sm text-center">
          <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
            <Activity className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No categories found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            We couldn't find any categories matching your filters. Try adjusting search queries or create a new custom category.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center h-9 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all text-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Category
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <CategoryList
          categories={categories}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onRestore={handleRestore}
        />
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onRestore={handleRestore}
        />
      )}

      {/* Category Create/Edit Modal dialog form */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        category={editingCategory}
        error={formError}
      />
    </div>
  );
};
