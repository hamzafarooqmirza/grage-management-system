import Link from "next/link";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  getCustomer,
  getVehiclesForCustomer,
  getBookingsForCustomer,
  getJobsForCustomer,
  getInvoicesForCustomer,
  invoiceTotals,
} from "@/lib/mock-data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { ArrowLeft } from "lucide-react";

const invoiceStatusTone: Record<string, "neutral" | "blue" | "green" | "amber" | "red"> = {
  draft: "neutral",
  sent: "blue",
  paid: "green",
  overdue: "red",
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = getCustomer(id);
  if (!customer) notFound();

  const vehicles = getVehiclesForCustomer(customer.id);
  const bookings = getBookingsForCustomer(customer.id);
  const jobs = getJobsForCustomer(customer.id);
  const custInvoices = getInvoicesForCustomer(customer.id);

  return (
    <>
      <TopBar title={customer.name} subtitle={customer.email} />
      <main className="flex-1 space-y-6 overflow-y-auto p-6">
        <Link
          href="/customers"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={15} /> Back to customers
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader title="Customer details" />
            <CardBody className="space-y-2 text-sm">
              <p>
                <span className="text-slate-500">Phone:</span>{" "}
                {customer.phone}
              </p>
              <p>
                <span className="text-slate-500">Email:</span>{" "}
                {customer.email}
              </p>
              <p>
                <span className="text-slate-500">Address:</span>{" "}
                {customer.address}
              </p>
              <p>
                <span className="text-slate-500">Customer since:</span>{" "}
                {formatDate(customer.createdAt)}
              </p>
              {customer.notes ? (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
                  {customer.notes}
                </p>
              ) : null}
            </CardBody>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader
              title="Vehicles"
              subtitle={`${vehicles.length} on record`}
            />
            <CardBody className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                    <th className="px-5 py-2 font-medium">Registration</th>
                    <th className="px-5 py-2 font-medium">Vehicle</th>
                    <th className="px-5 py-2 font-medium">Mileage</th>
                    <th className="px-5 py-2 font-medium">MOT due</th>
                    <th className="px-5 py-2 font-medium">Last service</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => {
                    const days = daysUntil(v.motDue);
                    return (
                      <tr
                        key={v.id}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <td className="px-5 py-3 font-medium text-slate-900">
                          {v.registration}
                        </td>
                        <td className="px-5 py-3 text-slate-700">
                          {v.year} {v.make} {v.model} · {v.colour}
                        </td>
                        <td className="px-5 py-3 text-slate-500">
                          {v.mileage.toLocaleString()} mi
                        </td>
                        <td className="px-5 py-3">
                          <Badge tone={days <= 14 ? "amber" : "neutral"}>
                            {formatDate(v.motDue)}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-slate-500">
                          {v.lastServiceDate
                            ? formatDate(v.lastServiceDate)
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader
              title="Booking & job history"
              subtitle={`${bookings.length} bookings · ${jobs.length} job cards`}
            />
            <CardBody className="space-y-3">
              {jobs.length === 0 ? (
                <p className="text-sm text-slate-400">No job history yet.</p>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {job.description}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(job.createdAt)} · {job.technician}
                      </p>
                    </div>
                    <Badge className="capitalize">
                      {job.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Invoices"
              subtitle={`${custInvoices.length} total`}
            />
            <CardBody className="space-y-3">
              {custInvoices.length === 0 ? (
                <p className="text-sm text-slate-400">No invoices yet.</p>
              ) : (
                custInvoices.map((inv) => {
                  const { total } = invoiceTotals(inv);
                  return (
                    <Link
                      key={inv.id}
                      href={`/invoices/${inv.id}`}
                      className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 hover:bg-slate-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {inv.number}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(inv.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">
                          {formatCurrency(total)}
                        </p>
                        <Badge tone={invoiceStatusTone[inv.status]} className="capitalize">
                          {inv.status}
                        </Badge>
                      </div>
                    </Link>
                  );
                })
              )}
            </CardBody>
          </Card>
        </div>
      </main>
    </>
  );
}
