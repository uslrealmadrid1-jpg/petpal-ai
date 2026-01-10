import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useUserSettings } from './useUserSettings';

const ThemeContext = createContext<{}>({});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useUserSettings();

  useEffect(() => {
    const root = document.documentElement;
    const theme = settings.theme;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.add('light');
    } else {
      // System preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(isDark ? 'dark' : 'light');
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (settings.theme === 'system') {
          root.classList.remove('light', 'dark');
          root.classList.add(e.matches ? 'dark' : 'light');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
