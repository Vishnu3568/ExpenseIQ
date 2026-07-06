import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import {
  validateSearch,
  validateCompare,
  validateBulk,
  validateSavedView,
  validateUpdateView,
  validateDeleteView,
} from '../validators/intelligenceValidator';
import {
  searchTransactions,
  compareMetrics,
  performBulkOperations,
  saveView,
  getSavedViews,
  updateSavedView,
  deleteSavedView,
  getSearchHistory,
  clearSearchHistory,
  getSearchSuggestions,
} from '../controllers/intelligenceController';

const router = Router();

// Secure all endpoints with user session auth lock
router.use(requireAuth);

router.post('/search', validateSearch, searchTransactions);
router.post('/compare', validateCompare, compareMetrics);
router.post('/bulk', validateBulk, performBulkOperations);

router.post('/views', validateSavedView, saveView);
router.get('/views', getSavedViews);
router.patch('/views/:id', validateUpdateView, updateSavedView);
router.delete('/views/:id', validateDeleteView, deleteSavedView);

router.get('/history', getSearchHistory);
router.delete('/history', clearSearchHistory);
router.get('/suggestions', getSearchSuggestions);

export default router;
