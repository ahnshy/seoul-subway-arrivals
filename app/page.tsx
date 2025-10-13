'use client'

import * as React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Card, CardContent, Typography, Chip, CircularProgress, Stack, Divider, useMediaQuery, useTheme, Paper } from '@mui/material'
import Grid from '@mui/material/Grid2'
import TopBar from '../components/TopBar'

type Station={ id:string; name:string; lat:number; lng:number; distance:number }
type Arrival={ trainLineNm:string; updnLine:string; arvlMsg2:string; arvlMsg3:string; barvlDt?:string; btrainNo?:string }

declare global{ interface Window{ google:any; gm_authFailure?:()=>void; initMap?:()=>void } }

export default function Page(){
  const mapDivRef=useRef<HTMLDivElement>(null)
  const mapRef=useRef<any>(null)
  const currentMarkerRef=useRef<any>(null)
  const stationMarkersRef=useRef<any[]>([])

  const [pos,setPos]=useState<{lat:number,lng:number}|null>(null)
  const [mapsLoaded,setMapsLoaded]=useState(false)
  const [stations,setStations]=useState<Station[]>([])
  const [selected,setSelected]=useState<Station|null>(null)
  const [arrivals,setArrivals]=useState<Arrival[]>([])
  const [loadingStations,setLoadingStations]=useState(false)
  const [loadingArrivals,setLoadingArrivals]=useState(false)

  const theme=useTheme(); const isMobile=useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(()=>{ if(!('geolocation'in navigator)){ setPos({lat:37.5665,lng:126.9780}); return } navigator.geolocation.getCurrentPosition(g=>setPos({lat:g.coords.latitude,lng:g.coords.longitude}), _=>setPos({lat:37.5665,lng:126.9780})) },[])

  useEffect(()=>{ if(typeof window==='undefined')return; if(window.google&&window.google.maps){ setMapsLoaded(true); return } const key=process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; if(!key){ console.error('Google Maps API key is missing'); return } window.gm_authFailure=()=>console.error('Google Maps authentication failure'); window.initMap=()=>setMapsLoaded(true); const url=new URL('https://maps.googleapis.com/maps/api/js'); url.searchParams.set('key', key as string); url.searchParams.set('v','weekly'); url.searchParams.set('language','ko'); url.searchParams.set('region','KR'); url.searchParams.set('callback','initMap'); const s=document.createElement('script'); s.src=url.toString(); s.async=true; s.defer=true; s.onerror=(e)=>console.error('Google Maps JS load error',e); document.head.appendChild(s) },[])

  useEffect(()=>{ if(!mapsLoaded||!pos||!mapDivRef.current||mapRef.current) return; const g=window.google.maps; mapRef.current=new g.Map(mapDivRef.current,{ center:{lat:pos.lat,lng:pos.lng}, zoom:14, mapTypeControl:false, streetViewControl:false }); currentMarkerRef.current=new g.Marker({ position:{lat:pos.lat,lng:pos.lng}, map:mapRef.current, title:'현재 위치' }); mapRef.current.addListener('click',(e:any)=>{ const lat=e.latLng.lat(), lng=e.latLng.lng(); setPos({lat,lng}); if(currentMarkerRef.current) currentMarkerRef.current.setPosition({lat,lng}); else currentMarkerRef.current=new g.Marker({ position:{lat,lng}, map:mapRef.current, title:'현재 위치' }) }) },[mapsLoaded,pos])

  useEffect(()=>{ if(!pos||!mapRef.current) return; mapRef.current.setCenter({lat:pos.lat,lng:pos.lng}); if(currentMarkerRef.current) currentMarkerRef.current.setPosition({lat:pos.lat,lng:pos.lng}) },[pos])

  useEffect(()=>{ if(!pos) return; setLoadingStations(true); fetch(`/api/stations?lat=${pos.lat}&lng=${pos.lng}`).then(r=>r.json()).then((data:Station[])=>{ setStations(data); if(stationMarkersRef.current.length&&window.google?.maps){ stationMarkersRef.current.forEach(m=>m.setMap(null)); stationMarkersRef.current=[] } if(mapRef.current&&window.google?.maps){ const g=window.google.maps; data.forEach(s=>{ const m=new g.Marker({ position:{lat:s.lat,lng:s.lng}, map:mapRef.current, title:s.name, label:{text:'역',fontSize:'12px'} }); m.addListener('click',()=>onSelectStation(s)); stationMarkersRef.current.push(m) }) } }).finally(()=>setLoadingStations(false)) },[pos])

  const onSelectStation=(s:Station)=>{ setSelected(s); setArrivals([]); setLoadingArrivals(true); fetch(`/api/arrival?station=${encodeURIComponent(s.name)}`).then(r=>r.json()).then((data:Arrival[])=>setArrivals(data)).finally(()=>setLoadingArrivals(false)); if(mapRef.current&&window.google?.maps){ mapRef.current.setCenter({lat:s.lat,lng:s.lng}); mapRef.current.setZoom(15) } }

  const stationList=useMemo(()=>stations.slice(0,30),[stations])
  const recenterToGeo=()=>{ if(!('geolocation'in navigator)) return; navigator.geolocation.getCurrentPosition(g=>setPos({lat:g.coords.latitude,lng:g.coords.longitude})) }

  return (
    <Box sx={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <TopBar onRecenter={recenterToGeo}/>
      <Grid container spacing={2} sx={{ flex:1, px:{xs:1,sm:2}, py:2, m:0 }}>
        <Grid size={{ xs:12, md:7 }}>
          <Paper elevation={3} sx={{ height:{ xs:'55vh', md:'calc(100vh - 120px)' }, overflow:'hidden' }}>
            <Box ref={mapDivRef} className='map-root'/>
          </Paper>
          <Typography variant='caption' sx={{ mt:1, display:'block', opacity:0.7 }}>Tip: Tap the map to change current location. Markers refresh automatically.</Typography>
        </Grid>
        <Grid size={{ xs:12, md:5 }}>
          <Card elevation={3} sx={{ mb:2 }}>
            <CardContent>
              <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                <Typography variant='h6' fontWeight={700}>Nearby Subway Stations</Typography>
                <Chip size='small' label={pos?'GPS OK':'GPS …'} color={pos?'success':'default'}/>
              </Stack>
              <Divider sx={{ my:1.5 }}/>
              {loadingStations&&<Stack direction='row' spacing={1} alignItems='center'><CircularProgress size={18}/><Typography variant='body2'>Loading stations…</Typography></Stack>}
              {!loadingStations&&stationList.map(s=> (
                <Paper key={s.id} variant='outlined' onClick={()=>onSelectStation(s)} sx={{ p:1, mb:1.2, cursor:'pointer', '&:hover':{ bgcolor:'action.hover' } }}>
                  <Stack direction='row' justifyContent='space-between' alignItems='center'>
                    <Typography fontWeight={600}>{s.name}</Typography>
                    <Typography variant='caption' color='text.secondary'>{Math.round(s.distance)} m</Typography>
                  </Stack>
                  {selected?.id===s.id&&(
                    <Box sx={{ mt:1, pl:1, borderLeft:'2px solid', borderColor:'divider' }}>
                      <Typography variant='caption' color='text.secondary'>Realtime arrivals</Typography>
                      {loadingArrivals&&<Stack direction='row' spacing={1} alignItems='center'><CircularProgress size={16}/><Typography variant='body2'>Loading…</Typography></Stack>}
                      {!loadingArrivals&&arrivals.length===0&&(<Typography variant='body2' color='text.secondary'>No arrivals to display.</Typography>)}
                      {!loadingArrivals&&arrivals.map((a,idx)=>(
                        <Box key={idx} sx={{ my:0.75 }}>
                          <Stack direction='row' spacing={1} alignItems='baseline'>
                            <Chip size='small' label={a.updnLine}/>
                            <Typography>{a.trainLineNm}</Typography>
                          </Stack>
                          <Typography variant='body2' color='text.secondary'>{a.arvlMsg2} ({a.arvlMsg3})</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
