import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { useStore } from '../hooks/useStore';
import type { SessionView } from '../types/session';

export function ProtectedRoute({ view, children }: { view: SessionView; children: ReactNode }) {
  const { session } = useSession();
  const { state } = useStore();

  if (!session) return <Navigate to="/login" replace />;
  if (session.view !== view) return <Navigate to={session.view === 'admin' ? '/admin' : '/employee'} replace />;

  if (view === 'employee') {
    const employee = state.employees.find((e) => e.id === session.employeeId);
    if (employee?.mustChangePassword) return <Navigate to="/employee/change-password" replace />;
  }

  return <>{children}</>;
}
