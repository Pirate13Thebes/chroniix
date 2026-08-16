import confetti from 'canvas-confetti';
import { useStoreActions } from '../../hooks/useStore';
import { useGeolocationCheck } from '../../hooks/useGeolocationCheck';
import { useLanguage } from '../../hooks/useLanguage';
import type { Employee, Shift, WorkLocation } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface ShiftCardProps {
  employee: Employee;
  shift: Shift | undefined;
  location: WorkLocation | undefined;
  isClockedIn: boolean;
}

export function ShiftCard({ employee, shift, location, isClockedIn }: ShiftCardProps) {
  const { t } = useLanguage();
  const { clockIn, clockOut } = useStoreActions();
  const geo = useGeolocationCheck(location);
  const { theme } = useTheme();

  function handleClockIn() {
    if (!geo.inRange || !location) return;
    clockIn(employee.id, employee.allowedCheckInMethods[0] ?? 'gps_face', location.id);
    if (theme === 'banano') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#FFE135', '#FFF3A7', '#D4AF37', '#8B5A2B', '#FFFFFF'],
      });
    } else {
      confetti({ particleCount: 60, spread: 65, origin: { y: 0.7 } });
    }
  }

  function handleClockOut() {
    clockOut(employee.id);
    if (theme === 'banano') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFE135', '#FFF3A7', '#D4AF37', '#8B5A2B', '#FFFFFF'],
      });
    }
  }

  return (
    <div className="card">
      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{t('currentShift')}</div>
      <div style={{ fontWeight: 600, marginBottom: '1rem' }}>
        {shift ? `${shift.start} – ${shift.end} · ${shift.name}` : '—'}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary-navy" disabled={isClockedIn || !geo.inRange} onClick={handleClockIn} style={{ flex: 1 }}>
          {t('clockInCta')}
        </button>
        <button className="btn btn-primary-amber" disabled={!isClockedIn} onClick={handleClockOut} style={{ flex: 1 }}>
          {t('clockOutCta')}
        </button>
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
        {isClockedIn ? t('clockOutSub') : t('clockInSub')}
      </div>
    </div>
  );
}
