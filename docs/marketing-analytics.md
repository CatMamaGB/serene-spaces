# Marketing and analytics (GA4)

This project sends page views to **Google Analytics 4** when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. Analytics appear in the [Google Analytics](https://analytics.google.com) website—not inside this app.

## How it works

1. A visitor opens your site.
2. The GA4 script in [`app/layout.tsx`](../app/layout.tsx) runs and sends events to Google (page views, referrer, etc.).
3. You sign in to **GA4** and read **Reports** to see traffic sources (Google, social, direct, etc.).

## One-time setup (production)

1. In [Google Analytics](https://analytics.google.com), create or open a **GA4** property for loveserenespaces.com.
2. Go to **Admin → Data streams → Web** and copy the **Measurement ID** (format `G-XXXXXXXXXX`).
3. In your host (e.g. Vercel **Settings → Environment Variables**), add:
   - Name: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Value: your `G-...` ID
4. Redeploy the site so the variable is available at build/runtime.

Local development: copy `.env.example` to `.env.local` and set the same variable if you want to test (optional).

## Verify the tag is working

1. After deploy, open your **live** site in a browser.
2. In GA4, open **Reports → Realtime** (or the Realtime overview).
3. You should see at least **1 active user** while you browse the site (may take a few seconds).

If Realtime stays empty: check the env var name, redeploy, disable ad blockers for testing, and confirm the ID matches the GA4 property.

## Where to see “Google vs social” (and other sources)

After data has collected (Realtime works immediately; standard reports need time):

1. Go to **Reports → Acquisition → Traffic acquisition**.
2. Adjust the **date range** (top right).
3. Use dimensions such as:
   - **Session default channel grouping** — e.g. Organic Search, Organic Social, Direct.
   - **Session source / medium** — e.g. `google / organic`, `instagram / referral`.

**Note:** In-app browsers (Instagram, Facebook) sometimes hide referrers; those visits may appear as **Direct** unless you use UTM links for links you control.

## UTM parameters (optional, for campaigns you own)

For links you put in Instagram bio, email newsletters, or QR codes, add query parameters so GA4 labels the visit clearly:

Example:

```text
https://loveserenespaces.com/pricing?utm_source=instagram&utm_medium=social&utm_campaign=link_in_bio
```

Common parameters:

| Parameter        | Example        | Purpose              |
| ---------------- | -------------- | -------------------- |
| `utm_source`     | `instagram`    | Who sent the traffic |
| `utm_medium`     | `social`         | Type (social, email, etc.) |
| `utm_campaign`   | `spring_promo`   | Campaign name        |

You do **not** need UTMs for normal Google organic search to show as Google—GA4 infers that from the referrer when possible.

**Builder:** [Google Campaign URL Builder](https://ga-dev-tools.google/campaign-url-builder/) (official helper).

## Privacy and consent

If you serve EU/UK visitors, you may need a cookie consent banner and GA4 consent mode—consult your legal/policy requirements. US-only contexts often run GA4 without a banner, but verify for your business.

## Code reference

- Integration: [`app/layout.tsx`](../app/layout.tsx) — `GoogleAnalytics` from `@next/third-parties/google`
- Env template: [`.env.example`](../.env.example)
