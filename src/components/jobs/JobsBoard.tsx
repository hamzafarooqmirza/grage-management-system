"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { jobLineTotal } from "@/lib/totals";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  JOB_STATUSES,
  JOB_STATUS_LABELS,
  JOB_PRIORITY_LABELS,
  JOB_PRIORITY_TONE,
} from "@/lib/job-status";
import type { Customer, JobCard, Vehicle } from "@/lib/types";

export function JobsBoard({
  jobCards,
  customers,
  vehicles,
}: {
  jobCards: JobCard[];
  customers: Customer[];
  vehicles: Vehicle[];
}) {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const customerById = useMemo(
    () => new Map(customers.map((c) => [c.id, c])),
    [customers]
  );
  const vehicleById = useMemo(
    () => new Map(vehicles.map((v) => [v.id, v])),
    [vehicles]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return jobCards.filter((job) => {
      if (term) {
        const customer = customerById.get(job.customerId);
        const vehicle = job.vehicleId ? vehicleById.get(job.vehicleId) : undefined;
        const haystack = [
          customer?.name,
          customer?.email,
          vehicle?.registration,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (fromDate && (!job.dueDate || job.dueDate < fromDate)) return false;
      if (toDate && (!job.dueDate || job.dueDate > toDate)) return false;
      return true;
    });
  }, [jobCards, search, fromDate, toDate, customerById, vehicleById]);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative sm:col-span-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, email, or VRM..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm transition-all focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/10"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/10"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/10"
            />
          </div>
        </div>
        {(search || fromDate || toDate) ? (
          <p className="mt-2 text-xs text-slate-400">
            Showing {filtered.length} of {jobCards.length} jobs
          </p>
        ) : null}
      </Card>

      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-4">
          {JOB_STATUSES.map((status) => {
            const jobs = filtered.filter((j) => j.status === status);
            return (
              <div key={status} className="w-72 shrink-0">
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {JOB_STATUS_LABELS[status]}
                  </p>
                  <span className="text-xs text-slate-400">{jobs.length}</span>
                </div>
                <div className="space-y-3">
                  {jobs.map((job) => {
                    const customer = customerById.get(job.customerId);
                    const vehicle = job.vehicleId
                      ? vehicleById.get(job.vehicleId)
                      : undefined;
                    const { total } = jobLineTotal(job);
                    const itemsCount = job.labourLines.length + job.partLines.length;
                    return (
                      <Link key={job.id} href={`/jobs/${job.id}`}>
                        <Card className="p-3 transition-shadow hover:shadow-md">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-slate-900">
                              {vehicle?.registration ?? "No vehicle"}
                            </p>
                            <Badge tone={JOB_PRIORITY_TONE[job.priority]}>
                              {JOB_PRIORITY_LABELS[job.priority]}
                            </Badge>
                          </div>
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
                          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                            <span>
                              {job.dueDate ? `Due ${formatDate(job.dueDate)}` : "No due date"}
                            </span>
                            <span>
                              {itemsCount} item{itemsCount === 1 ? "" : "s"}
                            </span>
                          </div>
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
      </div>
    </div>
  );
}
