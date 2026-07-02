import { Router } from 'express';
import { register, login, me, refresh, logout } from '../controllers/authController';
import { registerValidator, loginValidator } from '../validators/authValidator';
import { validateRequest } from '../middleware/validationMiddleware';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.get('/me', requireAuth, me);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
