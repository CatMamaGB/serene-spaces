/** Same policy as intake: 8 requests / 15 min per IP, separate bucket. */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 8;

type Window = { resetAt: number; count: number };

const windows = new Map<string, Window>();

function pruneIfLarge(now: number) {
  if (windows.size < 5000) return;
  for (const [ip, w] of windows) {
    if (now > w.resetAt) windows.delete(ip);
  }
}

export function checkContactRateLimit(ip: string): { ok: boolean } {
  const now = Date.now();
  pruneIfLarge(now);

  const w = windows.get(ip);
  if (!w || now > w.resetAt) {
    windows.set(ip, { resetAt: now + WINDOW_MS, count: 1 });
    return { ok: true };
  }
  if (w.count >= MAX_REQUESTS) {
    return { ok: false };
  }
  w.count += 1;
  return { ok: true };
}
