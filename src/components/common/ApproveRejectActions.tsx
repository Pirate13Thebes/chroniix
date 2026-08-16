import { Check, X } from 'lucide-react';

interface ApproveRejectActionsProps {
  disabled?: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export function ApproveRejectActions({ disabled, onApprove, onReject }: ApproveRejectActionsProps) {
  return (
    <div className="approve-reject-actions">
      <button className="action-circle approve" disabled={disabled} onClick={onApprove} aria-label="Approve" title="Approve">
        <Check size={16} />
      </button>
      <button className="action-circle reject" disabled={disabled} onClick={onReject} aria-label="Reject" title="Reject">
        <X size={16} />
      </button>
    </div>
  );
}
