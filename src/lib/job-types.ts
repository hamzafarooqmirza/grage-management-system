import type { JobType } from "./types";

export const JOB_TYPES: JobType[] = [
  "vehicle_recovery",
  "diagnostic",
  "oil_service",
  "full_service",
  "mot",
  "tyre_replacement",
  "vehicle_storage",
  "mobile_tyre_fitting",
  "battery_replacement",
  "other",
];

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  vehicle_recovery: "Vehicle Recovery",
  diagnostic: "Diagnostic",
  oil_service: "Oil Service",
  full_service: "Full Service",
  mot: "MOT",
  tyre_replacement: "Tyre Replacement",
  vehicle_storage: "Vehicle Storage",
  mobile_tyre_fitting: "Mobile Tyre Fitting",
  battery_replacement: "Battery Replacement",
  other: "Other",
};

export type JobTypeTone = "neutral" | "blue" | "green" | "amber" | "red" | "purple";

export const JOB_TYPE_TONE: Record<JobType, JobTypeTone> = {
  vehicle_recovery: "red",
  diagnostic: "green",
  oil_service: "blue",
  full_service: "blue",
  mot: "purple",
  tyre_replacement: "amber",
  vehicle_storage: "neutral",
  mobile_tyre_fitting: "amber",
  battery_replacement: "red",
  other: "neutral",
};
