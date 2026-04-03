"use client";

import Script from "next/script";

/**
 * GA4 with lazyOnload to reduce main-thread contention on first paint (mobile / Slow 4G).
 * Inline init must run before the gtag.js request; both use the same strategy so order is preserved.
 */
export default function GoogleAnalyticsLazy({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        id="_next-ga-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
          window['dataLayer'] = window['dataLayer'] || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `,
        }}
      />
      <Script
        id="_next-ga"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
    </>
  );
}
