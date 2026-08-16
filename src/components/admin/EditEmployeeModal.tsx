import { useState } from 'react';
import { Copy, Check, RotateCw } from 'lucide-react';
import { Modal } from '../common/Modal';
import { FormField, FormSelect } from '../common/FormField';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { generateKioskPin } from '../../utils/kioskPin';
import type { CheckInMethod, Employee, EmploymentType } from '../../types';

const METHOD_LABELS: Record<CheckInMethod, string> = {
  gps_face: 'GPS Check-In',
  qr: 'QR Code',
  kiosk: 'Shared Kiosk Terminal',
};

export function EditEmployeeModal({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  const { state } = useStore();
  const { updateEmployee, updateSettings } = useStoreActions();
  const [department, setDepartment] = useState(employee.department);
  const [employmentType, setEmploymentType] = useState<EmploymentType>(employee.employmentType);
  const [shiftId, setShiftId] = useState(employee.shiftId ?? '');
  const [hourlyRate, setHourlyRate] = useState(String(employee.hourlyRateMUR ?? 0));
  const [allowedMethods, setAllowedMethods] = useState<CheckInMethod[]>(employee.allowedCheckInMethods);
  const [kioskPin, setKioskPin] = useState(employee.kioskPin);
  const [copied, setCopied] = useState(false);

  const departments = state.settings.departments;

  function handleRegeneratePin() {
    const next = generateKioskPin();
    setKioskPin(next);
    updateEmployee({ ...employee, kioskPin: next });
  }

  function handleCopyPin() {
    navigator.clipboard?.writeText(kioskPin).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedDept = department.trim();
    updateEmployee({
      ...employee,
      department: trimmedDept,
      employmentType,
      shiftId: shiftId || null,
      hourlyRateMUR: Number(hourlyRate) || 0,
      allowedCheckInMethods: allowedMethods.length ? allowedMethods : ['gps_face'],
    });
    if (trimmedDept && !departments.includes(trimmedDept)) {
      updateSettings({ departments: [...departments, trimmedDept] });
    }
    onClose();
  }

  return (
    <Modal title={`Edit ${employee.firstName} ${employee.lastName}`} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="responsive-grid-1-1">
          <FormField
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            list="edit-department-options"
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
        <datalist id="edit-department-options">
          {departments.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>

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

        {allowedMethods.includes('kiosk') && (
          <div className="form-field">
            <label className="form-label">Kiosk PIN</label>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '-0.25rem', marginBottom: '0.5rem' }}>
              Used only at a shared Kiosk terminal — separate from their login password.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: '0.75rem 1rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '3px', color: 'var(--chronix-navy)' }}>{kioskPin}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={handleCopyPin} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button type="button" className="btn btn-outline" onClick={handleRegeneratePin} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RotateCw size={16} /> Regenerate
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary-navy">
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
