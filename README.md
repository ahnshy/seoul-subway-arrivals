# 📦 seoul-subway-arrivals
Next.js-based web app for **Current Location → Pick a Station → Show real-time arrivals (up & down)** on **Google Maps**.<br/>
✅ Tested on Windows 10/11 · Node 18+ · Next.js 15<br/><br/>

## 📖 Overview
`seoul-subway-arrivals` is a lightweight app that detects the browser’s **current location (GPS/Geolocation)**, shows nearby **Seoul subway stations** on a map, and displays **real-time arrivals** for the selected station. It uses **Google Maps (JavaScript API)** for the map, **Overpass (OpenStreetMap)** for nearby stations, and **Seoul Open Data** (`realtimeStationArrival`) for live ETA info.<br/><br/>

## 🔑 Key Features
- ✅ **Auto-detect current location** (Geolocation) + **change location by clicking the map**
- ✅ **Nearby station markers** (1.5 km radius via Overpass API)
- ✅ **Station selection → realtime arrivals** (Seoul `realtimeStationArrival`)
- ✅ **Material UI 6** UI with mobile-first responsive layout
- ✅ **Theme modes**: **Light / Night / Dark**
  - **Light**: AppBar bg `#ffffff`, text `#111827`
  - **Night**: AppBar bg `#0b1220`, text `#e2e8f0`
  - **Dark**: AppBar bg `#000000`, text `#ffffff`
- ✅ **Mobile-friendly theme switch**: on phones, a **palette icon** opens a **menu** to select Light/Night/Dark; on desktop, an inline toggle is shown
- ✅ **Next.js Route Handlers** proxy external APIs → **API keys stay server-side**<br/><br/>

## 🛠️ Stacks
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)  
![Google Maps JS API](https://img.shields.io/badge/Google%20Maps-JS%20API-4285F4?logo=googlemaps&logoColor=white) ![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-Overpass-7EBC6F?logo=openstreetmap&logoColor=white) ![MUI](https://img.shields.io/badge/MUI-6-007FFF?logo=mui&logoColor=white) ![Node.js](https://img.shields.io/badge/Node-18%2B-339933?logo=node.js&logoColor=white)<br/><br/>

## ⚙️ Dev Environment
- **Platform**: Cross-platform (dev on Windows 10/11; also works on macOS/Linux)
- **Language**: TypeScript + React (Next.js App Router)
- **APIs**: Google Maps JS API, Overpass API (OSM), Seoul Open Data `realtimeStationArrival`<br/><br/>

## 📁 Source Tree
```
/
├── app/
│   ├── api/
│   │   ├── arrival/route.ts      # Proxy to Seoul realtime arrivals (fields normalized)
│   │   └── stations/route.ts     # Query nearby subway stations via Overpass
│   ├── globals.css               # Minimal global styles
│   ├── layout.tsx                # Root layout with ThemeRegistry
│   ├── ThemeRegistry.tsx         # MUI theme provider + Light/Night/Dark modes
│   └── page.tsx                  # Map loader, click-to-relocate, UI
├── components/
│   └── TopBar.tsx                # AppBar with geolocate & theme switch (menu on mobile)
├── .env.local.example            # Environment variable template
├── next.config.ts                # Next.js config (allowedDevOrigins for LAN dev)
├── package.json
└── README.md
```
<br/>

## 🧪 Quick Start (Local)
1) Install deps
```bash
npm i
```
2) Configure env vars
```bash
cp .env.local.example .env.local
# Edit .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_KEY
SEOUL_SUBWAY_API_KEY=YOUR_SEOUL_OPEN_DATA_KEY
```
3) Dev server
```bash
npm run dev
# http://localhost:3000
```
4) Production
```bash
npm run build
npm run start
```
<br/>

## 🚀 How to Use
1. On first load, **allow location** so the map centers on your current position.  
2. Tap the **“역”** markers on the map or pick from **Nearby Subway Stations**.  
3. The selected card shows **realtime arrivals** for **up**/**down** directions.  
4. **Tap the map** anywhere to **set a new current location** → stations/ETAs refresh.  
5. **Theme switch**:  
   - **Mobile**: tap the **palette icon** (top-right) → choose **Light / Night / Dark**  
   - **Desktop**: use the inline toggle on the AppBar<br/><br/>

## 🔌 Endpoints
- `GET /api/stations?lat={lat}&lng={lng}`  
  Overpass (OSM) query for subway-station nodes within 1.5 km → compute distance, sort, dedupe.

- `GET /api/arrival?station={name}`  
  Proxies Seoul `realtimeStationArrival` → returns relevant fields only.<br/><br/>

## 🔧 Configuration
**Google Maps JS API**
- Google Cloud Console → link billing → **enable “Maps JavaScript API.”**
- Create **API Key** (APIs & Services → Credentials).
- Set referrer restrictions for local dev: `http://localhost:3000/*` (add extra ports if needed).

**Seoul Open Data API**
- Apply for **`realtimeStationArrival`** dataset → obtain **API key**.

**Environment variables**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...   # used by the front-end loader
SEOUL_SUBWAY_API_KEY=...              # used in server routes (kept secret)
```
<br/>

## 🎨 Theme Details
- **Light**: bg `#ffffff`, text `#111827` (high readability)  
- **Night**: bg `#0b1220`, text `#e2e8f0` (dimmed dark-blue night view)  
- **Dark**: bg `#000000`, text `#ffffff` (pure black for OLED)  
- AppBar border subtly adapts per mode for better separation.

## 🧭 Tips & Troubleshooting
- **Gray map / not loading**: check console codes (`RefererNotAllowedMapError`, `BillingNotEnabledMapError`, `ApiNotActivatedMapError`), verify referrers/billing/API/key.
- **Name mismatches**: OSM vs Seoul API names can differ → consider autocomplete/normalization.
- **Rate limits**: add cooldowns & caching (`revalidate`) for Overpass/Seoul endpoints.
- **Marker accumulation**: if you modify rendering, clear previous markers via `marker.setMap(null)`.

## 🔍 Acknowledgements
- Product Design & Development by `ahnshy`  
- Built with **Next.js / React / TypeScript**, **Google Maps JS API**, **Overpass (OSM)**, **Seoul Open Data (`realtimeStationArrival`)**

## 📝 License
This template is for educational/experimental use. Follow the **Terms** and **usage limits** of Google Maps, Seoul Open Data, and Overpass.  
Map/data copyrights remain with their respective providers.
