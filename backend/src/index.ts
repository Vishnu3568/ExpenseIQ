import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import transactionRoutes from './routes/transactionRoutes';
import insightRoutes from './routes/insightRoutes';
import budgetRoutes from './routes/budgetRoutes';
import reportRoutes from './routes/reportRoutes';
import intelligenceRoutes from './routes/intelligenceRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import notificationRoutes from './routes/notificationRoutes';
import activityRoutes from './routes/activityRoutes';
import auditRoutes from './routes/auditRoutes';
import healthRoutes from './routes/healthRoutes';
import swaggerRoutes from './routes/swagger';

import activityService from './services/ActivityService';
import auditService from './services/AuditService';
import notificationRuleService from './services/NotificationRuleService';

import LoggerService from './services/LoggerService';
import { apiLimiter } from './middleware/rateLimiter';
import errorMiddleware from './middleware/errorMiddleware';

// Load environment variables
dotenv.config();

// Initialize event-driven core listeners
activityService.init();
auditService.init();
notificationRuleService.init();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Structured Logging Middleware
app.use(LoggerService.requestMiddleware());

// 2. Production Security Hardening (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://validator.swagger.io"],
        connectSrc: ["'self'", "http://localhost:5000", "http://localhost:5173"],
      },
    },
    referrerPolicy: { policy: 'same-origin' },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  })
);

// 3. CORS Improvements
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or swagger)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

app.use(express.json());
app.use(cookieParser());

// 4. Global API Rate Limiter
app.use(apiLimiter);

// 5. System Health Check endpoints
app.use('/', healthRoutes);

// 6. Swagger API Documentation
app.use('/api-docs', swaggerRoutes);

// 7. Core Feature API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/audit-logs', auditRoutes);

// 8. Global Error Middleware Handler
app.use(errorMiddleware);

// Bootstrap the server
app.listen(PORT, () => {
  LoggerService.info(`[Server]: ExpenseIQ API running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;
