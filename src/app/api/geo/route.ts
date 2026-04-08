import { NextRequest, NextResponse } from 'next/server';

const IP_GEO_URL = process.env.IP_GEO_URL || 'http://ip-geo:3849';

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();

  if (!ip) {
    return NextResponse.json({ detected: false }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  try {
    const res = await fetch(
      `${IP_GEO_URL}/lookup?ip=${encodeURIComponent(ip)}`,
      { signal: AbortSignal.timeout(3000) },
    );

    if (!res.ok) {
      return NextResponse.json({ detected: false }, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const data = await res.json();

    if (!data.detected || !data.lat || !data.lon) {
      return NextResponse.json({ detected: false }, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    return NextResponse.json({
      detected: true,
      lat: data.lat,
      lon: data.lon,
      city: data.city || null,
      country: data.country || null,
    }, {
      headers: { 'Cache-Control': 'private, max-age=300' },
    });
  } catch {
    return NextResponse.json({ detected: false }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
