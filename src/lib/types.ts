export type JobStatus =
  | "booked"
  | "in_progress"
  | "awaiting_parts"
  | "completed"
  | "invoiced";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type BookingType = "service" | "mot" | "repair" | "diagnostic";

export interface Vehicle {
  id: string;
  customerId: string;
  registration: string;
  make: string;
  model: string;
  year: number;
  colour: string;
  mileage: number;
  motDue: string; // ISO date
  lastServiceDate: string | null;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  notes?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  vehicleId: string;
  date: string; // ISO date (yyyy-mm-dd)
  time: string; // HH:mm
  durationMinutes: number;
  type: BookingType;
  bay: string;
  technician: string;
  notes?: string;
  jobId?: string;
}

export interface JobLabourLine {
  id: string;
  description: string;
  hours: number;
  rate: number;
}

export interface JobPartLine {
  id: string;
  partId: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface JobCard {
  id: string;
  bookingId?: string;
  customerId: string;
  vehicleId: string;
  status: JobStatus;
  technician: string;
  createdAt: string;
  dueDate: string;
  description: string;
  labourLines: JobLabourLine[];
  partLines: JobPartLine[];
  notes?: string;
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
  jobId?: string;
  customerId: string;
  vehicleId: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  vatRate: number;
  notes?: string;
}

export interface Part {
  id: string;
  sku: string;
  name: string;
  supplier: string;
  category: string;
  stockLevel: number;
  reorderLevel: number;
  costPrice: number;
  sellPrice: number;
}
