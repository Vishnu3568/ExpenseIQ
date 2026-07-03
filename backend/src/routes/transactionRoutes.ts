import { Router } from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController';
import { transactionValidator } from '../validators/transactionValidator';
import { validateRequest } from '../middleware/validationMiddleware';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Apply auth security middleware globally to all transaction endpoints
router.use(requireAuth);

router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.post('/', transactionValidator, validateRequest, createTransaction);
router.put('/:id', transactionValidator, validateRequest, updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
