import { createFixedWindowRateLimiter } from "@/lib/lead-rate-limit";

/** Same policy as intake: 8 requests / 15 min per IP, separate bucket. */
export const checkContactRateLimit = createFixedWindowRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 8,
});
