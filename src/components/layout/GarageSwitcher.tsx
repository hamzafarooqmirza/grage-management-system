"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, ChevronDown, Plus } from "lucide-react";
import { switchGarage, createGarage } from "@/lib/supabase/garage-actions";
import { Modal } from "@/components/ui/Modal";
import { FieldGroup, TextInput } from "@/components/ui/Field";
import { useGarage } from "./GarageContext";

export function GarageSwitcher() {
  const { garages, currentGarageId } = useGarage();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const current = garages.find((g) => g.id === currentGarageId) ?? garages[0];

  async function handleSwitch(garageId: string) {
    if (garageId === currentGarageId) {
      setOpen(false);
      return;
    }
    setSwitching(true);
    const result = await switchGarage(garageId);
    setSwitching(false);
    setOpen(false);
    if (!result.error) router.refresh();
  }

  if (!current) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={switching}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60"
      >
        <Building2 size={15} className="text-slate-400" />
        <span className="hidden max-w-[10rem] truncate sm:inline">{current.name}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-950/10">
            <p className="px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
              Your garages
            </p>
            {garages.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => handleSwitch(g.id)}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-slate-900">{g.name}</span>
                  <span className="block text-xs capitalize text-slate-400">{g.role}</span>
                </span>
                {g.id === currentGarageId ? (
                  <Check size={15} className="shrink-0 text-accent-600" />
                ) : null}
              </button>
            ))}
            <div className="my-1 border-t border-slate-100" />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setCreateOpen(true);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-accent-600 hover:bg-accent-50"
            >
              <Plus size={15} /> Add garage
            </button>
          </div>
        </>
      ) : null}

      <CreateGarageModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

function CreateGarageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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

    setName("");
    onClose();
    router.refresh();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a Garage"
      subtitle="Create a new, separate garage with its own customers and data"
      icon={Building2}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FieldGroup label="Garage Name" htmlFor="newGarageName" required>
          <TextInput
            id="newGarageName"
            name="newGarageName"
            icon={Building2}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Garage Birmingham"
          />
        </FieldGroup>

        {error ? (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        ) : null}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-accent-600/30 transition-colors hover:bg-accent-700 disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Garage"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
