import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import activityService from '../services/ActivityService';

const router = Router();

// Protect all routes
router.use(requireAuth);

/**
 * GET /api/activity
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const filters = {
      module: req.query.module as string,
      eventType: req.query.eventType as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    };

    const data = await activityService.getActivities(userId, filters);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/activity/:id
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const item = await activityService.getActivityById(req.params.id, userId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Activity event not found' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

export default router;
