import { body } from 'express-validator';
import { emailValidator, passwordValidator, sanitizeText } from './sharedValidator';

export const registerValidator = [
  emailValidator('email'),
  passwordValidator('password'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long')
    .customSanitizer(sanitizeText),
  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'INR', 'JPY'])
    .withMessage('Invalid currency. Supported: USD, EUR, GBP, INR, JPY'),
];

export const loginValidator = [
  emailValidator('email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];
