import { NextRequest, NextResponse } from 'next/server';
import { appendFile, mkdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { notifyTelegram, siteNameFromEnv } from '@/lib/telegram-feedback';

const FEEDBACK_FILE = process.env.FEEDBACK_FILE || join(process.cwd(), 'data', 'feedback.jsonl');
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB hard cap
const MAX_MESSAGE_LEN = 1000;
const MAX_BODY_BYTES = 8 * 1024;

// Strip C0/C1 control chars and Unicode bidi overrides that could be used
// to spoof rendered text. Cap to `max` chars (after trim).
function sanitizeText(s: string, max: number): string {
  // eslint-disable-next-line no-control-regex
  return s
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/[\u202A-\u202E\u2066-\u2069\uFEFF]/g, '')
    .trim()
    .slice(0, max);
}

export async function POST(req: NextRequest) {
  try {
    // Reject oversized bodies before parsing JSON.
    const contentLength = Number(req.headers.get('content-length') || '0');
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    if (!raw || typeof raw !== 'object') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
    const { rating, message, locale, page } = raw as Record<string, unknown>;

    const safeRating: 'up' | 'down' | null =
      rating === 'up' || rating === 'down' ? rating : null;

    const safeMessage =
      typeof message === 'string' ? sanitizeText(message, MAX_MESSAGE_LEN) : '';

    // Locale: strict allowlist of forms used by next-intl (e.g. "en", "pt-BR").
    const rawLocale = typeof locale === 'string' ? locale : '';
    const safeLocale = /^[a-z]{2}(-[A-Z]{2})?$/.test(rawLocale) ? rawLocale : '';

    // Page: must be an internal pathname (starts with "/", no whitespace,
    // no scheme). This blocks attackers from pasting external URLs that
    // would render as clickable links in admin notifications.
    const rawPage = typeof page === 'string' ? page : '';
    const safePage =
      /^\/[^\s]{0,199}$/.test(rawPage) && !/^\/\//.test(rawPage)
        ? sanitizeText(rawPage, 200)
        : '';

    if (!safeRating && !safeMessage) {
      return NextResponse.json({ error: 'Empty feedback' }, { status: 400 });
    }

    // Guard against disk exhaustion.
    try {
      const info = await stat(FEEDBACK_FILE);
      if (info.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'Feedback unavailable' }, { status: 503 });
      }
    } catch { /* file doesn't exist yet — ok */ }

    const entry = {
      ts: new Date().toISOString(),
      rating: safeRating,
      message: safeMessage,
      locale: safeLocale,
      page: safePage,
    };

    await mkdir(dirname(FEEDBACK_FILE), { recursive: true });
    await appendFile(FEEDBACK_FILE, JSON.stringify(entry) + '\n', 'utf-8');

    // Fire-and-forget Telegram notification — never awaited, never throws.
    notifyTelegram({
      rating: safeRating,
      message: safeMessage,
      locale: safeLocale,
      page: safePage,
      siteName: siteNameFromEnv(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[feedback] Failed to write:', err);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
