import { createContext } from 'react';
import type { Session, SessionView } from '../types/session';
import type { Employee } from '../types';

export interface SessionContextValue {
  session: Session | null;
  // Always takes the full, freshly-created/found Employee object plus which
  // business it belongs to — the caller (Login/Signup) already resolved
  // both, so this never needs to search the store itself.
  loginAs: (view: SessionView, employee: Employee, businessId: string) => void;
  logout: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
