import { body } from 'express-validator';
import { validateRequest } from '../middleware/validationMiddleware';

export const validateReportRequest = [
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('type')
    .isString()
    .withMessage('Type must be a string')
    .isIn([
      'MONTHLY',
      'WEEKLY',
      'YEARLY',
      'CUSTOM',
      'INCOME',
      'EXPENSE',
      'CATEGORY',
      'BUDGET_PERFORMANCE',
      'CASH_FLOW',
      'EXECUTIVE_SUMMARY',
    ])
    .withMessage('Invalid report type'),
  body('template')
    .optional()
    .isString()
    .isIn(['professional', 'minimal', 'executive'])
    .withMessage('Invalid template type'),
  body('filters')
    .optional()
    .isObject()
    .withMessage('Filters must be an object'),
  body('filters.startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO8601 date'),
  body('filters.endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO8601 date')
    .custom((value, { req }) => {
      const startDate = req.body?.filters?.startDate;
      if (startDate && new Date(value) < new Date(startDate)) {
        throw new Error('End date must be after or equal to start date');
      }
      return true;
    }),
  body('filters.categoryIds')
    .optional()
    .isArray()
    .withMessage('Category IDs must be an array of strings'),
  body('filters.categoryIds.*')
    .optional()
    .isUUID()
    .withMessage('Invalid category ID format'),
  body('filters.types')
    .optional()
    .isArray()
    .withMessage('Types must be an array'),
  body('filters.types.*')
    .optional()
    .isIn(['INCOME', 'EXPENSE'])
    .withMessage('Invalid transaction type filter'),
  body('filters.paymentMethods')
    .optional()
    .isArray()
    .withMessage('Payment methods must be an array of strings'),
  body('filters.minAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum amount must be a positive number'),
  body('filters.maxAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum amount must be a positive number')
    .custom((value, { req }) => {
      const minAmount = req.body?.filters?.minAmount;
      if (minAmount && Number(value) < Number(minAmount)) {
        throw new Error('Maximum amount must be greater than or equal to minimum amount');
      }
      return true;
    }),
  body('filters.budgetId')
    .optional()
    .isUUID()
    .withMessage('Invalid budget ID format'),
  validateRequest,
];
