import { isSupabaseConfigured } from "./supabase/env";

export type ClientRow = { id: string; name: string; phone: string | null; email: string | null; notes: string | null; created_at: string; appointments_count?: number };

export async function getClients() {
  if (!isSupabaseConfigured()) return [] as ClientRow[];
  const { createClient } = await import("./supabase/server");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];
  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", auth.user.id).maybeSingle();
  if (!profile) return [];
  const { data } = await supabase.from("clients").select("id,name,phone,email,notes,created_at").eq("company_id", profile.company_id).order("created_at", { ascending: false });
  return (data ?? []) as ClientRow[];
}
