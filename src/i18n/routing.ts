import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'sv', 'no', 'da', 'de', 'nl', 'it', 'es', 'fr', 'pt', 'pl'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];
