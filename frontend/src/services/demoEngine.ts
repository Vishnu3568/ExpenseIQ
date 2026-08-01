/* eslint-disable @typescript-eslint/no-explicit-any */
// In-Memory & LocalStorage Demo Engine for Static Hosting Environments (GitHub Pages)

interface TransactionDemo {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  paymentMethod: string;
  description?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  category?: any;
}

interface CategoryDemo {
  id: string;
  userId: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color: string;
  icon: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface BudgetDemo {
  id: string;
  userId: string;
  categoryId?: string;
  name: string;
  amount: number;
  type: 'OVERALL' | 'CATEGORY';
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  category?: any;
}

const STORAGE_KEY = 'expenseiq_demo_database_v1';

const getDefaultSeedData = () => {
  const now = new Date();
  const todayISO = now.toISOString();

  const categories: CategoryDemo[] = [
    { id: 'cat-1', userId: 'demo-user-id', name: 'Housing & Rent', type: 'EXPENSE', color: '#6366F1', icon: 'Home', sortOrder: 1, createdAt: todayISO, updatedAt: todayISO },
    { id: 'cat-2', userId: 'demo-user-id', name: 'Food & Dining', type: 'EXPENSE', color: '#EC4899', icon: 'Utensils', sortOrder: 2, createdAt: todayISO, updatedAt: todayISO },
    { id: 'cat-3', userId: 'demo-user-id', name: 'Transportation', type: 'EXPENSE', color: '#10B981', icon: 'Car', sortOrder: 3, createdAt: todayISO, updatedAt: todayISO },
    { id: 'cat-4', userId: 'demo-user-id', name: 'Utilities & Bills', type: 'EXPENSE', color: '#F59E0B', icon: 'Zap', sortOrder: 4, createdAt: todayISO, updatedAt: todayISO },
    { id: 'cat-5', userId: 'demo-user-id', name: 'Entertainment', type: 'EXPENSE', color: '#8B5CF6', icon: 'Tv', sortOrder: 5, createdAt: todayISO, updatedAt: todayISO },
    { id: 'cat-6', userId: 'demo-user-id', name: 'Salary & Wages', type: 'INCOME', color: '#059669', icon: 'DollarSign', sortOrder: 6, createdAt: todayISO, updatedAt: todayISO },
    { id: 'cat-7', userId: 'demo-user-id', name: 'Freelance / Projects', type: 'INCOME', color: '#3B82F6', icon: 'Briefcase', sortOrder: 7, createdAt: todayISO, updatedAt: todayISO },
    { id: 'cat-8', userId: 'demo-user-id', name: 'Investments & Returns', type: 'INCOME', color: '#14B8A6', icon: 'TrendingUp', sortOrder: 8, createdAt: todayISO, updatedAt: todayISO },
  ];

  const getPastDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  };

