'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { loadPreferences, savePreferences, type StoredLocation, type TempUnit, type Theme } from './storage';
import { buildCityPath } from './city-url';
import type { AqiData } from './aqi-api';

interface UseAqiPageOptions {
  initialLocation: StoredLocation | null;
  initialAqiData?: AqiData | null;
}

export function useAqiPage({ initialLocation, initialAqiData }: UseAqiPageOptions) {
  const locale = useLocale();
  const router = useRouter();
  const [location, setLocation] = useState<StoredLocation | null>(initialLocation);
  const [aqiData, setAqiData] = useState<AqiData | null>(initialAqiData ?? null);
  const loading = false;
  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const prefs = loadPreferences();
    if (prefs.tempUnit) setTempUnit(prefs.tempUnit);
    if (prefs.theme) {
      setTheme(prefs.theme);
      document.documentElement.setAttribute('data-theme', prefs.theme);
    }
  }, []);

  const prevInitial = useRef(initialAqiData);
  const prevInitialLocation = useRef(initialLocation);
  useEffect(() => {
    if (initialAqiData && initialAqiData !== prevInitial.current) {
      setAqiData(initialAqiData);
    }
    prevInitial.current = initialAqiData;
  }, [initialAqiData]);

  useEffect(() => {
    if (initialLocation && initialLocation !== prevInitialLocation.current) {
      setLocation(initialLocation);
    }
    prevInitialLocation.current = initialLocation;
  }, [initialLocation]);

  function handleLocationChange(loc: StoredLocation) {
    if (loc.geoId) {
      const cityPath = buildCityPath(loc.name.split(',')[0].trim(), loc.geoId);
      router.push(`/${locale}/${cityPath}`);
      return;
    }
    setLocation(loc);
  }

  function handleLocaleChange(newLocale: string) {
    savePreferences({ locale: newLocale });
  }

  function handleTempUnitChange() {
    const next = tempUnit === 'C' ? 'F' : 'C';
    setTempUnit(next);
    savePreferences({ tempUnit: next });
  }

  function handleThemeChange() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    savePreferences({ theme: next });
  }

  return {
    locale,
    router,
    location,
    setLocation,
    aqiData,
    loading,
    tempUnit,
    theme,
    handleLocationChange,
    handleLocaleChange,
    handleTempUnitChange,
    handleThemeChange,
  };
}
