import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Transaction } from '../../types/transaction';
import { CategoryIcon } from '../ui/CategoryIcon';
import { Card } from '../ui/Card';

interface TransactionCardProps {
  transaction: Transaction;
  onView: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  currency: string;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onView,
  onEdit,
  onDelete,
  currency = 'USD',
}) => {
  const isIncome = transaction.type === 'INCOME';
  const catName = transaction.category?.name || 'Uncategorized';
  const catColor = transaction.category?.color || '#6B7280';
  const catIcon = transaction.category?.icon || 'tag';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="border hover:shadow-md transition-shadow bg-card p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 text-left">
            <div
              className="p-2.5 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
              style={{
                backgroundColor: `${catColor}15`,
                color: catColor,
              }}
            >
              <CategoryIcon name={catIcon} className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground block">{catName}</span>
              <span className="text-sm font-bold text-foreground block truncate max-w-[150px]">
                {transaction.title}
              </span>
            </div>
          </div>

          <span className={`text-base font-extrabold ${isIncome ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
          </span>
        </div>

        {transaction.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 h-10 leading-relaxed text-left mb-4">
            {transaction.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t pt-4 mt-2 gap-2 text-xs font-semibold text-muted-foreground">
        <div className="flex flex-col text-left">
          <span>{transaction.paymentMethod}</span>
          <span className="text-[10px] font-medium mt-0.5">{formatDate(transaction.date)}</span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onView(transaction)}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};
