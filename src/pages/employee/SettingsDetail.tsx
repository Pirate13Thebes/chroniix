// Screen D4 — Employee Settings detail (generic shell keyed by :sectionId)
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { EMPLOYEE_SETTINGS_SECTIONS } from '../../data/settingsSections';
import { useSession } from '../../hooks/useSession';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import type { NotificationChannel } from '../../types';

const CHANNEL_OPTIONS: Array<{ value: NotificationChannel; label: string }> = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'in_app', label: 'In-app' },
];

export function EmployeeSettingsDetail() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { session } = useSession();
  const { state } = useStore();
  const { updateEmployee, updateSettings } = useStoreActions();
  const employee = state.employees.find((e) => e.id === session?.employeeId);
  const section = EMPLOYEE_SETTINGS_SECTIONS.find((s) => s.id === sectionId);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  if (!section) return <div className="empty-state">Section not found.</div>;

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);
    if (!employee) return;
    if (currentPassword !== employee.credential) {
      setPwError('Current password is incorrect.');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New passwords don't match.");
      return;
    }
    updateEmployee({ ...employee, credential: newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPwSuccess(true);
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="icon-btn" onClick={() => navigate('/employee/settings')}>
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.3rem' }}>{section.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{section.description}</p>
          </div>
        </div>
      </div>

      <div className="card">
        {section.id === 'personal-information' && employee && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="side-panel-row">
              <div className="side-panel-row-main">
                <div className="side-panel-sub">Name</div>
                <div className="side-panel-name">
                  {employee.firstName} {employee.lastName}
                </div>
              </div>
            </div>
            <div className="side-panel-row">
              <div className="side-panel-row-main">
                <div className="side-panel-sub">Email</div>
                <div className="side-panel-name">{employee.email}</div>
              </div>
            </div>
            <div className="side-panel-row">
              <div className="side-panel-row-main">
                <div className="side-panel-sub">Phone</div>
                <div className="side-panel-name">{employee.phone}</div>
              </div>
            </div>
          </div>
        )}

        {section.id === 'notification-preferences' && (
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Choose which channels Chronix uses to notify your team about requests and approvals.
            </p>
            {CHANNEL_OPTIONS.map((opt) => (
              <label key={opt.value} className="side-panel-row" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={state.settings.notificationChannels.includes(opt.value)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...state.settings.notificationChannels, opt.value]
                      : state.settings.notificationChannels.filter((c) => c !== opt.value);
                    updateSettings({ notificationChannels: next });
                  }}
                />
                <span className="side-panel-name">{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {section.id === 'privacy-security' && employee && (
          <form onSubmit={handleChangePassword} style={{ maxWidth: 360 }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Change Password</h4>
            <div className="form-field">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password" value={currentPassword} onChange={(e) => { setCurrentPassword(e.target.value); setPwError(''); }} required />
            </div>
            <div className="form-field">
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setPwError(''); }} required minLength={6} />
            </div>
            <div className="form-field">
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPwError(''); }} required minLength={6} />
            </div>
            {pwError && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>{pwError}</p>}
            {pwSuccess && <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1rem' }}>Password updated.</p>}
            <button type="submit" className="btn btn-primary-navy">Update Password</button>
          </form>
        )}

        {section.id === 'app-preferences' && (
          <div>
            <div className="side-panel-row">
              <div className="side-panel-row-main">
                <div className="side-panel-name">Language</div>
                <div className="side-panel-sub">Current: {lang === 'en' ? 'English' : 'Français'}</div>
              </div>
              <button className="btn btn-outline" onClick={toggleLang}>
                Switch to {lang === 'en' ? 'Français' : 'English'}
              </button>
            </div>
            <div className="side-panel-row" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <div className="side-panel-row-main">
                <div className="side-panel-name">Theme</div>
                <div className="side-panel-sub">Current: {theme === 'banano' ? 'Nana Banano 🍌' : 'Standard'}</div>
              </div>
              <button className="btn btn-outline" onClick={toggleTheme}>
                Switch to {theme === 'banano' ? 'Standard' : 'Nana Banano 🍌'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
