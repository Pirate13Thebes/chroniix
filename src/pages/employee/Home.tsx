// Screen D1 — Employee Home
import { useSession } from '../../hooks/useSession';
import { useStore } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { StatusCard } from '../../components/employee/StatusCard';
import { ShiftCard } from '../../components/employee/ShiftCard';
import { WorkLocationCard } from '../../components/employee/WorkLocationCard';
import { TodaysSummary } from '../../components/employee/TodaysSummary';
import { ShortcutTiles } from '../../components/employee/ShortcutTiles';
import { getEmployeeAttendance, getRecentActivity } from '../../store/selectors';
import { formatRelative, formatTime, localDateString } from '../../utils/format';

export function EmployeeHome() {
  const { t } = useLanguage();
  const { session } = useSession();
  const { state } = useStore();
  const employee = state.employees.find((e) => e.id === session?.employeeId);
  if (!employee) return null;

  const today = localDateString();
  const todayRecord = state.attendance.find((r) => r.employeeId === employee.id && r.date === today);
  const isClockedIn = !!todayRecord?.live;
  const shift = state.settings.shifts[0];
  const location = state.settings.workLocations.find((l) => l.id === employee.workLocationId);

  const attendance = getEmployeeAttendance(state, employee.id);
  const last30 = attendance.slice(0, 22);
  const monthAttendancePct = last30.length ? (last30.filter((r) => r.status !== 'absent').length / last30.length) * 100 : 100;

  const activity = getRecentActivity(state, employee.id, 5);

  return (
    <div>
      <div className="responsive-grid-1-1" style={{ marginBottom: '1.25rem' }}>
        <StatusCard employee={employee} isClockedIn={isClockedIn} clockInAt={todayRecord?.clockIn ?? null} />
        <WorkLocationCard location={location} />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <ShiftCard employee={employee} shift={shift} location={location} isClockedIn={isClockedIn} />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <TodaysSummary todayRecord={todayRecord} monthAttendancePct={monthAttendancePct} />
      </div>

      <div className="side-panel" style={{ marginBottom: '1.25rem' }}>
        <div className="side-panel-title">
          <span>{t('recentActivity')}</span>
        </div>
        {activity.length === 0 ? (
          <div className="empty-state">No recent activity.</div>
        ) : (
          activity.map((event) => (
            <div className="side-panel-row" key={event.id}>
              <div className="side-panel-row-main">
                <div className="side-panel-name">{event.kind.replace(/_/g, ' ')}</div>
              </div>
              <div className="side-panel-sub">{formatTime(event.at)} · {formatRelative(event.at)}</div>
            </div>
          ))
        )}
      </div>

      <ShortcutTiles />
    </div>
  );
}
