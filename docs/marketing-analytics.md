# Marketing and analytics (GA4)

This project sends page views to **Google Analytics 4** when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. Analytics appear in the [Google Analytics](https://analytics.google.com) website—not inside this app.

## The plan (how it fits together)

| Layer | What it does |
| ----- | ------------ |
| **GA4 on the site** | Measures visits, pages, and (when present) UTM campaign data from the landing URL. |
| **UTM links you share** | Tell GA4 *which* email, post, or ad someone used—especially when the browser would otherwise show **Direct** or a vague **referral**. |
| **Consistent naming** | Makes reports comparable month over month; random labels ruin the data. |

You do **not** need custom code for standard UTM tracking: GA4 reads `utm_*` parameters automatically on the first page load.

## How GA4 works in this project

1. A visitor opens your site.
2. The GA4 script in [`app/layout.tsx`](../app/layout.tsx) runs and sends events to Google (page views, referrer, etc.).
3. You sign in to **GA4** and use **Reports** to see traffic sources, campaigns, and behavior.

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

---

## What UTM tracking is

UTMs are **extra query parameters on the URL** so Google Analytics can record:

- **Where** traffic came from (`utm_source`)
- **What type** of channel it is (`utm_medium`)
- **Which campaign or effort** it belongs to (`utm_campaign`)
- Optionally **which link or creative** (`utm_content`), and **paid keyword** (`utm_term`)

**Without UTMs (for links you control):** traffic often looks like **Direct** or generic **referral**, especially from in-app browsers (Instagram, Facebook) that hide referrers.

**With UTMs:** you get **clear attribution** for email, social bios, QR codes, and campaigns—as long as naming stays consistent.

**You do not need UTMs** for normal **Google organic** search to show as Google when the referrer is available—GA4 infers `google / organic` when possible.

### URL structure (core)

```text
https://loveserenespaces.com/page?utm_source=SOURCE&utm_medium=MEDIUM&utm_campaign=CAMPAIGN
```

**The three parameters to use first:**

| Parameter | Meaning | Examples |
| --------- | ------- | -------- |
| `utm_source` | Who sent the traffic | `instagram`, `facebook`, `newsletter` |
| `utm_medium` | Type of traffic | `social`, `email`, `paid` |
| `utm_campaign` | The named effort | `spring_launch`, `april_promo`, `bio_link` |

Optional: `utm_content` (e.g. `story_slide_2`, `hero_blue`) for A/B tests or multiple links in one campaign; `utm_term` is often used for paid search keywords.

### Real examples

**Email (e.g. Mailchimp, Klaviyo):**

```text
https://loveserenespaces.com/shop?utm_source=newsletter&utm_medium=email&utm_campaign=april_launch
```

**Instagram bio:**

```text
https://loveserenespaces.com/?utm_source=instagram&utm_medium=social&utm_campaign=bio_link
```

**Instagram story or post:**

```text
https://loveserenespaces.com/pricing?utm_source=instagram&utm_medium=social&utm_campaign=spring_rates
```

**Paid social (UTMs add readable names; platforms may also add `fbclid` etc.):**

```text
https://loveserenespaces.com/?utm_source=facebook&utm_medium=paid&utm_campaign=retargeting_q2
```

### How to create UTM links (no coding)

Use Google’s official tool: **[Campaign URL Builder](https://ga-dev-tools.google/campaign-url-builder/)**

1. Paste the destination URL on your site.
2. Fill in source, medium, and campaign (and optional content).
3. Copy the generated link and use **that** URL in the email, bio, ad, or QR code.

---

## Where to use UTMs (and where not to)

**Use UTMs** anywhere the visitor **arrives from outside your site** and you control the link:

- Email newsletters and automations  
- Instagram / TikTok / Facebook bios and posts  
- Paid ads (alongside platform click IDs)  
- Affiliate or partner links you negotiate  
- **QR codes** (encode the full tagged URL)

**Avoid UTMs on internal links** (nav, footer, “related products” on your own domain). Re-tagging internal navigation **pollutes attribution** and can make campaigns look like they came from fake “campaigns.” Use plain paths for on-site links.

---

## What you’ll see in GA4

1. **Reports → Acquisition → Traffic acquisition**
2. Set the **date range** (top right).
3. Use dimensions such as:
   - **Session default channel grouping** — Organic Search, Organic Social, Direct, etc.
   - **Session source / medium** — e.g. `google / organic`, `instagram / social` (when UTMs are present).
   - **Session campaign** — matches `utm_campaign` when the session started from a tagged link.

**Note:** In-app browsers sometimes strip referrers; **tagged links** fix attribution for those entry points.

### Common mistakes (don’t do this)

- Inventing new spellings every week (`ig` vs `instagram` vs `Instagram`).
- Mixing uppercase and lowercase inconsistently.
- Skipping UTMs on social bios and email, then wondering why everything is **Direct**.

**Fix:** pick a small set of allowed `source` / `medium` values, use **lowercase and underscores**, and reuse them across campaigns.

---

## Lead conversion (GA4)

Successful **contact** and **intake (service request)** submissions redirect to **`/thank-you`** (with `?type=contact` or `?type=intake`). That produces a real **`page_view`** in the same session as the visit, so acquisition from UTMs still attributes the lead.

### After deploy: create `generate_lead` and mark it as a conversion

Do this once in the [GA4](https://analytics.google.com) property for the site:

1. **Admin** (gear) → **Data display** → **Events** → **Create event**.
2. Configure the new event:
   - **Event name:** `generate_lead`
   - **Matching conditions** (add both):
     - Parameter `event_name` **equals** `page_view`
     - Parameter `page_location` **contains** `thank-you`  
       (If your UI shows **page path + query string** instead, use the equivalent condition so paths like `/thank-you` match.)
3. Save. After data processes, open **Admin → Events**, find **`generate_lead`**, and turn on **Mark as conversion**.

### Verify before relying on reports

1. Submit a real test form on the **live** site.
2. In GA4, open **Reports → Realtime** and confirm a page view to a URL containing **`thank-you`**.

Optional: in **Explore** or custom reports, split leads by the `type` query string in the full URL (`contact` vs `intake`).

---

## Privacy and consent

If you serve EU/UK visitors, you may need a cookie consent banner and GA4 consent mode—consult your legal/policy requirements. US-only contexts often run GA4 without a banner, but verify for your business.

## Code reference

- Integration: [`app/layout.tsx`](../app/layout.tsx) — `GoogleAnalytics` from `@next/third-parties/google`
- Env template: [`.env.example`](../.env.example)
- Thank-you / lead landing: [`app/(public)/thank-you/page.tsx`](<../app/(public)/thank-you/page.tsx>) — `noindex` metadata; redirects from contact and intake forms

---

## Marketing analytics checklist (todo)

Use this as a living checklist; copy rows into your project tracker if needed.

### Setup

- [ ] GA4 property exists for the production domain.
- [ ] Web data stream uses the same site URL you actually use (https, correct host).
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in production and the site was redeployed after.
- [ ] Realtime report shows your visit when you browse the live site (ad blockers off for this test).

### UTM discipline

- [ ] Document a **naming convention** (lowercase, underscores, fixed list of sources/mediums).
- [ ] Bookmark the **[Campaign URL Builder](https://ga-dev-tools.google/campaign-url-builder/)** for the team.
- [ ] Tag **email** links (`utm_medium=email` or agreed variant).
- [ ] Tag **social** bios and major posts (`utm_source` = platform, `utm_medium=social` or `paid`).
- [ ] Encode **QR codes** with the full tagged URL, not a naked homepage.
- [ ] **Do not** add UTMs to internal navigation links on your site.

### Reporting habit

- [ ] Weekly or monthly: open **Traffic acquisition**, compare channels and campaigns over the same date range.
- [ ] When launching a named campaign, align `utm_campaign` with the name you use internally so reports match planning.

### Lead conversions

- [ ] In GA4, create the **`generate_lead`** event (see [Lead conversion (GA4)](#lead-conversion-ga4)) and **Mark as conversion**.
- [ ] Realtime test: submit contact and intake on production and confirm **`/thank-you`** appears.

### Optional later

- [ ] Use `utm_content` when testing two creatives or two buttons in the same campaign.
- [ ] If you need SQL or CRM joins, explore GA4 **BigQuery export** (separate setup in GA4 Admin).
- [ ] If EU/UK traffic is material, add a **consent** strategy and GA4 consent mode (legal review).
