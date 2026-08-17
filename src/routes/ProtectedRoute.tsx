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

  if (state.settings?.isLocked && session.view === 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', padding: '2rem' }}>
        <div className="card" style={{ maxWidth: 500, textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', margin: '0 auto 1.5rem' }}>
            <span style={{ fontSize: '2rem' }}>🔒</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--chronix-navy)' }}>
            Account Access Suspended
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Access to your Chronix workspace has been locked by the administrator. Please complete your subscription payment or contact our team to reinstate full access.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a href="/billing/checkout" className="btn btn-primary-amber">
              Complete Payment / Upgrade Plan →
            </a>
            <a href="https://wa.me/23054737793?text=Hi%20Chronix%20Support,%20my%20account%20access%20is%20locked.%20Please%20help." target="_blank" rel="noreferrer" className="btn btn-outline">
              Contact Chronix Support on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'employee') {
    const employee = state.employees.find((e) => e.id === session.employeeId);
    if (employee?.mustChangePassword) return <Navigate to="/employee/change-password" replace />;
  }

  return <>{children}</>;
}
