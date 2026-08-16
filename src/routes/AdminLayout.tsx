import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar, DesktopTopBar } from '../components/layout/TopBar';

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <TopBar variant="admin" onOpenMobile={() => setMobileOpen(true)} />
      <Sidebar variant="admin" mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <main className="main-content">
        <DesktopTopBar variant="admin" />
        <Outlet />
      </main>
    </div>
  );
}
