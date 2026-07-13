/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import LoggerService from '../services/LoggerService';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If the headers have already been sent, delegate to the default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred.';
  let details = err.details || undefined;

  // Handle Prisma Database Errors
  if (err.code && err.code.startsWith('P')) {
    LoggerService.error(`Database Error: ${err.message}`, err, { code: err.code });
    statusCode = 400;
    errorCode = 'DATABASE_ERROR';
    message = 'A database error occurred while processing the request.';
    if (process.env.NODE_ENV !== 'production') {
      details = { prismaCode: err.code, prismaMessage: err.message };
    }
  } else if (statusCode === 500) {
    // Log unexpected errors
    LoggerService.error(`Unhandled Exception: ${err.message}`, err, {
      path: req.originalUrl,
      method: req.method,
    });
    if (process.env.NODE_ENV === 'production') {
      message = 'An unexpected error occurred.';
    }
  } else {
    // Log application errors (like validation, 404s, auth failures)
    LoggerService.warn(`AppError (${errorCode}): ${message}`, {
      path: req.originalUrl,
      method: req.method,
      statusCode,
      details,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: errorCode,
      ...(details ? { details } : {}),
      ...(process.env.NODE_ENV !== 'production' && statusCode === 500 ? { stack: err.stack } : {}),
    },
  });
};

export default errorMiddleware;
