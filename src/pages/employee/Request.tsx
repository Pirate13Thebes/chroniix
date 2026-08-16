// Screen D2 — Employee Request
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { ProgressTracker } from '../../components/common/ProgressTracker';
import { PolicyReminderBox } from '../../components/common/PolicyReminderBox';
import { RequestForm } from '../../components/employee/RequestForm';
import { RecentRequestsPanel } from '../../components/employee/RecentRequestsPanel';
import { useSession } from '../../hooks/useSession';
import { useStore } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { getEmployeeRequests } from '../../store/selectors';

export function RequestPage() {
  const { t } = useLanguage();
  const { session } = useSession();
  const { state } = useStore();
  const employeeId = session?.employeeId ?? '';

  const requests = getEmployeeRequests(state, employeeId);
  const reimbursements = state.reimbursements.filter((r) => r.employeeId === employeeId).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  const pendingCount = requests.filter((r) => r.status === 'pending' || r.status === 'in_review').length;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const approvedCount = requests.filter((r) => r.status === 'approved' && r.decidedAt?.startsWith(thisMonth)).length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected' && r.decidedAt?.startsWith(thisMonth)).length;

  const latestRequest = requests[0];

  const prevStatuses = useRef<Record<string, string>>({});
  useEffect(() => {
    requests.forEach((r) => {
      const prev = prevStatuses.current[r.id];
      if (prev && prev !== 'approved' && r.status === 'approved') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
      prevStatuses.current[r.id] = r.status;
    });
  }, [requests]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.4rem' }}>{t('requestTitle')}</h1>
        </div>
      </div>

      <div className="stat-card-row">
        <StatCard icon={<Clock size={18} />} iconBg="var(--warning-bg)" iconColor="#92660b" label={t('statPendingRequestsEmp')} value={String(pendingCount)} />
        <StatCard icon={<CheckCircle2 size={18} />} iconBg="var(--success-bg)" iconColor="var(--success)" label={t('statApprovedThisMonth')} value={String(approvedCount)} trend={{ direction: 'flat', label: t('thisMonth') }} />
        <StatCard icon={<XCircle size={18} />} iconBg="var(--danger-bg)" iconColor="var(--danger)" label={t('statRejectedThisMonth')} value={String(rejectedCount)} trend={{ direction: 'flat', label: t('thisMonth') }} />
      </div>

      <div className="responsive-grid-main-sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <RequestForm employeeId={employeeId} />

          {latestRequest && (
            <div className="card">
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>{t('approvalInProgress')}</h3>
              <ProgressTracker steps={latestRequest.approvalSteps} />
            </div>
          )}

          <PolicyReminderBox title={t('policyReminderTitle')} notes={[t('policyReminder3Days'), t('policyReminderHalfDay')]} />
        </div>
        <RecentRequestsPanel requests={requests} reimbursements={reimbursements} />
      </div>
    </div>
  );
}
