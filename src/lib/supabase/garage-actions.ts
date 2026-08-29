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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: garage, error } = await supabase
    .from("garage_settings")
    .insert({ garage_name: garageName })
    .select("id")
    .single();
  if (error) return { error: error.message };

  const { error: memberError } = await supabase
    .from("garage_members")
    .insert({ garage_id: garage.id, user_id: user.id, role: "owner" });
  if (memberError) return { error: memberError.message };

  const cookieStore = await cookies();
  cookieStore.set(GARAGE_COOKIE, garage.id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/");
  return {};
}
