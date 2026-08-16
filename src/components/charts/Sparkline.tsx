import { LineChart, Line, ResponsiveContainer } from 'recharts';

export function Sparkline({ data, color = '#fff', width = 120, height = 32 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const points = data.map((value, i) => ({ i, value }));
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
