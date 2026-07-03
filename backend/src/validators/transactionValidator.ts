import { body } from 'express-validator';

export const transactionValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Transaction title is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Title must be between 2 and 50 characters'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Transaction type is required')
    .isIn(['INCOME', 'EXPENSE'])
    .withMessage('Type must be either INCOME or EXPENSE'),
  body('categoryId')
    .optional({ nullable: true })
    .trim()
    .isUUID()
    .withMessage('Category ID must be a valid UUID'),
  body('date')
    .trim()
    .notEmpty()
    .withMessage('Transaction date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO8601 date string'),
  body('paymentMethod')
    .trim()
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Wallet', 'Other'])
    .withMessage('Invalid payment method selection'),
  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  body('notes')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];
