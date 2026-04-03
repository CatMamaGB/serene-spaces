"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    /** Set by gtag.js after `GoogleAnalyticsLazy` scripts load */
    gtag?: (...args: unknown[]) => void;
  }
}

const GTAG_RETRY_MS = 100;
const GTAG_MAX_ATTEMPTS = 60;

/**
 * Sends GA4 `page_view` on client-side navigations (App Router).
 * The initial page load is counted by `GoogleAnalyticsLazy` in `layout.tsx`;
 * we skip the first effect run to avoid double-counting.
 * Retries until `gtag` exists because GA is loaded with `lazyOnload`.
 */
export default function TrackPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstNavigation = useRef(true);

  useEffect(() => {
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    if (isFirstNavigation.current) {
      isFirstNavigation.current = false;
      return;
    }

    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const send = () => {
      const { gtag } = window;
      if (typeof gtag === "function") {
        gtag("event", "page_view", {
          page_path: pagePath,
          page_location: window.location.href,
          page_title: document.title,
        });
        return;
      }
      attempts += 1;
      if (attempts < GTAG_MAX_ATTEMPTS) {
        timeoutId = setTimeout(send, GTAG_RETRY_MS);
      }
    };

    send();
    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams]);

  return null;
}
