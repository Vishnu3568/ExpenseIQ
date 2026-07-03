import React, { useEffect, useMemo } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ErrorAlert } from '../ui/ErrorAlert';
import { Category } from '../../types/category';
import { Transaction, TransactionPayload } from '../../types/transaction';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionPayload) => Promise<void>;
  transaction?: Transaction | null;
  categories: Category[];
  existingTransactions: Transaction[];
  error?: string;
}

const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Wallet', 'Other'];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transaction,
  categories,
  existingTransactions,
  error,
}) => {
  const isEdit = !!transaction;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      amount: 0,
      type: 'EXPENSE',
      categoryId: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      notes: '',
    },
  });

  const selectedType = watch('type');
  const selectedCategory = watch('categoryId');
  const inputTitle = watch('title');
  const inputAmount = watch('amount');
  const inputDate = watch('date');

  // Populate form values when editing
  useEffect(() => {
    if (transaction) {
      reset({
        title: transaction.title,
        description: transaction.description || '',
        amount: transaction.amount,
        type: transaction.type,
        categoryId: transaction.categoryId || '',
        date: new Date(transaction.date).toISOString().split('T')[0],
        paymentMethod: transaction.paymentMethod,
        notes: transaction.notes || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        amount: 0,
        type: 'EXPENSE',
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        notes: '',
      });
    }
  }, [transaction, reset, isOpen]);

  // Dynamically filter category dropdown list: match selected type & must be active (or matches editing id)
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (c) =>
        c.type === selectedType &&
        (c.isActive || c.id === transaction?.categoryId)
    );
  }, [categories, selectedType, transaction]);

  // Smart duplicate transaction warning alert detection
  const isDuplicateWarning = useMemo(() => {
    if (isEdit || !inputTitle || !inputAmount || !inputDate) return false;
    
    const formattedInputDate = new Date(inputDate).toISOString().split('T')[0];
    const match = existingTransactions.find((t) => {
      const matchTitle = t.title.trim().toLowerCase() === inputTitle.trim().toLowerCase();
      const matchAmount = Number(t.amount) === Number(inputAmount);
      const matchDate = new Date(t.date).toISOString().split('T')[0] === formattedInputDate;
      return matchTitle && matchAmount && matchDate;
    });

    return !!match;
  }, [existingTransactions, inputTitle, inputAmount, inputDate, isEdit]);

  const onFormSubmit = async (data: FieldValues) => {
    try {
      await onSubmit({
        title: data.title,
        description: data.description || null,
        amount: parseFloat(data.amount),
        type: data.type as 'INCOME' | 'EXPENSE',
        categoryId: data.categoryId || null,
        date: new Date(data.date).toISOString(),
        paymentMethod: data.paymentMethod,
        notes: data.notes || null,
      });
      onClose();
    } catch (err) {
      // Handled in parent
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Transaction Details' : 'Record Transaction'}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        <ErrorAlert message={error || ''} />

        {/* Duplicate Warning Prompt */}
        {isDuplicateWarning && (
          <div className="flex items-start space-x-3 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 rounded-lg text-sm text-left">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Potential Duplicate Transaction</span>
              <p className="mt-0.5 text-xs">
                A transaction with the exact same title, amount, and date was already recorded. Click submit again to save if this is correct.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Title */}
          <Input
            label="Transaction Title"
            placeholder="e.g. Amazon Web Services"
            error={errors.title?.message}
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 2, message: 'Must be at least 2 characters' },
              maxLength: { value: 50, message: 'Cannot exceed 50 characters' },
            })}
          />

          {/* Type Toggle */}
          <div className="text-left">
            <label className="block text-sm font-medium text-foreground mb-1.5">Type</label>
            <div className="flex rounded-lg border p-1 bg-background h-10">
              <button
                type="button"
                onClick={() => {
                  setValue('type', 'EXPENSE');
                  setValue('categoryId', ''); // reset category on switch
                }}
                className={`flex-1 rounded-md text-xs font-semibold transition-colors ${
                  selectedType === 'EXPENSE'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('type', 'INCOME');
                  setValue('categoryId', ''); // reset category
                }}
                className={`flex-1 rounded-md text-xs font-semibold transition-colors ${
                  selectedType === 'INCOME'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Income
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Amount */}
          <Input
            label="Amount ($)"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register('amount', {
              required: 'Amount is required',
              validate: (val) => parseFloat(val as string) > 0 || 'Amount must be greater than 0',
            })}
          />

          {/* Category Dropdown */}
          <div className="text-left">
            <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
            <select
              value={selectedCategory}
              {...register('categoryId')}
              className="w-full h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none cursor-pointer transition-colors focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="">Uncategorized</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date Picker */}
          <div className="text-left">
            <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="w-full h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none transition-colors focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            {errors.date?.message && (
              <p className="mt-1 text-xs text-danger font-medium">{errors.date.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="text-left">
            <label className="block text-sm font-medium text-foreground mb-1.5">Payment Method</label>
            <select
              value={watch('paymentMethod')}
              {...register('paymentMethod', { required: 'Payment method is required' })}
              className="w-full h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none cursor-pointer transition-colors focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Description */}
          <Input
            label="Description"
            placeholder="e.g. Premium API plan"
            error={errors.description?.message}
            {...register('description', {
              maxLength: { value: 200, message: 'Cannot exceed 200 characters' },
            })}
          />

          {/* Notes */}
          <Input
            label="Notes"
            placeholder="e.g. Renewed automatically"
            error={errors.notes?.message}
            {...register('notes', {
              maxLength: { value: 500, message: 'Cannot exceed 500 characters' },
            })}
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Record Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
