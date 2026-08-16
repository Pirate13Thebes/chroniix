import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../utils/chartColors';
import { useLanguage } from '../../hooks/useLanguage';

interface AttendanceDistributionDonutProps {
  onTime: number;
  late: number;
  absent: number;
  onTimePct: number;
  latePct: number;
  absentPct: number;
}

export function AttendanceDistributionDonut({ onTime, late, absent, onTimePct, latePct, absentPct }: AttendanceDistributionDonutProps) {
  const { t } = useLanguage();
  const total = onTime + late + absent;
  const data = [
    { name: t('statusOnTime'), value: onTime, color: CHART_COLORS.navy, pct: onTimePct },
    { name: t('statusLate'), value: late, color: CHART_COLORS.amber, pct: latePct },
    { name: t('statusAbsent'), value: absent, color: CHART_COLORS.grey, pct: absentPct },
  ];

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3 style={{ fontSize: '1rem' }}>{t('attendanceDistribution')}</h3>
      </div>
      <div className="donut-wrap">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={62} outerRadius={90} paddingAngle={2} stroke="none">
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center">
          <div className="donut-center-value">{total}</div>
          <div className="donut-center-label">Total</div>
        </div>
      </div>
      <div>
        {data.map((entry) => (
          <div className="legend-row" key={entry.name}>
            <span className="legend-dot" style={{ background: entry.color }} />
            <span>
              {entry.name} {entry.value} ({entry.pct}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
