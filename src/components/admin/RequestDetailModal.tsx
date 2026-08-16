import { Paperclip } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Avatar } from '../common/Avatar';
import { StatusBadge } from '../common/StatusBadge';
import { ApproveRejectActions } from '../common/ApproveRejectActions';
import type { Employee, RequestStatus } from '../../types';

interface DetailField {
  label: string;
  value: string;
}

interface RequestDetailModalProps {
  title: string;
  employee: Employee;
  status: RequestStatus;
  fields: DetailField[];
  reason: string;
  attachmentUrl: string | null;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

// Admins used to see only a title and Approve/Reject on every pending
// request — no reason text and no way to open whatever was attached. This
// gives them the full picture before deciding.
export function RequestDetailModal({ title, employee, status, fields, reason, attachmentUrl, onApprove, onReject, onClose }: RequestDetailModalProps) {
  const decided = status === 'approved' || status === 'rejected';

  return (
    <Modal title={title} onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <Avatar src={employee.avatarUrl} name={`${employee.firstName} ${employee.lastName}`} size={40} />
        <div>
          <div style={{ fontWeight: 700 }}>{employee.firstName} {employee.lastName}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{employee.department}</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <StatusBadge status={status} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {fields.map((f) => (
          <div key={f.label}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{f.label}</div>
            <div style={{ fontSize: '0.92rem' }}>{f.value}</div>
          </div>
        ))}

        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Reason / Description</div>
          <div style={{ fontSize: '0.92rem', whiteSpace: 'pre-wrap' }}>{reason || '—'}</div>
        </div>

        {attachmentUrl && (
          <a
            href={attachmentUrl}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--chronix-navy)' }}
          >
            <Paperclip size={16} /> View attachment
          </a>
        )}
      </div>

      {!decided ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <ApproveRejectActions
            onApprove={() => { onApprove(); onClose(); }}
            onReject={() => { onReject(); onClose(); }}
          />
        </div>
      ) : (
        <button type="button" className="btn btn-outline" style={{ width: '100%' }} onClick={onClose}>
          Close
        </button>
      )}
    </Modal>
  );
}
