import { EventEmitter } from 'events';
import LoggerService from './LoggerService';

export type DomainEventType =
  | 'AUTH_LOGIN_SUCCEEDED'
  | 'AUTH_LOGIN_FAILED'
  | 'AUTH_LOGOUT'
  | 'PASSWORD_CHANGED'
  | 'PROFILE_UPDATED'
  | 'EMAIL_CHANGED'
  | 'WORKSPACE_PREFERENCES_UPDATED'
  | 'TRANSACTION_CREATED'
  | 'TRANSACTION_UPDATED'
  | 'TRANSACTION_DELETED'
  | 'TRANSACTIONS_BULK_UPDATED'
  | 'TRANSACTIONS_BULK_DELETED'
  | 'CATEGORY_CREATED'
  | 'CATEGORY_UPDATED'
  | 'CATEGORY_ARCHIVED'
  | 'CATEGORY_RESTORED'
  | 'BUDGET_CREATED'
  | 'BUDGET_UPDATED'
  | 'BUDGET_DELETED'
  | 'BUDGET_WARNING_REACHED'
  | 'BUDGET_EXCEEDED'
  | 'REPORT_GENERATED'
  | 'REPORT_EXPORTED'
  | 'REPORT_DELETED'
  | 'SAVED_VIEW_CREATED'
  | 'SAVED_VIEW_UPDATED'
  | 'SAVED_VIEW_DELETED'
  | 'PERSONAL_DATA_EXPORTED'
  | 'ALL_TRANSACTIONS_DELETED'
  | 'DEMO_DATA_RESET';

export interface DomainEventPayloadMap {
  AUTH_LOGIN_SUCCEEDED: { userId: string; ipAddress?: string; userAgent?: string };
  AUTH_LOGIN_FAILED: { email: string; ipAddress?: string; userAgent?: string; reason?: string };
  AUTH_LOGOUT: { userId: string; ipAddress?: string; userAgent?: string };
  PASSWORD_CHANGED: { userId: string; ipAddress?: string; userAgent?: string };
  PROFILE_UPDATED: { userId: string; updatedFields: string[] };
  EMAIL_CHANGED: { userId: string; oldEmail: string; newEmail: string; ipAddress?: string; userAgent?: string };
  WORKSPACE_PREFERENCES_UPDATED: { userId: string; preferences: Record<string, unknown> };
  TRANSACTION_CREATED: {
    userId: string;
    transactionId: string;
    amount: number;
    currency: string;
    categoryId?: string | null;
    date: Date;
    title: string;
  };
  TRANSACTION_UPDATED: {
    userId: string;
    transactionId: string;
    amount: number;
    oldAmount: number;
    currency: string;
    categoryId?: string | null;
    date: Date;
    title: string;
  };
  TRANSACTION_DELETED: {
    userId: string;
    transactionId: string;
    amount: number;
    currency: string;
    categoryId?: string | null;
    date: Date;
    title: string;
  };
  TRANSACTIONS_BULK_UPDATED: { userId: string; transactionIds: string[]; count: number };
  TRANSACTIONS_BULK_DELETED: { userId: string; transactionIds: string[]; count: number };
  CATEGORY_CREATED: { userId: string | null; categoryId: string; name: string; type: string };
  CATEGORY_UPDATED: { userId: string | null; categoryId: string; name: string };
  CATEGORY_ARCHIVED: { userId: string | null; categoryId: string; name: string };
  CATEGORY_RESTORED: { userId: string | null; categoryId: string; name: string };
  BUDGET_CREATED: { userId: string; budgetId: string; name: string; amount: number; categoryId?: string | null };
  BUDGET_UPDATED: { userId: string; budgetId: string; name: string; amount: number; categoryId?: string | null };
  BUDGET_DELETED: { userId: string; budgetId: string; name: string };
  BUDGET_WARNING_REACHED: { userId: string; budgetId: string; name: string; utilization: number; amount: number; spent: number };
  BUDGET_EXCEEDED: { userId: string; budgetId: string; name: string; utilization: number; amount: number; spent: number };
  REPORT_GENERATED: { userId: string; reportId: string; name: string; type: string };
  REPORT_EXPORTED: { userId: string; name: string; format: string };
  REPORT_DELETED: { userId: string; reportId: string; name: string };
  SAVED_VIEW_CREATED: { userId: string; savedViewId: string; name: string };
  SAVED_VIEW_UPDATED: { userId: string; savedViewId: string; name: string };
  SAVED_VIEW_DELETED: { userId: string; savedViewId: string; name: string };
  PERSONAL_DATA_EXPORTED: { userId: string; ipAddress?: string; userAgent?: string };
  ALL_TRANSACTIONS_DELETED: { userId: string; count: number; ipAddress?: string; userAgent?: string };
  DEMO_DATA_RESET: { userId: string; ipAddress?: string; userAgent?: string };
}

export class DomainEventService extends EventEmitter {
  publish<T extends DomainEventType>(event: T, payload: DomainEventPayloadMap[T]): void {
    try {
      this.emit(event, payload);
    } catch (err) {
      LoggerService.error(`[DomainEventService]: Error emitting event ${event}`, err);
    }
  }

  subscribe<T extends DomainEventType>(event: T, listener: (payload: DomainEventPayloadMap[T]) => void | Promise<void>): this {
    const safeListener = async (payload: DomainEventPayloadMap[T]) => {
      try {
        await listener(payload);
      } catch (err) {
        LoggerService.error(`[DomainEventService]: Error handling event ${event}`, err);
      }
    };
    return super.on(event, safeListener);
  }
}

export const domainEventService = new DomainEventService();
export default domainEventService;
