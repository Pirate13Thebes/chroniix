export type SessionView = 'admin' | 'employee';

export interface Session {
  view: SessionView;
  employeeId: string;
  businessId: string; // which isolated business this session belongs to
  loggedInAt: string; // ISO datetime
}
