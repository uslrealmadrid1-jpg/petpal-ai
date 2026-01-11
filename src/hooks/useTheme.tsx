/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useUserSettings } from './useUserSettings';

const ThemeContext = createContext<object>({});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useUserSettings();

  useEffect(() => {
    const root = document.documentElement;
    const theme = settings.theme;

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

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (settings.theme === 'system') {
          if (e.matches) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
