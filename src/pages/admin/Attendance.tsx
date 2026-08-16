// Screen C2 — Admin Attendance
import { useMemo, useState } from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { DataTable, type DataTableColumn } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Avatar } from '../../components/common/Avatar';
import { AddEmployeeModal } from '../../components/admin/AddEmployeeModal';
import { useStore } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { formatHours, formatTime, localDateString } from '../../utils/format';
import type { AttendanceRecord, Employee } from '../../types';

interface Row {
  record: AttendanceRecord;
  employee: Employee;
}

export function Attendance() {
  const { t } = useLanguage();
  const { state } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [department, setDepartment] = useState('all');
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return localDateString(d);
  });
  const [to, setTo] = useState(() => localDateString());

  const departments = useMemo(() => Array.from(new Set(state.employees.map((e) => e.department))), [state.employees]);

  const rows: Row[] = useMemo(() => {
    return state.attendance
      .filter((r) => r.date >= from && r.date <= to)
      .map((record) => ({ record, employee: state.employees.find((e) => e.id === record.employeeId)! }))
      .filter((r) => r.employee && (department === 'all' || r.employee.department === department))
      .sort((a, b) => b.record.date.localeCompare(a.record.date));
  }, [state.attendance, state.employees, from, to, department]);

  const totalEmployees = state.employees.filter((e) => e.status !== 'terminated').length;
  const onTimeCount = rows.filter((r) => r.record.status === 'on_time').length;
  const lateCount = rows.filter((r) => r.record.status === 'late').length;

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
    { key: 'date', header: 'Date', render: (row) => row.record.date },
    { key: 'clockIn', header: 'Clock In', render: (row) => (row.record.clockIn ? formatTime(row.record.clockIn) : '—') },
    { key: 'clockOut', header: 'Clock Out', render: (row) => (row.record.clockOut ? formatTime(row.record.clockOut) : '—') },
    { key: 'hours', header: 'Hours', render: (row) => formatHours(row.record.hours) },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.record.status} /> },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>{t('attendanceTitle')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('attendanceSubtitle')}</p>
        </div>
        <button className="btn btn-primary-navy" onClick={() => setShowAddModal(true)}>
          {t('addNewEmployees')}
        </button>
      </div>

      <div className="stat-card-row">
        <StatCard icon={<Users size={18} />} iconBg="var(--info-bg)" iconColor="var(--info)" label={t('statTotalEmployees')} value={String(totalEmployees)} trend={{ direction: 'flat', label: 'vs last week' }} />
        <StatCard icon={<UserCheck size={18} />} iconBg="var(--success-bg)" iconColor="var(--success)" label={t('statOnTime')} value={String(onTimeCount)} trend={{ direction: 'up', label: 'vs last week' }} />
        <StatCard icon={<UserX size={18} />} iconBg="var(--warning-bg)" iconColor="#92660b" label={t('statLateArrival')} value={String(lateCount)} trend={{ direction: 'down', label: 'vs last week' }} />
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="date-range-picker">
          <div className="form-field" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('fromDate')}</label>
            <input type="date" className="form-input" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="form-field" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('toDate')}</label>
            <input type="date" className="form-input" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="form-field" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('allDepartments')}</label>
            <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="all">{t('allDepartments')}</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <DataTable columns={columns} rows={rows} rowKey={(row) => row.record.id} pageSize={10} />

      {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
