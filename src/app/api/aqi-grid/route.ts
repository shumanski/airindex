import { NextRequest, NextResponse } from 'next/server';
import { buildAqiGrid, encodeGrid, normaliseRequest } from '@/lib/aqi-grid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const u = req.nextUrl;
  const minLat = parseFloat(u.searchParams.get('minLat') || '');
  const maxLat = parseFloat(u.searchParams.get('maxLat') || '');
  const minLon = parseFloat(u.searchParams.get('minLon') || '');
  const maxLon = parseFloat(u.searchParams.get('maxLon') || '');
  const spacing = parseFloat(u.searchParams.get('spacing') || '');

  if (![minLat, maxLat, minLon, maxLon, spacing].every(Number.isFinite)) {
    return NextResponse.json({ error: 'invalid params' }, { status: 400 });
  }
  if (maxLat <= minLat || maxLon <= minLon) {
    return NextResponse.json({ error: 'bbox inverted' }, { status: 400 });
  }

  const request = normaliseRequest({ minLat, maxLat, minLon, maxLon, spacing });

  try {
    const grid = await buildAqiGrid(request);
    const buf = encodeGrid(grid);
    return new NextResponse(buf as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': String(buf.byteLength),
        'Cache-Control': 'public, max-age=600, s-maxage=3600, stale-while-revalidate=1800',
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'grid failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
