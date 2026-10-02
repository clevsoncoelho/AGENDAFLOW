import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const fallbackSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

export async function GET(request: Request) {
  const url = new URL(request.url); const slug = url.searchParams.get("slug"); const serviceId = url.searchParams.get("serviceId"); const staffId = url.searchParams.get("staffId"); const date = url.searchParams.get("date");
  if (!isSupabaseConfigured() || !slug || !serviceId || !staffId || !date) return NextResponse.json({ slots: [] });
  const { createClient } = await import("@/lib/supabase/server"); const supabase = await createClient();
  const { data: company } = await supabase.from("companies").select("id").eq("slug", slug).eq("is_active", true).maybeSingle(); if (!company) return NextResponse.json({ slots: [] });
  const day = new Date(`${date}T12:00:00`); const dayOfWeek = day.getDay();
  const { data: availability } = await supabase.from("staff_availability").select("starts_at,ends_at").eq("staff_id", staffId).eq("day_of_week", dayOfWeek).eq("is_active", true).maybeSingle();
  if (!availability) return NextResponse.json({ slots: [] });
  const start = new Date(`${date}T00:00:00`); const end = new Date(`${date}T23:59:59`);
  const { data: booked } = await supabase.from("appointments").select("starts_at,ends_at").eq("company_id", company.id).eq("staff_id", staffId).gte("starts_at", start.toISOString()).lte("starts_at", end.toISOString()).neq("status", "cancelled");
  const busy = (booked ?? []).map((item) => new Date(item.starts_at).toISOString().slice(11, 16));
  const slots = fallbackSlots.filter((slot) => !busy.includes(slot));
  return NextResponse.json({ slots });
}
