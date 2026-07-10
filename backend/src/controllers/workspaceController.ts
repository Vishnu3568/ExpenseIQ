import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../db';
import WorkspaceService from '../services/WorkspaceService';
import { domainEventService } from '../services/DomainEventService';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    currency: string;
  };
}

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const profile = await WorkspaceService.getProfile(userId);
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Failed to load profile' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userBefore = await prisma.user.findUnique({ where: { id: userId } });
    const updated = await WorkspaceService.updateProfile(userId, req.body);
    
    if (userBefore) {
      const updatedFields: string[] = [];
      if (req.body.name && req.body.name !== userBefore.name) updatedFields.push('name');
      
      if (req.body.email && req.body.email !== userBefore.email) {
        domainEventService.publish('EMAIL_CHANGED', {
          userId,
          oldEmail: userBefore.email,
          newEmail: req.body.email,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
        });
      }
      
      if (updatedFields.length > 0 || req.body.bio !== undefined || req.body.phoneNumber !== undefined) {
        domainEventService.publish('PROFILE_UPDATED', {
          userId,
          updatedFields: updatedFields.length > 0 ? updatedFields : ['profile_details'],
        });
      }
    }

    res.json({ success: true, message: 'Profile updated successfully', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: (err as Error).message || 'Failed to update profile' });
  }
};

export const updatePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await WorkspaceService.updatePassword(userId, newPasswordHash);
    domainEventService.publish('PASSWORD_CHANGED', {
      userId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Failed to update password' });
  }
};

export const getPreferences = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const prefs = await WorkspaceService.getPreferences(userId);
    res.json({ success: true, data: prefs });
  } catch (err) {
    res.status(550).json({ success: false, message: (err as Error).message || 'Failed to fetch preferences' });
  }
};

export const updatePreferences = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const updated = await WorkspaceService.updatePreferences(userId, req.body);
    domainEventService.publish('WORKSPACE_PREFERENCES_UPDATED', {
      userId,
      preferences: req.body,
    });
    res.json({ success: true, message: 'Preferences updated successfully', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: (err as Error).message || 'Failed to update preferences' });
  }
};

export const getTheme = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const theme = await WorkspaceService.getTheme(userId);
    res.json({ success: true, data: theme });
  } catch (err) {
    res.status(550).json({ success: false, message: (err as Error).message || 'Failed to fetch theme' });
  }
};

export const updateTheme = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const updated = await WorkspaceService.updateTheme(userId, req.body.theme);
    res.json({ success: true, message: 'Theme updated successfully', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: (err as Error).message || 'Failed to update theme' });
  }
};

export const getDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const dashboard = await WorkspaceService.getDashboard(userId);
    res.json({ success: true, data: dashboard });
  } catch (err) {
    res.status(550).json({ success: false, message: (err as Error).message || 'Failed to fetch dashboard preferences' });
  }
};

export const updateDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const updated = await WorkspaceService.updateDashboard(userId, req.body);
    res.json({ success: true, message: 'Dashboard preferences updated successfully', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: (err as Error).message || 'Failed to update dashboard preferences' });
  }
};

export const getExport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const exportPrefs = await WorkspaceService.getExport(userId);
    res.json({ success: true, data: exportPrefs });
  } catch (err) {
    res.status(550).json({ success: false, message: (err as Error).message || 'Failed to fetch export preferences' });
  }
};

export const updateExport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const updated = await WorkspaceService.updateExport(userId, req.body);
    res.json({ success: true, message: 'Export preferences updated successfully', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: (err as Error).message || 'Failed to update export preferences' });
  }
};

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const notifications = await WorkspaceService.getNotifications(userId);
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(550).json({ success: false, message: (err as Error).message || 'Failed to fetch notification preferences' });
  }
};

export const updateNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const updated = await WorkspaceService.updateNotifications(userId, req.body);
    res.json({ success: true, message: 'Notification preferences updated successfully', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: (err as Error).message || 'Failed to update notification preferences' });
  }
};

export const getSecurity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const security = await WorkspaceService.getSecurity(userId);
    res.json({ success: true, data: security });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Failed to fetch security settings' });
  }
};

export const deleteAccount = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    await WorkspaceService.deleteAccount(userId);
    res.clearCookie('token');
    res.json({ success: true, message: 'Account permanently deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Failed to delete account' });
  }
};

export const purgeTransactions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const count = await prisma.transaction.count({ where: { userId } });
    await WorkspaceService.purgeTransactions(userId);
    domainEventService.publish('ALL_TRANSACTIONS_DELETED', {
      userId,
      count,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });
    res.json({ success: true, message: 'All transactions successfully deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Failed to purge transactions' });
  }
};

export const resetDemoData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    await WorkspaceService.resetDemoData(userId);
    domainEventService.publish('DEMO_DATA_RESET', {
      userId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });
    res.json({ success: true, message: 'Demo data successfully reset' });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Failed to reset demo data' });
  }
};

export const exportPersonalData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = await WorkspaceService.exportPersonalData(userId);
    domainEventService.publish('PERSONAL_DATA_EXPORTED', {
      userId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });
    res.setHeader('Content-disposition', `attachment; filename=expenseiq_backup_${userId}.json`);
    res.setHeader('Content-type', 'application/json');
    res.send(JSON.stringify(data, null, 2));
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Failed to export personal data' });
  }
};