  const transactions: TransactionDemo[] = [
    { id: 'tx-1', userId: 'demo-user-id', categoryId: 'cat-6', title: 'Monthly Salary Credit', amount: 85000, type: 'INCOME', date: getPastDate(2), paymentMethod: 'Bank Transfer', description: 'Primary monthly corporate salary payout', createdAt: getPastDate(2), updatedAt: getPastDate(2) },
    { id: 'tx-2', userId: 'demo-user-id', categoryId: 'cat-1', title: 'Apartment Rent Payment', amount: 22000, type: 'EXPENSE', date: getPastDate(3), paymentMethod: 'Bank Transfer', description: 'Monthly residential lease', createdAt: getPastDate(3), updatedAt: getPastDate(3) },
    { id: 'tx-3', userId: 'demo-user-id', categoryId: 'cat-2', title: 'Supermarket Grocery Shopping', amount: 4850, type: 'EXPENSE', date: getPastDate(1), paymentMethod: 'Card', description: 'Weekly groceries and essentials', createdAt: getPastDate(1), updatedAt: getPastDate(1) },
    { id: 'tx-4', userId: 'demo-user-id', categoryId: 'cat-3', title: 'Vehicle Fuel Refill', amount: 3200, type: 'EXPENSE', date: getPastDate(4), paymentMethod: 'UPI', description: 'Petrol station fillup', createdAt: getPastDate(4), updatedAt: getPastDate(4) },
    { id: 'tx-5', userId: 'demo-user-id', categoryId: 'cat-4', title: 'Electricity & Water Bill', amount: 2450, type: 'EXPENSE', date: getPastDate(5), paymentMethod: 'UPI', description: 'Utility provider invoice', createdAt: getPastDate(5), updatedAt: getPastDate(5) },
    { id: 'tx-6', userId: 'demo-user-id', categoryId: 'cat-7', title: 'UI Consulting Client Fee', amount: 25000, type: 'INCOME', date: getPastDate(6), paymentMethod: 'Bank Transfer', description: 'Web app design consultation', createdAt: getPastDate(6), updatedAt: getPastDate(6) },
    { id: 'tx-7', userId: 'demo-user-id', categoryId: 'cat-5', title: 'Movie Night & Dinner', amount: 1800, type: 'EXPENSE', date: getPastDate(7), paymentMethod: 'Card', description: 'Weekend entertainment', createdAt: getPastDate(7), updatedAt: getPastDate(7) },
  ];

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const budgets: BudgetDemo[] = [
    { id: 'b-1', userId: 'demo-user-id', categoryId: 'cat-2', name: 'Food & Dining Budget', amount: 15000, type: 'CATEGORY', startDate: startOfMonth, endDate: endOfMonth, status: 'ACTIVE', notes: 'Monthly dining cap', createdAt: todayISO, updatedAt: todayISO },
    { id: 'b-2', userId: 'demo-user-id', categoryId: 'cat-3', name: 'Transportation Budget', amount: 8000, type: 'CATEGORY', startDate: startOfMonth, endDate: endOfMonth, status: 'ACTIVE', notes: 'Fuel & transit cap', createdAt: todayISO, updatedAt: todayISO },
    { id: 'b-3', userId: 'demo-user-id', name: 'Overall Monthly Spending Limit', amount: 45000, type: 'OVERALL', startDate: startOfMonth, endDate: endOfMonth, status: 'ACTIVE', notes: 'Total monthly budget target', createdAt: todayISO, updatedAt: todayISO },
  ];

  const notifications = [
    { id: 'notif-1', userId: 'demo-user-id', type: 'BUDGET_WARNING', title: 'Food & Dining Budget Update', message: 'You have utilized 32% of your monthly food budget.', status: 'UNREAD', priority: 'MEDIUM', source: 'SYSTEM', createdAt: getPastDate(1), updatedAt: getPastDate(1) },
    { id: 'notif-2', userId: 'demo-user-id', type: 'SYSTEM_ALERT', title: 'Security Audit Notice', message: 'Successful login detected from Chrome Browser on Windows.', status: 'READ', priority: 'LOW', source: 'SECURITY', createdAt: getPastDate(2), updatedAt: getPastDate(2) },
  ];

  const workspace = {
    profile: {
      id: 'demo-user-id',
      name: 'Demo User',
      email: 'demo@expenseiq.io',
      phoneNumber: '+1 555-0199',
      bio: 'Personal Finance Lead',
      avatarUrl: '',
    },
    preferences: {
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      locale: 'en-IN',
      numberFormat: 'standard',
      dateFormat: 'YYYY-MM-DD',
      theme: 'dark',
    },
    theme: 'dark',
    dashboard: {
      defaultView: 'overview',
      widgetOrder: ['cash-flow', 'category-breakdown', 'recent-transactions'],
      showNetWorthCard: true,
      showBudgetBars: true,
    },
    export: {
      defaultFormat: 'pdf',
      includeCategories: true,
      includeNotes: true,
    },
    notifications: {
      emailAlerts: true,
      budgetWarnings: true,
      weeklyReports: false,
    },
    security: {
      mfaEnabled: false,
      lastPasswordChange: getPastDate(15),
      activeSessionsCount: 1,
    },
    auditLogs: [
      { id: 'al-1', userId: 'demo-user-id', action: 'USER_LOGIN', entityType: 'AUTH', entityId: 'demo-user-id', details: { ip: '127.0.0.1' }, ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0 (Windows NT 10.0)', createdAt: getPastDate(1) },
      { id: 'al-2', userId: 'demo-user-id', action: 'TRANSACTION_CREATE', entityType: 'TRANSACTION', entityId: 'tx-3', details: { amount: 4850 }, ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0 (Windows NT 10.0)', createdAt: getPastDate(1) },
    ],
  };

  return { categories, transactions, budgets, notifications, workspace };
};

export const getDemoDB = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // Re-seed on corruption
    }
  }
  const initial = getDefaultSeedData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

