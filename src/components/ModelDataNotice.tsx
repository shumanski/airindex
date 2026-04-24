'use client';

import { useTranslations } from 'next-intl';
import { AlertTriangleIcon } from './Icons';

/**
 * Prominent disclaimer banner shown near the top of home / city pages.
 * States that AQI values come from atmospheric models, not local stations.
 */
export default function ModelDataNotice() {
  const t = useTranslations('notice');
  return (
    <div
      role="note"
      className="flex items-start gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-[13px] leading-snug shadow-sm"
    >
      <span className="flex-shrink-0 mt-0.5 text-[var(--aqi-text-usg)]">
        <AlertTriangleIcon size={16} />
      </span>
      <p className="text-[var(--color-text-secondary)]">
        <span className="font-semibold text-[var(--color-text)]">{t('title')}</span>{' '}
        {t('body')}
      </p>
    </div>
  );
}
