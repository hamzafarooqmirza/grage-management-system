"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Archive, Loader2, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import {
  archiveCustomer,
  deleteCustomer,
  deleteCustomerCascade,
  getCustomerDependencyCounts,
} from "@/lib/supabase/mutations";

export function DeleteCustomerButton({
  customerId,
  customerName,
  redirectTo,
}: {
  customerId: string;
  customerName: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [pending, setPending] = useState<"delete" | "archive" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  async function openModal() {
    setError(null);
    setBlocked(false);
    setChecking(true);
    setOpen(true);

    try {
      const counts = await getCustomerDependencyCounts(customerId);
      const hasDependents =
        counts.vehicles > 0 || counts.bookings > 0 || counts.jobs > 0 || counts.invoices > 0;
      setBlocked(hasDependents);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to check related records.");
    } finally {
      setChecking(false);
    }
  }

  function finish() {
    setOpen(false);
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.refresh();
    }
  }

  async function handleDelete() {
    setPending("delete");
    setError(null);
    const result = blocked
      ? await deleteCustomerCascade(customerId)
      : await deleteCustomer(customerId);
    setPending(null);

    if (result.error) {
      setError(result.error);
      return;
    }

    finish();
  }

  async function handleArchive() {
    setPending("archive");
    setError(null);
    const result = await archiveCustomer(customerId);
    setPending(null);

    if (result.error) {
      setError(result.error);
      return;
    }

    finish();
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        aria-label={`Delete ${customerName}`}
        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
      >
        <Trash2 size={14} />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete Customer"
        icon={AlertTriangle}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          {checking ? (
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 size={14} className="animate-spin" /> Checking related records...
            </p>
          ) : blocked ? (
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">{customerName}</span> can&rsquo;t be
              deleted on their own — they still have related records on file. Archiving keeps
              everything (vehicles, bookings, jobs, invoices) and just hides them from the
              active customer list; deleting everything permanently removes it all.
            </p>
          ) : (
            <p className="text-sm text-slate-600">
              Delete <span className="font-medium text-slate-900">{customerName}</span>? This
              cannot be undone. You can archive them instead to keep their record.
            </p>
          )}

          {error ? (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleArchive}
              disabled={checking || pending !== null}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60"
            >
              {pending === "archive" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Archive size={14} />
              )}
              {pending === "archive" ? "Archiving..." : "Archive Instead"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={checking || pending !== null}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-rose-600/30 transition-colors hover:bg-rose-700 disabled:opacity-60"
            >
              {pending === "delete" ? <Loader2 size={14} className="animate-spin" /> : null}
              {pending === "delete"
                ? "Deleting..."
                : blocked
                  ? "Delete Customer & All Data"
                  : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
