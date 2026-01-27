'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return context;
};

const getTheme = (mode: ThemeMode): Theme => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#FF8C00', // Orange
        light: '#FFA500', // Light Orange
        dark: '#FF7F00', // Dark Orange
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#FFD700', // Gold/Yellow
        light: '#FFE44D', // Light Yellow
        dark: '#FFB800', // Dark Yellow
        contrastText: mode === 'dark' ? '#ffffff' : '#000000',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#FFF8E1', // Dark mode: dark gray, Light mode: Light Yellow/Orange tint
        paper: mode === 'dark' ? '#1E1E1E' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#333333',
        secondary: mode === 'dark' ? '#b0b0b0' : '#666666',
      },
      divider: mode === 'dark' ? '#333333' : '#FFE0B2', // Dark mode: dark divider, Light mode: Light Orange divider
    },
    typography: {
      fontFamily: [
        'var(--font-geist-sans)',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1E1E1E' : '#ffffff',
            color: mode === 'dark' ? '#ffffff' : '#333333',
            boxShadow: mode === 'dark' ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(255, 140, 0, 0.12)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#1E1E1E' : '#ffffff',
            borderRight: mode === 'dark' ? '1px solid #333333' : '1px solid #FFE0B2',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: mode === 'dark' ? '#333333' : '#FFF3E0',
              color: '#FF8C00',
              '&:hover': {
                backgroundColor: mode === 'dark' ? '#404040' : '#FFE0B2',
              },
            },
            '&:hover': {
              backgroundColor: mode === 'dark' ? '#2A2A2A' : '#FFF8E1',
            },
          },
        },
      },
    },
  });
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode') as ThemeMode;
      return savedMode === 'dark' || savedMode === 'light' ? savedMode : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', mode);
    }
  }, [mode]);

  const toggleColorMode = (): void => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  const value = useMemo(() => ({ mode, toggleColorMode }), [mode]);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
