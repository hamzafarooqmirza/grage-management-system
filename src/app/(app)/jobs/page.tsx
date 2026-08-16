import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getCustomers, getJobCards, getVehicles } from "@/lib/supabase/queries";
import { jobLineTotal } from "@/lib/totals";
import { formatCurrency, formatDate } from "@/lib/format";
import type { JobStatus } from "@/lib/types";

const columns: { status: JobStatus; label: string }[] = [
  { status: "booked", label: "Booked" },
  { status: "in_progress", label: "In progress" },
  { status: "awaiting_parts", label: "Awaiting parts" },
  { status: "completed", label: "Completed" },
  { status: "invoiced", label: "Invoiced" },
];

export default async function JobsPage() {
  const [jobCards, customers, vehicles] = await Promise.all([
    getJobCards(),
    getCustomers(),
    getVehicles(),
  ]);

  const customerById = new Map(customers.map((c) => [c.id, c]));
  const vehicleById = new Map(vehicles.map((v) => [v.id, v]));

  return (
    <>
      <TopBar
        title="Job Cards"
        subtitle="Track every job from booking through to invoice"
      />
      <main className="flex-1 overflow-x-auto p-4 sm:p-6">
        <div className="flex min-w-max gap-4">
          {columns.map((col) => {
            const jobs = jobCards.filter((j) => j.status === col.status);
            return (
              <div key={col.status} className="w-72 shrink-0">
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {col.label}
                  </p>
                  <span className="text-xs text-slate-400">
                    {jobs.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {jobs.map((job) => {
                    const customer = customerById.get(job.customerId);
                    const vehicle = job.vehicleId
                      ? vehicleById.get(job.vehicleId)
                      : undefined;
                    const { total } = jobLineTotal(job);
                    return (
                      <Link key={job.id} href={`/jobs/${job.id}`}>
                        <Card className="p-3 transition-shadow hover:shadow-md">
                          <p className="text-sm font-medium text-slate-900">
                            {vehicle?.registration ?? "No vehicle"}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {customer?.name}
                          </p>
                          <p className="mt-2 text-xs text-slate-600">
                            {job.description ?? "—"}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <Badge tone="neutral">{job.technician ?? "Unassigned"}</Badge>
                            <span className="text-xs font-semibold text-slate-900">
                              {formatCurrency(total)}
                            </span>
                          </div>
                          <p className="mt-2 text-[11px] text-slate-400">
                            {job.dueDate ? `Due ${formatDate(job.dueDate)}` : "No due date"}
                          </p>
                        </Card>
                      </Link>
                    );
                  })}
                  {jobs.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400">
                      No jobs
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
