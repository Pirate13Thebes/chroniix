// Forced first-login step for employees given a temp PIN by their admin
// (see AddEmployeeModal) — they must set their own password before reaching
// the employee portal.
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '../../hooks/useSession';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { AuthShell } from './AuthShell';

export function ChangePasswordPage() {
  const { t } = useLanguage();
  const { session } = useSession();
  const { state } = useStore();
  const { updateEmployee } = useStoreActions();
  const navigate = useNavigate();

  const employee = state.employees.find((e) => e.id === session?.employeeId);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!session || !employee) {
    return <Navigate to="/login" replace />;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!employee) return;
    if (newPassword.length < 6) {
      setError(t('passwordTooShortError'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('passwordsMismatchError'));
      return;
    }
    updateEmployee({ ...employee, credential: newPassword, mustChangePassword: false });
    navigate('/employee/home');
  }

  return (
    <AuthShell>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{t('changePasswordTitle')}</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{t('changePasswordSubtitle')}</p>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">{t('newPasswordLabel')}</label>
          <input className="form-input" type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setError(''); }} required minLength={6} />
        </div>
        <div className="form-field">
          <label className="form-label">{t('confirmPasswordLabel')}</label>
          <input className="form-input" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }} required minLength={6} />
        </div>
        {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
        <button type="submit" className="btn btn-primary-amber" style={{ width: '100%' }}>
          {t('setPasswordButton')}
        </button>
      </form>
    </AuthShell>
  );
}
