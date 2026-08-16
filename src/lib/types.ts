export type JobStatus =
  | "booked"
  | "in_progress"
  | "awaiting_parts"
  | "completed"
  | "invoiced";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type JobType =
  | "vehicle_recovery"
  | "diagnostic"
  | "oil_service"
  | "full_service"
  | "mot"
  | "tyre_replacement"
  | "vehicle_storage"
  | "mobile_tyre_fitting"
  | "battery_replacement"
  | "other";

export interface Vehicle {
  id: string;
  customerId: string;
  registration: string;
  make: string | null;
  model: string | null;
  year: number | null;
  colour: string | null;
  mileage: number | null;
  motDue: string | null; // ISO date
  lastServiceDate: string | null;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postCode: string;
  createdAt: string;
  notes?: string | null;
}

export interface Booking {
  id: string;
  customerId: string;
  vehicleId: string | null;
  date: string; // ISO date (yyyy-mm-dd)
  time: string | null; // HH:mm
  durationMinutes: number | null;
  jobType: JobType;
  bay: string | null;
  technician: string | null;
  estPrice: number | null;
  notes?: string | null;
}

export interface JobLabourLine {
  id: string;
  description: string;
  hours: number;
  rate: number;
}

export interface JobPartLine {
  id: string;
  partId: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface JobCard {
  id: string;
  bookingId?: string | null;
  customerId: string;
  vehicleId: string | null;
  status: JobStatus;
  technician: string | null;
  createdAt: string;
  dueDate: string | null;
  description: string | null;
  labourLines: JobLabourLine[];
  partLines: JobPartLine[];
  notes?: string | null;
  invoiceId?: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  jobId?: string | null;
  customerId: string;
  vehicleId: string | null;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  vatRate: number;
  notes?: string | null;
}

export interface Part {
  id: string;
  sku: string;
  name: string;
  supplier: string | null;
  category: string | null;
  stockLevel: number;
  reorderLevel: number;
  costPrice: number;
  sellPrice: number;
}
