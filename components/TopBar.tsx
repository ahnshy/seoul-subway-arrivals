'use client'

import * as React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import NightlightIcon from '@mui/icons-material/Nightlight'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import { ThemeContext, type Mode } from '../app/ThemeRegistry'

function getBarColors(mode: Mode) {
  if (mode === 'dark') return { bg: '#000000', fg: '#ffffff' }
  if (mode === 'night') return { bg: '#0b1220', fg: '#e2e8f0' }
  return { bg: '#ffffff', fg: '#111827' } // light
}

export default function TopBar({ onRecenter }: { onRecenter: () => void }) {
  const { mode, setMode } = React.useContext(ThemeContext)
  const { bg, fg } = getBarColors(mode)

  // Mobile menu for theme switch
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const choose = (m: Mode) => {
    setMode(m)
    handleClose()
  }

  return (
      <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: bg,
            color: fg,
            borderBottom: '1px solid',
            borderColor: mode === 'light' ? '#e5e7eb' : 'rgba(255,255,255,0.08)',
          }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
            Seoul Subway Arrivals
          </Typography>

          <Tooltip title="Recenter to geolocation">
            <IconButton onClick={onRecenter} sx={{ color: fg }}>
              <MyLocationIcon />
            </IconButton>
          </Tooltip>

          {/* Desktop: inline toggle */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <ToggleButtonGroup
                size="small"
                exclusive
                value={mode}
                onChange={(_, v) => v && setMode(v)}
            >
              <ToggleButton value="light" aria-label="light mode">
                <LightModeIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="night" aria-label="night mode">
                <NightlightIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="dark" aria-label="dark mode">
                <DarkModeIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Mobile: palette icon → menu */}
          <Box sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
            <IconButton onClick={handleOpen} sx={{ color: fg }} aria-label="theme menu">
              <ColorLensIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                disableScrollLock
            >
              <MenuItem onClick={() => choose('light')}>
                <ListItemIcon><LightModeIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Light</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => choose('night')}>
                <ListItemIcon><NightlightIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Night</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => choose('dark')}>
                <ListItemIcon><DarkModeIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Dark</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
  )
}
