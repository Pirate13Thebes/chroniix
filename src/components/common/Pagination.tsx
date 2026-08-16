import { useLanguage } from '../../hooks/useLanguage';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const { t } = useLanguage();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5);

  return (
    <div className="table-pagination">
      <span>{t('showingResults', { from: String(from), to: String(to), total: String(total) })}</span>
      <div className="pager">
        {pages.map((p) => (
          <button key={p} className={`pager-btn ${p === page ? 'active' : ''}`} onClick={() => onPageChange(p)}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
