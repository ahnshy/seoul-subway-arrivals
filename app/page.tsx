'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Station = { id: string; name: string; lat: number; lng: number; distance: number }
type Arrival = { trainLineNm: string; updnLine: string; arvlMsg2: string; arvlMsg3: string; barvlDt?: string; btrainNo?: string }

declare global { interface Window { google: any; gm_authFailure?: ()=>void; initMap?: ()=>void } }

export default function Home(){
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const currentMarkerRef = useRef<any>(null)
  const [pos,setPos] = useState<{lat:number,lng:number}|null>(null)
  const [mapsLoaded,setMapsLoaded]=useState(false)
  const [stations,setStations]=useState<Station[]>([])
  const [selected,setSelected]=useState<Station|null>(null)
  const [arrivals,setArrivals]=useState<Arrival[]>([])
  const [loadingStations,setLoadingStations]=useState(false)
  const [loadingArrivals,setLoadingArrivals]=useState(false)

  // 1) 초기 위치: 브라우저 Geolocation
  useEffect(()=>{
    if(!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
        g => setPos({lat:g.coords.latitude, lng:g.coords.longitude}),
        _ => setPos({lat:37.5665, lng:126.9780})
    )
  },[])

  // 2) Google Maps 로더 (callback 방식)
  useEffect(()=>{
    if (typeof window === 'undefined') return
    if (window.google && window.google.maps) { setMapsLoaded(true); return }

    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!key) { console.error('Google Maps API key is missing'); return }

    window.gm_authFailure = () => { console.error('Google Maps authentication failure') }
    window.initMap = () => { setMapsLoaded(true) }

    const url = new URL('https://maps.googleapis.com/maps/api/js')
    url.searchParams.set('key', key as string)
    url.searchParams.set('v', 'weekly')
    url.searchParams.set('language', 'ko')
    url.searchParams.set('region', 'KR')
    url.searchParams.set('callback', 'initMap')

    const s = document.createElement('script')
    s.src = url.toString()
    s.async = true
    s.defer = true
    s.onerror = (e)=> console.error('Google Maps JS load error', e)
    document.head.appendChild(s)
  }, [])

  // 3) 맵 초기화 (한 번만)
  useEffect(()=>{
    if (!mapsLoaded || !pos || !mapDivRef.current || mapRef.current) return
    const g = window.google.maps
    mapRef.current = new g.Map(mapDivRef.current, {
      center:{lat:pos.lat,lng:pos.lng},
      zoom:14,
      mapTypeControl:false,
      streetViewControl:false
    })
    currentMarkerRef.current = new g.Marker({
      position:{lat:pos.lat,lng:pos.lng},
      map: mapRef.current,
      title:'현재 위치'
    })

    // ▶ 맵 클릭으로 현재 위치 변경
    mapRef.current.addListener('click', (e:any)=>{
      const lat = e.latLng.lat(); const lng = e.latLng.lng()
      setPos({lat,lng})                      // 상태 업데이트 → 주변 역 재조회 트리거
      if (currentMarkerRef.current) currentMarkerRef.current.setPosition({lat,lng})
      else currentMarkerRef.current = new g.Marker({ position:{lat,lng}, map:mapRef.current, title:'현재 위치' })
    })
  }, [mapsLoaded, pos])

  // 4) pos가 바뀌면 지도 중심/마커를 갱신
  useEffect(()=>{
    if (!pos || !mapRef.current || !window.google?.maps) return
    mapRef.current.setCenter({lat:pos.lat, lng:pos.lng})
    if (currentMarkerRef.current) currentMarkerRef.current.setPosition({lat:pos.lat, lng:pos.lng})
  }, [pos])

  // 5) 주변 역 조회 (pos에 따라 갱신)
  useEffect(()=>{
    if (!pos) return
    setLoadingStations(true)
    fetch(`/api/stations?lat=${pos.lat}&lng=${pos.lng}`)
        .then(r=>r.json())
        .then((data: Station[])=>{
          setStations(data)
          if (mapRef.current && window.google?.maps) {
            const g = window.google.maps
            data.forEach(s => {
              const m = new g.Marker({
                position:{lat:s.lat,lng:s.lng},
                map: mapRef.current,
                title: s.name,
                label:{ text:'역', fontSize:'12px' }
              })
              m.addListener('click', ()=> onSelectStation(s))
            })
          }
        })
        .finally(()=> setLoadingStations(false))
  }, [pos])

  const onSelectStation=(s:Station)=>{
    setSelected(s)
    setArrivals([])
    setLoadingArrivals(true)
    fetch(`/api/arrival?station=${encodeURIComponent(s.name)}`)
        .then(r=>r.json())
        .then((data:Arrival[])=> setArrivals(data))
        .finally(()=> setLoadingArrivals(false))
    if (mapRef.current && window.google?.maps) {
      mapRef.current.setCenter({lat:s.lat,lng:s.lng})
      mapRef.current.setZoom(15)
    }
  }

  const stationList=useMemo(()=>stations.slice(0,30),[stations])

  return (
      <main className='app'>
        <div style={{position:'relative'}}>
          <div className='toolbar'>
            <span className='badge'>{pos?'GPS OK':'GPS...'}</span>
            <span className='muted'>반경 내 지하철역 탐색</span>
            <span className='hint'>· 지도를 클릭하면 <b>현재 위치</b>가 바뀝니다</span>
          </div>
          <div id='map' ref={mapDivRef} />
        </div>
        <aside className='panel'>
          <h2 style={{marginTop:0}}>가까운 지하철역</h2>
          {loadingStations&&<div>역 정보를 불러오는 중...</div>}
          {!loadingStations&&stationList.map(s=> (
              <div key={s.id} className='station-item' onClick={()=>onSelectStation(s)}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                  <strong>{s.name}</strong><span className='muted'>{Math.round(s.distance)} m</span>
                </div>
                {selected?.id===s.id&&(
                    <div className='arrivals'>
                      <div style={{fontSize:12}} className='muted'>실시간 도착</div>
                      {loadingArrivals&&<div>도착 정보를 불러오는 중...</div>}
                      {!loadingArrivals&&arrivals.length===0&&<div>표시할 도착 정보가 없습니다.</div>}
                      {!loadingArrivals&&arrivals.map((a,idx)=>(
                          <div key={idx} style={{margin:'6px 0'}}>
                            <div style={{display:'flex',gap:8,alignItems:'baseline'}}>
                              <span className='badge'>{a.updnLine}</span>
                              <span>{a.trainLineNm}</span>
                            </div>
                            <div className='muted' style={{fontSize:13}}>{a.arvlMsg2} ({a.arvlMsg3})</div>
                          </div>
                      ))}
                    </div>
                )}
              </div>
          ))}
        </aside>
      </main>
  )
}
