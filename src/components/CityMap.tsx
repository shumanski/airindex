'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { getAqiColor } from '@/lib/aqi-utils';
import AqiLegend from './AqiLegend';
import type { NearbyCityResult } from '@/lib/geocode-api';

interface Props {
  lat: number;
  lon: number;
  cityName: string;
  currentAqi?: number;
  nearbyCities?: NearbyCityResult[];
}

const LOCALE_MAP: Record<string, string> = {
  en: 'en', sv: 'sv', no: 'no', da: 'da', de: 'de',
  nl: 'nl', it: 'it', es: 'es', fr: 'fr', pt: 'pt', pl: 'pl',
};

export default function CityMap({ lat, lon, cityName, currentAqi, nearbyCities }: Props) {
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: '300px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !containerRef.current) return;

    let cancelled = false;

    async function init() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      const { leafletLayer } = await import('protomaps-leaflet');

      if (cancelled || !containerRef.current) return;

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

      const mainColor = currentAqi != null ? (Math.round(currentAqi) === 0 ? '#9ca3af' : getAqiColor(Math.round(currentAqi))) : '#3b82f6';
      L.circleMarker([lat, lon], {
        radius: 7,
        fillColor: mainColor,
        fillOpacity: 1,
        color: '#fff',
        weight: 2.5,
      }).bindTooltip(currentAqi != null ? `${cityName} AQI ${Math.round(currentAqi)}` : cityName, {
        permanent: true,
        direction: 'top',
        offset: [0, -10],
        className: 'map-label map-label-main',
      }).addTo(map);

      const points: [number, number][] = [[lat, lon]];
      nearbyCities?.forEach((c) => {
        if (typeof (c as any).lat !== 'number' || typeof (c as any).lon !== 'number') return;
        points.push([(c as any).lat, (c as any).lon]);
        L.circleMarker([(c as any).lat, (c as any).lon], {
          radius: 4.5,
          fillColor: '#6b7280',
          fillOpacity: 0.8,
          color: '#fff',
          weight: 1.5,
        }).bindTooltip(c.name, {
          direction: 'top',
          offset: [0, -6],
          className: 'map-label',
        }).on('click', () => {
          window.location.href = `/${locale}/${c.slug}`;
        }).addTo(map);
      });

      if (points.length > 1) {
        map.fitBounds(points as L.LatLngBoundsExpression, {
          padding: [35, 35],
          maxZoom: 9,
        });
      }

      mapRef.current = map;
      observerRef.current = themeObserver;
    }

    init();

    return () => {
      cancelled = true;
      observerRef.current?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [inView, lat, lon, cityName, locale, nearbyCities]);

  return (
    <section>
      <div
        ref={containerRef}
        className="relative z-0 h-[220px] lg:h-[380px] rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)]"
      />
      <AqiLegend />
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
      `}</style>
    </section>
  );
}
