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

interface Props {
  overlay?: {
    enabled: boolean;
    onToggle: (next: boolean) => void;
  };
}

export default function AqiLegend({ overlay }: Props = {}) {
  const t = useTranslations('aqi');
  const tMap = useTranslations('map');
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-xs text-[var(--color-text-muted)]">
      {LEVELS.map(({ key, color }) => (
        <span key={key} className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
          {t(key)}
        </span>
      ))}
      {overlay && (
        <button
          type="button"
          onClick={() => overlay.onToggle(!overlay.enabled)}
          aria-pressed={overlay.enabled}
          title={tMap('overlayHelp')}
          className={`ml-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium transition-colors ${
            overlay.enabled
              ? 'bg-[var(--color-accent)] text-white border-transparent'
              : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${overlay.enabled ? 'bg-white' : 'bg-[var(--color-text-muted)]'}`} />
          {tMap('overlay')}
        </button>
      )}
    </div>
  );
}
