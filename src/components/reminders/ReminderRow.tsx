"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Trash2 } from "lucide-react";
import { deleteReminder, toggleReminderDone } from "@/lib/supabase/mutations";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Reminder } from "@/lib/types";

export function ReminderRow({
  reminder,
  customerName,
}: {
  reminder: Reminder;
  customerName?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    if (busy) return;
    setBusy(true);
    await toggleReminderDone(reminder.id, !reminder.done);
    setBusy(false);
    router.refresh();
  }

  async function handleDelete() {
    if (busy) return;
    setBusy(true);
    await deleteReminder(reminder.id);
    setBusy(false);
    router.refresh();
  }

  const overdue = !reminder.done && reminder.dueDate < new Date().toISOString().slice(0, 10);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2.5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleToggle}
          disabled={busy}
          aria-label={reminder.done ? "Mark as not done" : "Mark as done"}
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
            reminder.done
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-300 text-transparent hover:border-accent-500"
          )}
        >
          {busy ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
        </button>
        <div>
          <p className={cn("text-sm font-medium", reminder.done ? "text-slate-400 line-through" : "text-slate-900")}>
            {reminder.title}
          </p>
          <p className="text-xs text-slate-500">
            {customerName ? `${customerName} · ` : ""}
            <span className={overdue ? "font-medium text-rose-600" : ""}>
              Due {formatDate(reminder.dueDate)}
            </span>
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        aria-label={`Delete ${reminder.title}`}
        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
