import { useState } from 'react';
import { Avatar } from '../common/Avatar';
import { useLanguage } from '../../hooks/useLanguage';
import type { Employee } from '../../types';
import { EditProfileModal } from './EditProfileModal';

export function ProfileCard({ employee }: { employee: Employee }) {
  const { t } = useLanguage();
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
      <div style={{ position: 'relative' }}>
        <Avatar src={employee.avatarUrl} name={`${employee.firstName} ${employee.lastName}`} size={56} />
        <span className="online-dot" style={{ position: 'absolute', bottom: 0, right: 0, borderColor: '#fff' }} />
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
          {employee.firstName} {employee.lastName}
        </div>
        <span className="status-badge status-badge--in-review" style={{ marginBottom: '0.3rem', display: 'inline-flex' }}>
          {employee.role}
        </span>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{employee.email}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{employee.phone}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          {t('joined')} {employee.joinedAt}
        </div>
      </div>
      <button className="btn btn-outline" onClick={() => setShowEdit(true)}>{t('editProfile')}</button>
      {showEdit && <EditProfileModal employee={employee} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
