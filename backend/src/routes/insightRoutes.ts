import { Router } from 'express';
import {
  getOverview,
  getMonthlyBreakdown,
  getWeeklyBreakdown,
  getCategoryBreakdown,
  getRecent,
  getStatistics,
  getCashflow,
} from '../controllers/insightController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Apply auth security middleware globally to all insights endpoints
router.use(requireAuth);

router.get('/overview', getOverview);
router.get('/monthly', getMonthlyBreakdown);
router.get('/weekly', getWeeklyBreakdown);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/recent', getRecent);
router.get('/statistics', getStatistics);
router.get('/cashflow', getCashflow);

export default router;
