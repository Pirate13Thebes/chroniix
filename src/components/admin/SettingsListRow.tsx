import { useNavigate } from 'react-router-dom';
import {
  Clock,
  MapPin,
  ScanFace,
  Users,
  CalendarDays,
  BarChart3,
  ShieldCheck,
  Lock,
  Bell,
  User,
  FileText,
  Settings as SettingsIcon,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import type { SettingsSectionDef } from '../../types';

const ICONS: Record<string, typeof Clock> = {
  Clock,
  MapPin,
  ScanFace,
  Users,
  CalendarDays,
  BarChart3,
  ShieldCheck,
  Lock,
  Bell,
  User,
  FileText,
  Settings: SettingsIcon,
  CreditCard,
};

export function SettingsListRow({ section, basePath }: { section: SettingsSectionDef; basePath: string }) {
  const navigate = useNavigate();
  const Icon = ICONS[section.icon] ?? SettingsIcon;

  return (
    <div className="settings-row" onClick={() => navigate(`${basePath}/${section.id}`)}>
      <div className="settings-row-icon">
        <Icon size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{section.title}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{section.description}</div>
      </div>
      <ChevronRight size={18} color="var(--text-secondary)" />
    </div>
  );
}
