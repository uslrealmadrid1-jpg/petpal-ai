/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useUserSettings } from './useUserSettings';

interface ThemeContextType {
  applyTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({ applyTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useUserSettings();

  const applyTheme = useCallback((theme: string) => {
    const root = document.documentElement;

    // Remove dark class first
    root.classList.remove('dark');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      // Light is default, just remove dark class
      root.classList.remove('dark');
    } else {
      // System preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, []);

  useEffect(() => {
    applyTheme(settings.theme);

    // Listen for system theme changes when theme is 'system'
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const root = document.documentElement;
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme, applyTheme]);

  return <ThemeContext.Provider value={{ applyTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
