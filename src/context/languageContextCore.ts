import { createContext } from 'react';
import type { Language, TFunction } from '../data/translations';

export interface LanguageContextValue {
  lang: Language;
  t: TFunction;
  toggleLang: () => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
