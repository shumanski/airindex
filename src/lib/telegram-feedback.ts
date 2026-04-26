// Fire-and-forget Telegram notification for feedback submissions.
// Never throws, never blocks the response. If env vars are unset, it's a no-op.
//
// Required env:
//   TELEGRAM_BOT_TOKEN  e.g. 1234567890:ABCDEF...
//   TELEGRAM_CHAT_ID    numeric chat id (negative for groups)

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Hard cap on outbound text — Telegram's own limit is 4096.
const TG_MAX_TEXT = 3500;
const TG_TIMEOUT_MS = 5000;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Strip C0/C1 control chars (except \t, \n, \r) and Unicode bidi/format
// override characters that could be used to spoof text in chat clients.
function sanitize(s: string, max: number): string {
  // eslint-disable-next-line no-control-regex
  const cleaned = s
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/[\u202A-\u202E\u2066-\u2069\uFEFF]/g, '');
  return cleaned.slice(0, max);
}

export interface FeedbackPayload {
  rating: 'up' | 'down' | null;
  message: string;
  locale: string;
  page: string;
  siteName: string;
}

export function notifyTelegram(p: FeedbackPayload): void {
  if (!BOT_TOKEN || !CHAT_ID) return;

  const ratingEmoji = p.rating === 'up' ? '👍' : p.rating === 'down' ? '👎' : '💬';
  const lines: string[] = [];
  lines.push(`${ratingEmoji} <b>${escapeHtml(sanitize(p.siteName, 64))}</b> feedback`);
  if (p.rating) lines.push(`Rating: ${p.rating}`);
  if (p.locale) lines.push(`Locale: ${escapeHtml(sanitize(p.locale, 16))}`);
  if (p.page) lines.push(`Page: <code>${escapeHtml(sanitize(p.page, 200))}</code>`);
  if (p.message) {
    lines.push('');
    lines.push(escapeHtml(sanitize(p.message, 1000)));
  }
  const text = lines.join('\n').slice(0, TG_MAX_TEXT);

  // Fire and forget; never affect the request handler.
  void (async () => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TG_TIMEOUT_MS);
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
        signal: ctrl.signal,
      });
    } catch {
      // swallow — telegram failures must never surface to users
    } finally {
      clearTimeout(timer);
    }
  })();
}

export function siteNameFromEnv(): string {
  try {
    const u = new URL(process.env.SITE_URL || 'http://localhost');
    return u.hostname.replace(/^www\./, '') || 'site';
  } catch {
    return 'site';
  }
}
