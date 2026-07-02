import { body } from 'express-validator';

export const categoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('Category name must be between 2 and 30 characters'),
  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Category type is required')
    .isIn(['INCOME', 'EXPENSE'])
    .withMessage('Category type must be either INCOME or EXPENSE'),
  body('color')
    .trim()
    .notEmpty()
    .withMessage('Color is required')
    .matches(/^#[0-9a-fA-F]{6}$/)
    .withMessage('Color must be a valid 6-digit hex code starting with #'),
  body('icon')
    .trim()
    .notEmpty()
    .withMessage('Icon is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('Icon name must be between 2 and 30 characters'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer')
    .toInt(),
];
