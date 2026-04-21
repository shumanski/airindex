import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware({
  ...routing,
  alternateLinks: false, // We set hreflang in page metadata; middleware x-default links lack locale prefix
});

const validLocales: readonly string[] = routing.locales;

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block dotfile access (e.g. /.env, /.git)
  if (pathname.startsWith('/.')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Serve root as English homepage (no redirect — URL stays as /)
  if (pathname === '/') {
    return NextResponse.rewrite(new URL('/en', request.url));
  }

  // Redirect bare /en to / for canonical consolidation
  const norm = pathname.replace(/\/$/, '');
  if (norm === '/en') {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }

  // Redirect bare /privacy and /about (no locale prefix) → /en/...
  if (pathname === '/privacy' || pathname === '/about') {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url), 301);
  }

  // For non-root paths, validate the first segment is a known locale
  const firstSegment = pathname.split('/')[1];
  if (firstSegment && !validLocales.includes(firstSegment)) {
    // Redirect langless city URLs to /en/…
    if (/^air-quality-index-.+-\d+$/.test(firstSegment) && pathname.split('/').length === 2) {
      return NextResponse.redirect(
        new URL(`/en/${firstSegment}`, request.url),
        301,
      );
    }
    return NextResponse.rewrite(new URL('/en/_', request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/((?!api|_next|favicon|apple-touch-icon|robots|sitemap|manifest\\.json|sw\\.js|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|webmanifest|txt)$).*)'],
};
