import { createClient } from "./server";
import type { Tables } from "./database.types";
import type {
  Booking,
  Customer,
  Invoice,
  InvoiceLineItem,
  JobCard,
  JobLabourLine,
  JobPartLine,
  Part,
  Vehicle,
} from "@/lib/types";

type CustomerRow = Tables<"customers">;
type VehicleRow = Tables<"vehicles">;
type PartRow = Tables<"parts">;
type BookingRow = Tables<"bookings">;
type JobCardRow = Tables<"job_cards"> & {
  job_labour_lines: Tables<"job_labour_lines">[];
  job_part_lines: Tables<"job_part_lines">[];
};
type InvoiceRow = Tables<"invoices"> & {
  invoice_line_items: Tables<"invoice_line_items">[];
};

function mapCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    phone: row.phone,
    address: row.address_line,
    city: row.city,
    postCode: row.post_code,
    createdAt: row.created_at,
    notes: row.notes,
  };
}

function mapVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    customerId: row.customer_id,
    registration: row.registration,
    make: row.make,
    model: row.model,
    year: row.year,
    colour: row.colour,
    mileage: row.mileage,
    motDue: row.mot_due,
    lastServiceDate: row.last_service_date,
  };
}

function mapPart(row: PartRow): Part {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    supplier: row.supplier,
    category: row.category,
    stockLevel: row.stock_level,
    reorderLevel: row.reorder_level,
    costPrice: row.cost_price,
    sellPrice: row.sell_price,
  };
}

function mapBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    customerId: row.customer_id,
    vehicleId: row.vehicle_id,
    date: row.date,
    time: row.time,
    durationMinutes: row.duration_minutes,
    jobType: row.job_type,
    bay: row.bay,
    technician: row.technician,
    estPrice: row.est_price,
    notes: row.notes,
  };
}

function mapLabourLine(row: Tables<"job_labour_lines">): JobLabourLine {
  return {
    id: row.id,
    description: row.description,
    hours: row.hours,
    rate: row.rate,
  };
}

function mapPartLine(row: Tables<"job_part_lines">): JobPartLine {
  return {
    id: row.id,
    partId: row.part_id,
    description: row.description,
    quantity: row.quantity,
    unitPrice: row.unit_price,
  };
}

function mapJobCard(row: JobCardRow, invoiceId?: string | null): JobCard {
  return {
    id: row.id,
    bookingId: row.booking_id,
    customerId: row.customer_id,
    vehicleId: row.vehicle_id,
    status: row.status,
    priority: (row.priority as JobCard["priority"]) ?? "medium",
    technician: row.technician,
    createdAt: row.created_at,
    dueDate: row.due_date,
    description: row.description,
    notes: row.notes,
    labourLines: (row.job_labour_lines ?? []).map(mapLabourLine),
    partLines: (row.job_part_lines ?? []).map(mapPartLine),
    invoiceId: invoiceId ?? undefined,
  };
}

function mapLineItem(row: Tables<"invoice_line_items">): InvoiceLineItem {
  return {
    id: row.id,
    description: row.description,
    quantity: row.quantity,
    unitPrice: row.unit_price,
  };
}

function mapInvoice(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    number: row.number,
    jobId: row.job_id,
    customerId: row.customer_id,
    vehicleId: row.vehicle_id,
    date: row.date,
    dueDate: row.due_date,
    status: row.status,
    vatRate: row.vat_rate,
    notes: row.notes,
    lineItems: (row.invoice_line_items ?? []).map(mapLineItem),
  };
}

const JOB_CARD_SELECT = "*, job_labour_lines(*), job_part_lines(*)";
const INVOICE_SELECT = "*, invoice_line_items(*)";

// ---- Customers ----

export async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("full_name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapCustomer);
}

export async function getCustomer(id: string): Promise<Customer | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapCustomer(data) : undefined;
}

// ---- Vehicles ----

export async function getVehicles(): Promise<Vehicle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("vehicles").select("*");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapVehicle);
}

export async function getVehicle(id: string): Promise<Vehicle | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapVehicle(data) : undefined;
}

export async function getVehiclesForCustomer(
  customerId: string
): Promise<Vehicle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapVehicle);
}

// ---- Parts ----

export async function getParts(): Promise<Part[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("parts")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapPart);
}

// ---- Bookings ----

export async function getBookings(): Promise<Booking[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("date", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapBooking);
}

export async function getBookingsForCustomer(
  customerId: string
): Promise<Booking[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("customer_id", customerId);
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapBooking);
}

// ---- Job cards ----

export async function getJobCards(): Promise<JobCard[]> {
  const supabase = await createClient();
  const [{ data, error }, { data: invoiceLinks, error: invError }] =
    await Promise.all([
      supabase
        .from("job_cards")
        .select(JOB_CARD_SELECT)
        .order("created_at", { ascending: false }),
      supabase.from("invoices").select("id, job_id").not("job_id", "is", null),
    ]);
  if (error) throw new Error(error.message);
  if (invError) throw new Error(invError.message);

  const invoiceIdByJobId = new Map(
    (invoiceLinks ?? []).map((inv) => [inv.job_id as string, inv.id])
  );

  return (data ?? []).map((row) =>
    mapJobCard(row as JobCardRow, invoiceIdByJobId.get(row.id))
  );
}

export async function getJobsForCustomer(
  customerId: string
): Promise<JobCard[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_cards")
    .select(JOB_CARD_SELECT)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapJobCard(row as JobCardRow));
}

export async function getJob(id: string): Promise<JobCard | undefined> {
  const supabase = await createClient();
  const [{ data, error }, { data: invoiceLink }] = await Promise.all([
    supabase.from("job_cards").select(JOB_CARD_SELECT).eq("id", id).maybeSingle(),
    supabase.from("invoices").select("id").eq("job_id", id).maybeSingle(),
  ]);
  if (error) throw new Error(error.message);
  if (!data) return undefined;
  return mapJobCard(data as JobCardRow, invoiceLink?.id);
}

// ---- Invoices ----

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select(INVOICE_SELECT)
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapInvoice(row as InvoiceRow));
}

export async function getInvoicesForCustomer(
  customerId: string
): Promise<Invoice[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select(INVOICE_SELECT)
    .eq("customer_id", customerId)
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapInvoice(row as InvoiceRow));
}

export async function getInvoice(id: string): Promise<Invoice | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select(INVOICE_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapInvoice(data as InvoiceRow) : undefined;
}
