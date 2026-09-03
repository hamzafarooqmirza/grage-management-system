import type {
  JobType,
  ServiceDetails,
  Transmission,
  TyreCondition,
  YesNo,
} from "./types";

export type ServiceFieldKind = "text" | "number" | "select";

export interface ServiceFieldOption {
  value: string;
  label: string;
}

export interface ServiceFieldConfig {
  name: string;
  label: string;
  kind: ServiceFieldKind;
  placeholder?: string;
  options?: ServiceFieldOption[];
  defaultValue: string | number;
  min?: number;
  step?: number;
  fullWidth?: boolean;
  uppercase?: boolean;
}

export type ServiceFieldValues = Record<string, string | number>;

// Config-driven fields for every job type except vehicle_storage, which
// needs cross-field date validation and a computed total and is handled
// separately in ServiceSpecificFields. Job types not listed here (booked
// via their stable slug, not their label) show no extra fields at all.
export const SERVICE_FIELD_CONFIG: Partial<Record<JobType, ServiceFieldConfig[]>> = {
  tyre_replacement: [
    {
      name: "tyreCondition",
      label: "Tyre Condition",
      kind: "select",
      options: [
        { value: "new", label: "New" },
        { value: "part_worn", label: "Part Worn" },
      ],
      defaultValue: "new",
    },
    {
      name: "tyreSize",
      label: "Tyre Size",
      kind: "text",
      placeholder: "e.g. 205/55R16",
      defaultValue: "",
    },
    {
      name: "quantity",
      label: "Quantity",
      kind: "number",
      min: 1,
      defaultValue: 1,
    },
  ],
  mobile_tyre_fitting: [
    {
      name: "location",
      label: "Location",
      kind: "text",
      placeholder: "Postcode or address",
      defaultValue: "",
      fullWidth: true,
    },
    {
      name: "registration",
      label: "Car Registration",
      kind: "text",
      placeholder: "AB12CDE",
      defaultValue: "",
      fullWidth: true,
      uppercase: true,
    },
    {
      name: "tyreSize",
      label: "Tyre Size",
      kind: "text",
      placeholder: "e.g. 205/55R16",
      defaultValue: "",
    },
    {
      name: "quantity",
      label: "Quantity",
      kind: "number",
      min: 1,
      defaultValue: 1,
    },
  ],
  battery_replacement: [
    {
      name: "batteryCode",
      label: "Battery Code",
      kind: "text",
      placeholder: "e.g. 027, 096, 110",
      defaultValue: "",
      fullWidth: true,
    },
  ],
  vehicle_recovery: [
    {
      name: "pickupLocation",
      label: "Pickup Location",
      kind: "text",
      placeholder: "Postcode or address",
      defaultValue: "",
      fullWidth: true,
    },
    {
      name: "registration",
      label: "Car Registration",
      kind: "text",
      placeholder: "AB12CDE",
      defaultValue: "",
      fullWidth: true,
      uppercase: true,
    },
    {
      name: "transmission",
      label: "Transmission",
      kind: "select",
      options: [
        { value: "automatic", label: "Automatic" },
        { value: "manual", label: "Manual" },
      ],
      defaultValue: "automatic",
    },
    {
      name: "canRoll",
      label: "Can It Roll?",
      kind: "select",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      defaultValue: "yes",
    },
    {
      name: "passengers",
      label: "Number of Passengers",
      kind: "number",
      min: 0,
      defaultValue: 0,
    },
    {
      name: "dropoffAddress",
      label: "Drop-off Address",
      kind: "text",
      placeholder: "Postcode or address",
      defaultValue: "",
      fullWidth: true,
    },
  ],
};

export function defaultServiceValues(jobType: JobType | ""): ServiceFieldValues {
  const fields = jobType ? SERVICE_FIELD_CONFIG[jobType] : undefined;
  if (!fields) return {};
  const values: ServiceFieldValues = {};
  for (const field of fields) {
    values[field.name] = field.defaultValue;
  }
  return values;
}

export interface StorageFormValues {
  startDate: string;
  neededBy: string;
  dailyRate: string;
}

export const EMPTY_STORAGE_VALUES: StorageFormValues = {
  startDate: "",
  neededBy: "",
  dailyRate: "",
};

