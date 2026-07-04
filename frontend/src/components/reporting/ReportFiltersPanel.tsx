import React from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { FileText, Settings, Calendar, DollarSign, Palette } from 'lucide-react';
import { Category } from '../../types/category';
import { Budget } from '../../types/budget';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ReportFilter } from '../../types/report';

interface ReportFiltersPanelProps {
  categories: Category[];
  budgets: Budget[];
  onSubmit: (data: {
    name: string;
    type: string;
    template: string;
    filters: ReportFilter;
  }) => void;
  isLoading: boolean;
}

export const ReportFiltersPanel: React.FC<ReportFiltersPanelProps> = ({
  categories,
  budgets,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      type: 'MONTHLY',
      template: 'professional',
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      transactionType: 'ALL',
      paymentMethod: '',
      minAmount: '',
      maxAmount: '',
      categoryId: '',
      budgetId: '',
    },
  });

  const selectedType = watch('type');

  const onFormSubmit = (values: FieldValues) => {
    const filters: ReportFilter = {};

    if (values.startDate) filters.startDate = new Date(values.startDate).toISOString();
    if (values.endDate) filters.endDate = new Date(values.endDate).toISOString();

    if (values.transactionType === 'INCOME') {
      filters.types = ['INCOME'];
    } else if (values.transactionType === 'EXPENSE') {
      filters.types = ['EXPENSE'];
    }

    if (values.paymentMethod) {
      filters.paymentMethods = [values.paymentMethod];
    }

    if (values.minAmount) filters.minAmount = Number(values.minAmount);
    if (values.maxAmount) filters.maxAmount = Number(values.maxAmount);

    if (values.categoryId) {
      filters.categoryIds = [values.categoryId];
    }

    if (values.budgetId) {
      filters.budgetId = values.budgetId;
    }

    // Auto-generate name if empty
    const reportTypeLabel = selectedType.charAt(0) + selectedType.slice(1).toLowerCase().replace(/_/g, ' ');
    const reportName = values.name.trim() || `${reportTypeLabel} Report - ${new Date().toLocaleDateString()}`;

    onSubmit({
      name: reportName,
      type: values.type,
      template: values.template,
      filters,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-6 shrink-0"
    >
      <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-800/50 pb-3">
        <Settings className="h-5 w-5 text-indigo-500" />
        <h2 className="text-sm font-bold text-slate-800 dark:text-white">Report Configuration</h2>
      </div>

      {/* Report Name & Type */}
      <div className="space-y-4">
        <Input
          label="Report Title"
          placeholder="e.g. Q3 Spending Analysis"
          error={errors.name?.message as string}
          {...register('name', {
            maxLength: { value: 50, message: 'Title cannot exceed 50 characters' },
          })}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Report Type
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:outline-none"
            {...register('type')}
          >
            <option value="MONTHLY">Monthly Financial Report</option>
            <option value="WEEKLY">Weekly Financial Report</option>
            <option value="YEARLY">Yearly Financial Report</option>
            <option value="CUSTOM">Custom Date Range Report</option>
            <option value="INCOME">Income Report</option>
            <option value="EXPENSE">Expense Report</option>
            <option value="CATEGORY">Category Distribution Report</option>
            <option value="BUDGET_PERFORMANCE">Budget Performance Report</option>
            <option value="CASH_FLOW">Cash Flow Statement</option>
            <option value="EXECUTIVE_SUMMARY">Executive Summary Report</option>
          </select>
        </div>
      </div>

      {/* Date Range filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Calendar className="h-4 w-4 text-indigo-400" />
          <span>Report Timing Range</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="date"
            label="Start Date"
            error={errors.startDate?.message as string}
            {...register('startDate')}
          />
          <Input
            type="date"
            label="End Date"
            error={errors.endDate?.message as string}
            {...register('endDate', {
              validate: (val, formValues) =>
                !val ||
                !formValues.startDate ||
                new Date(val) >= new Date(formValues.startDate) ||
                'Must be after start date',
            })}
          />
        </div>
      </div>

      {/* Filter Parameters details */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <DollarSign className="h-4 w-4 text-indigo-400" />
          <span>Granular Filters</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Type Filter
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-white focus:border-indigo-500 focus:outline-none"
              {...register('transactionType')}
            >
              <option value="ALL">All Types</option>
              <option value="INCOME">Income Only</option>
              <option value="EXPENSE">Expense Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Payment Method
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-white focus:border-indigo-500 focus:outline-none"
              {...register('paymentMethod')}
            >
              <option value="">All Methods</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Credit/Debit Card</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            step="0.01"
            label="Min Amount"
            placeholder="0.00"
            {...register('minAmount')}
          />
          <Input
            type="number"
            step="0.01"
            label="Max Amount"
            placeholder="0.00"
            {...register('maxAmount', {
              validate: (val, formValues) =>
                !val ||
                !formValues.minAmount ||
                Number(val) >= Number(formValues.minAmount) ||
                'Must be >= min',
            })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Target Category
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-white focus:border-indigo-500 focus:outline-none"
            {...register('categoryId')}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.type})
              </option>
            ))}
          </select>
        </div>

        {selectedType === 'BUDGET_PERFORMANCE' && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Filter by Budget
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-white focus:border-indigo-500 focus:outline-none"
              {...register('budgetId')}
            >
              <option value="">All Budgets</option>
              {budgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Template Color Scheme selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Palette className="h-4 w-4 text-indigo-400" />
          <span>Styling Template</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {['professional', 'minimal', 'executive'].map((t) => (
            <label
              key={t}
              className="flex flex-col items-center justify-center p-2 border border-slate-200 dark:border-slate-850 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 text-center transition-all select-none"
            >
              <input
                type="radio"
                value={t}
                className="sr-only"
                {...register('template')}
              />
              <span className="text-[11px] font-semibold text-slate-750 dark:text-slate-200 uppercase tracking-wider">
                {t}
              </span>
              <span
                className={`mt-1.5 h-3.5 w-3.5 rounded-full border border-slate-300 ${
                  t === 'professional'
                    ? 'bg-indigo-600'
                    : t === 'minimal'
                      ? 'bg-slate-800'
                      : 'bg-slate-950'
                }`}
              />
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center gap-2">
        <FileText className="h-4 w-4" />
        <span>Generate Preview</span>
      </Button>
    </form>
  );
};
