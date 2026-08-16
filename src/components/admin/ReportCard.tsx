import { Clock, UserX, QrCode, Building2, FileDown, Wallet } from 'lucide-react';
import type { ReportCardDef } from '../../types';

const ICONS = { overtime: Clock, absence: UserX, qr: QrCode, department: Building2, payroll: Wallet };

export function ReportCard({ def, onGenerate, onExportPdf }: { def: ReportCardDef; onGenerate: () => void; onExportPdf: () => void }) {
  const Icon = ICONS[def.icon];
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="stat-card-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
        <Icon size={20} />
      </div>
      <h3 style={{ fontSize: '1rem' }}>{def.title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1 }}>{def.description}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn btn-outline" style={{ flex: 1, color: 'var(--chronix-navy)', borderColor: 'var(--chronix-navy)' }} onClick={onGenerate}>
          Export CSV
        </button>
        <button className="btn btn-outline" aria-label="Export as PDF" title="Export as PDF" onClick={onExportPdf} style={{ padding: '0 0.9rem' }}>
          <FileDown size={16} />
        </button>
      </div>
    </div>
  );
}
