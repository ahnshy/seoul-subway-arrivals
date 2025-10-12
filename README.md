# \# 📦 seoul-subway-arrivals

# Next.js-based web app for \*\*Current Location → Pick a Subway Station → Show real-time arrivals (up \& down directions)\*\* on \*\*Google Maps\*\*.<br/>

# ✅ Tested on Windows 10/11 · Node 18+ · Next.js 15<br/><br/>

# 

# \## 📖 Overview

# `seoul-subway-arrivals` is a lightweight web application that detects the browser’s \*\*current location (GPS/Geolocation)\*\*, shows nearby \*\*Seoul subway stations\*\* on a map, and displays \*\*real-time arrivals (both directions)\*\* for a selected station. It runs on a combination of \*\*Google Maps (JavaScript API)\*\*, \*\*Seoul Open Data (realtimeStationArrival)\*\*, and \*\*Overpass (OpenStreetMap)\*\*.<br/><br/>

# 

# \## 🔑 Key Features

# \- ✅ \*\*Auto-detect current location\*\* (Geolocation) + \*\*change location by clicking the map\*\*

# \- ✅ \*\*Nearby subway station markers\*\* on Google Maps (1.5 km radius via Overpass API)

# \- ✅ \*\*Station selection → real-time arrival messages\*\* (Seoul `realtimeStationArrival`)

# \- ✅ \*\*Next.js Route Handlers\*\* proxy external APIs → \*\*keep API keys safe\*\*

# \- ✅ Clean UI: \*\*map on the left\*\* · \*\*list \& arrivals panel on the right\*\*

# \- ✅ \*\*Environment-driven setup\*\* (`.env.local`) for both local dev and production<br/><br/>

# 

# \## 🛠️ Stacks

# !\[Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js) !\[TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript\&logoColor=white) !\[React](https://img.shields.io/badge/React-18-61DAFB?logo=react\&logoColor=black)  

# !\[Google Maps JS API](https://img.shields.io/badge/Google%20Maps-JS%20API-4285F4?logo=googlemaps\&logoColor=white) !\[OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-Overpass-7EBC6F?logo=openstreetmap\&logoColor=white) !\[Node.js](https://img.shields.io/badge/Node-18%2B-339933?logo=node.js\&logoColor=white)<br/><br/>

# 

# \## ⚙️ Dev Environment

# \- \*\*Platform\*\*: Cross-platform (developed on Windows 10/11; also works on macOS/Linux)

# \- \*\*Language\*\*: TypeScript + React (Next.js App Router)

# \- \*\*APIs\*\*: Google Maps JS API, Overpass API (OSM), Seoul Open Data `realtimeStationArrival`<br/><br/>

# 

# \## 📁 Source Tree

# ```

# /

# ├── app/

# │   ├── api/

# │   │   ├── arrival/route.ts      # Proxy to Seoul realtime arrivals (fields normalized)

# │   │   └── stations/route.ts     # Query nearby “subway stations” via Overpass

# │   ├── globals.css               # Base styles (two-column layout / toolbar / badges)

# │   ├── layout.tsx                # Root document

# │   └── page.tsx                  # Map loader, current-location marker, click-to-relocate, UI

# ├── .env.local.example            # Environment variable template

# ├── next.config.ts                # Next.js config

# ├── package.json

# └── README.md

# ```

# <br/>

# 

# \## 🧪 Quick Start (Local)

# 1\) Install dependencies

# ```bash

# npm i

# ```

# 

# 2\) Configure environment variables

# ```bash

# cp .env.local.example .env.local

# \# Edit .env.local

# NEXT\_PUBLIC\_GOOGLE\_MAPS\_API\_KEY=YOUR\_GOOGLE\_MAPS\_KEY

# SEOUL\_SUBWAY\_API\_KEY=YOUR\_SEOUL\_OPEN\_DATA\_KEY

# ```

# 

# 3\) Run the dev server

# ```bash

# npm run dev

