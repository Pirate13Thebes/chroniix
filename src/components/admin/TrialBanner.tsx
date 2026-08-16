import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { getTrialStatus } from '../../utils/trial';
import type { BusinessSettings } from '../../types';

// Persistent reminder so a trial never converts to a paid charge as a
// surprise — starts showing once day 5 of the 7-day trial is reached.
export function TrialBanner({ settings }: { settings: BusinessSettings }) {
  const navigate = useNavigate();
  const trial = getTrialStatus(settings);

  if (!trial.active || trial.daysElapsed < 5) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
        background: 'var(--warning-bg)',
        border: '1px solid rgba(243, 174, 44, 0.4)',
        borderRadius: 'var(--card-radius)',
        padding: '0.9rem 1.25rem',
        marginBottom: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <AlertTriangle size={18} color="#92660b" />
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#7a4d0a' }}>
          {trial.expired
            ? 'Your free trial has ended. Add a payment method to keep using Chronix.'
            : `Your free trial ends in ${trial.daysRemaining} day${trial.daysRemaining === 1 ? '' : 's'}${settings.billingCard ? ` — we'll charge ${settings.billingCard.brand} •••• ${settings.billingCard.last4} automatically.` : '.'}`}
        </span>
      </div>
      <button className="btn btn-outline" style={{ background: '#fff' }} onClick={() => navigate('/admin/settings/billing')}>
        Manage Billing
      </button>
    </div>
  );
}
