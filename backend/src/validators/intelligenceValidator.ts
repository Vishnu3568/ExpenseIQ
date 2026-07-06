import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validationMiddleware';

export const validateSearch = [
  body('searchTerm')
    .optional()
    .isString()
    .withMessage('Search term must be a string')
    .isLength({ max: 100 })
    .withMessage('Search term cannot exceed 100 characters'),
  body('queryGroup')
    .optional()
    .isObject()
    .withMessage('Query group must be a structured object'),
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page number must be a positive integer'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  body('sortBy')
    .optional()
    .isString()
    .withMessage('Sort by field name must be a string'),
  body('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc'),
  validateRequest,
];

export const validateCompare = [
  body('mode')
    .isIn([
      'MONTH_VS_MONTH',
      'YEAR_VS_YEAR',
      'CATEGORY_VS_CATEGORY',
      'INCOME_VS_EXPENSE',
      'BUDGET_VS_ACTUAL',
    ])
    .withMessage('Invalid comparison mode value'),
  body('params')
    .isObject()
    .withMessage('Comparison parameters object is required'),
  body('params.primaryPeriod.start')
    .optional()
    .isISO8601()
    .withMessage('Primary start period must be a valid ISO8601 date string'),
  body('params.primaryPeriod.end')
    .optional()
    .isISO8601()
    .withMessage('Primary end period must be a valid ISO8601 date string'),
  body('params.comparisonPeriod.start')
    .optional()
    .isISO8601()
    .withMessage('Comparison start period must be a valid ISO8601 date string'),
  body('params.comparisonPeriod.end')
    .optional()
    .isISO8601()
    .withMessage('Comparison end period must be a valid ISO8601 date string'),
  body('params.categoryIds')
    .optional()
    .isArray()
    .withMessage('Category IDs must be an array of strings'),
  body('params.categoryIds.*')
    .optional()
    .isUUID()
    .withMessage('Invalid Category ID format in list'),
  body('params.budgetId')
    .optional()
    .isUUID()
    .withMessage('Invalid Budget ID format'),
  validateRequest,
];

export const validateBulk = [
  body('ids')
    .isArray({ min: 1 })
    .withMessage('Transactions IDs must be a non-empty array of strings'),
  body('ids.*')
    .isUUID()
    .withMessage('Invalid transaction ID format in selection list'),
  body('action')
    .isIn(['DELETE', 'EXPORT', 'CATEGORY', 'ARCHIVE', 'RESTORE'])
    .withMessage('Invalid bulk action name'),
  body('categoryId')
    .optional()
    .isUUID()
    .withMessage('Invalid target Category ID format'),
  validateRequest,
];

export const validateSavedView = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Saved view name must be between 1 and 50 characters long'),
  body('filters')
    .isObject()
    .withMessage('Query filters configuration object is required'),
  body('isFavorite')
    .optional()
    .isBoolean()
    .withMessage('isFavorite must be a boolean flag'),
  validateRequest,
];

export const validateUpdateView = [
  param('id')
    .isUUID()
    .withMessage('Invalid Saved View ID parameter'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Saved view name must be between 1 and 50 characters long'),
  body('isFavorite')
    .optional()
    .isBoolean()
    .withMessage('isFavorite must be a boolean flag'),
  validateRequest,
];

export const validateDeleteView = [
  param('id')
    .isUUID()
    .withMessage('Invalid Saved View ID parameter'),
  validateRequest,
];

export const validateAddSearchHistory = [
  body('query')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query query must be between 1 and 100 characters'),
  validateRequest,
];
