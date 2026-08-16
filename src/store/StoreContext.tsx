import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { emptyBusinessState } from './storeReducer';
import { StoreContext } from './storeContextCore';
import { useSession } from '../hooks/useSession';
import type { StoreState, StoreAction, RootState, RootAction } from './storeReducer';

export function StoreProvider({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const [state, setState] = useState<StoreState>(emptyBusinessState());
  const businessId = session?.businessId;

  const fetchState = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/business/${id}`);
      if (response.ok) {
        const data = await response.json();
        setState(data);
      }
    } catch (error) {
      console.error('[StoreContext] Failed to fetch business state:', error);
    }
  }, []);

  useEffect(() => {
    if (!businessId) {
      setState(emptyBusinessState());
      return;
    }

    fetchState(businessId);

    const interval = setInterval(() => {
      fetchState(businessId);
    }, 5000);

    return () => clearInterval(interval);
  }, [businessId, fetchState]);

  const dispatch = useCallback(
    async (action: StoreAction) => {
      if (!businessId) return;
      try {
        const response = await fetch(`/api/business/${businessId}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action),
        });
        if (response.ok) {
          const updatedState = await response.json();
          setState(updatedState);
        } else {
          console.error('[StoreContext] Failed to dispatch action:', response.statusText);
        }
      } catch (error) {
        console.error('[StoreContext] Error dispatching action:', error);
      }
    },
    [businessId]
  );

  const root = useMemo<RootState>(() => ({ businesses: {} }), []);
  const rootDispatch = useCallback((_action: RootAction) => {}, []);

  const value = useMemo(() => ({ state, dispatch, root, rootDispatch }), [state, dispatch, root, rootDispatch]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
