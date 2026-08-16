import type { StoreState } from './storeReducer';
import type { AttendanceRecord, RequestStatus } from '../types';
import { localDateString } from '../utils/format';

export interface DateRange {
  from: string; // ISO date
  to: string; // ISO date
}

function inRange(dateIso: string, range?: DateRange): boolean {
  if (!range) return true;
  return dateIso >= range.from && dateIso <= range.to;
}

export function last7DaysRange(): DateRange {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 6);
  return { from: localDateString(from), to: localDateString(to) };
}

export function getDashboardStats(state: StoreState, range?: DateRange) {
  const records = state.attendance.filter((r) => inRange(r.date, range));
  const completed = records.filter((r) => r.hours != null);
  const avgHours = completed.length ? completed.reduce((sum, r) => sum + (r.hours ?? 0), 0) / completed.length : 0;

  const nonAbsent = records.filter((r) => r.status !== 'absent');
  const onTimeCount = records.filter((r) => r.status === 'on_time').length;
  const onTimePct = nonAbsent.length ? (onTimeCount / nonAbsent.length) * 100 : 0;

  const clockIns = nonAbsent.filter((r) => r.clockIn);
  const avgClockInMinutes = clockIns.length
    ? clockIns.reduce((sum, r) => sum + minutesSinceMidnight(r.clockIn), 0) / clockIns.length
    : 0;

  const clockOuts = nonAbsent.filter((r) => r.clockOut);
  const avgClockOutMinutes = clockOuts.length
    ? clockOuts.reduce((sum, r) => sum + minutesSinceMidnight(r.clockOut as string), 0) / clockOuts.length
    : 0;

  const today = localDateString();
  const todayRecords = state.attendance.filter((r) => r.date === today);
  const presentToday = todayRecords.filter((r) => r.status !== 'absent').length;
  const totalEmployees = state.employees.filter((e) => e.status !== 'terminated').length;

  return {
    avgHours,
    onTimePct,
    avgClockInMinutes,
    avgClockOutMinutes,
    presentToday,
    totalEmployees,
  };
}

