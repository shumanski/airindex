'use client';

import { getAqiCategory, getAqiColor, getAqiTextColor } from '@/lib/aqi-utils';
import { useTranslations } from 'next-intl';
import type { TempUnit } from '@/lib/storage';

export function displayTemp(c: number, unit: TempUnit): number {
  return unit === 'F' ? Math.round(c * 9 / 5 + 32) : Math.round(c);
}

interface Props {
  aqi: number;
  label: string;
  peakTime?: string;
  isPeak?: boolean;
}

// Standard AirNow AQI colors (https://www.airnow.gov/aqi/aqi-basics/)
const AQI_LEVELS = [
  { label: 'Good', max: 50, color: '#00e400' },
  { label: 'Moderate', max: 100, color: '#ffff00' },
  { label: 'USG', max: 150, color: '#ff7e00' },
  { label: 'Unhealthy', max: 200, color: '#ff0000' },
  { label: 'V. Unhealthy', max: 300, color: '#8f3f97' },
  { label: 'Hazardous', max: 500, color: '#7e0023' },
];

function AqiScale({ value, levels, categoryText, textColor }: {
  value: number;
  levels: typeof AQI_LEVELS;
  categoryText: string;
  textColor: string;
}) {
  const activeIdx = levels.findIndex(l => value <= l.max);
  const idx = activeIdx >= 0 ? activeIdx : levels.length - 1;
  const activeLevel = levels[idx];
  const prevMax = idx > 0 ? levels[idx - 1].max : 0;
  const rangeWidth = activeLevel.max - prevMax;
  const segWidth = 100 / levels.length;
  const segProgress = rangeWidth > 0 ? Math.min((value - prevMax) / rangeWidth, 1) : 1;
  const indicatorPos = idx * segWidth + segProgress * segWidth;

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold" style={{ color: activeLevel.color }}>{Math.round(value)}</span>
        <span className="text-sm font-semibold" style={{ color: textColor }}>{categoryText}</span>
      </div>
      <div className="relative">
        <div className="flex h-3 rounded-full overflow-hidden gap-[2px]">
          {levels.map((level, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                backgroundColor: level.color,
                opacity: i <= idx ? 1 : 0.2,
              }}
            />
          ))}
        </div>
        <div
          className="absolute -bottom-1 transition-all duration-500"
          style={{ left: `${Math.min(indicatorPos, 98)}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent"
            style={{ borderBottomColor: activeLevel.color }} />
        </div>
      </div>
      <div className="flex text-[10px] mt-1.5 text-[var(--color-text-muted)]">
        {levels.map((_, i) => (
          <div key={i} className="flex-1 text-center">{i === 0 ? '0' : levels[i - 1].max}</div>
        ))}
      </div>
    </div>
  );
}

export default function AqiDisplay({ aqi, label, peakTime, isPeak = true }: Props) {
  const t = useTranslations('aqi');

  const rounded = Math.round(aqi);
  const textColor = getAqiTextColor(rounded);
  const category = getAqiCategory(rounded);

  return (
    <div className="flex flex-col gap-2 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          {label}
        </span>
        {peakTime && (
          <span className="text-sm text-[var(--color-text-muted)]">
            {isPeak ? t('peakAt', { time: peakTime }) : `${t('at')} ${peakTime}`}
          </span>
        )}
      </div>
      <AqiScale
        value={rounded}
        levels={AQI_LEVELS}
        categoryText={t(category)}
        textColor={textColor}
      />
    </div>
  );
}
