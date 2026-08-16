import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { getPendingApprovals } from '../../store/selectors';

interface NotificationBellProps {
  color?: string;
}

// Admin-side notification bell — previously a static icon with no badge and
// no click behavior, so a new leave/reimbursement request was invisible
// unless the admin remembered to check the requests page manually.
export function NotificationBell({ color = 'var(--text-secondary)' }: NotificationBellProps) {
  const { state } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pending = getPendingApprovals(state);

  function employeeName(employeeId: string) {
    const emp = state.employees.find((e) => e.id === employeeId);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
  }

  function handleItemClick(kind: string) {
    setOpen(false);
    navigate(kind === 'reimbursement' ? '/admin/reimbursements' : '/admin/leave');
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${pending.length ? `, ${pending.length} pending` : ''}`}
        style={{ background: 'transparent', border: 'none', position: 'relative' }}
      >
        <Bell size={20} color={color} />
        {pending.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              background: 'var(--chronix-amber)',
              color: 'var(--chronix-navy)',
              fontSize: '0.65rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 3px',
              border: '2px solid var(--bg-card)',
            }}
          >
            {pending.length > 9 ? '9+' : pending.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setOpen(false)} />
          <div
            style={{
              position: 'absolute',
              top: '130%',
              right: 0,
              width: 300,
              maxHeight: 360,
              overflowY: 'auto',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--card-radius)',
              boxShadow: 'var(--card-shadow-hover)',
              zIndex: 200,
            }}
          >
            <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Notifications
            </div>
            {pending.length === 0 ? (
              <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>No pending requests.</div>
            ) : (
              pending.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.kind)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{employeeName(item.employeeId)}</div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
