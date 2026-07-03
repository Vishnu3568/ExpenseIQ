import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Transaction } from '../../types/transaction';
import { CategoryIcon } from '../ui/CategoryIcon';

interface TransactionTableProps {
  transactions: Transaction[];
  onView: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  currency: string;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onView,
  onEdit,
  onDelete,
  currency = 'USD',
}) => {
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
    <div className="overflow-x-auto bg-card border rounded-2xl shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b bg-card/60 text-xs font-semibold text-muted-foreground uppercase select-none">
            <th className="px-6 py-4">Transaction</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Payment</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y text-sm">
          {transactions.map((t) => {
            const isIncome = t.type === 'INCOME';
            const catName = t.category?.name || 'Uncategorized';
            const catColor = t.category?.color || '#6B7280';
            const catIcon = t.category?.icon || 'tag';

            return (
              <tr key={t.id} className="hover:bg-secondary/40 transition-colors">
                {/* 1. Transaction Details */}
                <td className="px-6 py-4">
                  <div className="text-left">
                    <span className="font-semibold text-foreground block truncate max-w-xs">{t.title}</span>
                    {t.description && (
                      <span className="text-xs text-muted-foreground block truncate max-w-xs mt-0.5">
                        {t.description}
                      </span>
                    )}
                  </div>
                </td>

                {/* 2. Category */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className="p-1.5 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0"
                      style={{
                        backgroundColor: `${catColor}15`,
                        color: catColor,
                      }}
                    >
                      <CategoryIcon name={catIcon} className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-foreground">{catName}</span>
                  </div>
                </td>

                {/* 3. Amount */}
                <td className="px-6 py-4 whitespace-nowrap font-bold">
                  <span className={isIncome ? 'text-emerald-500' : 'text-rose-500'}>
                    {isIncome ? '+' : '-'} {formatCurrency(t.amount)}
                  </span>
                </td>

                {/* 4. Payment Method */}
                <td className="px-6 py-4 whitespace-nowrap font-medium text-muted-foreground">
                  {t.paymentMethod}
                </td>

                {/* 5. Date */}
                <td className="px-6 py-4 whitespace-nowrap font-medium text-muted-foreground">
                  {formatDate(t.date)}
                </td>

                {/* 6. Actions */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      onClick={() => onView(t)}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(t)}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="p-1 rounded hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
