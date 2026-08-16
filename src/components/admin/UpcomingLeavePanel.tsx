import { useNavigate } from 'react-router-dom';
import { SidePanelList, type SidePanelRowDef } from '../common/SidePanelList';
import { StatusBadge } from '../common/StatusBadge';
import { useStore } from '../../hooks/useStore';
import { getUpcomingLeave } from '../../store/selectors';
import { formatDateRange } from '../../utils/format';
import { useLanguage } from '../../hooks/useLanguage';

export function UpcomingLeavePanel() {
  const { t } = useLanguage();
  const { state } = useStore();
  const navigate = useNavigate();
  const upcoming = getUpcomingLeave(state).slice(0, 5);

  const rows: SidePanelRowDef[] = upcoming.map((r) => {
    const emp = state.employees.find((e) => e.id === r.employeeId);
    const day = new Date(r.dateFrom);
    return {
      key: r.id,
      leading: (
        <div className="date-block">
          <span>{day.toLocaleDateString('en-US', { month: 'short' })}</span>
          <span>{day.getDate()}</span>
        </div>
      ),
      name: emp ? `${emp.firstName} ${emp.lastName}` : '',
      sub: formatDateRange(r.dateFrom, r.dateTo, r.days),
      trailing: <StatusBadge status={r.status === 'in_review' ? 'in_review' : r.status === 'approved' ? 'approved' : 'pending'} />,
    };
  });

  return (
    <SidePanelList title={t('upcomingLeave')} rows={rows} footerLabel={t('viewAll')} onFooterClick={() => navigate('/admin/leave')} emptyMessage="No upcoming leave." />
  );
}
