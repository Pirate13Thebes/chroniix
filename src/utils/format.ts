// Calendar-day string (YYYY-MM-DD) in local time — NOT toISOString().slice(0,10),
// which converts to UTC first and can shift the date near local midnight.
export function localDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatMUR(amount: number): string {
  return `Rs ${amount.toLocaleString('en-MU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatTime(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateRange(fromIso: string, toIso: string, days?: number): string {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  const sameMonth = from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear();
  const fromStr = from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const toStr = sameMonth
    ? to.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })
    : to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const range = fromIso === toIso ? from.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : `${fromStr} – ${toStr}`;
  return days != null ? `${range} · ${days} day${days === 1 ? '' : 's'}` : range;
}

export function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay}d ago`;
}

export function formatHours(hours: number | null): string {
  if (hours == null) return '—';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
