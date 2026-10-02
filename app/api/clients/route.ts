import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const schema = z.object({ name: z.string().min(2), phone: z.string().min(8), email: z.string().email().optional().or(z.literal("")), notes: z.string().max(1000).optional() });

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase ainda não está configurado." }, { status: 503 });
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
  const { createClient } = await import("@/lib/supabase/server"); const supabase = await createClient(); const { data: auth } = await supabase.auth.getUser(); if (!auth.user) return NextResponse.json({ error: "Faça login para cadastrar clientes." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", auth.user.id).maybeSingle(); if (!profile) return NextResponse.json({ error: "Perfil não encontrado." }, { status: 403 });
  const { error } = await supabase.from("clients").insert({ company_id: profile.company_id, name: parsed.data.name, phone: parsed.data.phone, email: parsed.data.email || null, notes: parsed.data.notes || null }); if (error) return NextResponse.json({ error: error.code === "23505" ? "Já existe um cliente com este telefone." : error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
