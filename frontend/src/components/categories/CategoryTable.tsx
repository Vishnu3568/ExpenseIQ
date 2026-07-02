import React from 'react';
import { Edit2, Archive, RotateCcw, Trash2 } from 'lucide-react';
import { Category } from '../../types/category';
import { CategoryIcon } from '../ui/CategoryIcon';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
}) => {
  return (
    <div className="overflow-x-auto bg-card border rounded-2xl shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b bg-card/60 text-xs font-semibold text-muted-foreground uppercase select-none">
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Origin</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Sort Order</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y text-sm">
          {categories.map((category) => {
            const isSystem = category.userId === null;

            return (
              <tr
                key={category.id}
                className="hover:bg-secondary/40 transition-colors"
              >
                {/* 1. Category Indicator */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-xl flex items-center justify-center shadow-sm"
                      style={{
                        backgroundColor: `${category.color}15`,
                        color: category.color,
                      }}
                    >
                      <CategoryIcon name={category.icon} className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-foreground">{category.name}</span>
                  </div>
                </td>

                {/* 2. Description */}
                <td className="px-6 py-4 max-w-xs truncate text-muted-foreground">
                  {category.description || '-'}
                </td>

                {/* 3. Type Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      category.type === 'INCOME'
                        ? 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-500 dark:bg-rose-400/10 dark:text-rose-400'
                    }`}
                  >
                    {category.type}
                  </span>
                </td>

                {/* 4. Origin Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {isSystem ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-500 dark:bg-indigo-400/10 dark:text-indigo-400">
                      System
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-400">
                      Custom
                    </span>
                  )}
                </td>

                {/* 5. Status Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-400">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-500/15 text-gray-500 dark:bg-gray-400/15 dark:text-gray-400 border border-gray-500/20">
                      Archived
                    </span>
                  )}
                </td>

                {/* 6. Sort Order */}
                <td className="px-6 py-4 text-center font-medium text-muted-foreground whitespace-nowrap">
                  {category.sortOrder}
                </td>

                {/* 7. Action Triggers */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-1.5">
                    {!isSystem ? (
                      <>
                        <button
                          onClick={() => onEdit(category)}
                          className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        {category.isActive ? (
                          <button
                            onClick={() => onArchive(category.id)}
                            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            title="Archive"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onRestore(category.id)}
                            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            title="Restore"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          onClick={() => onDelete(category.id)}
                          className="p-1 rounded hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground italic select-none pr-1">
                        Read-Only
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
