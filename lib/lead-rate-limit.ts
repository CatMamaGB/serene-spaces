type RateLimitWindow = {
  resetAt: number;
  count: number;
};

type FixedWindowOptions = {
  windowMs: number;
  maxRequests: number;
  maxBuckets?: number;
};

export function createFixedWindowRateLimiter({
  windowMs,
  maxRequests,
  maxBuckets = 5000,
}: FixedWindowOptions) {
  const windows = new Map<string, RateLimitWindow>();

  const pruneIfLarge = (now: number) => {
    if (windows.size < maxBuckets) return;

    for (const [ip, window] of windows) {
      if (now > window.resetAt) {
        windows.delete(ip);
      }
    }
  };

  return (ip: string): { ok: boolean } => {
    const now = Date.now();
    pruneIfLarge(now);

    const window = windows.get(ip);
    if (!window || now > window.resetAt) {
      windows.set(ip, { resetAt: now + windowMs, count: 1 });
      return { ok: true };
    }

    if (window.count >= maxRequests) {
      return { ok: false };
    }

    window.count += 1;
    return { ok: true };
  };
}
