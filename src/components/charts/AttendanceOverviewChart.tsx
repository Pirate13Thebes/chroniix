import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TrendPoint } from '../../store/selectors';
import { CHART_COLORS } from '../../utils/chartColors';
import { useLanguage } from '../../hooks/useLanguage';

interface AttendanceOverviewChartProps {
  dailyData: TrendPoint[];
  weeklyData: TrendPoint[];
}

export function AttendanceOverviewChart({ dailyData, weeklyData }: AttendanceOverviewChartProps) {
  const { t } = useLanguage();
  const [granularity, setGranularity] = useState<'daily' | 'weekly'>('daily');
  const data = granularity === 'daily' ? dailyData : weeklyData;

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3 style={{ fontSize: '1rem' }}>{t('attendanceOverview')}</h3>
        <div className="chart-toggle">
          <button className={granularity === 'daily' ? 'active' : ''} onClick={() => setGranularity('daily')}>
            {t('daily')}
          </button>
          <button className={granularity === 'weekly' ? 'active' : ''} onClick={() => setGranularity('weekly')}>
            {t('weekly')}
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={CHART_COLORS.border} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
          />
          <Area type="monotone" dataKey="onTime" stackId="1" stroke={CHART_COLORS.navy} fill={CHART_COLORS.navy} fillOpacity={0.15} name="On-time" />
          <Area type="monotone" dataKey="late" stackId="1" stroke={CHART_COLORS.amber} fill={CHART_COLORS.amber} fillOpacity={0.25} name="Late" />
          <Area type="monotone" dataKey="absent" stackId="1" stroke={CHART_COLORS.grey} fill={CHART_COLORS.grey} fillOpacity={0.2} name="Absent" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
