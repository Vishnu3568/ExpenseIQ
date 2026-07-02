import React from 'react';
import { Search, Grid, List } from 'lucide-react';

interface CategoryFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  typeFilter: 'all' | 'INCOME' | 'EXPENSE';
  setTypeFilter: (val: 'all' | 'INCOME' | 'EXPENSE') => void;
  statusFilter: 'all' | 'active' | 'archived';
  setStatusFilter: (val: 'all' | 'active' | 'archived') => void;
  sortBy: 'name' | 'sortOrder' | 'createdAt';
  setSortBy: (val: 'name' | 'sortOrder' | 'createdAt') => void;
  viewMode: 'grid' | 'table';
  setViewMode: (val: 'grid' | 'table') => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 bg-card border rounded-2xl shadow-sm mb-6">
      {/* 1. Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories by name or description..."
          className="w-full h-10 pl-10 pr-4 rounded-lg border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none transition-colors focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>

      {/* 2. Controls flex wrap */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as 'all' | 'INCOME' | 'EXPENSE')}
          className="h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="INCOME">Income Only</option>
          <option value="EXPENSE">Expense Only</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'archived')}
          className="h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent cursor-pointer"
        >
          <option value="active">Active Only</option>
          <option value="archived">Archived Only</option>
          <option value="all">All Statuses</option>
        </select>

        {/* Sort By Filter */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'sortOrder' | 'createdAt')}
          className="h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent cursor-pointer"
        >
          <option value="sortOrder">Sort Order</option>
          <option value="name">Alphabetical</option>
          <option value="createdAt">Date Created</option>
        </select>

        {/* Grid/Table Toggle */}
        <div className="flex rounded-lg border bg-background p-1">
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
        </div>
      </div>
    </div>
  );
};
