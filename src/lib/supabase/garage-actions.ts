"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "./server";
import { GARAGE_COOKIE, getUserGarages } from "./garage";
import type { MutationResult } from "./mutations";

export async function switchGarage(garageId: string): Promise<MutationResult> {
  const garages = await getUserGarages();
  if (!garages.some((g) => g.id === garageId)) {
    return { error: "You are not a member of that garage." };
  }

  const cookieStore = await cookies();
  cookieStore.set(GARAGE_COOKIE, garageId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/");
  return {};
}

export async function createGarage(name: string): Promise<MutationResult> {
  const garageName = name.trim();
  if (!garageName) return { error: "Garage name is required." };

  const supabase = await createClient();

  // Creating the garage and adding its founding owner membership has to
  // happen atomically in one security-definer call: there is no RLS-safe
  // way to do it as two plain client inserts (see create_garage_with_owner
  // in the migration for why).
  const { data: garageId, error } = await supabase.rpc("create_garage_with_owner", {
    p_garage_name: garageName,
  });
  if (error) return { error: error.message };

  const cookieStore = await cookies();
  cookieStore.set(GARAGE_COOKIE, garageId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/");
  return {};
}
