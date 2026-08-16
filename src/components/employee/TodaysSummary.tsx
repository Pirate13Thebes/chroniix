import { useLiveClock } from '../../hooks/useLiveClock';
import { useLanguage } from '../../hooks/useLanguage';
import { formatHours } from '../../utils/format';
import type { AttendanceRecord } from '../../types';

export function TodaysSummary({ todayRecord, monthAttendancePct }: { todayRecord: AttendanceRecord | undefined; monthAttendancePct: number }) {
  const { t } = useLanguage();
  const now = useLiveClock(1000);

  let workedHours = 0;
  if (todayRecord?.clockIn) {
    const end = todayRecord.live ? now : new Date(todayRecord.clockOut ?? now);
    workedHours = Math.max(0, (end.getTime() - new Date(todayRecord.clockIn).getTime()) / 3600000 - todayRecord.breakMinutes / 60);
  }
  const breakHours = (todayRecord?.breakMinutes ?? 0) / 60;

  const items = [
    { label: t('workedHours'), value: formatHours(workedHours) },
    { label: t('breakHours'), value: formatHours(breakHours) },
    { label: t('totalHours'), value: formatHours(workedHours + breakHours) },
    { label: t('attendancePct'), value: `${monthAttendancePct.toFixed(0)}%` },
  ];

  return (
    <div className="card">
      <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>{t('todaysSummary')}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
        {items.map((item) => (
          <div key={item.label}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{item.label}</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
