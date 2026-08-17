import { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { EditBusinessProfileModal } from './EditBusinessProfileModal';

function CompanyLogoFallback({ name, size }: { name: string; size: number }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: 'linear-gradient(135deg, var(--chronix-navy), #1e3a5f)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--chronix-amber)',
        fontWeight: 800,
        fontSize: size * 0.38,
        letterSpacing: '0.5px',
        flexShrink: 0,
      }}
    >
      {initials || 'CX'}
    </div>
  );
}

export function BusinessProfileCard() {
  const { t } = useLanguage();
  const { state } = useStore();
  const [showEdit, setShowEdit] = useState(false);

  const realEmployeeCount = state.employees.filter((e) => e.status !== 'terminated').length;

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
      {state.settings.logoUrl ? (
        <img src={state.settings.logoUrl} alt={state.settings.companyName} style={{ height: 48, width: 48, objectFit: 'contain', borderRadius: 10, background: 'var(--bg-page)' }} />
      ) : (
        <CompanyLogoFallback name={state.settings.companyName} size={48} />
      )}
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{state.settings.companyName}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{realEmployeeCount} employee{realEmployeeCount === 1 ? '' : 's'}</div>
      </div>
      <button className="btn btn-outline" onClick={() => setShowEdit(true)}>{t('editProfile')}</button>
      {showEdit && <EditBusinessProfileModal settings={state.settings} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
