import './globals.css'
import type { Metadata } from 'next'
import ThemeRegistry from './ThemeRegistry'

export const metadata: Metadata = { title:'seoul-subway-arrivals', description:'Current location → pick station → real-time arrivals (Seoul Subway)' }

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (<html lang='ko'><body><ThemeRegistry>{children}</ThemeRegistry></body></html>)
}
