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

const DEFAULT_TAX_RATE_PERCENT = 6.25;
const toNumber = (value: unknown, fallback = 0): number => {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalizeItem = (item: Partial<InvoiceItem>, index: number): InvoiceItem => {
  const quantity = Math.max(1, Math.trunc(toNumber(item.quantity, 1)));
  const rate = toNumber(item.rate);
  const amountC = toCents(quantity * rate);

  return {
    id: item.id || `item-${index}`,
    description: item.description || "",
    quantity,
    rate: fromCents(toCents(rate)),
    amount: fromCents(amountC),
  };
};

// Recompute totals with cents math to avoid floating point drift
export const recomputeTotals = (invoice: Invoice): Invoice => {
  const items = invoice.items.map((item, index) => normalizeItem(item, index));

  const subtotalC = items.reduce((sum, item) => sum + toCents(item.amount), 0);
  const taxRatePercent = Math.max(0, toNumber(invoice.taxRate, DEFAULT_TAX_RATE_PERCENT));
  const taxC = invoice.applyTax
    ? Math.round(subtotalC * (taxRatePercent / 100))
    : 0;
  const totalC = subtotalC + taxC;

  return {
    ...invoice,
    items,
    subtotal: fromCents(subtotalC),
    tax: fromCents(taxC),
    total: fromCents(totalC),
    taxRate: taxRatePercent,
  };
};

export const normalizeInvoice = (invoice: Partial<Invoice>): Invoice => {
  const items = Array.isArray(invoice.items) ? invoice.items : [];

  return {
    id: invoice.id || "",
    customerName: invoice.customerName || "",
    customerEmail: invoice.customerEmail || "",
    customerPhone: invoice.customerPhone || "",
    customerAddress: invoice.customerAddress || "",
    invoiceDate: invoice.invoiceDate || "",
    status: invoice.status || "draft",
    notes: invoice.notes || "",
    terms: invoice.terms || "",
    subtotal: toNumber(invoice.subtotal),
    tax: toNumber(invoice.tax),
    total: toNumber(invoice.total),
    applyTax:
      typeof invoice.applyTax === "boolean" ? invoice.applyTax : true,
    taxRate: Math.max(0, toNumber(invoice.taxRate, DEFAULT_TAX_RATE_PERCENT)),
    invoiceNumber: invoice.invoiceNumber || "",
    items: items.map((item, index) => normalizeItem(item, index)),
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
