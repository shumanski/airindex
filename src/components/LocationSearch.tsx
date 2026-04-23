'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { GeoResult } from '@/lib/geocode-api';
import type { StoredLocation } from '@/lib/storage';
import { MapPinIcon, SearchIcon } from './Icons';

interface Props {
  onSelect: (loc: StoredLocation) => void;
  onDetectLocation?: () => void;
}

export default function LocationSearch({ onSelect, onDetectLocation }: Props) {
  const locale = useLocale();
  const t = useTranslations('location');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
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
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(r: GeoResult) {
    onSelect({ lat: r.latitude, lon: r.longitude, name: `${r.name}, ${r.country}`, geoId: r.id });
    setIsFocused(false);
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
      setIsFocused(false);
      setQuery('');
      setResults([]);
      setHighlightIdx(-1);
    }
  }

  const showDropdown = isFocused && (results.length > 0 || (query.length === 0 && !!onDetectLocation) || isSearching);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="a-th-search-box">
        <SearchIcon size={18} className="a-th-search-icon shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setHighlightIdx(-1); }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('searchPlaceholder')}
          autoComplete="off"
          spellCheck={false}
          className="a-th-search-input"
        />
      </div>
      {showDropdown && (
        <ul className="absolute top-full left-0 right-0 z-50 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg mt-1 max-h-72 overflow-y-auto">
          {results.length > 0 ? (
            results.map((r, idx) => (
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
            ))
          ) : isSearching ? (
            <li className="px-3 py-2.5 text-sm text-[var(--color-text-muted)]">{t('detectingLocation')}…</li>
          ) : onDetectLocation ? (
            <li>
              <button
                onClick={() => { onDetectLocation(); setIsFocused(false); }}
                className="w-full text-left px-3 py-2.5 text-base text-[var(--color-accent)] hover:bg-[var(--color-bg)] rounded-xl flex items-center gap-2"
              >
                <MapPinIcon size={16} className="shrink-0" />
                {t('detectMyLocation')}
              </button>
            </li>
          ) : null}
        </ul>
      )}
    </div>
  );
}
