"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./server";
import type { InvoiceStatus, JobPriority, JobStatus, JobType } from "@/lib/types";
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

  const { data: customer, error } = await supabase
    .from("customers")
    .insert({
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
    .eq("id", id);

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

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
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

  const { error } = await supabase
    .from("job_cards")
    .update({ status })
    .eq("id", id);

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

  const { error } = await supabase
    .from("job_cards")
    .update({ priority })
    .eq("id", id);

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

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
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
    .eq("id", id);

  if (error) return { error: error.message };

  const { error: deleteError } = await supabase
    .from("invoice_line_items")
    .delete()
    .eq("invoice_id", id);

  if (deleteError) return { error: deleteError.message };

  const lineItems = input.lineItems.filter((li) => li.description.trim());
  if (lineItems.length > 0) {
    const { error: lineItemsError } = await supabase
      .from("invoice_line_items")
      .insert(
        lineItems.map((li) => ({
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

  const { error } = await supabase
    .from("invoices")
    .update({ status: "sent" })
    .eq("id", id)
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

  const { error } = await supabase.from("parts").insert({
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
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/inventory");
  revalidatePath("/");
  return {};
}
