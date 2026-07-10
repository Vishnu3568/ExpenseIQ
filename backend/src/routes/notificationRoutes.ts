import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import notificationService from '../services/NotificationService';

const router = Router();

// Protect all routes
router.use(requireAuth);

/**
 * GET /api/notifications
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const filters = {
      status: req.query.status as 'UNREAD' | 'READ' | 'ARCHIVED' | undefined,
      type: req.query.type as string,
      priority: req.query.priority as 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' | undefined,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
    };

    const data = await notificationService.getNotifications(userId, filters);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/notifications/unread-count
 */
router.get('/unread-count', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const data = await notificationService.getUnreadCount(userId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/notifications/:id
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const item = await notificationService.getNotificationById(req.params.id, userId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/notifications/:id/read
 */
router.patch('/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const item = await notificationService.markAsRead(req.params.id, userId);
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/notifications/:id/unread
 */
router.patch('/:id/unread', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const item = await notificationService.markAsUnread(req.params.id, userId);
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/notifications/:id/archive
 */
router.patch('/:id/archive', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const item = await notificationService.archiveNotification(req.params.id, userId);
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/notifications/mark-all-read
 */
router.post('/mark-all-read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    await notificationService.markAllRead(userId);
    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/notifications/archive-all-read
 */
router.post('/archive-all-read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    await notificationService.archiveAllRead(userId);
    return res.status(200).json({ success: true, message: 'All read notifications archived' });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/notifications/:id
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    await notificationService.deleteNotification(req.params.id, userId);
    return res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
