import { Router } from 'express';
import { register, login, me, refresh, logout } from '../controllers/authController';
import { registerValidator, loginValidator } from '../validators/authValidator';
import { validateRequest } from '../middleware/validationMiddleware';
import { requireAuth } from '../middleware/authMiddleware';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', registerLimiter, registerValidator, validateRequest, register);
router.post('/login', loginLimiter, loginValidator, validateRequest, login);
router.get('/me', requireAuth, me);
router.post('/refresh', loginLimiter, refresh); // Apply loginLimiter on refresh to prevent spam
router.post('/logout', logout);

export default router;
