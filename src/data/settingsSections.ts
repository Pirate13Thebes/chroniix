import type { SettingsSectionDef } from '../types';

export const ADMIN_SETTINGS_SECTIONS: SettingsSectionDef[] = [
  { id: 'shift-settings', title: 'Shift Settings', description: 'Shifts, schedules, shift policies.', icon: 'Clock' },
  { id: 'work-location-settings', title: 'Work Location Settings', description: 'Office locations and remote work settings.', icon: 'MapPin' },
  { id: 'check-in-methods', title: 'Check-In Methods', description: 'Attendance check-in methods (GPS, QR, kiosk, etc.).', icon: 'ScanFace' },
  { id: 'billing', title: 'Billing', description: 'Payment method, trial status, and plan.', icon: 'CreditCard' },
  { id: 'employee-settings', title: 'Employee Settings', description: 'Employee info, onboarding, HR preferences.', icon: 'Users' },
  { id: 'leave-absence-settings', title: 'Leave and Absence Settings', description: 'Leave types, policies, approval workflows.', icon: 'CalendarDays' },
  { id: 'report-settings', title: 'Report Settings', description: 'Reports, KPIs, visualization preferences.', icon: 'BarChart3' },
  { id: 'user-roles-permissions', title: 'User Roles and Permissions', description: 'Roles, access levels, permission controls.', icon: 'ShieldCheck' },
  { id: 'security-settings', title: 'Security Settings', description: 'Password policies, 2FA, security preferences.', icon: 'Lock' },
  { id: 'notification-settings', title: 'Notification Settings', description: 'Email, SMS, in-app notification preferences.', icon: 'Bell' },
];

// Trimmed to only the sections that are actually real and navigational —
// a "Coming Soon" row is worse than no row, since it advertises a capability
// we can't deliver.
export const EMPLOYEE_SETTINGS_SECTIONS: SettingsSectionDef[] = [
  { id: 'personal-information', title: 'Personal Information', description: 'Personal details and contact info.', icon: 'User' },
  { id: 'notification-preferences', title: 'Notification Preferences', description: 'How and when to be notified.', icon: 'Bell' },
  { id: 'privacy-security', title: 'Privacy & Security', description: 'Password, privacy, account security.', icon: 'Lock' },
  { id: 'app-preferences', title: 'App Preferences', description: 'Language, theme, general app settings.', icon: 'Settings' },
];
