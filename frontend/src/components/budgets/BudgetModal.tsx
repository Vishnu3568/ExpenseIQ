import React, { useEffect } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ErrorAlert } from '../ui/ErrorAlert';
import { Category } from '../../types/category';
import { Budget, BudgetPayload } from '../../types/budget';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetPayload) => Promise<void>;
  budget?: Budget | null;
  categories: Category[];
  error?: string;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  budget,
  categories,
  error,
}) => {
  const isEdit = !!budget;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      type: 'CATEGORY',
      categoryId: '',
      amount: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      status: 'ACTIVE',
      notes: '',
    },
  });

  const selectedType = watch('type');

  // Populate data when editing a budget
  useEffect(() => {
    if (budget) {
      reset({
        name: budget.name,
        type: budget.type,
        categoryId: budget.categoryId || '',
        amount: Number(budget.amount),
        startDate: new Date(budget.startDate).toISOString().split('T')[0],
        endDate: new Date(budget.endDate).toISOString().split('T')[0],
        status: budget.status,
        notes: budget.notes || '',
      });
    } else {
      reset({
        name: '',
        type: 'CATEGORY',
        categoryId: '',
        amount: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        status: 'ACTIVE',
        notes: '',
      });
    }
  }, [budget, reset, isOpen]);

  const onFormSubmit = async (values: FieldValues) => {
    const payload: BudgetPayload = {
      name: values.name,
      amount: Number(values.amount),
      type: values.type,
      categoryId: values.type === 'CATEGORY' ? values.categoryId : null,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      status: values.status,
      notes: values.notes || null,
    };
    await onSubmit(payload);
  };

  // Filter to show only active EXPENSE categories since budgets are for spending limit planning
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE' && c.isActive);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Budget' : 'Create Budget'}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
        {error && <ErrorAlert message={error} />}

        <Input
          label="Budget Name"
          placeholder="e.g. July Groceries, Monthly Overall"
          error={errors.name?.message as string}
          {...register('name', {
            required: 'Budget name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
          })}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Budget Type
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:outline-none"
              {...register('type', { required: 'Type is required' })}
            >
              <option value="CATEGORY">Category Budget</option>
              <option value="OVERALL">Overall Monthly</option>
            </select>
          </div>

          {selectedType === 'CATEGORY' && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:outline-none"
                {...register('categoryId', {
                  validate: (val) =>
                    selectedType !== 'CATEGORY' || !!val || 'Category selection is required',
                })}
              >
                <option value="">Select Category</option>
                {expenseCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId?.message && (
                <p className="mt-1 text-xs text-rose-500">{errors.categoryId.message as string}</p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            step="0.01"
            label="Limit Amount"
            placeholder="0.00"
            error={errors.amount?.message as string}
            {...register('amount', {
              required: 'Limit amount is required',
              validate: (val) => Number(val) > 0 || 'Limit must be a positive number',
            })}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Status
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:outline-none"
              {...register('status')}
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            label="Start Date"
            error={errors.startDate?.message as string}
            {...register('startDate', { required: 'Start date is required' })}
          />

          <Input
            type="date"
            label="End Date"
            error={errors.endDate?.message as string}
            {...register('endDate', {
              required: 'End date is required',
              validate: (val, formValues) =>
                new Date(val) >= new Date(formValues.startDate) || 'End date must be after start date',
            })}
          />
        </div>

        <Input
          label="Notes"
          placeholder="e.g. Limit grocery spend to save for vacation"
          error={errors.notes?.message as string}
          {...register('notes', {
            maxLength: { value: 200, message: 'Notes cannot exceed 200 characters' },
          })}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Save Budget' : 'Create Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
