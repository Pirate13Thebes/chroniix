import { useMemo, useState, type ReactNode } from 'react';
import type { Session, SessionView } from '../types/session';
import type { Employee } from '../types';
import { LEGACY_BUSINESS_ID } from '../store/storeReducer';
import { SessionContext, type SessionContextValue } from './sessionContextCore';

const STORAGE_KEY = 'chronix_session_v1';

function loadSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (!parsed.employeeId || !parsed.view) return null;
    // Sessions created before businesses were isolated from each other
    // didn't carry a businessId — default them to the migrated legacy
    // business so an existing logged-in user isn't forced to log back in.
    return { ...parsed, businessId: parsed.businessId ?? LEGACY_BUSINESS_ID } as Session;
  } catch {
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(loadSession);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      loginAs: (view: SessionView, employee: Employee, businessId: string) => {
        const finalView: SessionView = ['admin', 'hr', 'supervisor'].includes(employee.role) ? 'admin' : view === 'admin' ? 'employee' : view;
        const next: Session = { view: finalView, employeeId: employee.id, businessId, loggedInAt: new Date().toISOString() };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setSession(next);
      },
      logout: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setSession(null);
      },
    }),
    [session]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
