import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { FormField, FormSelect } from '../common/FormField';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { localDateString } from '../../utils/format';
import { generateKioskPin } from '../../utils/kioskPin';
import type { CheckInMethod, EmploymentType } from '../../types';

const METHOD_LABELS: Record<CheckInMethod, string> = {
  gps_face: 'GPS Check-In',
  qr: 'QR Code',
  kiosk: 'Shared Kiosk Terminal',
};

function generateTempPin(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function AddEmployeeModal({ onClose }: { onClose: () => void }) {
  const { state } = useStore();
  const { addEmployee, updateSettings } = useStoreActions();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full_time');
  const [shiftId, setShiftId] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [allowedMethods, setAllowedMethods] = useState<CheckInMethod[]>(['gps_face']);
  const [createdPin, setCreatedPin] = useState<string | null>(null);
  const [createdKioskPin, setCreatedKioskPin] = useState<string | null>(null);
  const [copied, setCopied] = useState<'login' | 'kiosk' | null>(null);

  const departments = state.settings.departments;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedDept = department.trim();
    const pin = generateTempPin();
    const kioskPin = generateKioskPin();
    const methods: CheckInMethod[] = allowedMethods.length ? allowedMethods : ['gps_face'];

    addEmployee({
      firstName,
      lastName,
      email,
      phone,
      avatarUrl: '',
      role: 'employee',
      department: trimmedDept,
      employmentType,
      joinedAt: localDateString(),
      workLocationId: state.settings.workLocations[0]?.id ?? '',
      shiftId: shiftId || null,
      allowedCheckInMethods: methods,
      leaveBalance: 14,
      hourlyRateMUR: Number(hourlyRate) || 0,
      credential: pin,
      mustChangePassword: true,
      status: 'active',
      terminatedAt: null,
      terminationReason: null,
      kioskPin,
    });

    if (trimmedDept && !departments.includes(trimmedDept)) {
      updateSettings({ departments: [...departments, trimmedDept] });
    }

    setCreatedPin(pin);
    if (methods.includes('kiosk')) setCreatedKioskPin(kioskPin);
  }

  function handleCopy(which: 'login' | 'kiosk', value: string) {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(which);
    setTimeout(() => setCopied(null), 1500);
  }

  if (createdPin) {
    return (
      <Modal title="Employee Added" onClose={onClose}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Share this temporary PIN with {firstName} ({email}) so they can log in. They'll be asked to set their own password on first login.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '4px', color: 'var(--chronix-navy)' }}>{createdPin}</span>
          <button type="button" className="btn btn-outline" onClick={() => handleCopy('login', createdPin)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {copied === 'login' ? <Check size={16} /> : <Copy size={16} />}
            {copied === 'login' ? 'Copied' : 'Copy'}
          </button>
        </div>

        {createdKioskPin && (
          <>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              They'll also use this separate 4-digit PIN to clock in/out at a shared Kiosk terminal. You can view or reset it anytime from Settings &gt; Employee Settings.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '4px', color: 'var(--chronix-amber)' }}>{createdKioskPin}</span>
              <button type="button" className="btn btn-outline" onClick={() => handleCopy('kiosk', createdKioskPin)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {copied === 'kiosk' ? <Check size={16} /> : <Copy size={16} />}
                {copied === 'kiosk' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </>
        )}

        <button type="button" className="btn btn-primary-navy" style={{ width: '100%' }} onClick={onClose}>
          Done
        </button>
      </Modal>
    );
  }

  return (
    <Modal title="Add New Employee" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="responsive-grid-1-1">
          <FormField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <FormField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <FormField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <div className="responsive-grid-1-1">
          <FormField
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            list="department-options"
            placeholder="ex: Housekeeping"
            required
          />
          <FormSelect
            label="Employment Type"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
            options={[
              { value: 'full_time', label: 'Full Time' },
              { value: 'part_time', label: 'Part Time' },
              { value: 'temporary', label: 'Temporary' },
            ]}
          />
        </div>
        <datalist id="department-options">
          {departments.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '-0.5rem', marginBottom: '1rem' }}>
          Type a new department name or pick one you've already used — Chronix remembers it for next time.
        </p>

        <div className="responsive-grid-1-1">
          <FormSelect
            label="Shift"
            value={shiftId}
            onChange={(e) => setShiftId(e.target.value)}
            options={[
              { value: '', label: state.settings.shifts.length ? 'No shift assigned' : 'No shifts configured yet' },
              ...state.settings.shifts.map((s) => ({ value: s.id, label: `${s.name} (${s.start}–${s.end})` })),
            ]}
          />
          <FormField
            label="Hourly Rate (MUR)"
            type="number"
            min="0"
            step="0.01"
            placeholder="ex: 150"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label">Allowed Check-In Methods</label>
          {state.settings.checkInMethods.map((method) => (
            <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={allowedMethods.includes(method)}
                onChange={(e) =>
                  setAllowedMethods(e.target.checked ? [...allowedMethods, method] : allowedMethods.filter((m) => m !== method))
                }
              />
              <span style={{ fontSize: '0.88rem' }}>{METHOD_LABELS[method]}</span>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary-navy">
            Save Employee
          </button>
        </div>
      </form>
    </Modal>
  );
}
