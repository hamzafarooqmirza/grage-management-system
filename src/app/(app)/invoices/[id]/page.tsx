import Link from "next/link";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getCustomer, getInvoice, getVehicle } from "@/lib/supabase/queries";
import { invoiceTotals } from "@/lib/totals";
import { formatCurrency, formatDate } from "@/lib/format";
import { ArrowLeft } from "lucide-react";

const statusTone: Record<string, "neutral" | "blue" | "green" | "red"> = {
  draft: "neutral",
  sent: "blue",
  paid: "green",
  overdue: "red",
};

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoice(id);
  if (!invoice) notFound();

  const [customer, vehicle] = await Promise.all([
    getCustomer(invoice.customerId),
    invoice.vehicleId ? getVehicle(invoice.vehicleId) : Promise.resolve(undefined),
  ]);
  const { subtotal, vat, total } = invoiceTotals(invoice);

  return (
    <>
      <TopBar title={invoice.number} subtitle="Invoice detail" />
      <main className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/invoices"
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={15} /> Back to invoices
          </Link>
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Print / download PDF
          </button>
        </div>

        <Card>
          <CardBody className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  My Garage Ltd
                </p>
                <p className="text-sm text-slate-500">
                  14 Workshop Way, Manchester, M1 2AB
                </p>
                <p className="text-sm text-slate-500">
                  VAT No. GB123456789
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-xl font-bold text-slate-900">
                  {invoice.number}
                </p>
                <Badge tone={statusTone[invoice.status]} className="mt-1 capitalize">
                  {invoice.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">
                  Bill to
                </p>
                <p className="mt-1 font-medium text-slate-900">
                  {customer?.name}
                </p>
                <p className="text-slate-500">
                  {customer ? `${customer.address}, ${customer.city} ${customer.postCode}` : null}
                </p>
                <p className="text-slate-500">{customer?.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">
                  Vehicle
                </p>
                <p className="mt-1 font-medium text-slate-900">
                  {vehicle?.registration ?? "—"}
                </p>
                <p className="text-slate-500">
                  {vehicle
                    ? [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ")
                    : null}
                </p>
                <p className="mt-3 text-xs font-medium text-slate-400 uppercase">
                  Dates
                </p>
                <p className="text-slate-500">
                  Issued {formatDate(invoice.date)} · Due{" "}
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                  <th className="py-2 font-medium">Description</th>
                  <th className="py-2 font-medium">Qty</th>
                  <th className="py-2 font-medium">Unit price</th>
                  <th className="py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((li) => (
                  <tr key={li.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3">{li.description}</td>
                    <td className="py-3 text-slate-500">{li.quantity}</td>
                    <td className="py-3 text-slate-500">
                      {formatCurrency(li.unitPrice)}
                    </td>
                    <td className="py-3 text-right font-medium">
                      {formatCurrency(li.quantity * li.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    VAT ({Math.round(invoice.vatRate)}%)
                  </span>
                  <span>{formatCurrency(vat)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
                  <span>Total due</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </main>
    </>
  );
}
