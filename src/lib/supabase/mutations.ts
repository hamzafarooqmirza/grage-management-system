"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./server";
import type { JobType } from "@/lib/types";

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

export async function addBooking(input: {
  customerId: string;
  jobType: JobType;
  date: string;
  estPrice?: number;
  notes?: string;
}): Promise<MutationResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("bookings").insert({
    customer_id: input.customerId,
    job_type: input.jobType,
    date: input.date,
    est_price: input.estPrice ?? null,
    notes: input.notes || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/diary");
  revalidatePath("/");
  return {};
}

export async function addInvoice(input: {
  customerId: string;
  vehicleId: string;
  invoiceDate: string;
  dueDate: string;
  vatRate: number;
  notes?: string;
  lineItems: { description: string; quantity: number; unitPrice: number }[];
}): Promise<MutationResult> {
  const supabase = await createClient();

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      customer_id: input.customerId,
      vehicle_id: input.vehicleId || null,
      date: input.invoiceDate,
      due_date: input.dueDate,
      vat_rate: input.vatRate,
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