# \# http://localhost:3000

# ```

# 

# 4\) Production build \& run

# ```bash

# npm run build

# npm run start

# ```

# <br/>

# 

# \## 🚀 How to Use

# 1\. On first load, \*\*allow location permission\*\* → the map centers on your current position.  

# 2\. Click the green \*\*“역”\*\*-labeled markers on the map or select a station from the \*\*Nearby Stations\*\* list.  

# 3\. The selected card displays \*\*real-time arrival messages\*\* for \*\*up\*\*/\*\*down\*\* directions.  

# 4\. \*\*Click anywhere on the map\*\* to set a \*\*new current location\*\*—nearby stations are fetched again accordingly.<br/><br/>

# 

# \## 🔌 Endpoints

# \- `GET /api/stations?lat={lat}\&lng={lng}`  

# &nbsp; Queries Overpass (OSM) for subway-station nodes within a 1.5 km radius → computes distance, sorts, and removes duplicates.

# 

# \- `GET /api/arrival?station={name}`  

# &nbsp; Proxies Seoul Open Data `realtimeStationArrival` → returns only the necessary fields for the UI.<br/><br/>

# 

# \## 🔧 Configuration

# \*\*Google Maps JS API\*\*

# \- In Google Cloud Console: link a billing account → \*\*Enable “Maps JavaScript API.”\*\*

# \- Create \*\*API Key\*\* in \*\*APIs \& Services → Credentials\*\*.

# \- Set \*\*HTTP referrer restrictions\*\* for local dev:  

# &nbsp; `http://localhost:3000/\*` (add `:3001/\*` etc. if you use other ports)

# 

# \*\*Seoul Open Data API\*\*

# \- Apply for the \*\*`realtimeStationArrival`\*\* dataset → get your \*\*API key\*\* (인증키).

# 

# \*\*Environment variables\*\*

# ```env

# NEXT\_PUBLIC\_GOOGLE\_MAPS\_API\_KEY=...   # injected into the front-end loader

# SEOUL\_SUBWAY\_API\_KEY=...              # used in server routes (kept hidden)

# ```

# <br/>

# 

# \## 🧭 Tips \& Troubleshooting

# \*\*Gray map / not loading\*\*

# \- Check console error codes such as `RefererNotAllowedMapError`, `BillingNotEnabledMapError`, `ApiNotActivatedMapError`.

# \- Verify referrers, billing linkage, API enablement, and key typos.

# 

# \*\*Station name mismatches\*\*

# \- OSM names may differ from Seoul API names. Add \*\*autocomplete/normalization\*\* for robust lookup.

# 

# \*\*Rate limits\*\*

# \- Apply \*\*cooldowns \& caching\*\* (`revalidate`) for Overpass and Seoul APIs.

# 

# \*\*Marker accumulation\*\*

# \- If markers pile up after many relocations, keep a `markersRef` and call `m.setMap(null)` before re-rendering.<br/><br/>

# 

# \## 💻 Preview

# \- \*\*Left\*\*: Map + current-location marker  

# \- \*\*Right\*\*: Nearby station list \& selected station’s real-time arrivals  

# \- \*\*Map click = change current location\*\* → immediate refresh of nearby stations/arrivals<br/><br/>

# 

# \## 🔍 Acknowledgements

# \- Product Design \& Development by `ahnshy`  

# \- Built with:

# &nbsp; - \*\*Next.js / React / TypeScript\*\*

# &nbsp; - \*\*Google Maps JavaScript API\*\*

# &nbsp; - \*\*Overpass API (OpenStreetMap)\*\*

# &nbsp; - \*\*Seoul Open Data (realtimeStationArrival)\*\*<br/><br/>

# 

# \## 📝 License

# This template is provided for educational/experimental purposes.  

# Please follow the \*\*Terms of Service and usage limits\*\* of Google Maps, Seoul Open Data, and Overpass.  

# Map/data copyrights and policies remain with their respective providers.



