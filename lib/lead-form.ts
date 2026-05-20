export function hasFilledHoneypot(value: unknown): boolean {
  return typeof value === "string" && value.trim() !== "";
}

export function normalizeRequiredString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized === "" ? null : normalized;
}

export function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}
