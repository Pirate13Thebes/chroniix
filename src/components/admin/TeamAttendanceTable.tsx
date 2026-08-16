import { Eye, MoreHorizontal } from 'lucide-react';
import { DataTable, type DataTableColumn } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { Avatar } from '../common/Avatar';
import { useStore } from '../../hooks/useStore';
import { formatHours, formatTime, localDateString } from '../../utils/format';
import type { AttendanceRecord, Employee } from '../../types';

interface Row {
  record: AttendanceRecord;
  employee: Employee;
}

export function TeamAttendanceTable({ limit }: { limit?: number }) {
  const { state } = useStore();
  const today = localDateString();

  const rows: Row[] = state.attendance
    .filter((r) => r.date === today)
    .map((record) => ({ record, employee: state.employees.find((e) => e.id === record.employeeId)! }))
    .filter((r) => r.employee)
    .sort((a, b) => a.employee.firstName.localeCompare(b.employee.firstName));

  const displayed = limit ? rows.slice(0, limit) : rows;

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
    { key: 'clockIn', header: 'Clock In', render: (row) => formatTime(row.record.clockIn) },
    { key: 'clockOut', header: 'Clock Out', render: (row) => (row.record.clockOut ? formatTime(row.record.clockOut) : '—') },
    { key: 'hours', header: 'Hours', render: (row) => formatHours(row.record.hours) },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.record.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Eye size={16} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
          <MoreHorizontal size={16} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} rows={displayed} rowKey={(row) => row.record.id} emptyMessage="No attendance recorded today." />;
}
