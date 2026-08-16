import type { RequestStatus, AttendanceStatus } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

type Status = RequestStatus | AttendanceStatus;

const CLASS_MAP: Record<Status, string> = {
  pending: 'status-badge--pending',
  in_review: 'status-badge--in-review',
  approved: 'status-badge--approved',
  rejected: 'status-badge--rejected',
  on_time: 'status-badge--on-time',
  late: 'status-badge--late',
  absent: 'status-badge--absent',
};

const KEY_MAP: Record<Status, string> = {
  pending: 'statusPending',
  in_review: 'statusInReview',
  approved: 'statusApproved',
  rejected: 'statusRejected',
  on_time: 'statusOnTime',
  late: 'statusLate',
  absent: 'statusAbsent',
};

export function StatusBadge({ status }: { status: Status }) {
  const { t } = useLanguage();
  return <span className={`status-badge ${CLASS_MAP[status]}`}>{t(KEY_MAP[status] as never)}</span>;
}
