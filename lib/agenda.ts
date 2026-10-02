import { isSupabaseConfigured } from "./supabase/env";
import type { Appointment } from "./types";

export type AgendaOption = { id: string; name: string };

export async function getAgendaData() {
  if (!isSupabaseConfigured()) return { appointments: [] as Appointment[], services: [] as AgendaOption[], staff: [] as AgendaOption[] };
  const { createClient } = await import("./supabase/server");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { appointments: [], services: [], staff: [] };
  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", auth.user.id).maybeSingle();
  if (!profile) return { appointments: [], services: [], staff: [] };
  const [{ data: appointments }, { data: services }, { data: staff }] = await Promise.all([
    supabase.from("appointments").select("id, starts_at, ends_at, status, total_amount, clients(name), services(name), staff(full_name)").eq("company_id", profile.company_id).order("starts_at"),
    supabase.from("services").select("id, name").eq("company_id", profile.company_id).eq("is_active", true).order("name"),
    supabase.from("staff").select("id, full_name").eq("company_id", profile.company_id).eq("is_active", true).order("full_name"),
  ]);
  const mapped = ((appointments ?? []) as unknown as Array<{ id: string; starts_at: string; ends_at: string; status: Appointment["status"]; total_amount: number; clients: { name: string } | null; services: { name: string } | null; staff: { full_name: string } | null }>).map((row) => ({ id: row.id, client_name: row.clients?.name ?? "Cliente", service_name: row.services?.name ?? "Serviço", staff_name: row.staff?.full_name ?? "Profissional", starts_at: row.starts_at, ends_at: row.ends_at, status: row.status, total_amount: Number(row.total_amount ?? 0) }));
  return { appointments: mapped, services: (services ?? []).map((item) => ({ id: item.id, name: item.name })), staff: (staff ?? []).map((item) => ({ id: item.id, name: item.full_name })) };
}
