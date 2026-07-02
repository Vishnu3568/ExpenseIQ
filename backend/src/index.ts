import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Essential middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

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
