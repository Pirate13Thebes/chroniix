import { useNavigate } from 'react-router-dom';
import { FileText, Clock, History as HistoryIcon } from 'lucide-react';

const TILES = [
  { icon: FileText, label: 'Leave Request', to: '/employee/request' },
  { icon: Clock, label: 'Timesheet', to: '/employee/history' },
  { icon: HistoryIcon, label: 'History', to: '/employee/history' },
];

export function ShortcutTiles() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
      {TILES.map((tile) => (
        <button
          key={tile.label}
          className="card"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none' }}
          onClick={() => navigate(tile.to)}
        >
          <tile.icon size={22} color="var(--chronix-navy)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{tile.label}</span>
        </button>
      ))}
    </div>
  );
}
