import { isSupabaseConfigured } from "./supabase/env";
import type { Company } from "./types";

export type PublicService = { id: string; name: string; description: string | null; price: number; duration_minutes: number };
export type PublicStaff = { id: string; full_name: string; avatar_url: string | null };

export async function getPublicBookingData(slug: string) {
  if (!isSupabaseConfigured()) return { company: null as Company | null, services: [] as PublicService[], staff: [] as PublicStaff[] };
  const { createClient } = await import("./supabase/server");
  const supabase = await createClient();
  const { data: company } = await supabase.from("companies").select("id,name,slug,phone,email,logo_url,primary_color,timezone").eq("slug", slug).eq("is_active", true).maybeSingle();
  if (!company) return { company: null, services: [], staff: [] };
  const [{ data: services }, { data: staff }] = await Promise.all([
    supabase.from("services").select("id,name,description,price,duration_minutes").eq("company_id", company.id).eq("is_active", true).order("name"),
    supabase.from("staff").select("id,full_name,avatar_url").eq("company_id", company.id).eq("is_active", true).order("full_name"),
  ]);
  return { company: company as Company, services: (services ?? []) as PublicService[], staff: (staff ?? []) as PublicStaff[] };
}
