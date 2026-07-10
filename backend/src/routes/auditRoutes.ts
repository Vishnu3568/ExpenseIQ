import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import auditService from '../services/AuditService';

const router = Router();

// Protect all routes
router.use(requireAuth);

/**
 * GET /api/audit-logs
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const filters = {
      module: req.query.module as string,
      action: req.query.action as string,
      outcome: req.query.outcome as 'SUCCESS' | 'FAILURE' | undefined,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    };

    const data = await auditService.getAuditLogs(userId, filters);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/audit-logs/:id
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const item = await auditService.getAuditLogById(req.params.id, userId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Audit log record not found' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

export default router;
