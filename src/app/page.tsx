import { TopBar } from "@/components/layout/TopBar";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  bookings,
  getCustomer,
  getVehicle,
  invoiceTotals,
  invoices,
  jobCards,
  parts,
} from "@/lib/mock-data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { CalendarClock, Users, Wrench, Boxes } from "lucide-react";
import Link from "next/link";

const TODAY = "2026-08-14";

const statusTone: Record<string, "neutral" | "blue" | "green" | "amber" | "red" | "purple"> = {
  booked: "blue",
  in_progress: "amber",
  awaiting_parts: "purple",
  completed: "green",
  invoiced: "neutral",
};

export default function DashboardPage() {
  const todaysBookings = bookings
    .filter((b) => b.date === TODAY)
    .sort((a, b) => a.time.localeCompare(b.time));

  const openJobs = jobCards.filter(
    (j) => j.status !== "invoiced" && j.status !== "completed"
  );

  const outstandingInvoices = invoices.filter(
    (i) => i.status === "sent" || i.status === "overdue"
  );
  const outstandingTotal = outstandingInvoices.reduce(
    (sum, inv) => sum + invoiceTotals(inv).total,
    0
  );

  const lowStockParts = parts.filter((p) => p.stockLevel <= p.reorderLevel);

  const upcomingMots = [...bookings]
    .map((b) => ({ booking: b, vehicle: getVehicle(b.vehicleId) }))
    .filter((x) => x.vehicle)
    .map((x) => x.vehicle!)
    .filter(
      (v, idx, arr) => arr.findIndex((y) => y.id === v.id) === idx
    )
    .filter((v) => daysUntil(v.motDue) <= 14 && daysUntil(v.motDue) >= 0)
    .sort((a, b) => daysUntil(a.motDue) - daysUntil(b.motDue));

  return (
    <>
      <TopBar
        title="Dashboard"
        subtitle="Overview of today's workshop activity"
      />
      <main className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Today's bookings"
            value={String(todaysBookings.length)}
            icon={CalendarClock}
            tone="blue"
          />
          <StatCard
            label="Open job cards"
            value={String(openJobs.length)}
            icon={Wrench}
            tone="amber"
          />
          <StatCard
            label="Outstanding invoices"
            value={formatCurrency(outstandingTotal)}
            icon={Users}
            tone="red"
            hint={`${outstandingInvoices.length} unpaid`}
          />
          <StatCard
            label="Low stock parts"
            value={String(lowStockParts.length)}
            icon={Boxes}
            tone={lowStockParts.length > 0 ? "red" : "green"}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader
              title="Today's diary"
              subtitle={formatDate(TODAY)}
              action={
                <Link
                  href="/diary"
                  className="text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  View diary →
                </Link>
              }
            />
            <CardBody className="p-0">
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                    <th className="px-5 py-2 font-medium">Time</th>
                    <th className="px-5 py-2 font-medium">Customer</th>
                    <th className="px-5 py-2 font-medium">Vehicle</th>
                    <th className="px-5 py-2 font-medium">Type</th>
                    <th className="px-5 py-2 font-medium">Bay</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysBookings.map((b) => {
                    const customer = getCustomer(b.customerId);
                    const vehicle = getVehicle(b.vehicleId);
                    return (
                      <tr
                        key={b.id}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <td className="px-5 py-3 font-medium text-slate-900">
                          {b.time}
                        </td>
                        <td className="px-5 py-3 text-slate-700">
                          {customer?.name}
                        </td>
                        <td className="px-5 py-3 text-slate-500">
                          {vehicle?.registration} · {vehicle?.make}{" "}
                          {vehicle?.model}
                        </td>
                        <td className="px-5 py-3">
                          <Badge tone="blue" className="capitalize">
                            {b.type}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-slate-500">
                          {b.bay}
                        </td>
                      </tr>
                    );
                  })}
                  {todaysBookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-6 text-center text-sm text-slate-400"
                      >
                        No bookings scheduled for today.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="MOTs due soon" subtitle="Next 14 days" />
            <CardBody className="space-y-3">
              {upcomingMots.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No MOTs due in the next two weeks.
                </p>
              ) : (
                upcomingMots.map((v) => {
                  const customer = getCustomer(v.customerId);
                  const days = daysUntil(v.motDue);
                  return (
                    <div
                      key={v.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {v.registration}
                        </p>
                        <p className="text-xs text-slate-500">
                          {customer?.name}
                        </p>
                      </div>
                      <Badge tone={days <= 3 ? "red" : "amber"}>
                        {days === 0 ? "Due today" : `${days}d left`}
                      </Badge>
                    </div>
                  );
                })
              )}
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader
              title="Job board snapshot"
              subtitle={`${openJobs.length} jobs in progress`}
              action={
                <Link
                  href="/jobs"
                  className="text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  View jobs →
                </Link>
              }
            />
            <CardBody className="space-y-3">
              {openJobs.map((job) => {
                const vehicle = getVehicle(job.vehicleId);
                return (
                  <div
                    key={job.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {vehicle?.registration} — {job.description}
                      </p>
                      <p className="text-xs text-slate-500">
                        {job.technician}
                      </p>
                    </div>
                    <Badge tone={statusTone[job.status]} className="capitalize">
                      {job.status.replace("_", " ")}
                    </Badge>
                  </div>
                );
              })}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Low stock alerts"
              subtitle="At or below reorder level"
              action={
                <Link
                  href="/inventory"
                  className="text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  View inventory →
                </Link>
              }
            />
            <CardBody className="space-y-3">
              {lowStockParts.length === 0 ? (
                <p className="text-sm text-slate-400">
                  All parts are above reorder level.
                </p>
              ) : (
                lowStockParts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {p.sku} · {p.supplier}
                      </p>
                    </div>
                    <Badge tone="red">{p.stockLevel} left</Badge>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      </main>
    </>
  );
}
