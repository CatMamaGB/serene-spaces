import { createFixedWindowRateLimiter } from "@/lib/lead-rate-limit";

/**
 * Fixed-window rate limit per IP for /api/intake (in-process).
 * Mitigates casual abuse; distributed attacks need edge/KV (e.g. Upstash) later.
 */
export const checkIntakeRateLimit = createFixedWindowRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 8,
});
