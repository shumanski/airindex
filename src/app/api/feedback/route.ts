import { NextRequest, NextResponse } from 'next/server';
import { appendFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';

const FEEDBACK_FILE = process.env.FEEDBACK_FILE || join(process.cwd(), 'data', 'feedback.jsonl');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rating, message, locale, page } = body;

    if (!rating && !message) {
      return NextResponse.json({ error: 'Empty feedback' }, { status: 400 });
    }

    if (typeof message === 'string' && message.length > 2000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 });
    }

    const entry = {
      ts: new Date().toISOString(),
      rating: rating === 'up' || rating === 'down' ? rating : null,
      message: typeof message === 'string' ? message.slice(0, 2000) : '',
      locale: typeof locale === 'string' ? locale.slice(0, 10) : '',
      page: typeof page === 'string' ? page.slice(0, 200) : '',
    };

    await mkdir(dirname(FEEDBACK_FILE), { recursive: true });
    await appendFile(FEEDBACK_FILE, JSON.stringify(entry) + '\n', 'utf-8');

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[feedback] Failed to write:', err);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
