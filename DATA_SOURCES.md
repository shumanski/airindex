# Air Quality Data Sources — Evaluation & Roadmap

Context: airindex.today currently uses **CAMS** (Copernicus Atmosphere Monitoring Service) global forecast via **Open-Meteo**. This works well for ~70% of the world but produces catastrophic outliers in specific regimes — most notably dust events over the Arabian Peninsula (Riyadh PM10 = 1334 µg/m³ vs ground truth ~50, yielding a display AQI of 1251). This document evaluates the available alternatives and proposes a path forward.

## 1. Current pipeline

```
Copernicus CAMS (global forecast, 0.4° grid)
  └── Open-Meteo (self-hosted, adds us_aqi calculation)
        └── airindex.today (displays raw)
```

Two failure modes identified:
- **CAMS model bias** in specific regimes (Arabian dust storms predicted 3–12× too intense). No public fix timeline from ECMWF.
- **Open-Meteo formula bug**: `positionExtrapolated()` extrapolates US AQI linearly past the EPA 500 cap instead of clamping. Fixable by fork (AGPLv3) but pointless without solving #1.

## 2. Cross-model comparison (2026-04-24, 20 cities)

Independent verification using NASA GEOS-CF (OPeNDAP, free, no key):

| Regime | Cities | CAMS/GEOS-CF ratio | Assessment |
|---|---|---|---|
| Arabian dust | Riyadh, Jeddah, Kuwait | 3.8× – 12.3× | **CAMS broken** |
| Other desert | Dubai, Doha, Cairo, Phoenix | 0.8× – 2.0× | Normal spread |
| Polluted Asia | Delhi, Beijing, Shanghai, Lahore, Jakarta | 0.2× – 3.5× | Mixed, mostly ok |
| Temperate/developed | London, Paris, NYC, Tokyo, Sydney, LA, Berlin | 0.4× – 1.4× | Agreement |

Conclusion: **CAMS is not globally broken**. It is broken for modeled Middle-East dust events where ground observations don't constrain the assimilation.

## 3. Data source options

### 3.1 Forecast models (what we show for the 5-day trend)

| Source | License | Cost | Rate limit | Coverage | Commercial use | Notes |
|---|---|---|---|---|---|---|
| **CAMS via Open-Meteo** (current) | CC-BY 4.0 (CAMS), AGPLv3 (OM) | Free, self-hosted already | Unlimited (self-host) | Global 0.4° | ✅ Yes with attribution | Has Arabian dust bias |
| **CAMS direct (Copernicus ADS)** | CC-BY 4.0 | Free | Request-based, needs key | Global | ✅ Yes | No JSON point API; GRIB files only |
| **NASA GEOS-CF** (OPeNDAP) | Public domain (NASA) | Free | "Best effort" — no SLA | Global 0.25° | ✅ Yes | Separate model; we validated it; no commercial SLA |
| **NOAA GEFS-Aerosols** | Public domain | Free | NOMADS server | Global | ✅ Yes | US-focused, GRIB format |
| **Open-Meteo public** | CC-BY 4.0 | Free | 10,000 req/day non-commercial | Global | ⚠️ Non-commercial only | We can't use on ads-supported site |
| **Meteomatics** | Proprietary | €€€ | Per-package | Global | ✅ Yes | Commercial weather API, ~$500/mo tier |

### 3.2 Ground station networks (authoritative for "what AQI is right now")

| Source | License | Cost | Rate limit | Coverage | Commercial use | Notes |
|---|---|---|---|---|---|---|
| **OpenAQ v3** | CC BY 4.0 (data), code MIT | Free, requires API key | 60 req/min (free), 2000 req/min (paid ~$50/mo) | ~15k stations globally | ✅ Yes | Canonical aggregator of govt. data, uneven coverage |
| **WAQI / aqicn.org** | Varies per station; demo free | Token required (free on request) | ~1 req/sec | ~12k stations | ⚠️ Ambiguous — commercial needs explicit permission per feed | Best station map UI but licensing unclear |
| **AirNow (US EPA)** | Public domain | Free with key | 500 req/hr | US only (+ some embassies globally) | ✅ Yes | Best data for North America |
| **EEA (European Env. Agency)** | CC0 | Free, bulk download | Unlimited | EU only | ✅ Yes | Hourly data, 1-day lag |
| **PurpleAir** | Proprietary | Free with key (non-commercial), paid commercial | 10 req/min free | ~30k low-cost sensors, heavy US/EU | ⚠️ Commercial license required | Consumer sensors, calibration issues |
| **Saudi PME** | Gov data, no public API | — | — | Saudi Arabia | ❌ Not publicly available | Available via WAQI aggregation |

