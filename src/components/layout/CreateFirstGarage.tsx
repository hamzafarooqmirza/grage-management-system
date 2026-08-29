"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, LogOut } from "lucide-react";
import { createGarage } from "@/lib/supabase/garage-actions";
import { signOut } from "@/lib/supabase/actions";
import { FieldGroup, TextInput } from "@/components/ui/Field";

export function CreateFirstGarage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await createGarage(name);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
            <Building2 size={22} />
          </span>
          <h1 className="text-lg font-semibold text-slate-900">Set up your garage</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create your garage to start managing customers, jobs, and invoices.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <FieldGroup label="Garage Name" htmlFor="garageName" required>
            <TextInput
              id="garageName"
              name="garageName"
              icon={Building2}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Garage Ltd"
              autoFocus
            />
          </FieldGroup>

          {error ? (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-accent-600/30 transition-colors hover:bg-accent-700 disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Garage"}
          </button>
        </form>

        <form action={signOut} className="mt-4 text-center">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600"
          >
            <LogOut size={13} /> Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
