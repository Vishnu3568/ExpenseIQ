import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';

/**
 * Middleware that intercept requests to run express-validator checks,
 * returning structured validation errors on failure.
 */
export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err: ValidationError) => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg,
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }
  
  next();
}
