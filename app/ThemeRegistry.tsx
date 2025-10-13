'use client'

import * as React from 'react'
import { ThemeProvider, createTheme, CssBaseline, PaletteMode } from '@mui/material'

type Mode='light'|'dark'|'night'

function getTheme(mode:Mode){
  if(mode==='night'){
    return createTheme({
      palette:{ mode:'dark', background:{ default:'#0b1220', paper:'#0f172a' }, primary:{ main:'#7dd3fc' }, secondary:{ main:'#a78bfa' }, text:{ primary:'#e2e8f0', secondary:'#94a3b8' } },
      components:{ MuiPaper:{ styleOverrides:{ root:{ borderRadius:16 } } }, MuiCard:{ styleOverrides:{ root:{ borderRadius:16 } } } }
    })
  }
  return createTheme({ palette:{ mode: mode as PaletteMode }, components:{ MuiPaper:{ styleOverrides:{ root:{ borderRadius:16 } } }, MuiCard:{ styleOverrides:{ root:{ borderRadius:16 } } } } })
}

export const ThemeContext=React.createContext<{mode:Mode,setMode:(m:Mode)=>void}>({mode:'light',setMode:()=>{}})

export default function ThemeRegistry({children}:{children:React.ReactNode}){
  const [mode,setMode]=React.useState<Mode>(()=>{ const saved=typeof window!=='undefined'?window.localStorage.getItem('theme-mode') as Mode:null; return saved||'light' })
  React.useEffect(()=>{ window.localStorage.setItem('theme-mode',mode) },[mode])
  const theme=React.useMemo(()=>getTheme(mode),[mode])
  return (<ThemeContext.Provider value={{mode,setMode}}><ThemeProvider theme={theme}><CssBaseline/>{children}</ThemeProvider></ThemeContext.Provider>)
}
