"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Loader2 } from "lucide-react";
import { restoreCustomer } from "@/lib/supabase/mutations";

export function RestoreCustomerBanner({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleRestore() {
    setPending(true);
    await restoreCustomer(customerId);
    setPending(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-center gap-2 text-sm text-amber-800">
        <Archive size={15} /> This customer is archived and hidden from the active customer list.
      </p>
      <button
        type="button"
        onClick={handleRestore}
        disabled={pending}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 shadow-sm transition-colors hover:bg-amber-100 disabled:opacity-60"
      >
        {pending ? <Loader2 size={13} className="animate-spin" /> : <ArchiveRestore size={13} />}
        {pending ? "Restoring..." : "Restore Customer"}
      </button>
    </div>
  );
}
