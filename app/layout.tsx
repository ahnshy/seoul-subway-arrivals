import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = { title:'Seoul Subway Arrivals (Google Maps)', description:'현재 위치 기준, 서울 지하철 역 실시간 도착 정보' }

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (<html lang='ko'><body>{children}</body></html>)
}
