'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { buildCityPath } from '@/lib/city-url';
import { getAqiColor } from '@/lib/aqi-utils';
import AqiLegend from './AqiLegend';
import { createAqiGridLayer, type AqiGridLayerHandle } from './AqiGridLayer';

interface City {
  name: string;
  geoId: number;
  lat: number;
  lon: number;
}

interface Props {
  cities: City[];
  aqiLevels?: Record<string, number>;
  center?: [number, number];
  zoom?: number;
  fitCities?: boolean;
  /** Bbox [minLat, minLon, maxLat, maxLon] for the AQI color overlay. If omitted, no overlay. */
  overlayBbox?: [number, number, number, number];
  /** Grid spacing in degrees (default 2 for global). */
  overlaySpacing?: number;
  /** localStorage key used to remember the per-map toggle state. */
  overlayStorageKey?: string;
}

const LOCALE_MAP: Record<string, string> = {
  en: 'en', sv: 'sv', no: 'no', da: 'da', de: 'de',
  nl: 'nl', it: 'it', es: 'es', fr: 'fr', pt: 'pt', pl: 'pl',
};

export default function HomeMap({ cities, aqiLevels, center, zoom, fitCities, overlayBbox, overlaySpacing, overlayStorageKey }: Props) {
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const markersRef = useRef<any>(null); // L.LayerGroup
  const leafletRef = useRef<any>(null); // L module
  const overlayRef = useRef<AqiGridLayerHandle | null>(null);
  const [inView, setInView] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Toggle state — default ON, persisted per map via storage key.
  const [overlayOn, setOverlayOn] = useState<boolean>(true);
  useEffect(() => {
    if (!overlayBbox || !overlayStorageKey || typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(overlayStorageKey);
    if (stored === '0') setOverlayOn(false);
    else if (stored === '1') setOverlayOn(true);
  }, [overlayBbox, overlayStorageKey]);
  const handleOverlayToggle = (next: boolean) => {
    setOverlayOn(next);
    if (overlayStorageKey && typeof window !== 'undefined') {
      window.localStorage.setItem(overlayStorageKey, next ? '1' : '0');
    }
  };

  // Stabilise cities reference — include name so locale/localized-name updates propagate
  const citiesKey = useMemo(() => cities.map(c => `${c.geoId}:${c.name}`).join('|'), [cities]);
  const stableCities = useMemo(() => cities, [citiesKey]);

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

  // Initialize map (base tiles only)
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
        center: center || [20, 0],
        zoom: zoom || 2,
        maxZoom: 9,
        minZoom: 2,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
        worldCopyJump: true,
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

      // Create marker layer group
      markersRef.current = L.layerGroup().addTo(map);

      if (fitCities && stableCities.length > 1) {
        const bounds = L.latLngBounds(stableCities.map(c => [c.lat, c.lon] as [number, number]));
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 });
      } else if (fitCities && stableCities.length === 1) {
        map.setView([stableCities[0].lat, stableCities[0].lon], 6);
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
      // Near viewport but no requestIdleCallback: defer with small RAF delay
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
      markersRef.current = null;
      leafletRef.current = null;
      setMapReady(false);
    };
  }, [inView, locale, stableCities]);

  // Update markers when aqiLevels changes
  useEffect(() => {
    const L = leafletRef.current;
    const markerGroup = markersRef.current;
    if (!L || !markerGroup) return;

    markerGroup.clearLayers();
    stableCities.forEach((c) => {
      const aqiKey = `${c.lat},${c.lon}`;
      const aqi = aqiLevels?.[aqiKey];
      const color = aqi != null ? (aqi === 0 ? '#9ca3af' : getAqiColor(aqi)) : '#3b82f6';
      const label = aqi != null ? `${c.name} AQI ${aqi}` : c.name;
      L.circleMarker([c.lat, c.lon], {
        radius: 5,
        fillColor: color,
        fillOpacity: 0.9,
        color: '#fff',
        weight: 2,
      }).bindTooltip(label, {
        direction: 'top',
        offset: [0, -6],
        className: 'map-label',
      }).on('click', () => {
        window.location.href = `/${locale}/${buildCityPath(c.name, c.geoId)}`;
      }).addTo(markerGroup);
    });
  }, [aqiLevels, stableCities, locale, mapReady]);

  // Mount / unmount the AQI grid overlay whenever toggle or map readiness changes.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map || !overlayBbox) return;
    if (!overlayOn) {
      overlayRef.current?.remove();
      overlayRef.current = null;
      return;
    }
    const [minLat, minLon, maxLat, maxLon] = overlayBbox;
    const layer = createAqiGridLayer(L, {
      minLat,
      maxLat,
      minLon,
      maxLon,
      spacing: overlaySpacing ?? 2,
    });
    layer.addTo(map);
    overlayRef.current = layer;
    return () => {
      layer.remove();
      if (overlayRef.current === layer) overlayRef.current = null;
    };
  }, [mapReady, overlayOn, overlayBbox, overlaySpacing]);

  return (
    <div>
      <div
        ref={containerRef}
        className="relative z-0 h-[260px] sm:h-[320px] lg:h-[420px] rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)]"
      />
      <AqiLegend overlay={overlayBbox ? { enabled: overlayOn, onToggle: handleOverlayToggle } : undefined} />
      <style jsx global>{`
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
    </div>
  );
}
