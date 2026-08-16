import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { SidePanelList, type SidePanelRowDef } from '../common/SidePanelList';
import { Avatar } from '../common/Avatar';
import { ApproveRejectActions } from '../common/ApproveRejectActions';
import { RequestDetailModal } from './RequestDetailModal';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { useSession } from '../../hooks/useSession';
import { getPendingApprovals } from '../../store/selectors';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDateRange, formatMUR } from '../../utils/format';

export function PendingApprovalsPanel() {
  const { t } = useLanguage();
  const { state } = useStore();
  const { decideRequest, decideReimbursement } = useStoreActions();
  const { session } = useSession();
  const navigate = useNavigate();
  const approvals = getPendingApprovals(state).slice(0, 5);
  const [viewingId, setViewingId] = useState<string | null>(null);

  function handleDecide(id: string, kind: string, decision: 'approved' | 'rejected') {
    if (kind === 'reimbursement') {
      decideReimbursement(id, decision);
    } else {
      decideRequest(id, decision, session?.employeeId ?? '');
    }
  }

  const rows: SidePanelRowDef[] = approvals.map((a) => {
    const emp = state.employees.find((e) => e.id === a.employeeId);
    return {
      key: a.id,
      leading: <Avatar src={emp?.avatarUrl} name={emp ? `${emp.firstName} ${emp.lastName}` : '?'} size={32} />,
      name: a.label,
      sub: emp ? `${emp.firstName} ${emp.lastName}` : '',
      trailing: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button type="button" className="icon-btn" aria-label="View details" onClick={() => setViewingId(a.id)}>
            <Eye size={14} />
          </button>
          <ApproveRejectActions
            onApprove={() => handleDecide(a.id, a.kind, 'approved')}
            onReject={() => handleDecide(a.id, a.kind, 'rejected')}
          />
        </div>
      ),
    };
  });

  const viewingReimbursement = viewingId ? state.reimbursements.find((r) => r.id === viewingId) : null;
  const viewingRequest = !viewingReimbursement && viewingId ? state.requests.find((r) => r.id === viewingId) : null;
  const viewingEmployee = state.employees.find(
    (e) => e.id === (viewingReimbursement?.employeeId ?? viewingRequest?.employeeId)
  );

  return (
    <>
      <SidePanelList
        title={t('pendingApprovals')}
        count={getPendingApprovals(state).length}
        rows={rows}
        footerLabel={t('viewAllApprovals')}
        onFooterClick={() => navigate('/admin/leave')}
        emptyMessage="No pending approvals."
      />

      {viewingReimbursement && viewingEmployee && (
        <RequestDetailModal
          title="Reimbursement"
          employee={viewingEmployee}
          status={viewingReimbursement.status}
          fields={[
            { label: 'Expense Type', value: viewingReimbursement.expenseType },
            { label: 'Date', value: viewingReimbursement.date },
            { label: 'Amount', value: formatMUR(viewingReimbursement.amountMUR) },
          ]}
          reason={viewingReimbursement.description}
          attachmentUrl={viewingReimbursement.receiptUrl}
          onApprove={() => decideReimbursement(viewingReimbursement.id, 'approved')}
          onReject={() => decideReimbursement(viewingReimbursement.id, 'rejected')}
          onClose={() => setViewingId(null)}
        />
      )}

      {viewingRequest && viewingEmployee && (
        <RequestDetailModal
          title="Leave Request"
          employee={viewingEmployee}
          status={viewingRequest.status}
          fields={[
            { label: 'Leave Type', value: viewingRequest.leaveType ?? viewingRequest.type },
            { label: 'Dates', value: formatDateRange(viewingRequest.dateFrom, viewingRequest.dateTo, viewingRequest.days) },
          ]}
          reason={viewingRequest.reason}
          attachmentUrl={viewingRequest.attachmentUrl}
          onApprove={() => decideRequest(viewingRequest.id, 'approved', session?.employeeId ?? '')}
          onReject={() => decideRequest(viewingRequest.id, 'rejected', session?.employeeId ?? '')}
          onClose={() => setViewingId(null)}
        />
      )}
    </>
  );
}
