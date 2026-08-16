// Screen D4 — Employee Settings (list)
import { useSession } from '../../hooks/useSession';
import { useStore } from '../../hooks/useStore';
import { ProfileCard } from '../../components/employee/ProfileCard';
import { SettingsListRow } from '../../components/admin/SettingsListRow';
import { EMPLOYEE_SETTINGS_SECTIONS } from '../../data/settingsSections';
import { useLanguage } from '../../hooks/useLanguage';

export function EmployeeSettings() {
  const { t } = useLanguage();
  const { session } = useSession();
  const { state } = useStore();
  const employee = state.employees.find((e) => e.id === session?.employeeId);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.4rem' }}>{t('settingsTitle')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('settingsSubtitleEmployee')}</p>
        </div>
      </div>

      {employee && <ProfileCard employee={employee} />}

      <div className="card" style={{ padding: 0 }}>
        {EMPLOYEE_SETTINGS_SECTIONS.map((section) => (
          <SettingsListRow key={section.id} section={section} basePath="/employee/settings" />
        ))}
      </div>
    </div>
  );
}
