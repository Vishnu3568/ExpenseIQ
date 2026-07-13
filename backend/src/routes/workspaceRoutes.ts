import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import {
  getProfile,
  updateProfile,
  updatePassword,
  getPreferences,
  updatePreferences,
  getTheme,
  updateTheme,
  getDashboard,
  updateDashboard,
  getExport,
  updateExport,
  getNotifications,
  updateNotifications,
  getSecurity,
  deleteAccount,
  purgeTransactions,
  resetDemoData,
  exportPersonalData,
} from '../controllers/workspaceController';
import {
  updateProfileValidator,
  updatePasswordValidator,
  updatePreferencesValidator,
  updateThemeValidator,
  updateDashboardValidator,
  updateExportValidator,
  updateNotificationsValidator,
} from '../validators/workspaceValidator';
import { passwordLimiter, exportLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply auth middleware globally to settings routes
router.use(requireAuth);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidator, validateRequest, updateProfile);

// Password
router.put('/password', passwordLimiter, updatePasswordValidator, validateRequest, updatePassword);

// Preferences
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferencesValidator, validateRequest, updatePreferences);

// Theme
router.get('/theme', getTheme);
router.put('/theme', updateThemeValidator, validateRequest, updateTheme);

// Dashboard preferences
router.get('/dashboard', getDashboard);
router.put('/dashboard', updateDashboardValidator, validateRequest, updateDashboard);

// Export preferences
router.get('/export', getExport);
router.put('/export', updateExportValidator, validateRequest, updateExport);

// Notification preferences
router.get('/notifications', getNotifications);
router.put('/notifications', updateNotificationsValidator, validateRequest, updateNotifications);

// Security info
router.get('/security', getSecurity);

// Data & account operations
router.delete('/account', deleteAccount);
router.delete('/data/transactions', purgeTransactions);
router.post('/data/reset-demo', resetDemoData);
router.get('/data/export', exportLimiter, exportPersonalData);

export default router;
