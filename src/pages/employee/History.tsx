// Screen D3 — Employee History
import { useMemo, useState } from 'react';
import { CalendarCheck, Clock3, AlertCircle } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { DataTable, type DataTableColumn } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useSession } from '../../hooks/useSession';
import { useStore } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { getEmployeeAttendance } from '../../store/selectors';
import { formatHours, formatTime } from '../../utils/format';
import type { AttendanceRecord } from '../../types';

export function History() {
  const { t } = useLanguage();
  const { session } = useSession();
  const { state } = useStore();
  const [statusFilter, setStatusFilter] = useState('all');

  const employeeId = session?.employeeId ?? '';
  const records = getEmployeeAttendance(state, employeeId);
  const lastMonthRecords = records.slice(0, 22);

  const totalDays = lastMonthRecords.filter((r) => r.status !== 'absent').length;
  const onTimeDays = lastMonthRecords.filter((r) => r.status === 'on_time').length;
  const lateDays = lastMonthRecords.filter((r) => r.status === 'late').length;

  const filtered = useMemo(() => records.filter((r) => statusFilter === 'all' || r.status === statusFilter), [records, statusFilter]);

  const columns: DataTableColumn<AttendanceRecord>[] = [
    { key: 'date', header: 'Date', cardPrimary: true, render: (r) => r.date },
    { key: 'clockIn', header: 'Clock In', render: (r) => (r.clockIn ? formatTime(r.clockIn) : '—') },
    { key: 'clockOut', header: 'Clock Out', render: (r) => (r.clockOut ? formatTime(r.clockOut) : '—') },
    { key: 'hours', header: 'Hours', render: (r) => formatHours(r.hours) },
    { key: 'location', header: 'Work Location', render: (r) => state.settings.workLocations.find((l) => l.id === r.workLocationId)?.name ?? '—' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.4rem' }}>{t('historyTitle')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('historySubtitle')}</p>
        </div>
      </div>

      <div className="stat-card-row">
        <StatCard icon={<CalendarCheck size={18} />} iconBg="var(--info-bg)" iconColor="var(--info)" label={t('statTotalDaysWorked')} value={String(totalDays)} trend={{ direction: 'flat', label: t('lastMonth') }} />
        <StatCard icon={<Clock3 size={18} />} iconBg="var(--success-bg)" iconColor="var(--success)" label={t('statOnTimeDays')} value={String(onTimeDays)} trend={{ direction: 'flat', label: t('lastMonth') }} />
        <StatCard icon={<AlertCircle size={18} />} iconBg="var(--warning-bg)" iconColor="#92660b" label={t('statLateDays')} value={String(lateDays)} trend={{ direction: 'flat', label: t('lastMonth') }} />
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="form-field" style={{ marginBottom: 0 }}>
          <label className="form-label">{t('allStatus')}</label>
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">{t('allStatus')}</option>
            <option value="on_time">{t('statusOnTime')}</option>
            <option value="late">{t('statusLate')}</option>
            <option value="absent">{t('statusAbsent')}</option>
          </select>
        </div>
        <button className="btn btn-outline" onClick={() => setStatusFilter('all')}>
          {t('clearFilters')}
        </button>
      </div>

      <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} pageSize={10} />
    </div>
  );
}
