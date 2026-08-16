import { createContext, type Dispatch } from 'react';
import type { StoreState, StoreAction, RootState, RootAction } from './storeReducer';

export interface StoreContextValue {
  state: StoreState; // the current session's own business — unaffected by any other business
  dispatch: Dispatch<StoreAction>; // scoped automatically to the current session's business
  root: RootState; // full multi-business data — only auth flows (login/signup) need this
  rootDispatch: Dispatch<RootAction>;
}

export const StoreContext = createContext<StoreContextValue | null>(null);
