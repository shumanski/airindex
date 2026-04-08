'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { CheckIcon } from './Icons';
import type { Theme } from '@/lib/storage';

interface Props {
  currentLocale: string;
  theme: Theme;
  onLocaleChange: (locale: string) => void;
  onThemeChange: () => void;
  localizedPaths?: Record<string, string>;
}

export default function SettingsMenu({
  currentLocale, theme,
  onLocaleChange, onThemeChange,
  localizedPaths,
}: Props) {
  const t = useTranslations('language');
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function switchLocale(locale: Locale) {
    if (localizedPaths?.[locale]) {
      onLocaleChange(locale);
      setIsOpen(false);
      router.push(localizedPaths[locale]);
      return;
    }
    const segs = pathname.split('/');
    if (segs.length >= 2 && routing.locales.includes(segs[1] as Locale)) {
      segs[1] = locale;
    }
    const newPath = segs.join('/') || `/${locale}`;
    onLocaleChange(locale);
    setIsOpen(false);
    router.push(newPath);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 h-9 px-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors"
        aria-label="Settings"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="text-xs font-semibold uppercase">{currentLocale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-[var(--color-surface)] rounded-xl shadow-lg border border-[var(--color-border)] py-2 z-50">
          <div className="flex items-center justify-center gap-1 px-3 py-2 border-b border-[var(--color-border)]">
            <button
              onClick={() => theme !== 'light' && onThemeChange()}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
              }`}
              aria-label="Light mode"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            </button>
            <button
              onClick={() => theme !== 'dark' && onThemeChange()}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
              }`}
              aria-label="Dark mode"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </button>
          </div>

          <div className="pt-1">
            {[...routing.locales].sort((a, b) => t(a).localeCompare(t(b))).map((locale) => (
              <button
                key={locale}
                onClick={() => switchLocale(locale)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                  locale === currentLocale
                    ? 'text-[var(--color-primary)] font-medium bg-[var(--color-surface-active)]'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                }`}
              >
                <span>{t(locale)}</span>
                {locale === currentLocale && (
                  <CheckIcon size={14} className="text-[var(--color-primary)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
