import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getCustomer, getVehicle, jobCards, jobLineTotal } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";
import type { JobStatus } from "@/lib/types";

const columns: { status: JobStatus; label: string }[] = [
  { status: "booked", label: "Booked" },
  { status: "in_progress", label: "In progress" },
  { status: "awaiting_parts", label: "Awaiting parts" },
  { status: "completed", label: "Completed" },
  { status: "invoiced", label: "Invoiced" },
];

export default function JobsPage() {
  return (
    <>
      <TopBar
        title="Job Cards"
        subtitle="Track every job from booking through to invoice"
      />
      <main className="flex-1 overflow-x-auto p-6">
        <div className="flex min-w-max gap-4">
          {columns.map((col) => {
            const jobs = jobCards.filter((j) => j.status === col.status);
            return (
              <div key={col.status} className="w-72 shrink-0">
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-sm font-semibold text-neutral-900">
                    {col.label}
                  </p>
                  <span className="text-xs text-neutral-400">
                    {jobs.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {jobs.map((job) => {
                    const customer = getCustomer(job.customerId);
                    const vehicle = getVehicle(job.vehicleId);
                    const { total } = jobLineTotal(job);
                    return (
                      <Link key={job.id} href={`/jobs/${job.id}`}>
                        <Card className="p-3 transition-shadow hover:shadow-md">
                          <p className="text-sm font-medium text-neutral-900">
                            {vehicle?.registration}
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-500">
                            {customer?.name}
                          </p>
                          <p className="mt-2 text-xs text-neutral-600">
                            {job.description}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <Badge tone="neutral">{job.technician}</Badge>
                            <span className="text-xs font-semibold text-neutral-900">
                              {formatCurrency(total)}
                            </span>
                          </div>
                          <p className="mt-2 text-[11px] text-neutral-400">
                            Due {formatDate(job.dueDate)}
                          </p>
                        </Card>
                      </Link>
                    );
                  })}
                  {jobs.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-neutral-200 px-3 py-6 text-center text-xs text-neutral-400">
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
