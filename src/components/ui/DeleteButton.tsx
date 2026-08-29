"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import type { MutationResult } from "@/lib/supabase/mutations";

export function DeleteButton<T>({
  id,
  action,
  confirmMessage,
  label,
  redirectTo,
}: {
  id: T;
  action: (id: T) => Promise<MutationResult>;
  confirmMessage: string;
  label?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (typeof window !== "undefined" && !window.confirm(confirmMessage)) return;

    setPending(true);
    const result = await action(id);
    setPending(false);

    if (result.error) {
      if (typeof window !== "undefined") window.alert(result.error);
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={label ?? "Delete"}
      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
}
