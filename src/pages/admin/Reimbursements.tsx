// Screen C4 — Admin Reimbursements
import { useMemo, useState } from 'react';
import { Clock, CheckCircle2, XCircle, Wallet, Eye } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { DataTable, type DataTableColumn } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ApproveRejectActions } from '../../components/common/ApproveRejectActions';
import { Avatar } from '../../components/common/Avatar';
import { RecentActivityPanel } from '../../components/admin/RecentActivityPanel';
import { RequestDetailModal } from '../../components/admin/RequestDetailModal';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { formatMUR } from '../../utils/format';
import type { Employee, Reimbursement } from '../../types';

interface Row {
  reimbursement: Reimbursement;
  employee: Employee;
}

export function Reimbursements() {
  const { t } = useLanguage();
  const { state } = useStore();
  const { decideReimbursement } = useStoreActions();
  const [viewingRow, setViewingRow] = useState<Row | null>(null);

  const pendingCount = state.reimbursements.filter((r) => r.status === 'pending' || r.status === 'in_review').length;
  const approvedCount = state.reimbursements.filter((r) => r.status === 'approved').length;
  const rejectedCount = state.reimbursements.filter((r) => r.status === 'rejected').length;
  const totalReimbursed = state.reimbursements.filter((r) => r.status === 'approved').reduce((sum, r) => sum + r.amountMUR, 0);

  const rows: Row[] = useMemo(() => {
    return state.reimbursements
      .map((reimbursement) => ({ reimbursement, employee: state.employees.find((e) => e.id === reimbursement.employeeId)! }))
      .filter((r) => r.employee)
      .sort((a, b) => b.reimbursement.submittedAt.localeCompare(a.reimbursement.submittedAt));
  }, [state.reimbursements, state.employees]);

  const columns: DataTableColumn<Row>[] = [
    {
      key: 'employee',
      header: 'Employee',
      cardPrimary: true,
      render: (row) => (
        <div className="table-person">
          <Avatar src={row.employee.avatarUrl} name={`${row.employee.firstName} ${row.employee.lastName}`} size={32} />
          <span>
            {row.employee.firstName} {row.employee.lastName}
          </span>
        </div>
      ),
    },
    { key: 'type', header: 'Expense Type', render: (row) => row.reimbursement.expenseType },
    { key: 'description', header: 'Description', render: (row) => row.reimbursement.description },
    { key: 'date', header: 'Date', render: (row) => row.reimbursement.date },
    {
      key: 'receipt',
      header: 'Receipt',
      render: (row) =>
        row.reimbursement.receiptUrl ? (
          <a href={row.reimbursement.receiptUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--chronix-navy)', fontWeight: 600 }}>
            {t('viewReceipt')}
          </a>
        ) : (
          '—'
        ),
    },
    { key: 'amount', header: 'Amount', render: (row) => formatMUR(row.reimbursement.amountMUR) },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.reimbursement.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button type="button" className="icon-btn" aria-label="View details" onClick={() => setViewingRow(row)}>
            <Eye size={16} />
          </button>
          <ApproveRejectActions
            disabled={row.reimbursement.status === 'approved' || row.reimbursement.status === 'rejected'}
            onApprove={() => decideReimbursement(row.reimbursement.id, 'approved')}
            onReject={() => decideReimbursement(row.reimbursement.id, 'rejected')}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>{t('reimbursementsTitle')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('reimbursementsSubtitle')}</p>
        </div>
      </div>

      <div className="stat-card-row">
        <StatCard icon={<Clock size={18} />} iconBg="var(--warning-bg)" iconColor="#92660b" label={t('statPendingClaims')} value={String(pendingCount)} trend={{ direction: 'flat', label: t('awaitingApproval') }} />
        <StatCard icon={<CheckCircle2 size={18} />} iconBg="var(--success-bg)" iconColor="var(--success)" label={t('statApprovedClaims')} value={String(approvedCount)} trend={{ direction: 'up', label: 'vs last month' }} />
        <StatCard icon={<XCircle size={18} />} iconBg="var(--danger-bg)" iconColor="var(--danger)" label={t('statRejectedClaims')} value={String(rejectedCount)} trend={{ direction: 'down', label: 'vs last month' }} />
        <StatCard icon={<Wallet size={18} />} iconBg="var(--info-bg)" iconColor="var(--info)" label={t('statTotalReimbursed')} value={formatMUR(totalReimbursed)} trend={{ direction: 'up', label: 'vs last month' }} />
      </div>

      <div className="responsive-grid-main-sidebar">
        <div className="card">
          <DataTable columns={columns} rows={rows} rowKey={(row) => row.reimbursement.id} />
        </div>
        <RecentActivityPanel />
      </div>

      {viewingRow && (
        <RequestDetailModal
          title="Reimbursement"
          employee={viewingRow.employee}
          status={viewingRow.reimbursement.status}
          fields={[
            { label: 'Expense Type', value: viewingRow.reimbursement.expenseType },
            { label: 'Date', value: viewingRow.reimbursement.date },
            { label: 'Amount', value: formatMUR(viewingRow.reimbursement.amountMUR) },
          ]}
          reason={viewingRow.reimbursement.description}
          attachmentUrl={viewingRow.reimbursement.receiptUrl}
          onApprove={() => decideReimbursement(viewingRow.reimbursement.id, 'approved')}
          onReject={() => decideReimbursement(viewingRow.reimbursement.id, 'rejected')}
          onClose={() => setViewingRow(null)}
        />
      )}
    </div>
  );
}
