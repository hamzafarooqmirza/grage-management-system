"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  ClipboardList,
  FileText,
  PoundSterling,
  Plus,
  User,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
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

export function BookJobButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setOpen(false);
    setSubmitting(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-accent-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm shadow-accent-600/30 transition-colors hover:bg-accent-700"
      >
        <Plus size={15} /> New booking
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Book a Job"
        subtitle="Schedule a new booking in the diary"
        icon={CalendarClock}
        maxWidth="max-w-lg"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <FieldGroup label="Customer" htmlFor="customer" required>
            <Select id="customer" name="customer" icon={User} required defaultValue="">
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
            <Select
              id="jobType"
              name="jobType"
              icon={ClipboardList}
              required
              defaultValue=""
            >
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldGroup label="Date" htmlFor="date" required>
              <TextInput id="date" name="date" type="date" icon={CalendarClock} required />
            </FieldGroup>

            <FieldGroup label="Est. Price (£)" htmlFor="estPrice">
              <TextInput
                id="estPrice"
                name="estPrice"
                type="number"
                icon={PoundSterling}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </FieldGroup>
          </div>

          <FieldGroup label="Notes" htmlFor="notes">
            <div className="relative">
              <FileText size={16} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
              <TextArea
                id="notes"
                name="notes"
                rows={4}
                className="pl-9"
                placeholder="Any additional details about the job..."
              />
            </div>
          </FieldGroup>

          <div className="sticky bottom-0 -mx-6 -mb-6 flex justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-accent-600/30 transition-colors hover:bg-accent-700 disabled:opacity-60"
            >
              {submitting ? "Booking..." : "Book Job"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
