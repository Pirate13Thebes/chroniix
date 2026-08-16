// Screen C1 — Admin Dashboard
import { Clock, LogIn, LogOut, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/common/StatCard';
import { BannerCard } from '../../components/common/BannerCard';
import { Sparkline } from '../../components/charts/Sparkline';
import { AttendanceOverviewChart } from '../../components/charts/AttendanceOverviewChart';
import { AttendanceDistributionDonut } from '../../components/charts/AttendanceDistributionDonut';
import { TeamAttendanceTable } from '../../components/admin/TeamAttendanceTable';
import { PendingApprovalsPanel } from '../../components/admin/PendingApprovalsPanel';
import { UpcomingLeavePanel } from '../../components/admin/UpcomingLeavePanel';
import { RecentActivityPanel } from '../../components/admin/RecentActivityPanel';
import { TrialBanner } from '../../components/admin/TrialBanner';
import { useStore } from '../../hooks/useStore';
import { useSession } from '../../hooks/useSession';
import { useLanguage } from '../../hooks/useLanguage';
import { getAttendanceDistribution, getAttendanceTrend, getDashboardStats } from '../../store/selectors';

export function Dashboard() {
  const { t } = useLanguage();
  const { state } = useStore();
  const { session } = useSession();
  const navigate = useNavigate();
  const employee = state.employees.find((e) => e.id === session?.employeeId);

  const stats = getDashboardStats(state);
  const distribution = getAttendanceDistribution(state);
  const dailyTrend = getAttendanceTrend(state, 'daily');
  const weeklyTrend = getAttendanceTrend(state, 'weekly');
  const sparklineData = dailyTrend.map((d) => (d.onTime + d.late > 0 ? (d.onTime / (d.onTime + d.late + d.absent)) * 100 : 0));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>
            {t('goodMorning')}, {employee?.firstName} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('dashboardSubtitle')}</p>
        </div>
      </div>

      <TrialBanner settings={state.settings} />

      <BannerCard
        text={t('insightBannerText')}
        visual={<Sparkline data={sparklineData.length ? sparklineData : [0]} />}
        actions={
          <>
            <button className="btn btn-primary-amber" onClick={() => navigate('/admin/reports')}>
              {t('viewWeeklyReport')}
            </button>
            <button className="btn btn-outline" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
              {t('teamSummary')}
            </button>
          </>
        }
      />

      <div className="stat-card-row">
        <StatCard icon={<Clock size={18} />} iconBg="var(--info-bg)" iconColor="var(--info)" label={t('statAvgHours')} value={`${Math.floor(stats.avgHours)}h ${Math.round((stats.avgHours % 1) * 60)}m`} trend={{ direction: 'up', label: '6% vs last week' }} />
        <StatCard icon={<Users size={18} />} iconBg="var(--success-bg)" iconColor="var(--success)" label={t('statOnTimeArrival')} value={`${stats.onTimePct.toFixed(1)}%`} trend={{ direction: 'up', label: '8% vs last week' }} />
        <StatCard icon={<LogIn size={18} />} iconBg="var(--warning-bg)" iconColor="#92660b" label={t('statAvgCheckIn')} value={minutesToTime(stats.avgClockInMinutes)} trend={{ direction: 'down', label: '3m vs last week' }} />
        <StatCard icon={<LogOut size={18} />} iconBg="var(--warning-bg)" iconColor="#92660b" label={t('statAvgCheckOut')} value={minutesToTime(stats.avgClockOutMinutes)} trend={{ direction: 'up', label: '11m vs last week' }} />
        <StatCard
          icon={<Users size={18} />}
          iconBg="var(--info-bg)"
          iconColor="var(--info)"
          label={t('statEmployeesPresent')}
          value={`${stats.presentToday} / ${stats.totalEmployees}`}
          trend={{ direction: 'flat', label: `${Math.round((stats.presentToday / Math.max(1, stats.totalEmployees)) * 100)}% ${t('ofWorkforce')}` }}
        />
      </div>

      <div className="responsive-grid-2-1" style={{ marginBottom: '1.5rem' }}>
        <AttendanceOverviewChart dailyData={dailyTrend} weeklyData={weeklyTrend} />
        <AttendanceDistributionDonut {...distribution} />
      </div>

      <div className="responsive-grid-main-sidebar">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem' }}>{t('teamAttendance')}</h3>
            <button className="btn btn-primary-navy" onClick={() => navigate('/admin/attendance')}>
              {t('viewAll')}
            </button>
          </div>
          <TeamAttendanceTable limit={6} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <PendingApprovalsPanel />
          <UpcomingLeavePanel />
          <RecentActivityPanel />
        </div>
      </div>
    </div>
  );
}

function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}
