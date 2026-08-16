import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  trend?: { direction: 'up' | 'down' | 'flat'; label: string };
}

export function StatCard({ icon, iconBg, iconColor, label, value, trend }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background: iconBg, color: iconColor }}>
        {icon}
      </div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      {trend && (
        <div className={`stat-card-trend trend-${trend.direction}`}>
          {trend.direction === 'up' ? '↑ ' : trend.direction === 'down' ? '↓ ' : '— '}
          {trend.label}
        </div>
      )}
    </div>
  );
}
