import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { validateReportRequest } from '../validators/reportValidator';
import {
  generatePreview,
  saveReport,
  getReportsHistory,
  getReportDetails,
  exportReportFile,
  deleteReport,
} from '../controllers/reportController';
import { exportLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply auth lock on all reports endpoints
router.use(requireAuth);

router.post('/preview', validateReportRequest, generatePreview);
router.post('/', validateReportRequest, saveReport);
router.get('/', getReportsHistory);
router.get('/:id', getReportDetails);
router.get('/:id/export/:format', exportLimiter, exportReportFile);
router.delete('/:id', deleteReport);

export default router;
