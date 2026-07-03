import React from 'react';
import { CategoryBreakdownItem } from '../../types/insight';

interface CategoryBreakdownListProps {
  categories: CategoryBreakdownItem[];
  currencySymbol?: string;
  isLoading?: boolean;
}

export const CategoryBreakdownList: React.FC<CategoryBreakdownListProps> = ({
  categories,
  currencySymbol = '$',
  isLoading = false,
}) => {
  // We only display the top expense categories
  const expenseCategories = categories
    .filter((c) => c.type === 'EXPENSE')
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2 animate-pulse">
            <div className="flex justify-between">
              <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-12" />
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (expenseCategories.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-slate-400 dark:text-slate-500">
        No expense allocations recorded
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenseCategories.map((item) => {
        const percentage = Math.round(item.percentage);

        return (
          <div key={item.categoryId || 'uncategorized'} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                  {item.name}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
                  ({percentage}%)
                </span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 ml-2">
                {currencySymbol}
                {Number(item.amount).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  backgroundColor: item.color,
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
