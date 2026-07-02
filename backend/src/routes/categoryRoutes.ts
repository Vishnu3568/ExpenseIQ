import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  archiveCategory,
  restoreCategory,
} from '../controllers/categoryController';
import { categoryValidator } from '../validators/categoryValidator';
import { validateRequest } from '../middleware/validationMiddleware';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Apply auth security middleware globally to all category endpoints
router.use(requireAuth);

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', categoryValidator, validateRequest, createCategory);
router.put('/:id', categoryValidator, validateRequest, updateCategory);
router.delete('/:id', deleteCategory);
router.patch('/:id/archive', archiveCategory);
router.patch('/:id/restore', restoreCategory);

export default router;
