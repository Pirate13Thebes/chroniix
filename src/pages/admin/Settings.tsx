// Screen C6 — Admin Settings (list)
import { BusinessProfileCard } from '../../components/admin/BusinessProfileCard';
import { SettingsListRow } from '../../components/admin/SettingsListRow';
import { ADMIN_SETTINGS_SECTIONS } from '../../data/settingsSections';
import { useLanguage } from '../../hooks/useLanguage';

export function AdminSettings() {
  const { t } = useLanguage();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>{t('settingsTitle')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('settingsSubtitleAdmin')}</p>
        </div>
      </div>

      <BusinessProfileCard />

      <div className="card" style={{ padding: 0 }}>
        {ADMIN_SETTINGS_SECTIONS.map((section) => (
          <SettingsListRow key={section.id} section={section} basePath="/admin/settings" />
        ))}
      </div>
    </div>
  );
}
