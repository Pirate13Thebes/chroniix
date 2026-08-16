import { useContext, useMemo } from 'react';
import { StoreContext, type StoreContextValue } from '../store/storeContextCore';
import { uid, type StoreState } from '../store/storeReducer';
import type { Employee, Reimbursement, Request, BusinessSettings, CheckInMethod } from '../types';

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}

export function useStoreActions() {
  const { dispatch, rootDispatch } = useStore();
  return useMemo(
    () => ({
      // Only for Signup — creates a brand new, fully isolated business
      // (not scoped to the current session, since there isn't one yet).
      createBusiness: (businessId: string, initialState: StoreState) =>
        rootDispatch({ type: 'CREATE_BUSINESS', businessId, initialState }),
      clockIn: (employeeId: string, method: CheckInMethod, workLocationId: string) =>
        dispatch({ type: 'CLOCK_IN', employeeId, method, workLocationId }),
      clockOut: (employeeId: string) => dispatch({ type: 'CLOCK_OUT', employeeId }),
      submitRequest: (payload: Omit<Request, 'id' | 'status' | 'approvalSteps' | 'submittedAt' | 'decidedAt' | 'decidedBy'>) =>
        dispatch({ type: 'SUBMIT_REQUEST', payload }),
      decideRequest: (id: string, decision: 'approved' | 'rejected', decidedBy: string) =>
        dispatch({ type: 'DECIDE_REQUEST', id, decision, decidedBy }),
      submitReimbursement: (payload: Omit<Reimbursement, 'id' | 'status' | 'submittedAt' | 'decidedAt'>) =>
        dispatch({ type: 'SUBMIT_REIMBURSEMENT', payload }),
      decideReimbursement: (id: string, decision: 'approved' | 'rejected') =>
        dispatch({ type: 'DECIDE_REIMBURSEMENT', id, decision }),
      addEmployee: (payload: Omit<Employee, 'id'>): string => {
        const id = uid('emp');
        dispatch({ type: 'ADD_EMPLOYEE', payload: { ...payload, id } });
        return id;
      },
      updateEmployee: (payload: Employee) => dispatch({ type: 'UPDATE_EMPLOYEE', payload }),
      updateSettings: (payload: Partial<BusinessSettings>) => dispatch({ type: 'UPDATE_SETTINGS', payload }),
    }),
    [dispatch, rootDispatch]
  );
}
