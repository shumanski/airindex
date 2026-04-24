'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { getAqiColor } from '@/lib/aqi-utils';
import AqiLegend from './AqiLegend';
import type { NearbyCityResult } from '@/lib/geocode-api';
import { createAqiGridLayer, type AqiGridLayerHandle } from './AqiGridLayer';

interface Props {
  lat: number;
  lon: number;
  cityName: string;
  currentAqi?: number;
  todayPeakAqi?: number;
  nearbyCities?: NearbyCityResult[];
  nearbyAqiCurrent?: Record<string, number>;
  nearbyAqiMax?: Record<string, number>;
}

const LOCALE_MAP: Record<string, string> = {
  en: 'en', sv: 'sv', no: 'no', da: 'da', de: 'de',
  nl: 'nl', it: 'it', es: 'es', fr: 'fr', pt: 'pt', pl: 'pl',
};

export default function CityMap({ lat, lon, cityName, currentAqi, todayPeakAqi, nearbyCities, nearbyAqiCurrent, nearbyAqiMax }: Props) {
  const locale = useLocale();
  const t = useTranslations('aqi');
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const mainMarkerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const overlayRef = useRef<AqiGridLayerHandle | null>(null);
  const [inView, setInView] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [aqiMode, setAqiMode] = useState<'now' | 'max'>('now');
  const activeAqi = aqiMode === 'max' ? todayPeakAqi : currentAqi;

  // Overlay — default ON, persisted per city.
  const overlayStorageKey = `aqiOverlay.city`;
  const [overlayOn, setOverlayOn] = useState<boolean>(true);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(overlayStorageKey);
    if (stored === '0') setOverlayOn(false);
    else if (stored === '1') setOverlayOn(true);
  }, [overlayStorageKey]);
  const handleOverlayToggle = (next: boolean) => {
    setOverlayOn(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(overlayStorageKey, next ? '1' : '0');
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !containerRef.current) return;

    let cancelled = false;
    let idleId: number | null = null;
    let timeoutId: number | null = null;

    async function init() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      const { leafletLayer } = await import('protomaps-leaflet');

      if (cancelled || !containerRef.current) return;

      leafletRef.current = L;

      const tileUrl = process.env.NEXT_PUBLIC_TILES_URL || '/tiles/basemap.pmtiles';
      const lang = LOCALE_MAP[locale] || 'en';

      const getTheme = (): 'white' | 'black' =>
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'black' : 'white';

      const map = L.map(containerRef.current, {
        center: [lat, lon],
        zoom: 7,
        maxZoom: 9,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      L.control.attribution({ position: 'bottomright' }).addTo(map);

      let currentLayer = leafletLayer({
        url: tileUrl,
        flavor: getTheme(),
        lang,
      }).addTo(map);

      const themeObserver = new MutationObserver(() => {
        map.removeLayer(currentLayer);
        currentLayer = leafletLayer({
          url: tileUrl,
          flavor: getTheme(),
          lang,
        }).addTo(map);
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });

      // Create marker layer group for main + nearby (rebuilt on toggle)
      mainMarkerRef.current = L.layerGroup().addTo(map);

      // Fit to show all points with padding
      const points: [number, number][] = [[lat, lon]];
      nearbyCities?.forEach((c) => {
        if (typeof c.lat === 'number' && typeof c.lon === 'number') {
          points.push([c.lat, c.lon]);
        }
      });
      if (points.length > 1) {
        map.fitBounds(points as L.LatLngBoundsExpression, {
          padding: [35, 35],
          maxZoom: 9,
        });
      }

      mapRef.current = map;
      observerRef.current = themeObserver;
      setMapReady(true);
    }

    const startInit = () => {
      window.requestAnimationFrame(() => {
        if (!cancelled) init();
      });
    };

    const ric = (window as Window & {
      requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
    }).requestIdleCallback;

    const isNearViewport = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return false;
      return rect.top < window.innerHeight * 1.5;
    };

    if (isNearViewport() && ric) {
      // Near viewport: wait for idle time (max 1s) before importing Leaflet
      idleId = ric(() => startInit(), { timeout: 1000 });
    } else if (isNearViewport()) {
      // Near viewport but no requestIdleCallback: defer with frames only
      window.requestAnimationFrame(() => {
        if (!cancelled) window.requestAnimationFrame(() => startInit());
      });
    } else if (ric) {
      // Far from viewport: wait for idle time (no timeout)
      idleId = ric(() => startInit());
    }

    return () => {
      cancelled = true;
      if (idleId !== null) {
        const cic = (window as Window & {
          cancelIdleCallback?: (id: number) => void;
        }).cancelIdleCallback;
        cic?.(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      observerRef.current?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      mainMarkerRef.current = null;
      leafletRef.current = null;
      setMapReady(false);
    };
  }, [inView, lat, lon, locale, nearbyCities]);

  // Derive the active nearby AQI lookup based on mode
  const nearbyAqi = aqiMode === 'max' ? nearbyAqiMax : nearbyAqiCurrent;

  // Update all markers (main + nearby) when activeAqi changes
  useEffect(() => {
    const L = leafletRef.current;
    const markerGroup = mainMarkerRef.current;
    if (!L || !markerGroup) return;

    markerGroup.clearLayers();

    const aqi = activeAqi;
    const mainColor = aqi != null ? (Math.round(aqi) === 0 ? '#9ca3af' : getAqiColor(Math.round(aqi))) : '#3b82f6';

    // Main city marker (larger, permanent label)
    L.circleMarker([lat, lon], {
      radius: 7,
      fillColor: mainColor,
      fillOpacity: 1,
      color: '#fff',
      weight: 2.5,
    }).bindTooltip(aqi != null ? `${cityName} AQI ${Math.round(aqi)}` : cityName, {
      permanent: true,
      direction: 'top',
      offset: [0, -10],
      className: 'map-label map-label-main',
    }).addTo(markerGroup);

    // Nearby city markers (smaller, clickable) — each uses its OWN AQI
    nearbyCities?.forEach((c) => {
      if (typeof c.lat !== 'number' || typeof c.lon !== 'number') return;
      const cKey = `${c.lat},${c.lon}`;
      const cAqi = nearbyAqi?.[cKey];
      const cColor = cAqi != null ? (cAqi === 0 ? '#9ca3af' : getAqiColor(cAqi)) : '#6b7280';
      const cLabel = cAqi != null ? `${c.name} AQI ${cAqi}` : c.name;
      L.circleMarker([c.lat, c.lon], {
        radius: 4.5,
        fillColor: cColor,
        fillOpacity: 0.8,
        color: '#fff',
        weight: 1.5,
      }).bindTooltip(cLabel, {
        direction: 'top',
        offset: [0, -6],
        className: 'map-label',
      }).on('click', () => {
        window.location.href = `/${locale}/${c.slug}`;
      }).addTo(markerGroup);
    });
  }, [activeAqi, nearbyAqi, lat, lon, cityName, nearbyCities, locale, mapReady]);

  // Mount / unmount the AQI grid overlay for this city (±1° bbox, 0.1° spacing).
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    if (!overlayOn) {
      overlayRef.current?.remove();
      overlayRef.current = null;
      return;
    }
    const layer = createAqiGridLayer(L, {
      minLat: lat - 1,
      maxLat: lat + 1,
      minLon: lon - 1,
      maxLon: lon + 1,
      spacing: 0.1,
    });
    layer.addTo(map);
    overlayRef.current = layer;
    return () => {
      layer.remove();
      if (overlayRef.current === layer) overlayRef.current = null;
    };
  }, [mapReady, overlayOn, lat, lon]);

  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <div className="inline-flex rounded-lg border border-[var(--color-border)] overflow-hidden text-xs font-medium">
          <button
            onClick={() => setAqiMode('now')}
            className={`px-2.5 py-1 transition-colors ${aqiMode === 'now' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'}`}
          >{t('now')}</button>
          <button
            onClick={() => setAqiMode('max')}
            className={`px-2.5 py-1 transition-colors ${aqiMode === 'max' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'}`}
          >{t('todayMax')}</button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative z-0 h-[220px] lg:h-[380px] rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)]"
      />
      <AqiLegend overlay={{ enabled: overlayOn, onToggle: handleOverlayToggle }} />
      <style jsx global>{`
        .map-label {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 4px;
          border: none;
          box-shadow: 0 1px 3px rgba(0,0,0,.15);
          background: var(--color-surface);
          color: var(--color-text-secondary);
        }
        .map-label-main {
          font-weight: 600;
          font-size: 12px;
          color: var(--color-text);
        }
        .map-label::before {
          display: none;
        }
        .leaflet-control-attribution {
          font-size: 10px !important;
          background: rgba(255,255,255,0.7) !important;
        }
        [data-theme="dark"] .leaflet-control-attribution {
          background: rgba(0,0,0,0.5) !important;
          color: #999 !important;
        }
        [data-theme="dark"] .leaflet-control-attribution a {
          color: #999 !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 1px 4px rgba(0,0,0,.15) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          width: 28px !important;
          height: 28px !important;
          line-height: 28px !important;
          font-size: 14px !important;
          background: var(--color-surface) !important;
          color: var(--color-text-secondary) !important;
          border-bottom: 1px solid var(--color-border) !important;
        }
        .leaflet-control-zoom a:last-child {
          border-bottom: none !important;
        }
        .leaflet-control-zoom a:hover {
          background: var(--color-border) !important;
          color: var(--color-text) !important;
        }
      `}</style>
    </section>
  );
}
