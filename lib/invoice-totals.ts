import { Prisma } from "@prisma/client";

const D = (n: number | string) => new Prisma.Decimal(n);
const round2 = (d: Prisma.Decimal) => d.toDecimalPlaces(2);

export function calcTotals(
  items: { quantity: number; unitPrice: Prisma.Decimal; taxable: boolean }[],
  taxRate: Prisma.Decimal,
  applyTax: boolean,
) {
  const subtotal = items.reduce(
    (acc, it) => acc.plus(D(it.quantity).times(it.unitPrice)),
    D(0),
  );

  const taxableBase = items.reduce(
    (acc, it) =>
      it.taxable ? acc.plus(D(it.quantity).times(it.unitPrice)) : acc,
    D(0),
  );

  const tax = applyTax ? taxableBase.times(taxRate).div(100) : D(0);
  const total = subtotal.plus(tax);

  return {
    subtotal: round2(subtotal),
    tax: round2(tax),
    total: round2(total),
  };
}