### 3.3 Paid "fused" commercial services

| Source | Pricing | Coverage | Notes |
|---|---|---|---|
| **Google Air Quality API** | $5 / 1000 requests after 10k free/mo | Global, 0.5 km resolution | Fuses CAMS + local stations + traffic. Commercial OK. Must display "Data from Google". |
| **Breezometer** (now part of Google) | N/A — folded into Google AQ API | — | Deprecated May 2024 |
| **IQAir AirVisual API** | $150–$1,500/mo | Global | 14-day forecasts, uses own + gov stations |
| **AerisWeather** | ~$50/mo entry | Global | Aggregator, good for commercial dashboards |
| **Ambee** | Custom quote (~$200+/mo) | Global | ML-fused CAMS + stations |

## 4. Proposed approach (phased)

### Phase 1 — Honest UX (do now)
- **Add a prominent "modeled forecast data" disclaimer** near the top of the home page and each city page, explaining that values are modeled and that ground stations should be consulted for health-critical decisions. ✅ In scope of current change.
- Keep existing outlier suppression (Saudi cities excluded from homepage ranking).
- **Do NOT cap AQI to 500** — breaks forecast charts, doesn't solve ranking problem.

### Phase 2 — Better "right now" value
Add a **ground station layer for the current-hour AQI only** (not forecast):
- Integrate **OpenAQ v3** (free, commercial-OK, governmental data) with fallback chain:
  1. If station within X km with fresh reading → show station AQI as "now"
  2. Else → show CAMS value labeled "modeled"
- Forecast chart stays CAMS-based everywhere (no alternative for 5-day hourly).
- Cost: free, one API key. Station coverage poor in developing regions, but that's honest — we'd display "no station data, showing model".

Estimated effort: 1-2 days. Main work in [src/lib/aqi-api.ts](src/lib/aqi-api.ts) + new [src/lib/openaq.ts](src/lib/openaq.ts).

### Phase 3 — Regional dust filter (optional)
For regions where CAMS dust model misbehaves (Arabian Peninsula primarily), apply heuristic:
- If `pm10/pm2.5 > 5` AND `pm10 > 500 µg/m³` → flag as "modeled dust event" and either:
  - Swap to PM2.5-derived AQI only (more trustworthy in this regime)
  - Or blend toward GEOS-CF value if available

Risk: user complaint prevention system from above rule #2 — never changing API data without explicit approval. This would need user sign-off.

### Phase 4 — Paid upgrade (only if warranted by traffic)
If ad revenue justifies ~$5–50/month and we want "it just works" globally:
- **Google Air Quality API** is the cleanest option. Commercial license, global 500m resolution, fuses CAMS with local stations automatically, handles the dust-over-Arabia problem out of the box because it pulls Saudi PME stations into the fusion.
- Only worth it once the site has enough traffic that the accuracy-vs-cost tradeoff is positive.

## 5. Items explicitly rejected

| Option | Why rejected |
|---|---|
| Cap AQI to 500 | Doesn't fix ranking (Riyadh still #1 with max value); flattens forecast charts into straight lines for days; misleading. |
| Drop CAMS entirely | 14/20 cities test fine; CAMS is only broken in specific regimes; replacing the engine for a regional bug is overkill. |
| Fork Open-Meteo and fix `positionExtrapolated()` | Fixes the display number but not the underlying CAMS overestimation; 500 is still ~10× ground truth. Maintenance burden not worth it. |
| Open-Meteo public tier | Non-commercial license; we plan ads. Already using self-hosted which is fine commercially. |
| PurpleAir primary | Commercial licensing required; consumer sensor calibration quality is inconsistent; would still need professional stations to validate. |

## 6. Attribution requirements (for ToS page)

Whatever we use, ensure:
- **CAMS**: "Generated using Copernicus Atmosphere Monitoring Service information 2026" + link to https://atmosphere.copernicus.eu (CC-BY 4.0 — required)
- **Open-Meteo**: Current attribution ok; if we upgrade to Google/IQAir, can remove
- **OpenAQ** (if added): "Powered by OpenAQ" link required
- **Google AQ API** (if added): "Data from Google" required per their ToS
- **NASA GEOS-CF** (if added): "Data from NASA GMAO" courtesy attribution

## 7. Decision matrix

| Goal | Recommended |
|---|---|
| Ship honest UX today with zero API work | **Phase 1 disclaimer only** |
| Improve "current AQI" accuracy without paying | **Phase 1 + Phase 2 (OpenAQ)** |
| Handle the Arabia outlier class | **Phase 1 + Phase 2 + Phase 3** |
| Best quality, commercial-grade | **Phase 4 (Google AQ API)** once traffic justifies ~$10-50/mo |
