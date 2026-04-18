import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware({
  ...routing,
  alternateLinks: false,
});

const validLocales: readonly string[] = routing.locales;

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/.')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (pathname !== '/') {
    const firstSegment = pathname.split('/')[1];
    if (firstSegment && !validLocales.includes(firstSegment)) {
      if (/^air-quality-index-.+-\d+$/.test(firstSegment) && pathname.split('/').length === 2) {
        return NextResponse.redirect(
          new URL(`/en/${firstSegment}`, request.url),
          301,
        );
      }
      return NextResponse.rewrite(new URL('/en/_', request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/((?!api|_next|favicon|apple-touch-icon|robots|sitemap|manifest\\.json|sw\\.js|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|webmanifest|txt)$).*)'],
};
