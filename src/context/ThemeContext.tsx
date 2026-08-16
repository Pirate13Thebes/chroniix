import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext, type ThemeMode, type ThemeContextValue } from './themeContextCore';

const STORAGE_KEY = 'chronix_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'standard';
    return (window.localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'standard';
  });

  useEffect(() => {
    if (theme === 'banano') {
      document.body.classList.add('banano-mode');
    } else {
      document.body.classList.remove('banano-mode');
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: (t: ThemeMode) => {
        window.localStorage.setItem(STORAGE_KEY, t);
        setThemeState(t);
      },
      toggleTheme: () => {
        setThemeState((prev) => {
          const next = prev === 'standard' ? 'banano' : 'standard';
          window.localStorage.setItem(STORAGE_KEY, next);
          return next;
        });
      },
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
