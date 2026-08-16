import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar, DesktopTopBar } from '../components/layout/TopBar';

export function EmployeeLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <TopBar variant="employee" onOpenMobile={() => setMobileOpen(true)} />
      <Sidebar variant="employee" mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <main className="main-content">
        <DesktopTopBar variant="employee" />
        <Outlet />
      </main>
    </div>
  );
}
