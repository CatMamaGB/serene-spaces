"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    /** Set by gtag.js / @next/third-parties GoogleAnalytics inline script */
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends GA4 `page_view` on client-side navigations (App Router).
 * The initial page load is already counted by `GoogleAnalytics` in `layout.tsx`;
 * we skip the first effect run to avoid double-counting.
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

    const { gtag } = window;
    if (typeof gtag !== "function") return;

    gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
