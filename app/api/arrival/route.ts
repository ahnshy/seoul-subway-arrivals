import { NextResponse } from 'next/server'

export async function GET(req: Request){ const {searchParams}=new URL(req.url); const station=searchParams.get('station'); if(!station) return NextResponse.json([]); const key=process.env.SEOUL_SUBWAY_API_KEY; if(!key){ return NextResponse.json([{trainLineNm:'2호선',updnLine:'상행',arvlMsg2:'3분 후 도착',arvlMsg3:'성수행'},{trainLineNm:'2호선',updnLine:'하행',arvlMsg2:'6분 후 도착',arvlMsg3:'시청행'}]) }
  const url=`http://swopenapi.seoul.go.kr/api/subway/${key}/json/realtimeStationArrival/0/20/${encodeURIComponent(station)}`; try{ const res=await fetch(url,{ next:{ revalidate:7 } }); if(!res.ok) return NextResponse.json([]); const data=await res.json(); const list=data?.realtimeArrivalList??[]; const simplified=list.map((x:any)=>({ trainLineNm:x.trainLineNm, updnLine:x.updnLine, arvlMsg2:x.arvlMsg2, arvlMsg3:x.arvlMsg3, barvlDt:x.barvlDt, btrainNo:x.btrainNo })); return NextResponse.json(simplified) } catch { return NextResponse.json([]) }
}
