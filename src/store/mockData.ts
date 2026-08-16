import type {
  Employee,
  AttendanceRecord,
  Request,
  Reimbursement,
  WorkLocation,
  Shift,
  BusinessSettings,
  ActivityEvent,
} from '../types';

// No pre-seeded locations or shifts — every business defines its own real
// location (set at signup) and shifts (built from scratch in Settings)
// instead of inheriting a fictional Port Louis office and generic shifts.
export const WORK_LOCATIONS: WorkLocation[] = [];

export const SHIFTS: Shift[] = [];

// No seeded people or activity — every Employee/AttendanceRecord/Request/
// Reimbursement/ActivityEvent is created by real sign-ups and real usage.
export const EMPLOYEES: Employee[] = [];
export const ATTENDANCE_RECORDS: AttendanceRecord[] = [];
export const REQUESTS: Request[] = [];
export const REIMBURSEMENTS: Reimbursement[] = [];
export const ACTIVITY_EVENTS: ActivityEvent[] = [];

export const BUSINESS_SETTINGS: BusinessSettings = {
  companyName: 'Your Business',
  logoUrl: '/chronix_logo.png',
  employeeCount: EMPLOYEES.length,
  shifts: SHIFTS,
  workLocations: WORK_LOCATIONS,
  checkInMethods: ['gps_face', 'qr', 'kiosk'],
  leaveTypes: ['annual', 'sick', 'personal'],
  approvalFlow: ['submitted', 'team_lead', 'manager', 'hr'],
  notificationChannels: ['email', 'in_app'],
  departments: [],
  trialStartedAt: null,
  trialCancelled: false,
  billingCard: null,
  defaultReportRangeDays: 30,
  plan: null,
  billingStatus: 'none',
  paymentMethod: null,
  paymentReference: null,
};
