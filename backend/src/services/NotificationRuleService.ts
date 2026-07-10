import prisma from '../db';
import { domainEventService } from './DomainEventService';
import { notificationService } from './NotificationService';
import { budgetService } from './budgetService';

export const notificationRuleService = {
  init() {
    // 1. Transaction event hooks
    domainEventService.subscribe('TRANSACTION_CREATED', async (payload) => {
      await this.checkLargeTransactionRule(payload);
      await this.checkBudgetRules(payload.userId);
    });

    domainEventService.subscribe('TRANSACTION_UPDATED', async (payload) => {
      await this.checkLargeTransactionRule(payload);
      await this.checkBudgetRules(payload.userId);
    });

    domainEventService.subscribe('TRANSACTION_DELETED', async (payload) => {
      await this.checkBudgetRules(payload.userId);
    });

    // 2. Budget event hooks
    domainEventService.subscribe('BUDGET_CREATED', async (payload) => {
      await this.checkBudgetRules(payload.userId);
    });

    domainEventService.subscribe('BUDGET_UPDATED', async (payload) => {
      await this.checkBudgetRules(payload.userId);
    });

    // 3. Security event hooks
    domainEventService.subscribe('PASSWORD_CHANGED', async (payload) => {
      await this.triggerSecurityAlert(payload.userId, 'PASSWORD_CHANGED', 'Your security password was changed successfully.');
    });

    domainEventService.subscribe('EMAIL_CHANGED', async (payload) => {
      await this.triggerSecurityAlert(
        payload.userId,
        'EMAIL_CHANGED',
        `Your security email was changed from ${payload.oldEmail} to ${payload.newEmail}.`
      );
    });

    domainEventService.subscribe('PERSONAL_DATA_EXPORTED', async (payload) => {
      await this.triggerSecurityAlert(payload.userId, 'PERSONAL_DATA_EXPORTED', 'Your account data backup was exported successfully.');
    });

    // 4. Report event hooks
    domainEventService.subscribe('REPORT_GENERATED', async (payload) => {
      await this.triggerReportNotification(payload.userId, payload.reportId, payload.name, payload.type);
    });
  },

  /**
   * Helper to retrieve notification preferences from user Workspace settings
   */
  async getPreferences(userId: string) {
    const workspace = await prisma.workspace.findUnique({
      where: { userId },
    });
    if (!workspace || !workspace.notificationPreferences) {
      return {
        budgetAlerts: true,
        weeklySummary: true,
        monthlySummary: true,
        securityAlerts: true,
        productAnnouncements: false,
        emailNotifications: true,
        pushNotifications: false,
      };
    }
    const prefs = (workspace.notificationPreferences || {}) as unknown as Record<string, boolean>;
    return {
      budgetAlerts: prefs.budgetAlerts ?? true,
      weeklySummary: prefs.weeklySummary ?? true,
      monthlySummary: prefs.monthlySummary ?? true,
      securityAlerts: prefs.securityAlerts ?? true,
      productAnnouncements: prefs.productAnnouncements ?? false,
      emailNotifications: prefs.emailNotifications ?? true,
      pushNotifications: prefs.pushNotifications ?? false,
    };
  },

  /**
   * Rule: Budget Warning & Exceeded
   */
  async checkBudgetRules(userId: string) {
    try {
      const prefs = await this.getPreferences(userId);
      if (!prefs.budgetAlerts) {
        return; // Alerts disabled by workspace settings
      }

      // Fetch user's active budgets
      const budgets = await prisma.budget.findMany({
        where: { userId, status: 'ACTIVE' },
      });

      for (const budget of budgets) {
        const progress = await budgetService.calculateBudgetProgress(budget);
        const utilization = progress.budgetUtilization;
        const currency = progress.currency || 'USD';
        const spent = progress.amountSpent;
        const limit = Number(progress.amount);

        if (utilization >= 100) {
          // Exceeded rule
          const existingExceeded = await prisma.notification.findFirst({
            where: {
              userId,
              type: 'BUDGET_EXCEEDED',
              entityType: 'Budget',
              entityId: budget.id,
            },
          });

          if (!existingExceeded) {
            await notificationService.createNotification({
              userId,
              type: 'BUDGET_EXCEEDED',
              title: 'Budget Limit Exceeded!',
              message: `Budget "${budget.name}" has exceeded its limit of ${currency} ${limit.toFixed(2)}. Total spend: ${currency} ${spent.toFixed(2)}`,
              priority: 'CRITICAL',
              source: 'BUDGET',
              entityType: 'Budget',
              entityId: budget.id,
              actionUrl: `/budgets`,
              metadata: { budgetId: budget.id, name: budget.name, spent, limit, utilization },
            });
          }
        } else if (utilization >= 80) {
          // Warning rule
          const existingWarning = await prisma.notification.findFirst({
            where: {
              userId,
              type: 'BUDGET_WARNING',
              entityType: 'Budget',
              entityId: budget.id,
            },
          });

          if (!existingWarning) {
            await notificationService.createNotification({
              userId,
              type: 'BUDGET_WARNING',
              title: 'Budget Alert Threshold Reached',
              message: `Budget "${budget.name}" is at ${utilization.toFixed(0)}% utilization. Spend: ${currency} ${spent.toFixed(2)} / ${currency} ${limit.toFixed(2)}`,
              priority: 'HIGH',
              source: 'BUDGET',
              entityType: 'Budget',
              entityId: budget.id,
              actionUrl: `/budgets`,
              metadata: { budgetId: budget.id, name: budget.name, spent, limit, utilization },
            });
          }
        }
      }
    } catch (err) {
      console.error('[NotificationRuleService]: Error in budget rule check:', err);
    }
  },

  /**
   * Rule: Large Transaction Warning
   */
  async checkLargeTransactionRule(payload: {
    userId: string;
    transactionId: string;
    amount: number;
    currency: string;
    title: string;
  }) {
    try {
      const threshold = 10000; // Default application limit
      if (payload.amount >= threshold) {
        await notificationService.createNotification({
          userId: payload.userId,
          type: 'LARGE_TRANSACTION',
          title: 'Large Transaction Logged',
          message: `A large transaction of ${payload.currency} ${payload.amount.toFixed(2)} was logged: "${payload.title}"`,
          priority: 'NORMAL',
          source: 'TRANSACTION',
          entityType: 'Transaction',
          entityId: payload.transactionId,
          actionUrl: `/transactions`,
          metadata: payload,
        });
      }
    } catch (err) {
      console.error('[NotificationRuleService]: Error in large transaction rule check:', err);
    }
  },

  /**
   * Rule: Security Events notifications
   */
  async triggerSecurityAlert(userId: string, type: string, message: string) {
    try {
      const prefs = await this.getPreferences(userId);
      if (!prefs.securityAlerts) {
        return; // Notifications disabled, but audit logging still runs in AuditService
      }

      await notificationService.createNotification({
        userId,
        type: 'SECURITY_ALERT',
        title: 'Security Alert Warning',
        message: `${message} If you did not authorize this, review settings immediately.`,
        priority: 'HIGH',
        source: 'SYSTEM',
        actionUrl: `/settings`,
        metadata: { eventType: type },
      });
    } catch (err) {
      console.error('[NotificationRuleService]: Error logging security alert notification:', err);
    }
  },

  /**
   * Rule: Report Generated notifications
   */
  async triggerReportNotification(userId: string, reportId: string, name: string, type: string) {
    try {
      await notificationService.createNotification({
        userId,
        type: 'REPORT_GENERATED',
        title: 'Financial Report Compiled',
        message: `Your ${type} report "${name}" has been generated successfully.`,
        priority: 'LOW',
        source: 'REPORT',
        entityType: 'Report',
        entityId: reportId,
        actionUrl: `/reports`,
        metadata: { reportId, name, type },
      });
    } catch (err) {
      console.error('[NotificationRuleService]: Error logging report notification:', err);
    }
  },
};

export default notificationRuleService;
