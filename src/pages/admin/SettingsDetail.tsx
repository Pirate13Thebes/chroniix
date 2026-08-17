// Screen C6 — Admin Settings detail (generic shell keyed by :sectionId)
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2, Eye, EyeOff } from 'lucide-react';
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', margin: 0 }}>Work Locations</h3>
              <button
                type="button"
                className="btn btn-primary-navy"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                onClick={() => {
                  const name = prompt('Work Location Name (e.g. Headquarters):');
                  if (!name) return;
                  const address = prompt('Address (e.g. Port Louis, Mauritius):') || name;
                  const radiusMeters = Number(prompt('Radius in meters (e.g. 150):') || '150');
                  const newLoc = { id: uid('loc'), name, address, radiusMeters, lat: -20.2, lng: 57.5 };
                  updateSettings({ workLocations: [...state.settings.workLocations, newLoc] });
                }}
              >
                + Add Work Location
              </button>
            </div>

            {state.settings.workLocations.length === 0 && <p className="empty-state">No work locations configured.</p>}
            {state.settings.workLocations.map((loc) => (
              <div key={loc.id} className="side-panel-row" style={{ alignItems: 'center' }}>
                <div className="side-panel-row-main">
                  <div className="side-panel-name">{loc.name}</div>
                  <div className="side-panel-sub">{loc.address} · radius {loc.radiusMeters}m</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                    onClick={() => {
                      const newName = prompt('Edit Location Name:', loc.name);
                      if (newName === null) return;
                      const newAddr = prompt('Edit Location Address:', loc.address) ?? loc.address;
                      const newRad = Number(prompt('Edit Radius (meters):', String(loc.radiusMeters)) || loc.radiusMeters);
                      const updatedLocs = state.settings.workLocations.map((l) =>
                        l.id === loc.id ? { ...l, name: newName, address: newAddr, radiusMeters: newRad } : l
                      );
                      updateSettings({ workLocations: updatedLocs });
                    }}
                  >
                    Edit
                  </button>
                  {state.settings.workLocations.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                      onClick={() => {
                        if (confirm(`Delete location "${loc.name}"?`)) {
                          updateSettings({ workLocations: state.settings.workLocations.filter((l) => l.id !== loc.id) });
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
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

            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 700 }}>QR Code & Kiosk Check-In Terminals</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Print or display the QR code at your business entrance for temporary worker check-in, or launch the interactive kiosk terminal for registered staff.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {state.settings.checkInMethods.includes('kiosk') && (
                  <a href="/kiosk" target="_blank" rel="noreferrer" className="btn btn-primary-navy">
                    Launch Kiosk Terminal →
                  </a>
                )}
                <a href="/temp-checkin" target="_blank" rel="noreferrer" className="btn btn-primary-amber">
                  Open QR Check-In Page 📱
                </a>
              </div>

              <div className="card" style={{ marginTop: '1.25rem', textAlign: 'center', background: 'var(--bg-page)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.75rem' }}>
                  Temporary Worker QR Code
                </div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.origin + '/temp-checkin')}`}
                  alt="Temporary Worker Check-In QR Code"
                  style={{ width: 160, height: 160, borderRadius: 12, border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                  Scan with any phone camera to clock in as a temporary worker.
                </p>
              </div>
            </div>
          </div>
        )}

        {section.id === 'billing' && (
          <div>
            {(() => {
              const trial = getTrialStatus(state.settings);
              const planNames: Record<string, string> = {
                starter: 'Starter',
                silver: 'Silver',
                gold: 'Gold',
                platinum: 'Platinum',
                platinum_plus: 'Platinum Plus',
                diamond: 'Diamond',
              };
              return (
                <>
                  <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Chronix Plan</h3>
                  <div className="side-panel-row" style={{ marginBottom: '1.5rem' }}>
                    <div className="side-panel-row-main">
                      <div className="side-panel-name">
                        {state.settings.plan ? `${planNames[state.settings.plan] || state.settings.plan} Plan` : 'No plan selected yet'}
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0 0.75rem' }}>
                    <h3 style={{ fontSize: '0.95rem', margin: 0 }}>Payment Method</h3>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
                      onClick={() => {
                        const brand = prompt('Card Brand (e.g. Visa, Mastercard):', 'Visa');
                        if (!brand) return;
                        const last4 = prompt('Last 4 digits:', '4242') || '4242';
                        const expiry = prompt('Expiry Date (MM/YY):', '12/28') || '12/28';
                        updateSettings({ billingCard: { brand, last4, expiry } });
                      }}
                    >
                      {state.settings.billingCard ? 'Edit Card' : '+ Add Card'}
                    </button>
                  </div>

                  {state.settings.billingCard ? (
                    <div className="side-panel-row">
                      <div className="side-panel-row-main">
                        <div className="side-panel-name">
                          💳 {state.settings.billingCard.brand} •••• {state.settings.billingCard.last4}
                        </div>
                        <div className="side-panel-sub">Expires {state.settings.billingCard.expiry}</div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                        onClick={() => {
                          if (confirm('Remove your payment card on file?')) {
                            updateSettings({ billingCard: null });
                          }
                        }}
                      >
                        Remove Card
                      </button>
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
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); setPwError(''); }}
                  required
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.25rem',
                  }}
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPwError(''); }}
                  required
                  minLength={6}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.25rem',
                  }}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPwError(''); }}
                  required
                  minLength={6}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.25rem',
                  }}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
