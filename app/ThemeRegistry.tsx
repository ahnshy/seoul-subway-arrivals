'use client'

import * as React from 'react'
import { ThemeProvider, createTheme, CssBaseline, PaletteMode } from '@mui/material'

export type Mode = 'light' | 'dark' | 'night'

function getTheme(mode: Mode) {
  if (mode === 'night') {
    return createTheme({
      palette: {
        mode: 'dark',
        background: { default: '#0b1220', paper: '#0f172a' },
        primary: { main: '#7dd3fc' },
        secondary: { main: '#a78bfa' },
        text: { primary: '#e2e8f0', secondary: '#94a3b8' },
      },
      components: {
        MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
        MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
      },
    })
  }

  if (mode === 'dark') {
    return createTheme({
      palette: {
        mode: 'dark',
        background: { default: '#000000', paper: '#0a0a0a' },
        primary: { main: '#90caf9' },
        secondary: { main: '#ce93d8' },
        text: { primary: '#ffffff', secondary: '#bdbdbd' },
      },
      components: {
        MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
        MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
      },
    })
  }

  // light
  return createTheme({
    palette: {
      mode: 'light' as PaletteMode,
      background: { default: '#ffffff', paper: '#ffffff' },
      primary: { main: '#1976d2' },
      secondary: { main: '#7c4dff' },
      text: { primary: '#111827', secondary: '#4b5563' },
    },
    components: {
      MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
      MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
    },
  })
}

export const ThemeContext = React.createContext<{ mode: Mode; setMode: (m: Mode) => void }>({
  mode: 'light',
  setMode: () => {},
})

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<Mode>(() => {
    const saved = typeof window !== 'undefined' ? (window.localStorage.getItem('theme-mode') as Mode) : 'light'
    return saved || 'light'
  })
  React.useEffect(() => {
    window.localStorage.setItem('theme-mode', mode)
  }, [mode])

  const theme = React.useMemo(() => getTheme(mode), [mode])

  return (
      <ThemeContext.Provider value={{ mode, setMode }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ThemeContext.Provider>
  )
}
