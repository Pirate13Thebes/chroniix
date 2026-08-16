// Screen C3 — Admin Leave Management
import { useMemo, useState } from 'react';
import { Clock, CheckCircle2, XCircle, CalendarClock, Eye } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { DataTable, type DataTableColumn } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ApproveRejectActions } from '../../components/common/ApproveRejectActions';
import { Avatar } from '../../components/common/Avatar';
import { SearchInput } from '../../components/common/SearchInput';
import { PendingApprovalsPanel } from '../../components/admin/PendingApprovalsPanel';
import { UpcomingLeavePanel } from '../../components/admin/UpcomingLeavePanel';
import { RequestDetailModal } from '../../components/admin/RequestDetailModal';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { useSession } from '../../hooks/useSession';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDateRange, localDateString } from '../../utils/format';
import type { Employee, Request } from '../../types';

interface Row {
  request: Request;
  employee: Employee;
}

export function LeaveManagement() {
  const { t } = useLanguage();
  const { state } = useStore();
  const { decideRequest } = useStoreActions();
  const { session } = useSession();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingRow, setViewingRow] = useState<Row | null>(null);

  const leaveRequests = state.requests.filter((r) => r.type === 'leave');
  const pendingCount = leaveRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = leaveRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = leaveRequests.filter((r) => r.status === 'rejected').length;
  const upcomingCount = leaveRequests.filter((r) => r.status === 'approved' && r.dateFrom >= localDateString()).length;

  const rows: Row[] = useMemo(() => {
    return leaveRequests
      .map((request) => ({ request, employee: state.employees.find((e) => e.id === request.employeeId)! }))
      .filter((r) => r.employee)
      .filter((r) => statusFilter === 'all' || r.request.status === statusFilter)
      .filter((r) => !search || `${r.employee.firstName} ${r.employee.lastName}`.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.request.submittedAt.localeCompare(a.request.submittedAt));
  }, [leaveRequests, state.employees, statusFilter, search]);

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
    { key: 'department', header: 'Department', render: (row) => row.employee.department },
    { key: 'type', header: 'Leave Type', render: (row) => row.request.leaveType ?? row.request.type },
    { key: 'dates', header: 'Dates', render: (row) => formatDateRange(row.request.dateFrom, row.request.dateTo, row.request.days) },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.request.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button type="button" className="icon-btn" aria-label="View details" onClick={() => setViewingRow(row)}>
            <Eye size={16} />
          </button>
          <ApproveRejectActions
            disabled={row.request.status === 'approved' || row.request.status === 'rejected'}
            onApprove={() => decideRequest(row.request.id, 'approved', session?.employeeId ?? '')}
            onReject={() => decideRequest(row.request.id, 'rejected', session?.employeeId ?? '')}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>{t('leaveManagementTitle')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('leaveManagementSubtitle')}</p>
        </div>
      </div>

      <div className="stat-card-row">
        <StatCard icon={<Clock size={18} />} iconBg="var(--warning-bg)" iconColor="#92660b" label={t('statPendingRequests')} value={String(pendingCount)} trend={{ direction: 'flat', label: t('awaitingApproval') }} />
        <StatCard icon={<CheckCircle2 size={18} />} iconBg="var(--success-bg)" iconColor="var(--success)" label={t('statApprovedLeaves')} value={String(approvedCount)} trend={{ direction: 'up', label: 'vs last month' }} />
        <StatCard icon={<XCircle size={18} />} iconBg="var(--danger-bg)" iconColor="var(--danger)" label={t('statRejectedRequests')} value={String(rejectedCount)} trend={{ direction: 'down', label: 'vs last month' }} />
        <StatCard icon={<CalendarClock size={18} />} iconBg="var(--info-bg)" iconColor="var(--info)" label={t('statUpcomingLeave')} value={String(upcomingCount)} trend={{ direction: 'flat', label: t('next30Days') }} />
      </div>

      <div className="responsive-grid-main-sidebar">
        <div className="card">
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <SearchInput value={search} onChange={setSearch} placeholder={t('search')} />
            <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">{t('allStatus')}</option>
              <option value="pending">{t('statusPending')}</option>
              <option value="in_review">{t('statusInReview')}</option>
              <option value="approved">{t('statusApproved')}</option>
              <option value="rejected">{t('statusRejected')}</option>
            </select>
          </div>
          <DataTable columns={columns} rows={rows} rowKey={(row) => row.request.id} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <PendingApprovalsPanel />
          <UpcomingLeavePanel />
        </div>
      </div>

      {viewingRow && (
        <RequestDetailModal
          title="Leave Request"
          employee={viewingRow.employee}
          status={viewingRow.request.status}
          fields={[
            { label: 'Leave Type', value: viewingRow.request.leaveType ?? viewingRow.request.type },
            { label: 'Dates', value: formatDateRange(viewingRow.request.dateFrom, viewingRow.request.dateTo, viewingRow.request.days) },
          ]}
          reason={viewingRow.request.reason}
          attachmentUrl={viewingRow.request.attachmentUrl}
          onApprove={() => decideRequest(viewingRow.request.id, 'approved', session?.employeeId ?? '')}
          onReject={() => decideRequest(viewingRow.request.id, 'rejected', session?.employeeId ?? '')}
          onClose={() => setViewingRow(null)}
        />
      )}
    </div>
  );
}
