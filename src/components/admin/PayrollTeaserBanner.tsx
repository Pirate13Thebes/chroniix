import { useLanguage } from '../../hooks/useLanguage';

// Always inert — payroll integration is never a working feature (see CLAUDE.md hard rules).
export function PayrollTeaserBanner() {
  const { t } = useLanguage();
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', opacity: 0.85 }}>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('payrollBannerText')}</p>
      <span className="status-badge status-badge--pending">{t('comingSoon')}</span>
    </div>
  );
}
