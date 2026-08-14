import { TopBar } from "@/components/layout/TopBar";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { invoiceTotals, invoices, jobCards, parts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { PoundSterling, TrendingUp, Wrench, AlertTriangle } from "lucide-react";

const monthlyRevenue = [
  { month: "Mar", value: 8420 },
  { month: "Apr", value: 9110 },
  { month: "May", value: 8760 },
  { month: "Jun", value: 10230 },
  { month: "Jul", value: 11040 },
  { month: "Aug", value: 6380 },
];

export default function ReportsPage() {
  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, inv) => sum + invoiceTotals(inv).total, 0);

  const outstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, inv) => sum + invoiceTotals(inv).total, 0);

  const avgJobValue =
    jobCards.length > 0
      ? jobCards.reduce((sum, j) => {
          const labour = j.labourLines.reduce((s, l) => s + l.hours * l.rate, 0);
          const partsTotal = j.partLines.reduce(
            (s, p) => s + p.quantity * p.unitPrice,
            0
          );
          return sum + labour + partsTotal;
        }, 0) / jobCards.length
      : 0;

  const inventoryValue = parts.reduce(
    (sum, p) => sum + p.stockLevel * p.costPrice,
    0
  );

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value));

  const jobsByStatus = ["booked", "in_progress", "awaiting_parts", "completed", "invoiced"].map(
    (status) => ({
      status,
      count: jobCards.filter((j) => j.status === status).length,
    })
  );
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
            <CardHeader title="Monthly revenue" subtitle="Last 6 months" />
            <CardBody>
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
