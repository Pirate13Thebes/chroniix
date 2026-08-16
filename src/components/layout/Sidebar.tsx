import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  Receipt,
  BarChart3,
  Settings,
  Home,
  FileText,
  History,
  LifeBuoy,
  LogOut,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useSession } from '../../hooks/useSession';
import { useStore } from '../../hooks/useStore';
import { Avatar } from '../common/Avatar';
import logoWhite from '../../assets/chronix_logo_white.png';
import { useTheme } from '../../hooks/useTheme';
import { EditProfileModal } from '../employee/EditProfileModal';

interface SidebarProps {
  variant: 'admin' | 'employee';
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ variant, mobileOpen, onCloseMobile }: SidebarProps) {
  const { t } = useLanguage();
  const { session, logout } = useSession();
  const { state } = useStore();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showEdit, setShowEdit] = useState(false);
  const employee = state.employees.find((e) => e.id === session?.employeeId);

  const adminLinks = [
    { to: '/admin/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { to: '/admin/attendance', label: t('navAttendance'), icon: Clock },
    { to: '/admin/leave', label: t('navLeave'), icon: CalendarDays },
    { to: '/admin/reimbursements', label: t('navReimbursements'), icon: Receipt },
    { to: '/admin/reports', label: t('navReports'), icon: BarChart3 },
    { to: '/admin/settings', label: t('navSettings'), icon: Settings },
  ];

  const employeeLinks = [
    { to: '/employee/home', label: t('navHome'), icon: Home },
    { to: '/employee/request', label: t('navRequest'), icon: FileText },
    { to: '/employee/history', label: t('navHistory'), icon: History },
    { to: '/employee/settings', label: t('navSettings'), icon: Settings },
  ];

  const links = variant === 'admin' ? adminLinks : employeeLinks;

  return (
    <>
      {mobileOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div>
          <div className="sidebar-logo" style={{ padding: '1.25rem 1rem 1.75rem', display: 'flex', alignItems: 'center' }}>
            <img src={logoWhite} alt="Chronix" style={{ height: 145, width: 145, objectFit: 'contain', margin: '-53px 0 -57px -18px', display: 'block' }} />
          </div>
          <ul className="nav-list">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onCloseMobile}>
                  <link.icon size={18} />
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          {variant === 'admin' && (
            <div className="upsell-card">
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>{t('goPremium')}</div>
              <button className="btn btn-primary-amber" style={{ width: '100%' }} onClick={() => { onCloseMobile(); navigate('/billing/checkout'); }}>
                {t('upgradeNow')}
              </button>
            </div>
          )}
          {employee && (
            <div 
              className="mini-profile" 
              onClick={() => setShowEdit(true)} 
              style={{ cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <Avatar src={employee.avatarUrl} name={`${employee.firstName} ${employee.lastName}`} size={36} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {employee.firstName} {employee.lastName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="online-dot" /> {employee.role}
                </div>
              </div>
            </div>
          )}
          <button className="nav-item" onClick={toggleTheme} style={{ color: theme === 'banano' ? 'var(--chronix-amber)' : 'inherit' }}>
            <span style={{ fontSize: '16px', display: 'flex', alignItems: 'center', width: '18px', marginRight: '6px' }}>🍌</span>
            {theme === 'banano' ? 'Banano Mode' : 'Switch to Banano'}
          </button>
          <button className="nav-item" onClick={logout}>
            <LogOut size={18} />
            {t('logout')}
          </button>
          {variant === 'employee' && (
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem' }}>
              <LifeBuoy size={14} />
              {t('needHelp')}
            </div>
          )}
        </div>
      </aside>
      {showEdit && employee && (
        <EditProfileModal employee={employee} onClose={() => setShowEdit(false)} />
      )}
    </>
  );
}
