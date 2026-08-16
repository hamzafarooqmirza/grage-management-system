import { TopBar } from "@/components/layout/TopBar";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { getInvoices, getJobCards, getParts } from "@/lib/supabase/queries";
import { invoiceTotals, jobLineTotal } from "@/lib/totals";
import { formatCurrency } from "@/lib/format";
import { PoundSterling, TrendingUp, Wrench, AlertTriangle } from "lucide-react";
import type { JobStatus } from "@/lib/types";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function lastSixMonths(): { key: string; label: string }[] {
  const months: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: MONTH_LABELS[d.getMonth()],
    });
  }
  return months;
}

export default async function ReportsPage() {
  const [invoices, jobCards, parts] = await Promise.all([
    getInvoices(),
    getJobCards(),
    getParts(),
  ]);

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, inv) => sum + invoiceTotals(inv).total, 0);

  const outstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, inv) => sum + invoiceTotals(inv).total, 0);

  const avgJobValue =
    jobCards.length > 0
      ? jobCards.reduce((sum, j) => sum + jobLineTotal(j).total, 0) / jobCards.length
      : 0;

  const inventoryValue = parts.reduce(
    (sum, p) => sum + p.stockLevel * p.costPrice,
    0
  );

  const months = lastSixMonths();
  const monthlyRevenue = months.map(({ key, label }) => {
    const value = invoices
      .filter((inv) => inv.status === "paid" && inv.date.startsWith(key))
      .reduce((sum, inv) => sum + invoiceTotals(inv).total, 0);
    return { month: label, value };
  });
  const maxRevenue = Math.max(1, ...monthlyRevenue.map((m) => m.value));
  const hasRevenue = monthlyRevenue.some((m) => m.value > 0);

  const statusList: JobStatus[] = [
    "booked",
    "in_progress",
    "awaiting_parts",
    "completed",
    "invoiced",
  ];
  const jobsByStatus = statusList.map((status) => ({
    status,
    count: jobCards.filter((j) => j.status === status).length,
  }));
  const maxJobs = Math.max(...jobsByStatus.map((j) => j.count), 1);

  return (
    <>
      <TopBar
        title="Reports"
        subtitle="Sales, revenue and KPI overview"
      />
      <main className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Revenue (paid)"
            value={formatCurrency(totalRevenue)}
            icon={PoundSterling}
            tone="green"
          />
          <StatCard
            label="Outstanding"
            value={formatCurrency(outstanding)}
            icon={AlertTriangle}
            tone="amber"
          />
          <StatCard
            label="Avg. job value"
            value={formatCurrency(avgJobValue)}
            icon={Wrench}
            tone="blue"
          />
          <StatCard
            label="Inventory value"
            value={formatCurrency(inventoryValue)}
            icon={TrendingUp}
            tone="neutral"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Monthly revenue" subtitle="Last 6 months, paid invoices" />
            <CardBody>
              {hasRevenue ? (
                <div className="flex h-48 items-end gap-4">
                  {monthlyRevenue.map((m) => (
                    <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-xs font-medium text-slate-500">
                        {formatCurrency(m.value)}
                      </span>
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-accent-600 to-accent-500"
                        style={{
                          height: `${(m.value / maxRevenue) * 140}px`,
                        }}
                      />
                      <span className="text-xs text-slate-400">
                        {m.month}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-16 text-center text-sm text-slate-400">
                  No paid invoices yet — revenue will appear here once invoices are marked paid.
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Jobs by status" subtitle="Current workshop load" />
            <CardBody className="space-y-3">
              {jobsByStatus.map((j) => (
                <div key={j.status}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="capitalize text-slate-600">
                      {j.status.replace("_", " ")}
                    </span>
                    <span className="text-slate-400">{j.count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-accent-500"
                      style={{ width: `${(j.count / maxJobs) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </main>
    </>
  );
}
