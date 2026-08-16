// Screen C6 — Admin Settings detail (generic shell keyed by :sectionId)
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { ADMIN_SETTINGS_SECTIONS } from '../../data/settingsSections';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { useSession } from '../../hooks/useSession';
import { uid } from '../../store/storeReducer';
import { getTrialStatus } from '../../utils/trial';
import { Avatar } from '../../components/common/Avatar';
import { EditEmployeeModal } from '../../components/admin/EditEmployeeModal';
import { TerminateEmployeeModal } from '../../components/admin/TerminateEmployeeModal';
import type { ApprovalStepName, CheckInMethod, Employee, EmployeeRole, LeaveType, NotificationChannel, Shift } from '../../types';

const CHECK_IN_OPTIONS: Array<{ value: CheckInMethod; label: string }> = [
  { value: 'gps_face', label: 'GPS Check-In' },
  { value: 'qr', label: 'QR Code' },
  { value: 'kiosk', label: 'Shared Kiosk Terminal' },
];

const LEAVE_TYPE_OPTIONS: Array<{ value: LeaveType; label: string }> = [
  { value: 'annual', label: 'Annual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'personal', label: 'Personal Leave' },
];

const APPROVAL_STEP_OPTIONS: Array<{ value: ApprovalStepName; label: string }> = [
  { value: 'submitted', label: 'Submitted (employee)' },
  { value: 'team_lead', label: 'Team Lead review' },
  { value: 'manager', label: 'Manager review' },
  { value: 'hr', label: 'HR sign-off' },
];

const NOTIFICATION_CHANNEL_OPTIONS: Array<{ value: NotificationChannel; label: string }> = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'in_app', label: 'In-app' },
];

const ROLE_OPTIONS: Array<{ value: EmployeeRole; label: string }> = [
  { value: 'employee', label: 'Employee' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'hr', label: 'HR' },
  { value: 'admin', label: 'Admin' },
];

const emptyShiftDraft = { name: '', start: '09:00', end: '17:00', type: 'general' as Shift['type'], graceMinutes: '10' };

