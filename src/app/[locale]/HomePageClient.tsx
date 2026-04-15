'use client';

import { useTranslations } from 'next-intl';
import LocationSearch from '@/components/LocationSearch';
import SettingsMenu from '@/components/SettingsMenu';
import Link from 'next/link';
import Logo from '@/components/Logo';
import AqiPageContent from '@/components/AqiPageContent';
import { type StoredLocation } from '@/lib/storage';
import { useAqiPage } from '@/lib/useAqiPage';
import { getAqiCategory, getAqiTextColor } from '@/lib/aqi-utils';
import type { AqiData } from '@/lib/aqi-api';

const DEFAULT_LOCATION: StoredLocation = {
  lat: 48.86, lon: 2.35, name: 'Paris, France', geoId: 2988507,
};

interface Props {
  initialAqiData: AqiData | null;
}

export default function HomePageClient({ initialAqiData }: Props) {
  const t = useTranslations();
  const {
    locale, location, aqiData, loading, tempUnit, theme,
    handleLocationChange,
    handleLocaleChange, handleTempUnitChange, handleThemeChange,
  } = useAqiPage({ initialLocation: DEFAULT_LOCATION, initialAqiData });

  return (
    <main className="max-w-xl lg:max-w-5xl mx-auto px-4 pb-8 pt-4 space-y-4 relative z-10">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
          <Link href="/" aria-label="Air Index Today home" className="flex items-center"><span className="relative z-[-1]"><Logo size={34} /></span></Link>
          <span>{t('meta.h1')}</span>
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={handleTempUnitChange}
            className="text-sm font-medium px-2 py-1 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors"
          >°{tempUnit}</button>
          <SettingsMenu
            currentLocale={locale}
            theme={theme}
            onLocaleChange={handleLocaleChange}
            onThemeChange={handleThemeChange}
          />
        </div>
      </header>

      {aqiData && (() => {
        const cityName = (location || DEFAULT_LOCATION).name.split(',')[0].trim();
        const country = (location || DEFAULT_LOCATION).name.split(',').slice(1).join(',').trim();
        const aqiRounded = Math.round(aqiData.currentAqi);
        const peakAqi = Math.round(aqiData.todayPeak.aqi);
        const tomorrowAqi = Math.round(aqiData.tomorrowPeak.aqi);
        return (
          <div className="text-sm leading-relaxed -mt-2 space-y-0.5">
            <p className="text-[var(--color-text-muted)]">
              {t('city.summaryDesc', { city: cityName, country })}
            </p>
            <p className="text-[var(--color-text-secondary)]">
              {aqiData.currentAqi > 0 && (
                <>
                  {t('city.summaryNow')}{' '}
                  <span className="font-medium" style={{ color: getAqiTextColor(aqiRounded) }}>
                    AQI {aqiRounded} ({t(`aqi.${getAqiCategory(aqiRounded)}`)})
                  </span>
                  {' · '}
                </>
              )}
              {t('city.summaryPeak')}{' '}
              <span className="font-medium" style={{ color: getAqiTextColor(peakAqi) }}>
                AQI {peakAqi}
              </span>
              {' '}{t('aqi.at')} {aqiData.todayPeak.hour}
            </p>
            <p className="text-[var(--color-text-secondary)]">
              {t('aqi.tomorrow')}{': '}
              <span className="font-medium" style={{ color: getAqiTextColor(tomorrowAqi) }}>
                AQI {tomorrowAqi}
              </span>
              {' '}{t('aqi.at')} {aqiData.tomorrowPeak.hour}
            </p>
          </div>
        );
      })()}

      <LocationSearch location={DEFAULT_LOCATION} onSelect={handleLocationChange} tempUnit={tempUnit} weather={aqiData ? { weatherCode: aqiData.currentWeatherCode, temperature: aqiData.currentTemp } : undefined} />

      <AqiPageContent
        aqiData={aqiData}
        loading={loading}
        tempUnit={tempUnit}
        cityName={(location || DEFAULT_LOCATION).name.split(',')[0].trim()}
        geoId={(location || DEFAULT_LOCATION).geoId}
      />
    </main>
  );
}
