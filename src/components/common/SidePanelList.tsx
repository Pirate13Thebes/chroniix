import type { ReactNode } from 'react';

export interface SidePanelRowDef {
  key: string;
  leading: ReactNode; // avatar or date block
  name: string;
  sub: string;
  trailing?: ReactNode; // badge or count
}

interface SidePanelListProps {
  title: string;
  count?: number;
  rows: SidePanelRowDef[];
  footerLabel?: string;
  onFooterClick?: () => void;
  emptyMessage?: string;
}

export function SidePanelList({ title, count, rows, footerLabel, onFooterClick, emptyMessage = 'Nothing here yet.' }: SidePanelListProps) {
  return (
    <div className="side-panel">
      <div className="side-panel-title">
        <span>{title}</span>
        {count != null && count > 0 && <span className="status-badge status-badge--pending">{count}</span>}
      </div>
      {rows.length === 0 ? (
        <div className="empty-state" style={{ padding: '1rem 0' }}>{emptyMessage}</div>
      ) : (
        rows.map((row) => (
          <div className="side-panel-row" key={row.key}>
            {row.leading}
            <div className="side-panel-row-main">
              <div className="side-panel-name">{row.name}</div>
              <div className="side-panel-sub">{row.sub}</div>
            </div>
            {row.trailing}
          </div>
        ))
      )}
      {footerLabel && (
        <div className="side-panel-footer" onClick={onFooterClick}>
          {footerLabel}
        </div>
      )}
    </div>
  );
}
