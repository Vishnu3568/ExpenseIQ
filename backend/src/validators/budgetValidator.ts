import { body } from 'express-validator';

export const budgetValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Budget name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('amount')
    .notEmpty()
    .withMessage('Budget amount is required')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Budget type is required')
    .isIn(['OVERALL', 'CATEGORY'])
    .withMessage('Type must be either OVERALL or CATEGORY'),
  body('categoryId')
    .optional({ nullable: true })
    .trim()
    .isUUID()
    .withMessage('Category ID must be a valid UUID'),
  body('startDate')
    .trim()
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid ISO8601 date string'),
  body('endDate')
    .trim()
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid ISO8601 date string')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error('End date must be on or after start date');
      }
      return true;
    }),
  body('status')
    .optional()
    .trim()
    .isIn(['ACTIVE', 'COMPLETED', 'ARCHIVED'])
    .withMessage('Status must be ACTIVE, COMPLETED, or ARCHIVED'),
  body('notes')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Notes cannot exceed 200 characters'),
];
