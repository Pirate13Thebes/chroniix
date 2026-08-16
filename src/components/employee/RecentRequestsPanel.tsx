import { FileText, Plane, Wallet } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { useLanguage } from '../../hooks/useLanguage';
import type { Reimbursement, Request } from '../../types';

type Item = ({ kind: 'request' } & Request) | ({ kind: 'reimbursement' } & Reimbursement);

export function RecentRequestsPanel({ requests, reimbursements }: { requests: Request[]; reimbursements: Reimbursement[] }) {
  const { t } = useLanguage();
  const items: Item[] = [
    ...requests.map((r) => ({ kind: 'request' as const, ...r })),
    ...reimbursements.map((r) => ({ kind: 'reimbursement' as const, ...r })),
  ].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return (
    <div className="side-panel">
      <div className="side-panel-title">
        <span>{t('recentRequests')}</span>
      </div>
      {items.length === 0 ? (
        <div className="empty-state">No requests yet.</div>
      ) : (
        items.slice(0, 6).map((item) => (
          <div className="side-panel-row" key={`${item.kind}-${item.id}`}>
            {item.kind === 'reimbursement' ? <Wallet size={18} color="var(--info)" /> : item.type === 'leave' ? <Plane size={18} color="var(--chronix-navy)" /> : <FileText size={18} color="var(--chronix-navy)" />}
            <div className="side-panel-row-main">
              <div className="side-panel-name">{item.kind === 'reimbursement' ? 'Reimbursement' : item.type.replace(/_/g, ' ')}</div>
              <div className="side-panel-sub">{new Date(item.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            </div>
            <StatusBadge status={item.status} />
          </div>
        ))
      )}
      <div className="side-panel-footer">{t('viewAll')}</div>
    </div>
  );
}
