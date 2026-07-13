/* eslint-disable @typescript-eslint/no-explicit-any */
import { body } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

// 1. Reusable Email Validator
export const emailValidator = (fieldName: string = 'email') =>
  body(fieldName)
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail();

// 2. Reusable Password Complexity Validator
export const passwordValidator = (fieldName: string = 'password') =>
  body(fieldName)
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

// 3. Custom HTML Sanitization function to strip all HTML tags
export const sanitizeText = (value: any) => {
  if (typeof value !== 'string') return value;
  return sanitizeHtml(value, {
    allowedTags: [], // Strip all HTML tags
    allowedAttributes: {}, // Strip all attributes
  });
};
