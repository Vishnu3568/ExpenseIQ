import { Router, Request, Response } from 'express';
import prisma from '../db';
import LoggerService from '../services/LoggerService';

const router = Router();

const VERSION = '1.0.0';

// Live checks (Liveness)
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    environment: process.env.NODE_ENV || 'development',
    version: VERSION,
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
});

router.get('/live', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Ready check (Readiness: verifies database connection)
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Run a fast, lightweight query to check if DB is responsive
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'READY',
      database: 'CONNECTED',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    LoggerService.error('Readiness probe failed - Database down', err);
    res.status(503).json({
      status: 'DOWN',
      database: 'DISCONNECTED',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
