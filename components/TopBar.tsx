'use client'

import * as React from 'react'
import { AppBar, Toolbar, Typography, IconButton, Tooltip, Box, ToggleButtonGroup, ToggleButton } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import NightlightIcon from '@mui/icons-material/Nightlight'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import { ThemeContext } from '../app/ThemeRegistry'

export default function TopBar({ onRecenter }:{ onRecenter:()=>void }){
  const { mode, setMode } = React.useContext(ThemeContext)
  const handleMode = (_:any, value:'light'|'dark'|'night'|null)=>{ if(!value) return; setMode(value) }
  return (
    <AppBar position='sticky' color='primary' enableColorOnDark>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant='h6' sx={{ flexGrow: 1, fontWeight: 700 }}>Seoul Subway Arrivals</Typography>
        <Tooltip title='Recenter to geolocation'><IconButton color='inherit' onClick={onRecenter}><MyLocationIcon/></IconButton></Tooltip>
        <Box sx={{ display:{ xs:'none', sm:'flex' } }}>
          <ToggleButtonGroup size='small' exclusive value={mode} onChange={handleMode} color='secondary'>
            <ToggleButton value='light' aria-label='light mode'><LightModeIcon fontSize='small'/></ToggleButton>
            <ToggleButton value='night' aria-label='night mode'><NightlightIcon fontSize='small'/></ToggleButton>
            <ToggleButton value='dark' aria-label='dark mode'><DarkModeIcon fontSize='small'/></ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
