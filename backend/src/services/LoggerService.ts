/* eslint-disable @typescript-eslint/no-explicit-any */
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SECURITY';

export class LoggerService {
  private static formatLog(level: LogLevel, message: string, meta?: Record<string, any>): string {
    const logData = {
      timestamp: new Date().toISOString(),
      level,
      message,
      environment: process.env.NODE_ENV || 'development',
      ...meta,
    };

    if (process.env.NODE_ENV === 'production') {
      return JSON.stringify(logData);
    }

    // Clean colored format for local development
    const colorMap = {
      INFO: '\x1b[32m', // Green
      WARN: '\x1b[33m', // Yellow
      ERROR: '\x1b[31m', // Red
      SECURITY: '\x1b[35m', // Magenta
    };
    const reset = '\x1b[0m';
    const color = colorMap[level] || reset;
    const metaStr = meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${logData.timestamp}] ${color}${level}${reset}: ${message}${metaStr}`;
  }

  public static info(message: string, meta?: Record<string, any>): void {
    console.log(this.formatLog('INFO', message, meta));
  }

  public static warn(message: string, meta?: Record<string, any>): void {
    console.warn(this.formatLog('WARN', message, meta));
  }

  public static error(message: string, error?: unknown, meta?: Record<string, any>): void {
    const errorDetails: Record<string, any> = {};
    if (error instanceof Error) {
      errorDetails.errorMsg = error.message;
      errorDetails.stack = error.stack;
    } else if (error) {
      errorDetails.errorObj = error;
    }
    console.error(this.formatLog('ERROR', message, { ...errorDetails, ...meta }));
  }

  public static security(message: string, meta?: Record<string, any>): void {
    console.warn(this.formatLog('SECURITY', message, meta));
  }

  public static requestMiddleware() {
    return (req: any, res: any, next: () => void) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        const logMsg = `${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`;
        const meta = {
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          ip: req.ip || req.headers['x-forwarded-for'],
          userAgent: req.headers['user-agent'],
          durationMs: duration,
        };

        if (res.statusCode >= 500) {
          LoggerService.error(logMsg, null, meta);
        } else if (res.statusCode >= 400) {
          LoggerService.warn(logMsg, meta);
        } else {
          LoggerService.info(logMsg, meta);
        }
      });
      next();
    };
  }
}

export default LoggerService;
