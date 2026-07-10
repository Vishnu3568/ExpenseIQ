import express, { Request, Response, NextFunction } from 'express';
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

import activityService from './services/ActivityService';
import auditService from './services/AuditService';
import notificationRuleService from './services/NotificationRuleService';

// Load environment variables
dotenv.config();

// Initialize event-driven core listeners
activityService.init();
auditService.init();
notificationRuleService.init();

const app = express();
const PORT = process.env.PORT || 5000;

// Essential middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Register API Routes
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

// Health status verification endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global fallback error middleware handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Error System]:', err.message);
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR'
    }
  });
});

// Bootstrap the server
app.listen(PORT, () => {
  console.log(`[Server]: ExpenseIQ API running on http://localhost:${PORT}`);
});
export default app;
