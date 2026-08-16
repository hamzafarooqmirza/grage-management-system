import type { Invoice, JobCard } from "./types";

export function invoiceTotals(invoice: Invoice) {
  const subtotal = invoice.lineItems.reduce(
    (sum, li) => sum + li.quantity * li.unitPrice,
    0
  );
  const vat = subtotal * (invoice.vatRate / 100);
  return { subtotal, vat, total: subtotal + vat };
}

export function jobLineTotal(job: JobCard) {
  const labour = job.labourLines.reduce((sum, l) => sum + l.hours * l.rate, 0);
  const partsTotal = job.partLines.reduce(
    (sum, p) => sum + p.quantity * p.unitPrice,
    0
  );
  return { labour, partsTotal, total: labour + partsTotal };
}
