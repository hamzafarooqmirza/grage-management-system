"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardBody } from "@/components/ui/Card";
import { FieldGroup, Select, TextArea, TextInput } from "@/components/ui/Field";
import { customers } from "@/lib/mock-data";

const JOB_TYPES = [
  "Vehicle Recovery",
  "Diagnostic",
  "Oil Service",
  "Full Service",
  "MOT",
  "Tyre Replacement",
  "Vehicle Storage",
  "Mobile Tyre Fitting",
  "Battery Replacement",
  "Other",
];

export default function BookJobPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    router.push("/diary");
  }

  return (
    <>
      <TopBar title="Book a Job" subtitle="Schedule a new booking in the diary" />
      <main className="flex-1 space-y-4 overflow-y-auto p-6">
        <Link
          href="/diary"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={15} /> Back to diary
        </Link>

        <Card className="max-w-2xl">
          <CardBody>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <FieldGroup label="Customer" htmlFor="customer" required>
                <Select id="customer" name="customer" required defaultValue="">
                  <option value="" disabled>
                    Select a customer
                  </option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </FieldGroup>

              <FieldGroup label="Job Type" htmlFor="jobType" required>
                <Select id="jobType" name="jobType" required defaultValue="">
                  <option value="" disabled>
                    Select a job type
                  </option>
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FieldGroup>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FieldGroup label="Date" htmlFor="date" required>
                  <TextInput id="date" name="date" type="date" required />
                </FieldGroup>

                <FieldGroup label="Est. Price (£)" htmlFor="estPrice">
                  <TextInput
                    id="estPrice"
                    name="estPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </FieldGroup>
              </div>

              <FieldGroup label="Notes" htmlFor="notes">
                <TextArea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="Any additional details about the job..."
                />
              </FieldGroup>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <Link
                  href="/diary"
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-accent-600/30 hover:bg-accent-700 disabled:opacity-60"
                >
                  {submitting ? "Booking..." : "Book Job"}
                </button>
              </div>
            </form>
          </CardBody>
        </Card>
      </main>
    </>
  );
}
