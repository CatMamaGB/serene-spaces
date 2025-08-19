// Serene Spaces Pricing Configuration
export const PRICING = {
  BLANKET_FILL: 25,      // Blanket (with fill) - Per item
  SHEET_NO_FILL: 20,     // Sheet/Fly Sheet (no fill) - Per item
  SADDLE_PAD: 10,        // Saddle Pad - Per item
  WRAPS: 5,              // Wraps - Per item or pair
  BOOTS: 5,              // Boots - Per item or pair
  HOOD_NECK: 15,         // Hood or Neck Cover - Per item
  FLEECE_GIRTH: 15,      // Fleece Girth - Per item
  WATERPROOFING: 20,     // Waterproofing - Per blanket
  EXTRA_WASH: 10,        // Extra Wash Fee - Per item
  LEG_STRAPS: 10,        // Leg Strap(s) - Per set
} as const;

export const PRICE_LABELS = {
  BLANKET_FILL: 'Blanket (with fill)',
  SHEET_NO_FILL: 'Sheet/Fly Sheet (no fill)',
  SADDLE_PAD: 'Saddle Pad',
  WRAPS: 'Wraps',
  BOOTS: 'Boots',
  HOOD_NECK: 'Hood or Neck Cover',
  FLEECE_GIRTH: 'Fleece Girth',
  WATERPROOFING: 'Waterproofing',
  EXTRA_WASH: 'Extra Wash Fee',
  LEG_STRAPS: 'Leg Strap(s)',
  REPAIRS: 'Repairs'
} as const;

export const TAX_RATE = 0.0625; // 6.25% Illinois Sales Tax

export type PriceCode = keyof typeof PRICING;
export type PriceLabel = keyof typeof PRICE_LABELS;

// Helper function to get price for a code
export function getPrice(code: PriceCode): number {
  return PRICING[code];
}

// Helper function to get label for a code
export function getLabel(code: PriceCode | 'REPAIRS'): string {
  return PRICE_LABELS[code] || code;
}

// Calculate tax amount
export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE);
}
