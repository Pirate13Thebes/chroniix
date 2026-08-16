import type { ReactNode } from 'react';

interface BannerCardProps {
  text: string;
  visual?: ReactNode;
  actions?: ReactNode;
}

export function BannerCard({ text, visual, actions }: BannerCardProps) {
  return (
    <div className="banner-card">
      <div style={{ flex: 1, minWidth: 220 }}>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{text}</p>
        {actions && <div className="banner-actions" style={{ marginTop: '1rem' }}>{actions}</div>}
      </div>
      {visual}
    </div>
  );
}