// No storage-pricing convention existed anywhere in the app before this
// feature, so this is a deliberate choice, not a restored business rule:
// billed days = nights stayed (Needed By minus Start Date), with a
// 1-day minimum so a same-day in/out still charges one day.
export function storageBillableDays(startDate: string, neededBy: string): number {
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${neededBy}T00:00:00Z`).getTime();
  const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

export function storageTotal(values: StorageFormValues): number | null {
  const { startDate, neededBy, dailyRate } = values;
  if (!startDate || !neededBy || !dailyRate) return null;
  if (neededBy < startDate) return null;
  const rate = Number(dailyRate);
  if (!Number.isFinite(rate) || rate < 0) return null;
  return rate * storageBillableDays(startDate, neededBy);
}

export function buildServiceDetails(
  jobType: JobType | "",
  values: ServiceFieldValues,
  storage: StorageFormValues
): ServiceDetails | null {
  switch (jobType) {
    case "tyre_replacement":
      return {
        jobType,
        tyreCondition: (values.tyreCondition as TyreCondition) || "new",
        tyreSize: String(values.tyreSize ?? "").trim(),
        quantity: Math.max(1, Number(values.quantity) || 1),
      };
    case "mobile_tyre_fitting":
      return {
        jobType,
        location: String(values.location ?? "").trim(),
        registration: String(values.registration ?? "").trim().toUpperCase(),
        tyreSize: String(values.tyreSize ?? "").trim(),
        quantity: Math.max(1, Number(values.quantity) || 1),
      };
    case "battery_replacement":
      return {
        jobType,
        batteryCode: String(values.batteryCode ?? "").trim(),
      };
    case "vehicle_recovery":
      return {
        jobType,
        pickupLocation: String(values.pickupLocation ?? "").trim(),
        registration: String(values.registration ?? "").trim().toUpperCase(),
        transmission: (values.transmission as Transmission) || "automatic",
        canRoll: (values.canRoll as YesNo) || "yes",
        passengers: Math.max(0, Number(values.passengers) || 0),
        dropoffAddress: String(values.dropoffAddress ?? "").trim(),
      };
    case "vehicle_storage": {
      const { startDate, neededBy, dailyRate } = storage;
      if (!startDate && !neededBy && !dailyRate) return null;
      return {
        jobType,
        startDate: startDate || null,
        neededBy: neededBy || null,
        dailyRate: dailyRate ? Number(dailyRate) : null,
      };
    }
    default:
      return null;
  }
}

export function formatServiceDetailsSummary(
  details: ServiceDetails | null | undefined
): string | null {
  if (!details) return null;

  switch (details.jobType) {
    case "tyre_replacement": {
      const parts = [
        details.tyreSize,
        `x${details.quantity}`,
        details.tyreCondition === "part_worn" ? "Part Worn" : "New",
      ].filter(Boolean);
      return parts.join(" · ") || null;
    }
    case "vehicle_storage": {
      const parts: string[] = [];
      if (details.startDate) parts.push(`From ${details.startDate}`);
      if (details.neededBy) parts.push(`Until ${details.neededBy}`);
      if (details.dailyRate != null) parts.push(`£${details.dailyRate.toFixed(2)}/day`);
      return parts.length > 0 ? parts.join(" · ") : null;
    }
    case "mobile_tyre_fitting": {
      const parts = [
        details.registration,
        details.tyreSize,
        `x${details.quantity}`,
        details.location,
      ].filter(Boolean);
      return parts.join(" · ") || null;
    }
    case "battery_replacement":
      return details.batteryCode ? `Battery: ${details.batteryCode}` : null;
    case "vehicle_recovery": {
      const parts = [
        details.registration,
        details.transmission === "manual" ? "Manual" : "Automatic",
        details.canRoll === "no" ? "Cannot roll" : "Can roll",
        details.passengers
          ? `${details.passengers} passenger${details.passengers === 1 ? "" : "s"}`
          : null,
        details.pickupLocation ? `From ${details.pickupLocation}` : null,
        details.dropoffAddress ? `To ${details.dropoffAddress}` : null,
      ].filter(Boolean);
      return parts.join(" · ") || null;
    }
    default:
      return null;
  }
}
