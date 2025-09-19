// Shared invoice types and utilities
export interface InvoiceItem {
  id: string; // required - stable identifier
  description: string;
  quantity: number;
  rate: number; // dollars
  amount: number; // dollars
}

export interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  invoiceDate: string;
  status: string;
  notes: string;
  terms: string;
  subtotal: number;
  tax: number;
  total: number;
  applyTax: boolean;
  taxRate: number;
  invoiceNumber: string;
  items: InvoiceItem[];
}

// Money helpers for precise calculations
export const toCents = (dollars: number): number => Math.round(dollars * 100);
export const fromCents = (cents: number): number => cents / 100;

// Tax rate constant (6.25% Illinois Sales Tax)
export const TAX_RATE = 0.0625;

// Recompute totals with cents math to avoid floating point drift
export const recomputeTotals = (invoice: Invoice): Invoice => {
  const items = invoice.items.map((item) => {
    const amountC = toCents(item.quantity * item.rate);
    return { ...item, amount: fromCents(amountC) };
  });

  const subtotalC = items.reduce((sum, item) => sum + toCents(item.amount), 0);
  const taxC = Math.round(subtotalC * TAX_RATE);
  const totalC = subtotalC + taxC;

  return {
    ...invoice,
    items,
    subtotal: fromCents(subtotalC),
    tax: fromCents(taxC),
    total: fromCents(totalC),
  };
};

// Currency formatter using Intl.NumberFormat
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Generate stable item ID
export const generateItemId = (): string => {
  return crypto.randomUUID();
};
