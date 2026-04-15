'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function FeedbackWidget() {
  const t = useTranslations('feedback');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState(false);
  const [toastFading, setToastFading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const fadeTimer = setTimeout(() => setToastFading(true), 2400);
    const hideTimer = setTimeout(() => { setToast(false); setToastFading(false); }, 3000);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, [toast]);

  async function handleSubmit() {
    if (!rating && !message.trim()) return;
    setSending(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, message: message.trim(), locale, page: pathname }),
      });
      setOpen(false);
      setRating(null);
      setMessage('');
      setToast(true);
      setToastFading(false);
    } catch {
      // Silently fail
    } finally {
      setSending(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => { setRating(null); setMessage(''); }, 300);
  }

  return (
    <>
      {toast && (
        <div className={`fixed bottom-16 right-4 z-50 px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg transition-opacity duration-600 ${toastFading ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-sm text-[var(--color-text)]">{t('thanks')}</p>
        </div>
      )}

      <button
        onClick={() => setOpen(true)}
        aria-label={t('title')}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-muted)]">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleClose}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm shadow-xl m-0 sm:m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-20 bg-gradient-to-br from-[#0e57a0] via-[#1565C0] to-[#1976D2] overflow-hidden">
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 80" preserveAspectRatio="xMidYMid slice">
                <circle cx="60" cy="38" r="20" fill="none" stroke="#FFF" strokeWidth="1" />
                <circle cx="60" cy="38" r="30" fill="none" stroke="#FFF" strokeWidth="0.5" />
                <circle cx="160" cy="33" r="15" fill="none" stroke="#FFF" strokeWidth="1" />
                <circle cx="160" cy="33" r="25" fill="none" stroke="#FFF" strokeWidth="0.5" />
                <circle cx="280" cy="43" r="18" fill="none" stroke="#FFF" strokeWidth="1" />
                <circle cx="280" cy="43" r="28" fill="none" stroke="#FFF" strokeWidth="0.5" />
                <path d="M30,50 Q50,40 70,50 Q90,60 110,50" fill="none" stroke="#FFF" strokeWidth="0.8" opacity="0.3" />
                <path d="M200,30 Q220,20 240,30 Q260,40 280,30" fill="none" stroke="#FFF" strokeWidth="0.8" opacity="0.3" />
              </svg>
              <div className="absolute inset-0 flex items-center px-5">
                <h2 className="text-lg font-semibold text-white">{t('title')}</h2>
              </div>
              <button onClick={handleClose} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm text-[var(--color-text-muted)] mb-4">{t('description')}</p>

              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setRating(rating === 'up' ? null : 'up')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                    rating === 'up'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-emerald-400'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                  {t('good')}
                </button>
                <button
                  onClick={() => setRating(rating === 'down' ? null : 'down')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                    rating === 'down'
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-red-400'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                  </svg>
                  {t('bad')}
                </button>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('placeholder')}
                maxLength={2000}
                rows={3}
                className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] resize-none focus:outline-none focus:border-[var(--color-accent)]"
              />

              <button
                onClick={handleSubmit}
                disabled={sending || (!rating && !message.trim())}
                className="mt-3 w-full py-2.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                {t('submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
