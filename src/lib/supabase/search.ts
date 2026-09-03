"use server";

import { createClient } from "./server";
import { getCurrentGarageId } from "./garage";

export interface CustomerSearchResult {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  postCode: string;
  matchedVehicle?: string;
}

function escapeForOr(value: string): string {
  // Supabase's .or() filter string splits on "," and treats "%"/"*" as
  // wildcards inside ilike patterns — strip characters that would let a
  // typed query break out of its own filter clause or match everything.
  return value.replace(/[,%*]/g, " ").trim();
}

export async function searchCustomers(term: string): Promise<CustomerSearchResult[]> {
  const query = escapeForOr(term);
  if (query.length < 2) return [];

  const supabase = await createClient();
  const garageId = await getCurrentGarageId();
  const like = `%${query}%`;

  const [customersRes, vehiclesRes] = await Promise.all([
    supabase
      .from("customers")
      .select("id, full_name, email, phone, city, post_code")
      .eq("garage_id", garageId)
      .eq("archived", false)
      .or(
        `full_name.ilike.${like},email.ilike.${like},phone.ilike.${like},city.ilike.${like},post_code.ilike.${like},address_line.ilike.${like}`
      )
      .limit(8),
    supabase
      .from("vehicles")
      .select("customer_id, registration")
      .eq("garage_id", garageId)
      .ilike("registration", like)
      .limit(8),
  ]);

  if (customersRes.error) throw new Error(customersRes.error.message);
  if (vehiclesRes.error) throw new Error(vehiclesRes.error.message);

  const results = new Map<string, CustomerSearchResult>();

  for (const c of customersRes.data ?? []) {
    results.set(c.id, {
      id: c.id,
      name: c.full_name,
      email: c.email,
      phone: c.phone,
      city: c.city,
      postCode: c.post_code,
    });
  }

  const vehicleMatches = vehiclesRes.data ?? [];
  const missingIds = vehicleMatches
    .map((v) => v.customer_id)
    .filter((id) => !results.has(id));

  if (missingIds.length > 0) {
    const { data: extraCustomers, error } = await supabase
      .from("customers")
      .select("id, full_name, email, phone, city, post_code")
      .eq("garage_id", garageId)
      .eq("archived", false)
      .in("id", missingIds);
    if (error) throw new Error(error.message);
    for (const c of extraCustomers ?? []) {
      results.set(c.id, {
        id: c.id,
        name: c.full_name,
        email: c.email,
        phone: c.phone,
        city: c.city,
        postCode: c.post_code,
      });
    }
  }

  for (const v of vehicleMatches) {
    const entry = results.get(v.customer_id);
    if (entry && !entry.matchedVehicle) entry.matchedVehicle = v.registration;
  }

  return Array.from(results.values()).slice(0, 8);
}
