"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./server";
import { getCurrentGarageId } from "./garage";
import type {
  EmployeeRole,
  InvoiceStatus,
  JobPriority,
  JobStatus,
  JobType,
} from "@/lib/types";
import { JOB_TYPE_LABELS } from "@/lib/job-types";

export interface MutationResult {
  error?: string;
}

export async function addCustomer(input: {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  postCode: string;
  vehicleRegistration?: string;
}): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { data: customer, error } = await supabase
    .from("customers")
    .insert({
      garage_id: garageId,
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      address_line: input.addressLine,
      city: input.city,
      post_code: input.postCode,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  const registration = input.vehicleRegistration?.trim();
  if (registration) {
    const { error: vehicleError } = await supabase.from("vehicles").insert({
      garage_id: garageId,
      customer_id: customer.id,
      registration: registration.toUpperCase(),
    });
    if (vehicleError) return { error: vehicleError.message };
  }

  revalidatePath("/customers");
  revalidatePath("/");
  return {};
}

export async function updateCustomer(
  id: string,
  input: {
    fullName: string;
    email: string;
    phone: string;
    addressLine: string;
    city: string;
    postCode: string;
    notes?: string;
  }
): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { error } = await supabase
    .from("customers")
    .update({
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      address_line: input.addressLine,
      city: input.city,
      post_code: input.postCode,
      notes: input.notes || null,
    })
    .eq("id", id)
    .eq("garage_id", garageId);

  if (error) return { error: error.message };

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  return {};
}

export async function addBooking(input: {
  customerId: string;
  jobType: JobType;
  date: string;
  estPrice?: number;
  priority?: JobPriority;
  notes?: string;
}): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      garage_id: garageId,
      customer_id: input.customerId,
      job_type: input.jobType,
      date: input.date,
      est_price: input.estPrice ?? null,
      notes: input.notes || null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // A booking always creates its job card so the job moves through the
  // workshop board (booked -> in progress -> ... -> invoiced) from here.
  const { error: jobError } = await supabase.from("job_cards").insert({
    garage_id: garageId,
    booking_id: booking.id,
    customer_id: input.customerId,
    status: "booked",
    priority: input.priority ?? "medium",
    description: JOB_TYPE_LABELS[input.jobType],
    due_date: input.date,
    notes: input.notes || null,
  });

  if (jobError) return { error: jobError.message };

  revalidatePath("/diary");
  revalidatePath("/jobs");
  revalidatePath("/");
  return {};
}

export async function updateJobStatus(
  id: string,
  status: JobStatus
): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { error } = await supabase
    .from("job_cards")
    .update({ status })
    .eq("id", id)
    .eq("garage_id", garageId);

  if (error) return { error: error.message };

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);
  revalidatePath("/");
  return {};
}

export async function updateJobPriority(
  id: string,
  priority: JobPriority
): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { error } = await supabase
    .from("job_cards")
    .update({ priority })
    .eq("id", id)
    .eq("garage_id", garageId);

  if (error) return { error: error.message };

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);
  revalidatePath("/");
  return {};
}

export interface InvoiceInput {
  customerId: string;
  vehicleId: string;
  invoiceDate: string;
  dueDate: string;
  vatRate: number;
  status?: InvoiceStatus;
  notes?: string;
  lineItems: { description: string; quantity: number; unitPrice: number }[];
}

export async function addInvoice(input: InvoiceInput): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      garage_id: garageId,
      customer_id: input.customerId,
      vehicle_id: input.vehicleId || null,
      date: input.invoiceDate,
      due_date: input.dueDate,
      vat_rate: input.vatRate,
      status: input.status,
      notes: input.notes || null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  const lineItems = input.lineItems.filter((li) => li.description.trim());
  if (lineItems.length > 0) {
    const { error: lineItemsError } = await supabase
      .from("invoice_line_items")
      .insert(
        lineItems.map((li) => ({
          garage_id: garageId,
          invoice_id: invoice.id,
          description: li.description,
          quantity: li.quantity,
          unit_price: li.unitPrice,
        }))
      );
    if (lineItemsError) return { error: lineItemsError.message };
  }

  revalidatePath("/invoices");
  revalidatePath("/");
  return {};
}

export async function updateInvoice(
  id: string,
  input: InvoiceInput
): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { error } = await supabase
    .from("invoices")
    .update({
      customer_id: input.customerId,
      vehicle_id: input.vehicleId || null,
      date: input.invoiceDate,
      due_date: input.dueDate,
      vat_rate: input.vatRate,
      status: input.status,
      notes: input.notes || null,
    })
    .eq("id", id)
    .eq("garage_id", garageId);

  if (error) return { error: error.message };

  const { error: deleteError } = await supabase
    .from("invoice_line_items")
    .delete()
    .eq("invoice_id", id)
    .eq("garage_id", garageId);

  if (deleteError) return { error: deleteError.message };

  const lineItems = input.lineItems.filter((li) => li.description.trim());
  if (lineItems.length > 0) {
    const { error: lineItemsError } = await supabase
      .from("invoice_line_items")
      .insert(
        lineItems.map((li) => ({
          garage_id: garageId,
          invoice_id: id,
          description: li.description,
          quantity: li.quantity,
          unit_price: li.unitPrice,
        }))
      );
    if (lineItemsError) return { error: lineItemsError.message };
  }

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${id}`);
  revalidatePath("/");
  return {};
}

export async function convertEstimateToInvoice(id: string): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { error } = await supabase
    .from("invoices")
    .update({ status: "sent" })
    .eq("id", id)
    .eq("garage_id", garageId)
    .eq("status", "estimate");

  if (error) return { error: error.message };

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${id}`);
  revalidatePath("/");
  return {};
}

