import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pagination } from './Pagination';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  cardPrimary?: boolean; // shown prominently in mobile card view
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  pageSize?: number;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, rows, rowKey, pageSize = 8, emptyMessage = 'No records found.' }: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const start = (page - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  if (rows.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <div>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} pageSize={pageSize} total={rows.length} onPageChange={setPage} />
      </div>

      <div className="data-table-cards">
        {pageRows.map((row) => (
          <div key={rowKey(row)} className="card" style={{ padding: '1rem' }}>
            {columns.map((col) => (
              <div
                key={col.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  padding: '0.35rem 0',
                  fontWeight: col.cardPrimary ? 600 : 400,
                }}
              >
                {!col.cardPrimary && <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{col.header}</span>}
                <span>{col.render(row)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
