import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  getCustomer,
  getVehicle,
  invoiceTotals,
  invoices,
} from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";
import { CreateInvoiceButton } from "@/components/forms/CreateInvoiceModal";

const statusTone: Record<string, "neutral" | "blue" | "green" | "red"> = {
  draft: "neutral",
  sent: "blue",
  paid: "green",
  overdue: "red",
};

export default function InvoicesPage() {
  return (
    <>
      <TopBar
        title="Estimates & Invoicing"
        subtitle={`${invoices.length} invoices`}
      />
      <main className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        <div className="flex justify-end">
          <CreateInvoiceButton />
        </div>
        <Card>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Number</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Vehicle</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Due</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const customer = getCustomer(inv.customerId);
                const vehicle = getVehicle(inv.vehicleId);
                const { total } = invoiceTotals(inv);
                return (
                  <tr
                    key={inv.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {inv.number}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-700">
                      {customer?.name}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {vehicle?.registration}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {formatDate(inv.date)}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={statusTone[inv.status]} className="capitalize">
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-slate-900">
                      {formatCurrency(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </Card>
      </main>
    </>
  );
}