export function AdminSettingsDetail() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { state } = useStore();
  const { updateSettings, updateEmployee } = useStoreActions();
  const { session } = useSession();
  const section = ADMIN_SETTINGS_SECTIONS.find((s) => s.id === sectionId);
  const [shiftDraft, setShiftDraft] = useState(emptyShiftDraft);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [terminatingEmployee, setTerminatingEmployee] = useState<Employee | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  if (!section) return <div className="empty-state">Section not found.</div>;

  const me = state.employees.find((e) => e.id === session?.employeeId);

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);
    if (!me) return;
    if (currentPassword !== me.credential) {
      setPwError('Current password is incorrect.');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New passwords don't match.");
      return;
    }
    updateEmployee({ ...me, credential: newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPwSuccess(true);
  }

  function handleAddShift(e: React.FormEvent) {
    e.preventDefault();
    if (!shiftDraft.name.trim()) return;
    const newShift: Shift = {
      id: uid('shift'),
      name: shiftDraft.name.trim(),
      start: shiftDraft.start,
      end: shiftDraft.end,
      type: shiftDraft.type,
      graceMinutes: Number(shiftDraft.graceMinutes) || 0,
    };
    updateSettings({ shifts: [...state.settings.shifts, newShift] });
    setShiftDraft(emptyShiftDraft);
  }

  function handleRemoveShift(id: string) {
    updateSettings({ shifts: state.settings.shifts.filter((s) => s.id !== id) });
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="icon-btn" onClick={() => navigate('/admin/settings')}>
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.3rem' }}>{section.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{section.description}</p>
          </div>
        </div>
      </div>

      <div className="card">
        {section.id === 'shift-settings' && (
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Shifts</h3>
            {state.settings.shifts.length === 0 && (
              <p className="empty-state" style={{ marginBottom: '1rem' }}>No shifts yet — add your first one below.</p>
            )}
            {state.settings.shifts.map((shift) => (
              <div key={shift.id} className="side-panel-row">
                <div className="side-panel-row-main">
                  <div className="side-panel-name">{shift.name}</div>
                  <div className="side-panel-sub">
                    {shift.start} – {shift.end} · grace {shift.graceMinutes}m
                  </div>
                </div>
                <span className="status-badge status-badge--in-review">{shift.type}</span>
                <button type="button" className="icon-btn" aria-label="Remove shift" onClick={() => handleRemoveShift(shift.id)} style={{ marginLeft: '0.5rem' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <form onSubmit={handleAddShift} style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>Add a shift</h4>
              <div className="responsive-grid-1-1">
                <div className="form-field">
                  <label className="form-label">Shift Name</label>
                  <input className="form-input" placeholder="ex: Morning Shift" value={shiftDraft.name} onChange={(e) => setShiftDraft({ ...shiftDraft, name: e.target.value })} />
                </div>
                <div className="form-field">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={shiftDraft.type} onChange={(e) => setShiftDraft({ ...shiftDraft, type: e.target.value as Shift['type'] })}>
                    <option value="general">General</option>
                    <option value="night">Night</option>
                    <option value="split">Split</option>
                  </select>
                </div>
              </div>
              <div className="responsive-grid-1-1">
                <div className="form-field">
                  <label className="form-label">Start Time</label>
                  <input className="form-input" type="time" value={shiftDraft.start} onChange={(e) => setShiftDraft({ ...shiftDraft, start: e.target.value })} />
                </div>
                <div className="form-field">
                  <label className="form-label">End Time</label>
                  <input className="form-input" type="time" value={shiftDraft.end} onChange={(e) => setShiftDraft({ ...shiftDraft, end: e.target.value })} />
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Grace Period (minutes)</label>
                <input className="form-input" type="number" min="0" value={shiftDraft.graceMinutes} onChange={(e) => setShiftDraft({ ...shiftDraft, graceMinutes: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary-navy">Add Shift</button>
            </form>
          </div>
        )}

        {section.id === 'work-location-settings' && (
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Work Locations</h3>
            {state.settings.workLocations.map((loc) => (
              <div key={loc.id} className="side-panel-row">
                <div className="side-panel-row-main">
                  <div className="side-panel-name">{loc.name}</div>
                  <div className="side-panel-sub">{loc.address}</div>
                </div>
                <span className="side-panel-sub">radius {loc.radiusMeters}m</span>
              </div>
            ))}
          </div>
        )}

        {section.id === 'check-in-methods' && (
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Allowed Check-In Methods</h3>
            {CHECK_IN_OPTIONS.map((opt) => (
              <label key={opt.value} className="side-panel-row" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={state.settings.checkInMethods.includes(opt.value)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...state.settings.checkInMethods, opt.value]
                      : state.settings.checkInMethods.filter((m) => m !== opt.value);
                    updateSettings({ checkInMethods: next });
                  }}
                />
                <span className="side-panel-name">{opt.label}</span>
              </label>
            ))}

            {state.settings.checkInMethods.includes('kiosk') && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Open this on a shared tablet or computer at your entrance — employees tap their own name to clock in or out.
                </p>
                <a href="/kiosk" target="_blank" rel="noreferrer" className="btn btn-primary-navy" style={{ display: 'inline-flex' }}>
                  Launch Kiosk Terminal →
                </a>
              </div>
            )}
          </div>
        )}

        {section.id === 'billing' && (
          <div>
            {(() => {
              const trial = getTrialStatus(state.settings);
              const planNames: Record<string, string> = { starter: 'Starter', growth: 'Growth', enterprise: 'Enterprise' };
              return (
                <>
                  <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Chronix Plan</h3>
                  <div className="side-panel-row" style={{ marginBottom: '1.5rem' }}>
                    <div className="side-panel-row-main">
                      <div className="side-panel-name">
                        {state.settings.plan ? `${planNames[state.settings.plan]} Plan` : 'No plan selected yet'}
                      </div>
                      <div className="side-panel-sub">
                        {state.settings.billingStatus === 'awaiting_confirmation'
                          ? 'Awaiting payment confirmation'
                          : state.settings.billingStatus === 'confirmed'
                            ? 'Payment confirmed'
                            : 'Currently on your free trial'}
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary-amber" onClick={() => navigate('/billing/checkout')}>
                      {state.settings.plan ? 'Change Plan' : 'Choose a Plan'}
                    </button>
                  </div>

                  <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Trial Status</h3>
                  <div className="side-panel-row">
                    <div className="side-panel-row-main">
                      <div className="side-panel-name">
                        {state.settings.trialCancelled
                          ? 'Trial cancelled'
                          : trial.active
                            ? trial.expired
                              ? 'Trial ended'
                              : `${trial.daysRemaining} day${trial.daysRemaining === 1 ? '' : 's'} remaining`
                            : 'No active trial'}
                      </div>
                      <div className="side-panel-sub">7-day free trial, then billed automatically unless cancelled.</div>
                    </div>
                    {trial.active && !state.settings.trialCancelled && (
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                          if (confirm('Cancel your trial? You will not be charged.')) {
                            updateSettings({ trialCancelled: true });
                          }
                        }}
                      >
                        Cancel Trial
                      </button>
                    )}
                  </div>

                  <h3 style={{ margin: '1.5rem 0 0.75rem', fontSize: '0.95rem' }}>Payment Method</h3>
                  {state.settings.billingCard ? (
                    <div className="side-panel-row">
                      <div className="side-panel-row-main">
                        <div className="side-panel-name">
                          {state.settings.billingCard.brand} •••• {state.settings.billingCard.last4}
                        </div>
                        <div className="side-panel-sub">Expires {state.settings.billingCard.expiry}</div>
                      </div>
                    </div>
                  ) : (
                    <p className="empty-state">No card on file.</p>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {section.id === 'employee-settings' && (() => {
          const activeEmployees = state.employees.filter((e) => e.status !== 'terminated');
          const terminatedEmployees = state.employees.filter((e) => e.status === 'terminated');
          return (
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Team ({activeEmployees.length})</h3>
              {activeEmployees.length === 0 && <p className="empty-state">No employees yet.</p>}
              {activeEmployees.map((emp) => {
                const shift = state.settings.shifts.find((s) => s.id === emp.shiftId);
                return (
                  <div key={emp.id} className="side-panel-row">
                    <Avatar src={emp.avatarUrl} name={`${emp.firstName} ${emp.lastName}`} size={36} />
                    <div className="side-panel-row-main">
                      <div className="side-panel-name">{emp.firstName} {emp.lastName}</div>
                      <div className="side-panel-sub">
                        {emp.department || '—'} · {shift ? shift.name : 'No shift'} · MUR {emp.hourlyRateMUR}/hr {emp.allowedCheckInMethods.includes('kiosk') && `· Kiosk PIN: ${emp.kioskPin || emp.credential}`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="button" className="btn btn-outline" onClick={() => setEditingEmployee(emp)}>
                        Edit
                      </button>
                      {emp.role !== 'admin' && (
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                          onClick={() => setTerminatingEmployee(emp)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {terminatedEmployees.length > 0 && (
                <>
                  <h3 style={{ margin: '1.75rem 0 1rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    Former Employees ({terminatedEmployees.length})
                  </h3>
                  {terminatedEmployees.map((emp) => (
                    <div key={emp.id} className="side-panel-row" style={{ opacity: 0.7 }}>
                      <Avatar src={emp.avatarUrl} name={`${emp.firstName} ${emp.lastName}`} size={36} />
                      <div className="side-panel-row-main">
                        <div className="side-panel-name">{emp.firstName} {emp.lastName}</div>
                        <div className="side-panel-sub">
                          Removed {emp.terminatedAt} — {emp.terminationReason}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => updateEmployee({ ...emp, status: 'active', terminatedAt: null, terminationReason: null })}
                      >
                        Reinstate
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })()}

        {section.id === 'leave-absence-settings' && (
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Leave Types</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Employees can only pick from the leave types you enable here when submitting a request.
            </p>
            {LEAVE_TYPE_OPTIONS.map((opt) => (
              <label key={opt.value} className="side-panel-row" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={state.settings.leaveTypes.includes(opt.value)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...state.settings.leaveTypes, opt.value]
                      : state.settings.leaveTypes.filter((v) => v !== opt.value);
                    if (next.length === 0) return; // keep at least one leave type enabled
                    updateSettings({ leaveTypes: next });
                  }}
                />
                <span className="side-panel-name">{opt.label}</span>
              </label>
            ))}

            <h3 style={{ margin: '1.75rem 0 0.5rem', fontSize: '0.95rem' }}>Approval Workflow</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Which steps a leave request must pass through before it's fully approved.
            </p>
            {APPROVAL_STEP_OPTIONS.map((opt) => (
              <label key={opt.value} className="side-panel-row" style={{ cursor: opt.value === 'submitted' ? 'default' : 'pointer' }}>
                <input
                  type="checkbox"
                  checked={state.settings.approvalFlow.includes(opt.value)}
                  disabled={opt.value === 'submitted'}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...state.settings.approvalFlow, opt.value]
                      : state.settings.approvalFlow.filter((v) => v !== opt.value);
                    updateSettings({ approvalFlow: next });
                  }}
                />
                <span className="side-panel-name">{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {section.id === 'report-settings' && (
          <div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Default Report Period</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              How far back the Reports page looks by default. You can always override it with a custom range there.
            </p>
            <div className="form-field" style={{ maxWidth: 260 }}>
              <select
                className="form-select"
                value={state.settings.defaultReportRangeDays}
                onChange={(e) => updateSettings({ defaultReportRangeDays: Number(e.target.value) })}
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>
        )}

        {section.id === 'user-roles-permissions' && (
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Roles</h3>
            {state.employees.filter((e) => e.status !== 'terminated').length === 0 && (
              <p className="empty-state">No employees yet.</p>
            )}
            {state.employees.filter((e) => e.status !== 'terminated').map((emp) => (
              <div key={emp.id} className="side-panel-row">
                <Avatar src={emp.avatarUrl} name={`${emp.firstName} ${emp.lastName}`} size={36} />
                <div className="side-panel-row-main">
                  <div className="side-panel-name">{emp.firstName} {emp.lastName}</div>
                  <div className="side-panel-sub">{emp.email}</div>
                </div>
                <select
                  className="form-select"
                  style={{ width: 'auto' }}
                  value={emp.role}
                  disabled={emp.id === session?.employeeId}
                  onChange={(e) => updateEmployee({ ...emp, role: e.target.value as EmployeeRole })}
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
              You can't change your own role here — ask another admin if you need that changed.
            </p>
          </div>
        )}

        {section.id === 'security-settings' && me && (
          <form onSubmit={handleChangePassword} style={{ maxWidth: 360 }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Change Password</h3>
            <div className="form-field">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password" value={currentPassword} onChange={(e) => { setCurrentPassword(e.target.value); setPwError(''); }} required />
            </div>
            <div className="form-field">
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setPwError(''); }} required minLength={6} />
            </div>
            <div className="form-field">
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPwError(''); }} required minLength={6} />
            </div>
            {pwError && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>{pwError}</p>}
            {pwSuccess && <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1rem' }}>Password updated.</p>}
            <button type="submit" className="btn btn-primary-navy">Update Password</button>
          </form>
        )}

        {section.id === 'notification-settings' && (
          <div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Notify me when</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              How Chronix should reach you when a new leave or reimbursement request comes in.
            </p>
            {NOTIFICATION_CHANNEL_OPTIONS.map((opt) => (
              <label key={opt.value} className="side-panel-row" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={state.settings.notificationChannels.includes(opt.value)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...state.settings.notificationChannels, opt.value]
                      : state.settings.notificationChannels.filter((v) => v !== opt.value);
                    updateSettings({ notificationChannels: next });
                  }}
                />
                <span className="side-panel-name">{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {![
          'shift-settings', 'work-location-settings', 'check-in-methods', 'billing', 'employee-settings',
          'leave-absence-settings', 'report-settings', 'user-roles-permissions', 'security-settings', 'notification-settings',
        ].includes(section.id) && (
          <div className="empty-state">This section is coming soon.</div>
        )}
      </div>

      {editingEmployee && <EditEmployeeModal employee={editingEmployee} onClose={() => setEditingEmployee(null)} />}
      {terminatingEmployee && <TerminateEmployeeModal employee={terminatingEmployee} onClose={() => setTerminatingEmployee(null)} />}
    </div>
  );
}
