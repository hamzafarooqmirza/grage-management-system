"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/supabase/actions";
import { useUser } from "./UserContext";

function initialsFromEmail(email: string): string {
  const name = email.split("@")[0] ?? "";
  const parts = name.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

export function UserMenu() {
  const { email } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-xs font-semibold text-white"
      >
        {initialsFromEmail(email)}
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-950/10">
            <div className="px-2.5 py-2 text-xs text-slate-500">
              Signed in as
              <p className="truncate text-sm font-medium text-slate-900">{email}</p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={15} /> Sign out
              </button>
            </form>
          </div>
        </>
      ) : null}
    </div>
  );
}
