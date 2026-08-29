import type { EmployeeRole } from "./types";
import type { JobStatusTone } from "./job-status";

export const EMPLOYEE_ROLES: EmployeeRole[] = [
  "technician",
  "service_advisor",
  "manager",
  "apprentice",
  "other",
];

export const EMPLOYEE_ROLE_LABELS: Record<EmployeeRole, string> = {
  technician: "Technician",
  service_advisor: "Service Advisor",
  manager: "Manager",
  apprentice: "Apprentice",
  other: "Other",
};

export const EMPLOYEE_ROLE_TONE: Record<EmployeeRole, JobStatusTone> = {
  technician: "blue",
  service_advisor: "purple",
  manager: "green",
  apprentice: "amber",
  other: "neutral",
};
