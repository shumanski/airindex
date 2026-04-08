import { NextRequest, NextResponse } from 'next/server';
import { searchLocations } from '@/lib/geocode-api';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');
  const lang = request.nextUrl.searchParams.get('lang') || 'en';

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const sanitized = query.slice(0, 100).replace(/[^\p{L}\p{N}\s\-,.']/gu, '');

  if (!sanitized.trim()) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchLocations(sanitized, lang);
    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    });
  } catch (error) {
    console.error('Geocode API error:', error);
    return NextResponse.json([], { status: 502 });
  }
}
