// Screen C2 — Admin Attendance
import { useMemo, useState } from 'react';
import { Users, UserCheck, UserX, QrCode, Edit2, Trash2 } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { DataTable, type DataTableColumn } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Avatar } from '../../components/common/Avatar';
import { AddEmployeeModal } from '../../components/admin/AddEmployeeModal';
import { useStore, useStoreActions } from '../../hooks/useStore';
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
  const { updateTempWorker, deleteTempWorker } = useStoreActions();

  const [activeTab, setActiveTab] = useState<'employees' | 'temporary'>('employees');
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

  const tempWorkers = useMemo(() => {
    return (state.temporaryWorkers || []).filter((w) => w.date >= from && w.date <= to);
  }, [state.temporaryWorkers, from, to]);

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
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a href="/temp-checkin" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <QrCode size={16} /> QR Check-In Page
          </a>
          <button className="btn btn-primary-navy" onClick={() => setShowAddModal(true)}>
            {t('addNewEmployees')}
          </button>
        </div>
      </div>

      <div className="stat-card-row">
        <StatCard icon={<Users size={18} />} iconBg="var(--info-bg)" iconColor="var(--info)" label={t('statTotalEmployees')} value={String(totalEmployees)} trend={{ direction: 'flat', label: 'vs last week' }} />
        <StatCard icon={<UserCheck size={18} />} iconBg="var(--success-bg)" iconColor="var(--success)" label={t('statOnTime')} value={String(onTimeCount)} trend={{ direction: 'up', label: 'vs last week' }} />
        <StatCard icon={<UserX size={18} />} iconBg="var(--warning-bg)" iconColor="#92660b" label={t('statLateArrival')} value={String(lateCount)} trend={{ direction: 'down', label: 'vs last week' }} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        <button
          type="button"
          className={`btn ${activeTab === 'employees' ? 'btn-primary-navy' : 'btn-outline'}`}
          onClick={() => setActiveTab('employees')}
        >
          Registered Employees ({rows.length})
        </button>
        <button
          type="button"
          className={`btn ${activeTab === 'temporary' ? 'btn-primary-amber' : 'btn-outline'}`}
          onClick={() => setActiveTab('temporary')}
        >
          Temporary Workers QR Check-Ins ({tempWorkers.length})
        </button>
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
          {activeTab === 'employees' && (
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
          )}
        </div>
      </div>

      {activeTab === 'employees' ? (
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.record.id} pageSize={10} />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {tempWorkers.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No temporary worker check-ins logged within the selected date range.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem' }}>Worker Name</th>
                    <th style={{ padding: '1rem' }}>Contact Phone</th>
                    <th style={{ padding: '1rem' }}>Date</th>
                    <th style={{ padding: '1rem' }}>Clock In</th>
                    <th style={{ padding: '1rem' }}>Clock Out</th>
                    <th style={{ padding: '1rem' }}>Hours</th>
                    <th style={{ padding: '1rem' }}>Hourly Rate (MUR)</th>
                    <th style={{ padding: '1rem' }}>Total Pay (MUR)</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tempWorkers.map((w) => {
                    const pay = Math.round((w.hours || 0) * (w.hourlyRateMUR || 0) * 100) / 100;
                    return (
                      <tr key={w.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem', fontWeight: 700 }}>{w.name}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{w.phone}</td>
                        <td style={{ padding: '1rem' }}>{w.date}</td>
                        <td style={{ padding: '1rem' }}>
                          {w.clockIn ? new Date(w.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {w.clockOut ? new Date(w.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{w.hours || 0} hrs</td>
                        <td style={{ padding: '1rem' }}>MUR {w.hourlyRateMUR || 0}/hr</td>
                        <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--chronix-navy)' }}>
                          MUR {pay.toLocaleString('en-US')}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="btn btn-outline"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                              onClick={() => {
                                const newName = prompt('Edit Temporary Worker Name:', w.name);
                                if (newName === null) return;
                                const newPhone = prompt('Edit Contact Phone:', w.phone) ?? w.phone;
                                const newRate = Number(prompt('Edit Hourly Rate (MUR):', String(w.hourlyRateMUR || 0)) || 0);
                                updateTempWorker({ ...w, name: newName, phone: newPhone, hourlyRateMUR: newRate });
                              }}
                            >
                              <Edit2 size={14} /> Edit Salary/Info
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                              onClick={() => {
                                if (confirm(`Delete temporary worker record for "${w.name}"?`)) {
                                  deleteTempWorker(w.id);
                                }
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
