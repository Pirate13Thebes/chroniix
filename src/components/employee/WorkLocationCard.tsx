import { MapPin, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useGeolocationCheck } from '../../hooks/useGeolocationCheck';
import { useLanguage } from '../../hooks/useLanguage';
import type { WorkLocation } from '../../types';

export function WorkLocationCard({ location }: { location: WorkLocation | undefined }) {
  const { t } = useLanguage();
  const geo = useGeolocationCheck(location);

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <MapPin size={18} color="var(--chronix-navy)" />
        <span style={{ fontWeight: 600 }}>{t('workLocation')}</span>
      </div>
      <div style={{ fontSize: '0.92rem', marginBottom: '0.5rem' }}>{location?.name ?? '—'}</div>
      <span className={`status-badge ${geo.inRange ? 'status-badge--on-time' : 'status-badge--rejected'}`}>
        {geo.inRange ? t('inRange') : t('outOfRange')}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.6rem', fontSize: '0.82rem', color: geo.inRange ? 'var(--success)' : 'var(--danger)' }}>
        {geo.inRange ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
        {geo.inRange ? t('withinRadius') : t('outsideRadius')}
      </div>
    </div>
  );
}
