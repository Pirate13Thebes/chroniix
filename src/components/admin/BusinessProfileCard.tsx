import { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { EditBusinessProfileModal } from './EditBusinessProfileModal';

export function BusinessProfileCard() {
  const { t } = useLanguage();
  const { state } = useStore();
  const [showEdit, setShowEdit] = useState(false);

  const realEmployeeCount = state.employees.filter((e) => e.status !== 'terminated').length;

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
      <img src={state.settings.logoUrl} alt={state.settings.companyName} style={{ height: 48, width: 48, objectFit: 'contain', borderRadius: 10, background: 'var(--bg-page)' }} />
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{state.settings.companyName}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{realEmployeeCount} employee{realEmployeeCount === 1 ? '' : 's'}</div>
      </div>
      <button className="btn btn-outline" onClick={() => setShowEdit(true)}>{t('editProfile')}</button>
      {showEdit && <EditBusinessProfileModal settings={state.settings} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
