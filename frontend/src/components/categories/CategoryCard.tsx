import React from 'react';
import { Edit2, Archive, RotateCcw, Trash2 } from 'lucide-react';
import { Category } from '../../types/category';
import { CategoryIcon } from '../ui/CategoryIcon';
import { Card } from '../ui/Card';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
}) => {
  const isSystem = category.userId === null;

  return (
    <Card className="flex flex-col justify-between border hover:shadow-md transition-shadow relative overflow-hidden h-full group bg-card">
      <div>
        {/* Top visual circle & type indicators */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="p-3.5 rounded-2xl flex items-center justify-center shadow-sm"
            style={{
              backgroundColor: `${category.color}15`,
              color: category.color,
            }}
          >
            <CategoryIcon name={category.icon} className="h-6 w-6" />
          </div>

          {/* Badge Panel */}
          <div className="flex flex-col items-end gap-1.5">
            {/* System vs custom */}
            {isSystem ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-500 dark:bg-indigo-400/10 dark:text-indigo-400">
                System
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-400">
                Custom
              </span>
            )}

            {/* Type badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                category.type === 'INCOME'
                  ? 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-500 dark:bg-rose-400/10 dark:text-rose-400'
              }`}
            >
              {category.type}
            </span>

            {/* Archive state */}
            {!category.isActive && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-500/15 text-gray-500 dark:bg-gray-400/15 dark:text-gray-400 border border-gray-500/20">
                Archived
              </span>
            )}
          </div>
        </div>

        {/* Name & Description */}
        <div className="text-left">
          <h3 className="text-lg font-bold text-foreground truncate mb-1">{category.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-4 leading-relaxed">
            {category.description || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Action Buttons Footer Panel */}
      <div className="flex items-center justify-between pt-4 border-t gap-2">
        <span className="text-xs text-muted-foreground font-medium">
          Order: {category.sortOrder}
        </span>

        {/* Buttons (disabled for System Categories) */}
        <div className="flex items-center space-x-1">
          {!isSystem ? (
            <>
              <button
                onClick={() => onEdit(category)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                title="Edit category"
              >
                <Edit2 className="h-4 w-4" />
              </button>

              {category.isActive ? (
                <button
                  onClick={() => onArchive(category.id)}
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  title="Archive category"
                >
                  <Archive className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => onRestore(category.id)}
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  title="Restore category"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={() => onDelete(category.id)}
                className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
                title="Delete category"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic select-none pr-1">Read-Only</span>
          )}
        </div>
      </div>
    </Card>
  );
};
