import { isSupabaseConfigured } from "./supabase/env";

export type ServiceRow = { id: string; name: string; description: string | null; price: number; duration_minutes: number; is_active: boolean };

export async function getServices() {
  if (!isSupabaseConfigured()) return [] as ServiceRow[];
  const { createClient } = await import("./supabase/server");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];
  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", auth.user.id).maybeSingle();
  if (!profile) return [];
  const { data } = await supabase.from("services").select("id,name,description,price,duration_minutes,is_active").eq("company_id", profile.company_id).order("name");
  return (data ?? []) as ServiceRow[];
}