export interface PartInput {
  sku: string;
  name: string;
  supplier?: string;
  category?: string;
  stockLevel: number;
  reorderLevel: number;
  costPrice: number;
  sellPrice: number;
}

export async function addPart(input: PartInput): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { error } = await supabase.from("parts").insert({
    garage_id: garageId,
    sku: input.sku,
    name: input.name,
    supplier: input.supplier || null,
    category: input.category || null,
    stock_level: input.stockLevel,
    reorder_level: input.reorderLevel,
    cost_price: input.costPrice,
    sell_price: input.sellPrice,
  });

  if (error) return { error: error.message };

  revalidatePath("/inventory");
  revalidatePath("/");
  return {};
}

export async function updatePart(
  id: string,
  input: PartInput
): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { error } = await supabase
    .from("parts")
    .update({
      sku: input.sku,
      name: input.name,
      supplier: input.supplier || null,
      category: input.category || null,
      stock_level: input.stockLevel,
      reorder_level: input.reorderLevel,
      cost_price: input.costPrice,
      sell_price: input.sellPrice,
    })
    .eq("id", id)
    .eq("garage_id", garageId);

  if (error) return { error: error.message };

  revalidatePath("/inventory");
  revalidatePath("/");
  return {};
}

export interface EmployeeInput {
  fullName: string;
  role: EmployeeRole;
  email?: string;
  phone?: string;
  hourlyRate: number;
  active: boolean;
}

export async function addEmployee(input: EmployeeInput): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { error } = await supabase.from("employees").insert({
    garage_id: garageId,
    full_name: input.fullName,
    role: input.role,
    email: input.email || null,
    phone: input.phone || null,
    hourly_rate: input.hourlyRate,
    active: input.active,
  });

  if (error) return { error: error.message };

  revalidatePath("/employees");
  return {};
}

export async function updateEmployee(
  id: string,
  input: EmployeeInput
): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { error } = await supabase
    .from("employees")
    .update({
      full_name: input.fullName,
      role: input.role,
      email: input.email || null,
      phone: input.phone || null,
      hourly_rate: input.hourlyRate,
      active: input.active,
    })
    .eq("id", id)
    .eq("garage_id", garageId);

  if (error) return { error: error.message };

  revalidatePath("/employees");
  return {};
}

export interface ReminderInput {
  customerId?: string;
  vehicleId?: string;
  title: string;
  dueDate: string;
  notes?: string;
}

export async function addReminder(input: ReminderInput): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { error } = await supabase.from("reminders").insert({
    garage_id: garageId,
    customer_id: input.customerId || null,
    vehicle_id: input.vehicleId || null,
    title: input.title,
    due_date: input.dueDate,
    notes: input.notes || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/reminders");
  revalidatePath("/");
  return {};
}

export async function toggleReminderDone(
  id: string,
  done: boolean
): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { error } = await supabase
    .from("reminders")
    .update({ done })
    .eq("id", id)
    .eq("garage_id", garageId);

  if (error) return { error: error.message };

  revalidatePath("/reminders");
  revalidatePath("/");
  return {};
}

export async function deleteReminder(id: string): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  const { error } = await supabase
    .from("reminders")
    .delete()
    .eq("id", id)
    .eq("garage_id", garageId);

  if (error) return { error: error.message };

  revalidatePath("/reminders");
  revalidatePath("/");
  return {};
}

export interface GarageSettingsInput {
  garageName: string;
  addressLine: string;
  city: string;
  postCode: string;
  vatNumber: string;
  defaultVatRate: number;
  invoicePrefix: string;
}

export async function updateGarageSettings(
  id: string,
  input: GarageSettingsInput
): Promise<MutationResult> {
  const supabase = await createClient();
  const garageId = await getCurrentGarageId();

  if (id !== garageId) {
    return { error: "You can only edit the currently selected garage." };
  }

  const payload = {
    garage_name: input.garageName,
    address_line: input.addressLine,
    city: input.city,
    post_code: input.postCode,
    vat_number: input.vatNumber,
    default_vat_rate: input.defaultVatRate,
    invoice_prefix: input.invoicePrefix,
  };

  const { error } = await supabase
    .from("garage_settings")
    .update(payload)
    .eq("id", garageId);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/");
  return {};
}
