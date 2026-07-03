import { Router } from 'express';
import {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetsOverview,
  getBudgetsProgress,
} from '../controllers/budgetController';
import { budgetValidator } from '../validators/budgetValidator';
import { validateRequest } from '../middleware/validationMiddleware';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Apply auth security middleware globally to all budget endpoints
router.use(requireAuth);

router.get('/', getBudgets);
router.get('/overview', getBudgetsOverview);
router.get('/progress', getBudgetsProgress);
router.get('/:id', getBudgetById);
router.post('/', budgetValidator, validateRequest, createBudget);
router.put('/:id', budgetValidator, validateRequest, updateBudget);
router.delete('/:id', deleteBudget);

export default router;
