import { useMemo, useState, type ReactNode } from 'react';
import { getT, type Language } from '../data/translations';
import { LanguageContext, type LanguageContextValue } from './languageContextCore';

const STORAGE_KEY = 'chronix_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    return (window.localStorage.getItem(STORAGE_KEY) as Language) || 'en';
  });

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      t: getT(lang),
      toggleLang: () =>
        setLang((prev) => {
          const next = prev === 'en' ? 'fr' : 'en';
          window.localStorage.setItem(STORAGE_KEY, next);
          return next;
        }),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
