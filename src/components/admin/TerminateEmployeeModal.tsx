import { useState } from 'react';
import { Modal } from '../common/Modal';
import { FormTextarea } from '../common/FormField';
import { useStoreActions } from '../../hooks/useStore';
import { localDateString } from '../../utils/format';
import type { Employee } from '../../types';

// Deliberately not a one-click delete — a required reason plus an explicit
// confirmation checkbox, so removing someone takes a real deliberate action
// (this should only ever happen when the person has actually left) rather
// than being something an admin can do by accident or on a whim.
export function TerminateEmployeeModal({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  const { updateEmployee } = useStoreActions();
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (reason.trim().length < 10) {
      setError('Please give a brief reason (at least 10 characters).');
      return;
    }
    if (!confirmed) {
      setError('Please confirm this employee has actually left the company.');
      return;
    }
    updateEmployee({
      ...employee,
      status: 'terminated',
      terminatedAt: localDateString(),
      terminationReason: reason.trim(),
    });
    onClose();
  }

  return (
    <Modal title={`Remove ${employee.firstName} ${employee.lastName}`} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem', lineHeight: 1.5 }}>
          Only remove an employee once they've actually left the company. Their attendance and payroll history is
          kept for your records — they just won't be able to log in or count toward your active team anymore.
        </p>
        <FormTextarea
          label="Reason for removal (required)"
          placeholder="ex: Resigned on 15 July 2026 / Contract ended / Terminated for cause…"
          maxLength={300}
          value={reason}
          onChange={(e) => { setReason(e.target.value); setError(''); }}
        />
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', margin: '1rem 0', cursor: 'pointer', fontSize: '0.85rem' }}>
          <input type="checkbox" checked={confirmed} onChange={(e) => { setConfirmed(e.target.checked); setError(''); }} style={{ marginTop: 3 }} />
          <span>I confirm {employee.firstName} {employee.lastName} no longer works for this company.</span>
        </label>
        {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn" style={{ background: 'var(--danger)', color: '#fff' }}>
            Remove Employee
          </button>
        </div>
      </form>
    </Modal>
  );
}
