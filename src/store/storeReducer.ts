import type {
  Employee,
  AttendanceRecord,
  Request,
  Reimbursement,
  ActivityEvent,
  BusinessSettings,
  CheckInMethod,
  Shift,
} from '../types';
import {
  EMPLOYEES,
  ATTENDANCE_RECORDS,
  REQUESTS,
  REIMBURSEMENTS,
  ACTIVITY_EVENTS,
  BUSINESS_SETTINGS,
} from './mockData';
import { localDateString } from '../utils/format';
import { generateKioskPin } from '../utils/kioskPin';

export const STORAGE_KEY = 'chronix_store_v1';

export interface StoreState {
  employees: Employee[];
  attendance: AttendanceRecord[];
  requests: Request[];
  reimbursements: Reimbursement[];
  activity: ActivityEvent[];
  settings: BusinessSettings;
}

export type StoreAction =
  | { type: 'CLOCK_IN'; employeeId: string; method: CheckInMethod; workLocationId: string }
  | { type: 'CLOCK_OUT'; employeeId: string }
  | { type: 'SUBMIT_REQUEST'; payload: Omit<Request, 'id' | 'status' | 'approvalSteps' | 'submittedAt' | 'decidedAt' | 'decidedBy'> }
  | { type: 'DECIDE_REQUEST'; id: string; decision: 'approved' | 'rejected'; decidedBy: string }
  | { type: 'SUBMIT_REIMBURSEMENT'; payload: Omit<Reimbursement, 'id' | 'status' | 'submittedAt' | 'decidedAt'> }
  | { type: 'DECIDE_REIMBURSEMENT'; id: string; decision: 'approved' | 'rejected' }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<BusinessSettings> };

export function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function todayIso(): string {
  return localDateString();
}

// Late is relative to the employee's own assigned shift + its grace period —
// never a hardcoded time. If no shift has been assigned (or the business
// hasn't configured any shifts yet), there is no rule to be late against, so
// the honest answer is "on time", not a made-up 9:00 AM default.
function isLate(clockInIso: string, shift: Shift | undefined): boolean {
  if (!shift) return false;
  const d = new Date(clockInIso);
  const [startHour, startMinute] = shift.start.split(':').map(Number);
  const graceEnd = new Date(d);
  graceEnd.setHours(startHour, startMinute + shift.graceMinutes, 0, 0);
  return d.getTime() > graceEnd.getTime();
}

export function reducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'CLOCK_IN': {
      const at = nowIso();
      const employee = state.employees.find((e) => e.id === action.employeeId);
      const shift = state.settings.shifts.find((s) => s.id === employee?.shiftId);
      const late = isLate(at, shift);
      const record: AttendanceRecord = {
        id: uid('att'),
        employeeId: action.employeeId,
        date: todayIso(),
        clockIn: at,
        clockOut: null,
        breakMinutes: 0,
        hours: null,
        workLocationId: action.workLocationId,
        method: action.method,
        status: late ? 'late' : 'on_time',
        live: true,
      };
      const event: ActivityEvent = {
        id: uid('act'),
        employeeId: action.employeeId,
        kind: late ? 'check_in_late' : 'check_in',
        at,
      };
      return {
        ...state,
        attendance: [record, ...state.attendance],
        activity: [event, ...state.activity],
      };
    }
    case 'CLOCK_OUT': {
      const at = nowIso();
      const openRecord = state.attendance.find((r) => r.employeeId === action.employeeId && r.live);
      if (!openRecord) return state;
      const hours = (new Date(at).getTime() - new Date(openRecord.clockIn).getTime()) / 3600000 - openRecord.breakMinutes / 60;
      const event: ActivityEvent = { id: uid('act'), employeeId: action.employeeId, kind: 'check_out', at };
      return {
        ...state,
        attendance: state.attendance.map((r) =>
          r.id === openRecord.id ? { ...r, clockOut: at, hours: Math.max(0, Math.round(hours * 100) / 100), live: false } : r
        ),
        activity: [event, ...state.activity],
      };
    }
    case 'SUBMIT_REQUEST': {
      const at = nowIso();
      const id = uid('req');
      const request: Request = {
        ...action.payload,
        id,
        status: 'pending',
        approvalSteps: [
          { step: 'submitted', state: 'done', date: at.slice(0, 10) },
          { step: 'team_lead', state: 'in_progress', date: null },
          { step: 'manager', state: 'pending', date: null },
          { step: 'hr', state: 'pending', date: null },
        ],
        submittedAt: at,
        decidedAt: null,
        decidedBy: null,
      };
      const event: ActivityEvent = { id: uid('act'), employeeId: request.employeeId, kind: 'request_submitted', at };
      return { ...state, requests: [request, ...state.requests], activity: [event, ...state.activity] };
    }
    case 'DECIDE_REQUEST': {
      const at = nowIso();
      const target = state.requests.find((r) => r.id === action.id);
      if (!target) return state;
      const event: ActivityEvent = {
        id: uid('act'),
        employeeId: target.employeeId,
        kind: action.decision === 'approved' ? 'request_approved' : 'request_rejected',
        at,
      };
      return {
        ...state,
        requests: state.requests.map((r) =>
          r.id === action.id
            ? {
                ...r,
                status: action.decision,
                decidedAt: at,
                decidedBy: action.decidedBy,
                approvalSteps: r.approvalSteps.map((s) => ({ ...s, state: 'done', date: s.date ?? at.slice(0, 10) })),
              }
            : r
        ),
        activity: [event, ...state.activity],
      };
    }
    case 'SUBMIT_REIMBURSEMENT': {
      const at = nowIso();
      const reimbursement: Reimbursement = { ...action.payload, id: uid('reim'), status: 'pending', submittedAt: at, decidedAt: null };
      const events: ActivityEvent[] = [{ id: uid('act'), employeeId: reimbursement.employeeId, kind: 'request_submitted', at }];
      if (reimbursement.receiptUrl) {
        events.push({ id: uid('act'), employeeId: reimbursement.employeeId, kind: 'receipt_uploaded', at });
      }
      return { ...state, reimbursements: [reimbursement, ...state.reimbursements], activity: [...events, ...state.activity] };
    }
    case 'DECIDE_REIMBURSEMENT': {
      const at = nowIso();
      const target = state.reimbursements.find((r) => r.id === action.id);
      if (!target) return state;
      const event: ActivityEvent = {
        id: uid('act'),
        employeeId: target.employeeId,
        kind: action.decision === 'approved' ? 'request_approved' : 'request_rejected',
        at,
      };
      return {
        ...state,
        reimbursements: state.reimbursements.map((r) =>
          r.id === action.id ? { ...r, status: action.decision, decidedAt: at } : r
        ),
        activity: [event, ...state.activity],
      };
    }
    case 'ADD_EMPLOYEE': {
      return {
        ...state,
        employees: [...state.employees, action.payload],
      };
    }
    case 'UPDATE_EMPLOYEE': {
      return { ...state, employees: state.employees.map((e) => (e.id === action.payload.id ? action.payload : e)) };
    }
    case 'UPDATE_SETTINGS': {
      return { ...state, settings: { ...state.settings, ...action.payload } };
    }
    default:
      return state;
  }
}

