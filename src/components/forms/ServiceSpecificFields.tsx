"use client";

import { CalendarClock, PoundSterling } from "lucide-react";
import { FieldGroup, Select, TextInput } from "@/components/ui/Field";
import { SERVICE_FIELD_CONFIG, type ServiceFieldValues, type StorageFormValues } from "@/lib/service-fields";
import type { JobType } from "@/lib/types";

export function ServiceSpecificFields({
  jobType,
  values,
  onChange,
  storageValues,
  onStorageChange,
  storageError,
}: {
  jobType: JobType | "";
  values: ServiceFieldValues;
  onChange: (name: string, value: string | number) => void;
  storageValues: StorageFormValues;
  onStorageChange: (patch: Partial<StorageFormValues>) => void;
  storageError: string | null;
}) {
  if (jobType === "vehicle_storage") {
    return (
      <div
        role="group"
        aria-label="Vehicle storage details"
        className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup label="Start Date" htmlFor="storageStartDate">
            <TextInput
              id="storageStartDate"
              type="date"
              icon={CalendarClock}
              value={storageValues.startDate}
              onChange={(e) => onStorageChange({ startDate: e.target.value })}
            />
          </FieldGroup>
          <FieldGroup label="Needed By" htmlFor="storageNeededBy">
            <TextInput
              id="storageNeededBy"
              type="date"
              icon={CalendarClock}
              min={storageValues.startDate || undefined}
              value={storageValues.neededBy}
              onChange={(e) => onStorageChange({ neededBy: e.target.value })}
            />
          </FieldGroup>
        </div>
        <FieldGroup label="Daily Storage Rate (£)" htmlFor="storageDailyRate">
          <TextInput
            id="storageDailyRate"
            type="number"
            icon={PoundSterling}
            min="0"
            step="0.01"
            placeholder="5.00"
            value={storageValues.dailyRate}
            onChange={(e) => {
              const raw = e.target.value;
              // Guard against a negative number even though min="0" doesn't
              // stop typing one directly.
              const safe = raw === "" || Number(raw) >= 0 ? raw : "0";
              onStorageChange({ dailyRate: safe });
            }}
          />
        </FieldGroup>
        <p
          className={storageError ? "text-xs text-rose-600" : "text-xs text-slate-400"}
          role={storageError ? "alert" : undefined}
          aria-live="polite"
        >
          {storageError ?? "Enter dates and rate to calculate total."}
        </p>
      </div>
    );
  }

  const fields = jobType ? SERVICE_FIELD_CONFIG[jobType] : undefined;
  if (!fields || fields.length === 0) return null;

  return (
    <div
      role="group"
      aria-label={`${jobType.replace(/_/g, " ")} details`}
      className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-2"
    >
      {fields.map((field) => {
        const value = values[field.name] ?? field.defaultValue;
        const inputId = `service-${field.name}`;

        return (
          <div key={field.name} className={field.fullWidth ? "sm:col-span-2" : undefined}>
            <FieldGroup label={field.label} htmlFor={inputId}>
              {field.kind === "select" ? (
                <Select
                  id={inputId}
                  value={String(value)}
                  onChange={(e) => onChange(field.name, e.target.value)}
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <TextInput
                  id={inputId}
                  type={field.kind}
                  min={field.kind === "number" ? field.min : undefined}
                  step={field.kind === "number" ? (field.step ?? 1) : undefined}
                  placeholder={field.placeholder}
                  value={value}
                  className={field.uppercase ? "uppercase" : undefined}
                  onChange={(e) => {
                    if (field.kind === "number") {
                      const raw = Number(e.target.value);
                      const min = field.min ?? 0;
                      onChange(field.name, Number.isFinite(raw) ? Math.max(min, raw) : min);
                    } else {
                      onChange(field.name, e.target.value);
                    }
                  }}
                />
              )}
            </FieldGroup>
          </div>
        );
      })}
    </div>
  );
}
