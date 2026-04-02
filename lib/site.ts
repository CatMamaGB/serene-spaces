import { getPublicSiteOrigin } from "./env-server";

/** Canonical site origin (no trailing slash). Uses `NEXT_PUBLIC_APP_URL` or production apex default. */
export function getCanonicalOrigin(): string {
  return getPublicSiteOrigin();
}

/** Absolute URL for a path starting with `/`. */
export function absoluteUrl(path: string): string {
  const base = getPublicSiteOrigin().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** Stable `@id` for the root LocalBusiness JSON-LD in app layout (must match layout script). */
export function getBusinessJsonLdId(): string {
  return `${getPublicSiteOrigin()}/#localbusiness`;
}