// Fills in any field missing from a persisted employee record — e.g. an
// employee saved before hourlyRateMUR/status/shiftId existed — with a safe
// default, instead of leaving it undefined (which silently turns into NaN
// in payroll/report math).
function normalizeEmployee(e: Partial<Employee>): Employee {
  return {
    ...e,
    avatarUrl: e.avatarUrl ?? '',
    department: e.department ?? '',
    employmentType: e.employmentType ?? 'full_time',
    workLocationId: e.workLocationId ?? '',
    shiftId: e.shiftId ?? null,
    allowedCheckInMethods: e.allowedCheckInMethods ?? ['gps_face'],
    leaveBalance: e.leaveBalance ?? 0,
    hourlyRateMUR: e.hourlyRateMUR ?? 0,
    status: e.status ?? 'active',
    terminatedAt: e.terminatedAt ?? null,
    terminationReason: e.terminationReason ?? null,
    kioskPin: e.kioskPin ?? generateKioskPin(),
  } as Employee;
}

function normalizeBusinessState(parsed: Partial<StoreState>): StoreState {
  return {
    employees: (parsed.employees ?? EMPLOYEES).map(normalizeEmployee),
    attendance: parsed.attendance ?? ATTENDANCE_RECORDS,
    requests: parsed.requests ?? REQUESTS,
    reimbursements: parsed.reimbursements ?? REIMBURSEMENTS,
    activity: parsed.activity ?? ACTIVITY_EVENTS,
    // Merge so any settings field introduced after this business was
    // created (e.g. defaultReportRangeDays) gets a real default instead of
    // undefined — which previously turned into NaN dates.
    settings: { ...BUSINESS_SETTINGS, ...(parsed.settings ?? {}) },
  };
}

export function emptyBusinessState(): StoreState {
  return normalizeBusinessState({});
}

// Every business (one per real-world company that signs up) gets its own
// fully isolated slice — own employees, own attendance, own settings. This
// is the fix for signups landing inside a previous business's account: the
// old shape was a single flat StoreState shared by the entire browser, so
// every signup just appended another "admin" employee to the one global
// list and overwrote the one global settings object.
export interface RootState {
  businesses: Record<string, StoreState>;
}

export type RootAction =
  | { type: 'CREATE_BUSINESS'; businessId: string; initialState: StoreState }
  | { type: 'SCOPED'; businessId: string; action: StoreAction };

export function rootReducer(root: RootState, action: RootAction): RootState {
  if (action.type === 'CREATE_BUSINESS') {
    return { businesses: { ...root.businesses, [action.businessId]: action.initialState } };
  }
  const current = root.businesses[action.businessId];
  if (!current) return root;
  return { businesses: { ...root.businesses, [action.businessId]: reducer(current, action.action) } };
}

// Businesses created before this multi-tenant model existed are all
// bundled under one flat StoreState in localStorage. Migrate that into a
// single named business so nobody loses existing data — this can't safely
// un-merge accounts that already got mixed together by the old bug, but it
// stops any further mixing going forward.
export const LEGACY_BUSINESS_ID = 'legacy-business';

export function loadInitialRootState(): RootState {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { businesses?: Record<string, Partial<StoreState>> } & Partial<StoreState>;
        if (parsed.businesses) {
          const businesses: Record<string, StoreState> = {};
          for (const [id, biz] of Object.entries(parsed.businesses)) {
            businesses[id] = normalizeBusinessState(biz);
          }
          return { businesses };
        }
        if (parsed.employees) {
          return { businesses: { [LEGACY_BUSINESS_ID]: normalizeBusinessState(parsed) } };
        }
      }
    } catch {
      // fall through to empty
    }
  }
  return { businesses: {} };
}
