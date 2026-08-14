import Link from "next/link";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  getCustomer,
  getJob,
  getVehicle,
  jobLineTotal,
} from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";
import { ArrowLeft } from "lucide-react";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();

  const customer = getCustomer(job.customerId);
  const vehicle = getVehicle(job.vehicleId);
  const { labour, partsTotal, total } = jobLineTotal(job);

  return (
    <>
      <TopBar
        title={`Job ${job.id.toUpperCase()}`}
        subtitle={job.description}
      />
      <main className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
        <Link
          href="/jobs"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={15} /> Back to job board
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader title="Customer & vehicle" />
            <CardBody className="space-y-2 text-sm">
              <p>
                <Link
                  href={`/customers/${customer?.id}`}
                  className="font-medium text-slate-900 hover:underline"
                >
                  {customer?.name}
                </Link>
              </p>
              <p className="text-slate-500">{customer?.phone}</p>
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="font-medium text-slate-900">
                  {vehicle?.registration}
                </p>
                <p className="text-slate-500">
                  {vehicle?.year} {vehicle?.make} {vehicle?.model}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Job status" />
            <CardBody className="space-y-2 text-sm">
              <Badge className="capitalize">
                {job.status.replace("_", " ")}
              </Badge>
              <p className="text-slate-500">
                Technician: {job.technician}
              </p>
              <p className="text-slate-500">
                Created: {formatDate(job.createdAt)}
              </p>
              <p className="text-slate-500">Due: {formatDate(job.dueDate)}</p>
              {job.notes ? (
                <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
                  {job.notes}
                </p>
              ) : null}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Job total" />
            <CardBody className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Labour</span>
                <span>{formatCurrency(labour)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parts</span>
                <span>{formatCurrency(partsTotal)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              {job.invoiceId ? (
                <Link
                  href={`/invoices/${job.invoiceId}`}
                  className="mt-2 inline-block text-xs font-medium text-accent-600 hover:underline"
                >
                  View linked invoice →
                </Link>
              ) : (
                <p className="text-xs text-slate-400">
                  Not yet invoiced
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader title="Labour lines" />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                  <th className="px-5 py-2 font-medium">Description</th>
                  <th className="px-5 py-2 font-medium">Hours</th>
                  <th className="px-5 py-2 font-medium">Rate</th>
                  <th className="px-5 py-2 text-right font-medium">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {job.labourLines.map((line) => (
                  <tr key={line.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3">{line.description}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {line.hours}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {formatCurrency(line.rate)}/hr
                    </td>
                    <td className="px-5 py-3 text-right font-medium">
                      {formatCurrency(line.hours * line.rate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Parts used" subtitle="Deducted from stock on completion" />
          <CardBody className="p-0">
            {job.partLines.length === 0 ? (
              <p className="px-5 py-4 text-sm text-slate-400">
                No parts allocated to this job.
              </p>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                    <th className="px-5 py-2 font-medium">Part</th>
                    <th className="px-5 py-2 font-medium">Qty</th>
                    <th className="px-5 py-2 font-medium">Unit price</th>
                    <th className="px-5 py-2 text-right font-medium">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {job.partLines.map((line) => (
                    <tr key={line.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3">{line.description}</td>
                      <td className="px-5 py-3 text-slate-500">
                        {line.quantity}
                      </td>
                      <td className="px-5 py-3 text-slate-500">
                        {formatCurrency(line.unitPrice)}
                      </td>
                      <td className="px-5 py-3 text-right font-medium">
                        {formatCurrency(line.quantity * line.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </CardBody>
        </Card>
      </main>
    </>
  );
}