function minutesSinceMidnight(iso: string): number {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

export function getAttendanceDistribution(state: StoreState, range?: DateRange) {
  const records = state.attendance.filter((r) => inRange(r.date, range));
  const onTime = records.filter((r) => r.status === 'on_time').length;
  const late = records.filter((r) => r.status === 'late').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const total = onTime + late + absent;
  return {
    onTime,
    late,
    absent,
    total,
    onTimePct: total ? Math.round((onTime / total) * 100) : 0,
    latePct: total ? Math.round((late / total) * 100) : 0,
    absentPct: total ? Math.round((absent / total) * 100) : 0,
  };
}

export interface TrendPoint {
  label: string;
  onTime: number;
  late: number;
  absent: number;
}

export function getAttendanceTrend(state: StoreState, granularity: 'daily' | 'weekly' = 'daily'): TrendPoint[] {
  const byDate = new Map<string, AttendanceRecord[]>();
  state.attendance.forEach((r) => {
    const arr = byDate.get(r.date) ?? [];
    arr.push(r);
    byDate.set(r.date, arr);
  });

  const dates = Array.from(byDate.keys()).sort();
  const recentDates = dates.slice(-14);

  if (granularity === 'daily') {
    return recentDates.map((date) => {
      const recs = byDate.get(date) ?? [];
      return {
        label: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        onTime: recs.filter((r) => r.status === 'on_time').length,
        late: recs.filter((r) => r.status === 'late').length,
        absent: recs.filter((r) => r.status === 'absent').length,
      };
    });
  }

  // weekly: bucket into 7-day chunks
  const weeks: TrendPoint[] = [];
  for (let i = 0; i < recentDates.length; i += 7) {
    const chunk = recentDates.slice(i, i + 7);
    const recs = chunk.flatMap((d) => byDate.get(d) ?? []);
    weeks.push({
      label: `Week of ${new Date(chunk[0]).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`,
      onTime: recs.filter((r) => r.status === 'on_time').length,
      late: recs.filter((r) => r.status === 'late').length,
      absent: recs.filter((r) => r.status === 'absent').length,
    });
  }
  return weeks;
}

export function getPendingApprovals(state: StoreState) {
  const pendingRequests = state.requests
    .filter((r) => r.status === 'pending' || r.status === 'in_review')
    .map((r) => ({
      id: r.id,
      kind: r.type === 'leave' ? 'leave' : ('request' as const),
      employeeId: r.employeeId,
      label: r.type === 'leave' ? 'Leave Request' : requestTypeLabel(r.type),
    }));
  const pendingReimbursements = state.reimbursements
    .filter((r) => r.status === 'pending' || r.status === 'in_review')
    .map((r) => ({ id: r.id, kind: 'reimbursement' as const, employeeId: r.employeeId, label: 'Reimbursement' }));
  return [...pendingRequests, ...pendingReimbursements];
}

function requestTypeLabel(type: string): string {
  switch (type) {
    case 'half_day': return 'Half Day Request';
    case 'remote_work': return 'Remote Work Request';
    case 'permission_slip': return 'Permission Slip';
    default: return 'Request';
  }
}

export function getUpcomingLeave(state: StoreState) {
  const today = localDateString();
  return state.requests
    .filter((r) => r.type === 'leave' && r.dateFrom >= today && (r.status === 'approved' || r.status === 'pending' || r.status === 'in_review'))
    .sort((a, b) => a.dateFrom.localeCompare(b.dateFrom));
}

export function getRecentActivity(state: StoreState, employeeId?: string, limit = 10) {
  const events = employeeId ? state.activity.filter((e) => e.employeeId === employeeId) : state.activity;
  return events.slice(0, limit);
}

export function getEmployeeAttendance(state: StoreState, employeeId: string) {
  return state.attendance.filter((r) => r.employeeId === employeeId).sort((a, b) => b.date.localeCompare(a.date));
}

export function getEmployeeRequests(state: StoreState, employeeId: string) {
  return state.requests.filter((r) => r.employeeId === employeeId).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export interface ReportsAggregates {
  overtimeHours: number;
  absenceCount: number;
  qrCheckIns: number;
  departmentBreakdown: Array<{ department: string; onTimePct: number; avgHours: number }>;
}

export function getReportsAggregates(state: StoreState, range?: DateRange): ReportsAggregates {
  const records = state.attendance.filter((r) => inRange(r.date, range));
  const overtimeHours = records.reduce((sum, r) => sum + Math.max(0, (r.hours ?? 0) - 8), 0);
  const absenceCount = records.filter((r) => r.status === 'absent').length;
  const qrCheckIns = records.filter((r) => r.method === 'qr').length;

  const byDept = new Map<string, AttendanceRecord[]>();
  records.forEach((r) => {
    const emp = state.employees.find((e) => e.id === r.employeeId);
    if (!emp) return;
    const arr = byDept.get(emp.department) ?? [];
    arr.push(r);
    byDept.set(emp.department, arr);
  });

  const departmentBreakdown = Array.from(byDept.entries()).map(([department, recs]) => {
    const nonAbsent = recs.filter((r) => r.status !== 'absent');
    const onTime = recs.filter((r) => r.status === 'on_time').length;
    const completed = recs.filter((r) => r.hours != null);
    return {
      department,
      onTimePct: nonAbsent.length ? Math.round((onTime / nonAbsent.length) * 100) : 0,
      avgHours: completed.length ? Math.round((completed.reduce((s, r) => s + (r.hours ?? 0), 0) / completed.length) * 100) / 100 : 0,
    };
  });

  return { overtimeHours: Math.round(overtimeHours * 100) / 100, absenceCount, qrCheckIns, departmentBreakdown };
}

export function statusLabel(status: RequestStatus): string {
  switch (status) {
    case 'pending': return 'Pending';
    case 'in_review': return 'In Review';
    case 'approved': return 'Approved';
    case 'rejected': return 'Rejected';
  }
}