export const saveDemoDB = (db: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const handleDemoRequest = async (method: string, url: string, data?: any): Promise<any> => {
  const db = getDemoDB();
  const cleanUrl = url.split('?')[0];
  const params = new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');

  // 1. Auth Endpoints
  if (cleanUrl.includes('/api/auth/login') || cleanUrl.includes('/api/auth/register')) {
    const user = {
      id: 'demo-user-id',
      name: data?.name || (data?.email ? data.email.split('@')[0] : 'Demo User'),
      email: data?.email || 'demo@expenseiq.io',
      currency: data?.currency || db.workspace.preferences.currency || 'INR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.workspace.profile.name = user.name;
    db.workspace.profile.email = user.email;
    db.workspace.preferences.currency = user.currency;
    saveDemoDB(db);
    return { data: { success: true, accessToken: 'demo-access-token', user } };
  }

  if (cleanUrl.includes('/api/auth/me')) {
    return {
      data: {
        success: true,
        user: {
          id: db.workspace.profile.id,
          name: db.workspace.profile.name,
          email: db.workspace.profile.email,
          currency: db.workspace.preferences.currency,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }

  if (cleanUrl.includes('/api/auth/refresh')) {
    return { data: { success: true, accessToken: 'demo-access-token' } };
  }

  if (cleanUrl.includes('/api/auth/logout')) {
    return { data: { success: true, message: 'Logged out successfully' } };
  }

  // 2. Category Endpoints
  if (cleanUrl.endsWith('/api/categories')) {
    if (method.toUpperCase() === 'GET') {
      return { data: { success: true, count: db.categories.length, data: db.categories } };
    }
    if (method.toUpperCase() === 'POST') {
      const newCat: CategoryDemo = {
        id: `cat-${Date.now()}`,
        userId: 'demo-user-id',
        name: data.name,
        type: data.type || 'EXPENSE',
        color: data.color || '#6366F1',
        icon: data.icon || 'Folder',
        sortOrder: db.categories.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.categories.push(newCat);
      saveDemoDB(db);
      return { data: { success: true, data: newCat } };
    }
  }

  if (cleanUrl.match(/\/api\/categories\/[^/]+$/)) {
    const id = cleanUrl.split('/').pop();
    if (method.toUpperCase() === 'PUT') {
      const index = db.categories.findIndex((c: any) => c.id === id);
      if (index !== -1) {
        db.categories[index] = { ...db.categories[index], ...data, updatedAt: new Date().toISOString() };
        saveDemoDB(db);
        return { data: { success: true, data: db.categories[index] } };
      }
    }
    if (method.toUpperCase() === 'DELETE') {
      db.categories = db.categories.filter((c: any) => c.id !== id);
      saveDemoDB(db);
      return { data: { success: true, message: 'Category deleted' } };
    }
  }

  // 3. Transaction Endpoints
  if (cleanUrl.endsWith('/api/transactions')) {
    if (method.toUpperCase() === 'GET') {
      let filtered = [...db.transactions];
      const typeFilter = params.get('type');
      const search = params.get('search');
      if (typeFilter && typeFilter !== 'ALL') {
        filtered = filtered.filter((t) => t.type === typeFilter);
      }
      if (search) {
        filtered = filtered.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
      }
      const page = parseInt(params.get('page') || '1', 10);
      const limit = parseInt(params.get('limit') || '10', 10);
      const total = filtered.length;
      const paginated = filtered.slice((page - 1) * limit, page * limit).map((t) => ({
        ...t,
        category: db.categories.find((c: any) => c.id === t.categoryId),
      }));
      return {
        data: {
          success: true,
          data: paginated,
          meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
        },
      };
    }
    if (method.toUpperCase() === 'POST') {
      const newTx: TransactionDemo = {
        id: `tx-${Date.now()}`,
        userId: 'demo-user-id',
        categoryId: data.categoryId,
        title: data.title,
        amount: parseFloat(data.amount),
        type: data.type || 'EXPENSE',
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        paymentMethod: data.paymentMethod || 'Cash',
        description: data.description || '',
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.transactions.unshift(newTx);
      saveDemoDB(db);
      return { data: { success: true, data: { ...newTx, category: db.categories.find((c: any) => c.id === newTx.categoryId) } } };
    }
  }

  if (cleanUrl.match(/\/api\/transactions\/[^/]+$/)) {
    const id = cleanUrl.split('/').pop();
    if (method.toUpperCase() === 'PUT') {
      const index = db.transactions.findIndex((t: any) => t.id === id);
      if (index !== -1) {
        db.transactions[index] = { ...db.transactions[index], ...data, amount: parseFloat(data.amount || db.transactions[index].amount), updatedAt: new Date().toISOString() };
        saveDemoDB(db);
        return { data: { success: true, data: db.transactions[index] } };
      }
    }
    if (method.toUpperCase() === 'DELETE') {
      db.transactions = db.transactions.filter((t: any) => t.id !== id);
      saveDemoDB(db);
      return { data: { success: true, message: 'Transaction deleted' } };
    }
  }

  // 4. Budget Endpoints
  if (cleanUrl.endsWith('/api/budgets')) {
    if (method.toUpperCase() === 'GET') {
      const populated = db.budgets.map((b: any) => ({
        ...b,
        category: db.categories.find((c: any) => c.id === b.categoryId),
      }));
      return { data: { success: true, data: populated } };
    }
    if (method.toUpperCase() === 'POST') {
      const newB: BudgetDemo = {
        id: `b-${Date.now()}`,
        userId: 'demo-user-id',
        categoryId: data.categoryId,
        name: data.name,
        amount: parseFloat(data.amount),
        type: data.type || (data.categoryId ? 'CATEGORY' : 'OVERALL'),
        startDate: data.startDate || new Date().toISOString(),
        endDate: data.endDate || new Date().toISOString(),
        status: 'ACTIVE',
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.budgets.push(newB);
      saveDemoDB(db);
      return { data: { success: true, data: { ...newB, category: db.categories.find((c: any) => c.id === newB.categoryId) } } };
    }
  }

  if (cleanUrl.match(/\/api\/budgets\/[^/]+$/)) {
    const id = cleanUrl.split('/').pop();
    if (method.toUpperCase() === 'DELETE') {
      db.budgets = db.budgets.filter((b: any) => b.id !== id);
      saveDemoDB(db);
      return { data: { success: true, message: 'Budget deleted' } };
    }
  }

  // 5. Data Intelligence & Insights Endpoints
  if (cleanUrl.includes('/api/insights/')) {
    const totalIncome = db.transactions.filter((t: any) => t.type === 'INCOME').reduce((acc: number, t: any) => acc + t.amount, 0);
    const totalExpense = db.transactions.filter((t: any) => t.type === 'EXPENSE').reduce((acc: number, t: any) => acc + t.amount, 0);
    const netWorth = totalIncome - totalExpense;

    if (cleanUrl.includes('/insights/overview')) {
      return {
        data: {
          success: true,
          data: {
            totalIncome,
            totalExpense,
            netWorth,
            savingsRate: totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0,
            transactionCount: db.transactions.length,
          },
        },
      };
    }

    if (cleanUrl.includes('/insights/monthly') || cleanUrl.includes('/insights/cashflow')) {
      return {
        data: {
          success: true,
          data: [
            { month: 'Jan', income: Math.round(totalIncome * 0.7), expense: Math.round(totalExpense * 0.6) },
            { month: 'Feb', income: Math.round(totalIncome * 0.8), expense: Math.round(totalExpense * 0.7) },
            { month: 'Mar', income: Math.round(totalIncome * 0.9), expense: Math.round(totalExpense * 0.85) },
            { month: 'Current', income: totalIncome, expense: totalExpense },
          ],
        },
      };
    }

    if (cleanUrl.includes('/insights/weekly')) {
      return {
        data: {
          success: true,
          data: [
            { week: 'Week 1', income: Math.round(totalIncome * 0.2), expense: Math.round(totalExpense * 0.25) },
            { week: 'Week 2', income: Math.round(totalIncome * 0.3), expense: Math.round(totalExpense * 0.2) },
            { week: 'Week 3', income: Math.round(totalIncome * 0.25), expense: Math.round(totalExpense * 0.3) },
            { week: 'Week 4', income: Math.round(totalIncome * 0.25), expense: Math.round(totalExpense * 0.25) },
          ],
        },
      };
    }

    if (cleanUrl.includes('/insights/category-breakdown')) {
      const breakdownMap: Record<string, number> = {};
      db.transactions.filter((t: any) => t.type === 'EXPENSE').forEach((t: any) => {
        const catName = db.categories.find((c: any) => c.id === t.categoryId)?.name || 'Uncategorized';
        breakdownMap[catName] = (breakdownMap[catName] || 0) + t.amount;
      });
      const breakdown = Object.entries(breakdownMap).map(([name, value]) => ({ name, value }));
      return { data: { success: true, data: breakdown } };
    }

    if (cleanUrl.includes('/insights/recent')) {
      const limit = parseInt(params.get('limit') || '5', 10);
      const recent = db.transactions.slice(0, limit).map((t: any) => ({
        ...t,
        category: db.categories.find((c: any) => c.id === t.categoryId),
      }));
      return { data: { success: true, data: recent } };
    }

    if (cleanUrl.includes('/insights/statistics')) {
      return {
        data: {
          success: true,
          data: {
            highestExpense: db.transactions.filter((t: any) => t.type === 'EXPENSE').reduce((max: number, t: any) => Math.max(max, t.amount), 0),
            averageTransaction: db.transactions.length > 0 ? Math.round((totalIncome + totalExpense) / db.transactions.length) : 0,
            activeBudgetsCount: db.budgets.length,
          },
        },
      };
    }
  }

  // 6. Notification Endpoints
  if (cleanUrl.endsWith('/api/notifications')) {
    return { data: { success: true, count: db.notifications.length, data: db.notifications } };
  }

  if (cleanUrl.includes('/api/notifications/unread-count')) {
    const unreadCount = db.notifications.filter((n: any) => n.status === 'UNREAD').length;
    return { data: { success: true, count: unreadCount } };
  }

  if (cleanUrl.includes('/api/notifications/read-all')) {
    db.notifications.forEach((n: any) => { n.status = 'READ'; });
    saveDemoDB(db);
    return { data: { success: true, message: 'All notifications marked as read' } };
  }

  // 7. Workspace Endpoints
  if (cleanUrl.includes('/api/workspace/profile')) {
    if (method.toUpperCase() === 'GET') {
      return { data: { success: true, data: db.workspace.profile } };
    }
    if (method.toUpperCase() === 'PUT') {
      db.workspace.profile = { ...db.workspace.profile, ...data };
      saveDemoDB(db);
      return { data: { success: true, data: db.workspace.profile } };
    }
  }

  if (cleanUrl.includes('/api/workspace/preferences')) {
    if (method.toUpperCase() === 'GET') {
      return { data: { success: true, data: db.workspace.preferences } };
    }
    if (method.toUpperCase() === 'PUT') {
      db.workspace.preferences = { ...db.workspace.preferences, ...data };
      saveDemoDB(db);
      return { data: { success: true, data: db.workspace.preferences } };
    }
  }

  if (cleanUrl.includes('/api/workspace/theme')) {
    if (method.toUpperCase() === 'GET') {
      return { data: { success: true, data: { theme: db.workspace.theme || 'dark' } } };
    }
    if (method.toUpperCase() === 'PUT') {
      db.workspace.theme = data.theme;
      saveDemoDB(db);
      return { data: { success: true, data: { theme: data.theme } } };
    }
  }

  if (cleanUrl.includes('/api/workspace/dashboard')) {
    if (method.toUpperCase() === 'GET') {
      return { data: { success: true, data: db.workspace.dashboard } };
    }
    if (method.toUpperCase() === 'PUT') {
      db.workspace.dashboard = { ...db.workspace.dashboard, ...data };
      saveDemoDB(db);
      return { data: { success: true, data: db.workspace.dashboard } };
    }
  }

  if (cleanUrl.includes('/api/workspace/export')) {
    if (method.toUpperCase() === 'GET') {
      return { data: { success: true, data: db.workspace.export } };
    }
    if (method.toUpperCase() === 'PUT') {
      db.workspace.export = { ...db.workspace.export, ...data };
      saveDemoDB(db);
      return { data: { success: true, data: db.workspace.export } };
    }
  }

  if (cleanUrl.includes('/api/workspace/notifications')) {
    if (method.toUpperCase() === 'GET') {
      return { data: { success: true, data: db.workspace.notifications } };
    }
    if (method.toUpperCase() === 'PUT') {
      db.workspace.notifications = { ...db.workspace.notifications, ...data };
      saveDemoDB(db);
      return { data: { success: true, data: db.workspace.notifications } };
    }
  }

  if (cleanUrl.includes('/api/workspace/security')) {
    return { data: { success: true, data: db.workspace.security } };
  }

  if (cleanUrl.includes('/api/workspace/audit-logs') || cleanUrl.includes('/api/workspace/activity-timeline')) {
    return { data: { success: true, data: db.workspace.auditLogs } };
  }

  if (cleanUrl.includes('/health')) {
    return { data: { status: 'UP', timestamp: new Date().toISOString() } };
  }

  // Reports Export Stub
  if (cleanUrl.includes('/api/reports/')) {
    const dummyBlob = new Blob(['ExpenseIQ Report Export Summary\nDate: ' + new Date().toLocaleDateString()], { type: 'text/plain' });
    return { data: dummyBlob };
  }

  // Generic Fallback OK Response
  return { data: { success: true, data: [] } };
};
