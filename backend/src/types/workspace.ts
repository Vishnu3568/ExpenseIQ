export interface DashboardPreferences {
  defaultLandingPage: string;
  favoriteWidgets: string[];
  compactMode: boolean;
  sidebarCollapsed: boolean;
  chartAnimations: boolean;
  density: 'COMFORTABLE' | 'COMPACT' | 'SPACIOUS';
}

export interface ExportPreferences {
  preferredPdfTemplate: string;
  preferredCsvDelimiter: string;
  excelFormatting: boolean;
  defaultReportTemplate: string;
}

export interface NotificationPreferences {
  budgetAlerts: boolean;
  weeklySummary: boolean;
  monthlySummary: boolean;
  securityAlerts: boolean;
  productAnnouncements: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface UserProfileResponse {
  fullName: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt: string;
  passwordChangedAt: string;
}

export interface WorkspacePreferencesResponse {
  currency: string;
  timezone: string;
  locale: string;
  numberFormat: string;
  dateFormat: string;
}
