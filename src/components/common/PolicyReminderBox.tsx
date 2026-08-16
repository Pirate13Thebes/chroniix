import { Shield } from 'lucide-react';

export function PolicyReminderBox({ title, notes }: { title: string; notes: string[] }) {
  return (
    <div className="policy-reminder">
      <Shield size={20} color="var(--chronix-amber)" style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ minWidth: 0 }}>
        <strong style={{ fontSize: '0.88rem' }}>{title}</strong>
        <ul>
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
