'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { GeoResult } from '@/lib/geocode-api';
import type { StoredLocation } from '@/lib/storage';
import type { TempUnit } from '@/lib/storage';
import { MapPinIcon, SearchIcon, ChevronDownIcon } from './Icons';
import { getWeatherIcon } from '@/lib/weather-icons';
import Image from 'next/image';

interface Props {
  location: StoredLocation | null;
  onSelect: (loc: StoredLocation) => void;
  onDetectLocation?: () => void;
  tempUnit?: TempUnit;
  weather?: {
    weatherCode: number;
    temperature: number;
  };
}

export default function LocationSearch({ location, onSelect, onDetectLocation, tempUnit = 'C', weather }: Props) {
  const locale = useLocale();
  const t = useTranslations('location');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}&lang=${locale}`);
      if (!res.ok) { setResults([]); return; }
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [locale]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(r: GeoResult) {
    onSelect({ lat: r.latitude, lon: r.longitude, name: `${r.name}, ${r.country}`, geoId: r.id });
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setHighlightIdx(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightIdx >= 0 && results[highlightIdx]) {
      e.preventDefault();
      handleSelect(results[highlightIdx]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      setResults([]);
      setHighlightIdx(-1);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors text-left cursor-pointer"
        >
          <SearchIcon size={20} className="text-[var(--color-text-muted)] shrink-0" />
          <span className={`flex-1 text-base truncate ${location?.name ? 'font-medium text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>
            {location?.name || t('searchPlaceholder')}
          </span>
          {weather && (
            <span className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] shrink-0">
              <span className="flex items-center gap-0.5">
                <Image src={getWeatherIcon(weather.weatherCode).src} alt={getWeatherIcon(weather.weatherCode).alt} width={22} height={22} className="w-[22px] h-[22px]" />
                <span>{tempUnit === 'F' ? Math.round(weather.temperature * 9 / 5 + 32) : Math.round(weather.temperature)}°{tempUnit}</span>
              </span>
            </span>
          )}
          <ChevronDownIcon size={18} className="text-[var(--color-accent)] shrink-0" />
        </button>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-accent)]">
            <SearchIcon size={16} className="text-[var(--color-text-muted)] shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setHighlightIdx(-1); }}
              onKeyDown={handleKeyDown}
              placeholder={t('searchPlaceholder')}
              className="flex-1 bg-transparent text-base text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
            />
          </div>
          {isSearching && (
            <div className="text-xs text-[var(--color-text-muted)] px-1">{t('detectingLocation')}...</div>
          )}
          {results.length > 0 ? (
            <ul className="absolute top-full left-0 right-0 z-50 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto">
              {results.map((r, idx) => (
                <li key={r.id}>
                  <button
                    onClick={() => handleSelect(r)}
                    className={`w-full text-left px-3 py-2.5 text-base text-[var(--color-text)] transition-colors first:rounded-t-xl last:rounded-b-xl ${idx === highlightIdx ? 'bg-[var(--color-bg)]' : 'hover:bg-[var(--color-bg)]'}`}
                  >
                    <span className="font-medium">{r.name}</span>
                    {r.admin1 && <span className="text-[var(--color-text-muted)]">, {r.admin1}</span>}
                    <span className="text-[var(--color-text-muted)]">, {r.country}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length === 0 && onDetectLocation && (
            <ul className="absolute top-full left-0 right-0 z-50 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg mt-1">
              <li>
                <button
                  onClick={() => { onDetectLocation(); setIsOpen(false); }}
                  className="w-full text-left px-3 py-2.5 text-base text-[var(--color-accent)] hover:bg-[var(--color-bg)] rounded-xl flex items-center gap-2"
                >
                  <MapPinIcon size={16} className="shrink-0" />
                  {t('detectMyLocation')}
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
