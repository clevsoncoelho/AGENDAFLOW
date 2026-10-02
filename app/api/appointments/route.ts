import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const schema = z.object({ clientName: z.string().min(2), clientPhone: z.string().min(8), serviceId: z.string().uuid(), staffId: z.string().uuid(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), time: z.string().regex(/^\d{2}:\d{2}$/), notes: z.string().optional() });

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase ainda não está configurado." }, { status: 503 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Faça login para criar agendamentos." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", auth.user.id).maybeSingle();
  if (!profile) return NextResponse.json({ error: "Perfil não encontrado." }, { status: 403 });
  const { data: client, error: clientError } = await supabase.from("clients").upsert({ company_id: profile.company_id, name: parsed.data.clientName, phone: parsed.data.clientPhone }, { onConflict: "company_id,phone" }).select("id").single();
  if (clientError || !client) return NextResponse.json({ error: clientError?.message ?? "Não foi possível salvar o cliente." }, { status: 400 });
  const { data: service } = await supabase.from("services").select("price,duration_minutes").eq("id", parsed.data.serviceId).eq("company_id", profile.company_id).single();
  if (!service) return NextResponse.json({ error: "Serviço não encontrado." }, { status: 404 });
  const startsAt = new Date(`${parsed.data.date}T${parsed.data.time}:00`).toISOString();
  const endsAt = new Date(new Date(startsAt).getTime() + service.duration_minutes * 60_000).toISOString();
  const { error } = await supabase.from("appointments").insert({ company_id: profile.company_id, client_id: client.id, service_id: parsed.data.serviceId, staff_id: parsed.data.staffId, starts_at: startsAt, ends_at: endsAt, total_amount: service.price, notes: parsed.data.notes ?? null, status: "scheduled" });
  if (error) return NextResponse.json({ error: error.code === "23P01" ? "Este profissional já possui um agendamento nesse horário." : error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
