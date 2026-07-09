import { body } from 'express-validator';

export const updateProfileValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phoneNumber')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('Phone number must be a string')
    .isLength({ max: 20 })
    .withMessage('Phone number is too long'),
  body('bio')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('Bio must be a string')
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('avatarUrl')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('Avatar URL must be a string'),
];

export const updatePasswordValidator = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number')
    .matches(/[#?!@$%^&*-]/)
    .withMessage('New password must contain at least one special character (#?!@$%^&*-)'),
];

export const updatePreferencesValidator = [
  body('currency')
    .isIn(['USD', 'EUR', 'GBP', 'INR', 'JPY'])
    .withMessage('Invalid currency. Supported: USD, EUR, GBP, INR, JPY'),
  body('timezone')
    .notEmpty()
    .withMessage('Timezone is required')
    .isString()
    .withMessage('Timezone must be a string'),
  body('locale')
    .notEmpty()
    .withMessage('Locale is required')
    .isString()
    .withMessage('Locale must be a string'),
  body('numberFormat')
    .isIn(['COMMA', 'DOT', 'SPACE'])
    .withMessage('Number format must be COMMA, DOT, or SPACE'),
  body('dateFormat')
    .isIn(['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'])
    .withMessage('Invalid date format preset'),
];

export const updateThemeValidator = [
  body('theme')
    .isIn(['light', 'dark', 'system'])
    .withMessage('Theme must be light, dark, or system'),
];

export const updateDashboardValidator = [
  body('defaultLandingPage')
    .isString()
    .withMessage('Default landing page must be a string'),
  body('favoriteWidgets')
    .isArray()
    .withMessage('Favorite widgets must be an array'),
  body('compactMode')
    .isBoolean()
    .withMessage('Compact mode must be a boolean'),
  body('sidebarCollapsed')
    .isBoolean()
    .withMessage('Sidebar collapsed must be a boolean'),
  body('chartAnimations')
    .isBoolean()
    .withMessage('Chart animations must be a boolean'),
  body('density')
    .isIn(['COMFORTABLE', 'COMPACT', 'SPACIOUS'])
    .withMessage('Density must be COMFORTABLE, COMPACT, or SPACIOUS'),
];

export const updateExportValidator = [
  body('preferredPdfTemplate')
    .isString()
    .withMessage('Preferred PDF template must be a string'),
  body('preferredCsvDelimiter')
    .isIn([',', ';', '\t'])
    .withMessage('Preferred CSV delimiter must be a comma, semicolon, or tab'),
  body('excelFormatting')
    .isBoolean()
    .withMessage('Excel formatting must be a boolean'),
  body('defaultReportTemplate')
    .isString()
    .withMessage('Default report template must be a string'),
];

export const updateNotificationsValidator = [
  body('budgetAlerts')
    .isBoolean()
    .withMessage('Budget alerts preference must be a boolean'),
  body('weeklySummary')
    .isBoolean()
    .withMessage('Weekly summary preference must be a boolean'),
  body('monthlySummary')
    .isBoolean()
    .withMessage('Monthly summary preference must be a boolean'),
  body('securityAlerts')
    .isBoolean()
    .withMessage('Security alerts preference must be a boolean'),
  body('productAnnouncements')
    .isBoolean()
    .withMessage('Product announcements preference must be a boolean'),
  body('emailNotifications')
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  body('pushNotifications')
    .isBoolean()
    .withMessage('Push notifications must be a boolean'),
];
