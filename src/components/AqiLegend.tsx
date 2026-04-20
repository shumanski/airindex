'use client';

import { useTranslations } from 'next-intl';

const LEVELS = [
  { key: 'good', color: '#00e400' },
  { key: 'moderate', color: '#e6b800' },
  { key: 'unhealthySensitive', color: '#ff7e00' },
  { key: 'unhealthy', color: '#ff0000' },
  { key: 'veryUnhealthy', color: '#8f3f97' },
  { key: 'hazardous', color: '#7e0023' },
] as const;

export default function AqiLegend() {
  const t = useTranslations('aqi');
  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-xs text-[var(--color-text-muted)]">
      {LEVELS.map(({ key, color }) => (
        <span key={key} className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
          {t(key)}
        </span>
      ))}
    </div>
  );
}
