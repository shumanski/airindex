'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { buildCityPath } from '@/lib/city-url';
import { getAqiColor } from '@/lib/aqi-utils';
import AqiLegend from './AqiLegend';

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
}

const LOCALE_MAP: Record<string, string> = {
  en: 'en', sv: 'sv', no: 'no', da: 'da', de: 'de',
  nl: 'nl', it: 'it', es: 'es', fr: 'fr', pt: 'pt', pl: 'pl',
};

export default function HomeMap({ cities, aqiLevels, center, zoom, fitCities }: Props) {
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
        center: center || [20, 0],
        zoom: zoom || 2,
        maxZoom: 9,
        minZoom: 2,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
        worldCopyJump: true,
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

      cities.forEach((c) => {
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
        }).addTo(map);
      });

      if (fitCities && cities.length > 1) {
        const bounds = L.latLngBounds(cities.map(c => [c.lat, c.lon] as [number, number]));
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 });
      } else if (fitCities && cities.length === 1) {
        map.setView([cities[0].lat, cities[0].lon], 6);
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
  }, [inView, locale, cities]);

  return (
    <div>
      <div
        ref={containerRef}
        className="relative z-0 h-[260px] sm:h-[320px] lg:h-[420px] rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)]"
      />
      <AqiLegend />
    </div>
  );
}
