import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validations";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Este espaço ainda não está conectado ao sistema." }, { status: 503 });
  const parsed = bookingSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Confira os dados da reserva." }, { status: 400 });
  const { createClient } = await import("@/lib/supabase/server"); const supabase = await createClient();
  const { error } = await supabase.rpc("create_public_booking", { p_company_slug: parsed.data.companySlug, p_service_id: parsed.data.serviceId, p_staff_id: parsed.data.staffId, p_starts_at: parsed.data.startsAt, p_client_name: parsed.data.clientName, p_client_phone: parsed.data.clientPhone, p_client_email: parsed.data.clientEmail || null, p_notes: parsed.data.notes || null });
  if (error) return NextResponse.json({ error: error.code === "23P01" ? "Esse horário acabou de ser reservado. Escolha outro." : error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
