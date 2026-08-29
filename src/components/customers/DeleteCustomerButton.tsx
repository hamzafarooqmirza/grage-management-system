"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { deleteCustomer, deleteCustomerCascade } from "@/lib/supabase/mutations";

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
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  function reset() {
    setError(null);
    setBlocked(false);
  }

  function finish() {
    setOpen(false);
    reset();
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.refresh();
    }
  }

  async function handleDelete() {
    setPending(true);
    setError(null);
    const result = await deleteCustomer(customerId);
    setPending(false);

    if (result.error) {
      setError(result.error);
      setBlocked(true);
      return;
    }

    finish();
  }

  async function handleDeleteEverything() {
    setPending(true);
    setError(null);
    const result = await deleteCustomerCascade(customerId);
    setPending(false);

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
        onClick={() => {
          reset();
          setOpen(true);
        }}
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
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          {!blocked ? (
            <p className="text-sm text-slate-600">
              Delete <span className="font-medium text-slate-900">{customerName}</span>? This
              cannot be undone.
            </p>
          ) : (
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">{customerName}</span> can&rsquo;t be
              deleted on their own — they still have related records on file. Deleting everything
              will permanently remove {customerName}, their vehicles, bookings, jobs, and
              invoices. This cannot be undone.
            </p>
          )}

          {error ? (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            {!blocked ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={pending}
                className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-rose-600/30 transition-colors hover:bg-rose-700 disabled:opacity-60"
              >
                {pending ? <Loader2 size={14} className="animate-spin" /> : null}
                {pending ? "Deleting..." : "Delete"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDeleteEverything}
                disabled={pending}
                className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-rose-600/30 transition-colors hover:bg-rose-700 disabled:opacity-60"
              >
                {pending ? <Loader2 size={14} className="animate-spin" /> : null}
                {pending ? "Deleting..." : "Delete Customer & All Data"}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
