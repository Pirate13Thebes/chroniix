import { CheckCircle2, Clock, LogIn, LogOut, Send } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { getRecentActivity } from '../../store/selectors';
import { formatRelative } from '../../utils/format';
import { useLanguage } from '../../hooks/useLanguage';
import type { ActivityKind } from '../../types';

const ICONS: Record<ActivityKind, { icon: typeof LogIn; color: string }> = {
  check_in: { icon: LogIn, color: 'var(--success)' },
  check_in_late: { icon: Clock, color: 'var(--warning)' },
  check_out: { icon: LogOut, color: 'var(--text-secondary)' },
  request_submitted: { icon: Send, color: 'var(--info)' },
  request_approved: { icon: CheckCircle2, color: 'var(--success)' },
  request_rejected: { icon: CheckCircle2, color: 'var(--danger)' },
  receipt_uploaded: { icon: Send, color: 'var(--info)' },
};

const LABELS: Record<ActivityKind, string> = {
  check_in: 'checked in',
  check_in_late: 'checked in late',
  check_out: 'checked out',
  request_submitted: 'submitted a request',
  request_approved: 'request approved',
  request_rejected: 'request rejected',
  receipt_uploaded: 'uploaded a receipt',
};

export function RecentActivityPanel() {
  const { t } = useLanguage();
  const { state } = useStore();
  const events = getRecentActivity(state, undefined, 6);

  return (
    <div className="side-panel">
      <div className="side-panel-title">
        <span>{t('recentActivity')}</span>
      </div>
      {events.length === 0 ? (
        <div className="empty-state">No recent activity.</div>
      ) : (
        events.map((event) => {
          const emp = state.employees.find((e) => e.id === event.employeeId);
          const { icon: Icon, color } = ICONS[event.kind];
          return (
            <div className="side-panel-row" key={event.id}>
              <Icon size={18} color={color} style={{ flexShrink: 0 }} />
              <div className="side-panel-row-main">
                <div className="side-panel-name">{emp ? `${emp.firstName} ${emp.lastName}` : ''}</div>
                <div className="side-panel-sub">{LABELS[event.kind]}</div>
              </div>
              <div className="side-panel-sub">{formatRelative(event.at)}</div>
            </div>
          );
        })
      )}
      <div className="side-panel-footer">{t('viewAllActivity')}</div>
    </div>
  );
}
