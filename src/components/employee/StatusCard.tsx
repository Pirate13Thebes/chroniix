import { useEffect, useState } from 'react';
import { Avatar } from '../common/Avatar';
import { useLanguage } from '../../hooks/useLanguage';
import type { Employee } from '../../types';

function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function StatusCard({ employee, isClockedIn, clockInAt }: { employee: Employee; isClockedIn: boolean; clockInAt: string | null }) {
  const { t } = useLanguage();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isClockedIn) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [isClockedIn]);

  const elapsed = isClockedIn && clockInAt ? formatElapsed(now - new Date(clockInAt).getTime()) : null;

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar src={employee.avatarUrl} name={`${employee.firstName} ${employee.lastName}`} size={56} />
      <div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Attendance status</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: isClockedIn ? 'var(--success)' : 'var(--text-primary)' }}>
          {isClockedIn ? t('clockedIn') : t('notClockedIn')}
        </div>
        {elapsed ? (
          <div style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
            {t('timeOnShift')} {elapsed}
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('haveAProductiveDay')}</div>
        )}
      </div>
    </div>
  );
}
