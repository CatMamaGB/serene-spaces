// Serene Spaces Pricing Configuration
export const PRICING = {
  BLANKET_FILL: 25,
  SHEET_NO_FILL: 20,
  SADDLE_PAD: 10,
  WRAPS: 5,
  BOOTS: 5,
  HOOD_NECK: 15,
  FLEECE_GIRTH: 15,
  LEG_STRAPS: 10,
  WATERPROOFING: 20,
  REPAIR_REPLACE_LEG_STRAPS: 15,
} as const;

export const PRICE_LABELS = {
  BLANKET_FILL: "WASH: Blanket (with fill)",
  SHEET_NO_FILL: "WASH: Sheet/Fly Sheet (no fill)",
  SADDLE_PAD: "WASH: Saddle Pad",
  WRAPS: "WASH: Wraps",
  BOOTS: "WASH: Boots",
  HOOD_NECK: "WASH: Hood or Neck Cover",
  FLEECE_GIRTH: "WASH: Fleece Girth",
  LEG_STRAPS: "WASH: Leg Straps (s)",
  WATERPROOFING: "WASH: Waterproofing",
  REPAIR_REPLACE_LEG_STRAPS: "Repair or replace leg strap(s)",
  REPAIRS: "Repairs",
} as const;

export const TAX_RATE = 0.0625; // 6.25% Illinois Sales Tax

export type PriceCode = keyof typeof PRICING;
export type PriceLabel = keyof typeof PRICE_LABELS;

// Helper function to get price for a code
export function getPrice(code: PriceCode): number {
  return PRICING[code];
}

// Helper function to get label for a code
export function getLabel(code: PriceCode | "REPAIRS"): string {
  return PRICE_LABELS[code] || code;
}

// Calculate tax amount
export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE);
}
