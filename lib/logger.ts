/**
 * Central logging for server and client. Debug/info are suppressed in production
 * to avoid PII noise in Vercel logs and browser consoles.
 */
const isDev = process.env.NODE_ENV === "development";

export const logger = {
  /** Verbose tracing — development only. */
  debug: (...args: unknown[]) => {
    if (isDev) console.log("[DEBUG]", ...args);
  },

  /** Non-error operational messages — development only. */
  info: (...args: unknown[]) => {
    if (isDev) console.info("[INFO]", ...args);
  },

  warn: (...args: unknown[]) => {
    console.warn("[WARN]", ...args);
  },

  error: (...args: unknown[]) => {
    console.error("[ERROR]", ...args);
  },

  /**
   * Log a caught failure with message in all environments; stack traces only in development.
   */
  errorFrom: (context: string, err: unknown) => {
    const prefix = `[ERROR] ${context}`;
    if (err instanceof Error) {
      console.error(prefix + ":", err.message);
      if (isDev && err.stack) console.error(err.stack);
    } else {
      console.error(prefix + ":", err);
    }
  },
};
