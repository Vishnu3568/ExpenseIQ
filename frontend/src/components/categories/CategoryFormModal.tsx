import React, { useEffect } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ErrorAlert } from '../ui/ErrorAlert';
import { CategoryIcon } from '../ui/CategoryIcon';
import { Category, CategoryPayload } from '../../types/category';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryPayload) => Promise<void>;
  category?: Category | null;
  error?: string;
}

const PRESET_COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#06B6D4', // Cyan
  '#6B7280', // Gray
];

const PRESET_ICONS = [
  'briefcase', 'laptop', 'building', 'trending-up', 'home', 'percent', 'rotate-ccw', 'gift',
  'heart', 'wallet', 'utensils', 'shopping-cart', 'droplet', 'car', 'shopping-bag', 'gamepad',
  'plane', 'heart-pulse', 'shield', 'graduation-cap', 'zap', 'tv', 'credit-card', 'file-text',
  'sparkles', 'dog', 'users', 'coffee', 'smartphone', 'smile', 'book-open', 'activity',
  'key', 'lock', 'unlock', 'sun', 'moon', 'piggy-bank', 'scale', 'tag'
];

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  error,
}) => {
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      type: 'EXPENSE',
      color: PRESET_COLORS[0],
      icon: PRESET_ICONS[0],
      sortOrder: 0,
    },
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');
  const selectedType = watch('type');

  // Load category values when editing
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || '',
        type: category.type,
        color: category.color,
        icon: category.icon,
        sortOrder: category.sortOrder,
      });
    } else {
      reset({
        name: '',
        description: '',
        type: 'EXPENSE',
        color: PRESET_COLORS[0],
        icon: PRESET_ICONS[0],
        sortOrder: 0,
      });
    }
  }, [category, reset, isOpen]);

  const onFormSubmit = async (data: FieldValues) => {
    try {
      await onSubmit({
        name: data.name,
        description: data.description || null,
        type: data.type as 'INCOME' | 'EXPENSE',
        color: data.color,
        icon: data.icon,
        sortOrder: data.sortOrder,
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
      title={isEdit ? 'Edit Custom Category' : 'Create Custom Category'}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <ErrorAlert message={error || ''} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Category Name"
            placeholder="e.g. Subscriptions"
            error={errors.name?.message}
            {...register('name', {
              required: 'Category name is required',
              minLength: { value: 2, message: 'Must be at least 2 characters' },
              maxLength: { value: 30, message: 'Cannot exceed 30 characters' },
            })}
          />

          <div className="text-left">
            <label className="block text-sm font-medium text-foreground mb-1.5">Type</label>
            <div className="flex rounded-lg border p-1 bg-background h-10">
              <button
                type="button"
                onClick={() => setValue('type', 'EXPENSE')}
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
                onClick={() => setValue('type', 'INCOME')}
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
          <Input
            label="Sort Order"
            type="number"
            placeholder="0"
            error={errors.sortOrder?.message}
            {...register('sortOrder', {
              valueAsNumber: true,
              min: { value: 0, message: 'Must be 0 or greater' },
            })}
          />

          <Input
            label="Description (Optional)"
            placeholder="Describe this allocation category..."
            error={errors.description?.message}
            {...register('description', {
              maxLength: { value: 200, message: 'Cannot exceed 200 characters' },
            })}
          />
        </div>

        {/* 1. Presets Color Grid */}
        <div className="text-left">
          <label className="block text-sm font-medium text-foreground mb-2">Select Theme Color</label>
          <div className="flex flex-wrap gap-2.5">
            {PRESET_COLORS.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => setValue('color', hex)}
                className="h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 relative"
                style={{ backgroundColor: hex }}
              >
                {selectedColor === hex && (
                  <span className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-white shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Presets Icon Grid */}
        <div className="text-left">
          <label className="block text-sm font-medium text-foreground mb-2">Select Category Icon</label>
          <div className="grid grid-cols-8 gap-2 max-h-36 overflow-y-auto p-2 border rounded-lg bg-background/50">
            {PRESET_ICONS.map((iconName) => (
              <button
                key={iconName}
                type="button"
                onClick={() => setValue('icon', iconName)}
                className={`p-2 rounded-lg flex items-center justify-center transition-all hover:bg-secondary ${
                  selectedIcon === iconName
                    ? 'border-2 border-primary bg-primary/10 text-primary'
                    : 'text-muted-foreground'
                }`}
                title={iconName}
              >
                <CategoryIcon name={iconName} className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>

        {/* Form Actions Footer Panel */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
