'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import SettingsMenu from '@/components/SettingsMenu';
import Logo from '@/components/Logo';
import LocationSearch from '@/components/LocationSearch';
import { buildCityPath } from '@/lib/city-url';
import type { StoredLocation, TempUnit, Theme } from '@/lib/storage';

interface Props {
  tempUnit: TempUnit;
  theme: Theme;
  onTempUnitChange: () => void;
  onLocaleChange: (loc: string) => void;
  onThemeChange: () => void;
  localizedPaths: Record<string, string>;
  /** Optional: override default navigate-on-select behavior. */
  onSelect?: (loc: StoredLocation) => void;
  onDetectLocation?: () => void;
}

export default function TopHeader({
  tempUnit,
  theme,
  onTempUnitChange,
  onLocaleChange,
  onThemeChange,
  localizedPaths,
  onSelect,
  onDetectLocation,
}: Props) {
  const locale = useLocale();
  const router = useRouter();

  const handleSelect = useCallback((loc: StoredLocation) => {
    if (onSelect) { onSelect(loc); return; }
    if (loc.geoId) {
      const cityPath = buildCityPath(loc.name.split(',')[0].trim(), loc.geoId);
      router.push(`/${locale}/${cityPath}`);
    }
  }, [locale, router, onSelect]);

  return (
    <header className="a-top-header">
      <Link href={`/${locale}`} aria-label="Air Index Today home" className="a-th-brand">
        <Logo size={36} />
        <span><span className="brand">airindex</span><span className="dot">·</span><span className="today">today</span></span>
      </Link>
      <div className="a-th-search">
        <LocationSearch
          onSelect={handleSelect}
          onDetectLocation={onDetectLocation}
        />
      </div>
      <div className="a-th-tools">
        <button
          onClick={onTempUnitChange}
          className="a-th-accent"
          aria-label={`Switch to °${tempUnit === 'C' ? 'F' : 'C'}`}
        >°{tempUnit}</button>
        <SettingsMenu
          currentLocale={locale}
          theme={theme}
          onLocaleChange={onLocaleChange}
          onThemeChange={onThemeChange}
          localizedPaths={localizedPaths}
        />
      </div>
    </header>
  );
}
