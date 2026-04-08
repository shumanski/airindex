import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { buildCityPath } from './lib/city-url';

const intlMiddleware = createMiddleware({
  ...routing,
  alternateLinks: false,
});

const IP_GEO_URL = process.env.IP_GEO_URL || 'http://ip-geo:3849';
const GEO_SERVICE_URL = process.env.GEO_SERVICE_URL || 'http://geo-service:3850';
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

  const response = intlMiddleware(request);

  const isLocaleOnly = pathname === '/' || (
    pathname.replace(/\/$/, '').split('/').length === 2 &&
    validLocales.includes(pathname.replace(/\/$/, '').split('/')[1])
  );

  if (isLocaleOnly) {
    const redirectUrl = response.headers.get('location');
    const targetLocale = redirectUrl
      ? redirectUrl.replace(/\/$/, '').split('/').pop() || 'en'
      : pathname.replace(/\/$/, '').split('/')[1] || 'en';

    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();

    if (ip) {
      try {
        const geoRes = await fetch(
          `${IP_GEO_URL}/lookup?ip=${encodeURIComponent(ip)}`,
          { signal: AbortSignal.timeout(2000) },
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.detected && geoData.lat && geoData.lon && geoData.city) {
            const geoSvcRes = await fetch(
              `${GEO_SERVICE_URL}/search?q=${encodeURIComponent(geoData.city)}&lang=${targetLocale}&count=3`,
              { signal: AbortSignal.timeout(2000) },
            );
            if (geoSvcRes.ok) {
              const geoSvcData = await geoSvcRes.json();
              if (geoSvcData.results?.length > 0) {
                const results: Array<{ latitude: number; longitude: number; name: string; id: number }> = geoSvcData.results;
                let best = results[0];
                let bestDist = Math.abs(best.latitude - geoData.lat) + Math.abs(best.longitude - geoData.lon);
                for (const r of results) {
                  const d = Math.abs(r.latitude - geoData.lat) + Math.abs(r.longitude - geoData.lon);
                  if (d < bestDist) { best = r; bestDist = d; }
                }

                const citySegment = buildCityPath(best.name, best.id);
                const cityUrl = new URL(`/${targetLocale}/${citySegment}`, request.url);
                return NextResponse.redirect(cityUrl, 302);
              }
            }
          }
        }
      } catch {
        // Geo lookup failed — fall through
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/', '/((?!api|_next|favicon|apple-touch-icon|robots|sitemap|manifest\\.json|sw\\.js|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|webmanifest|txt)$).*)'],
};
