import { isSupabaseConfigured } from "./supabase/env";
import type { Appointment, Company, DashboardMetric, Profile } from "./types";

export type DashboardData = {
  company: Company | null;
  profile: Profile | null;
  metrics: DashboardMetric[];
  todayAppointments: Appointment[];
  chart: { label: string; revenue: number; appointments: number }[];
};

const emptyDashboard: DashboardData = {
  company: null,
  profile: null,
  metrics: [
    { label: "Agendamentos hoje", value: "—", description: "Conecte o Supabase para carregar", tone: "blue" },
    { label: "Clientes ativos", value: "—", description: "Dados do seu espaço", tone: "mint" },
    { label: "Faturamento do mês", value: "—", description: "Atualizado em tempo real", tone: "violet" },
    { label: "Taxa de retorno", value: "—", description: "Baseado no histórico", tone: "amber" },
  ],
  todayAppointments: [],
  chart: [],
};

export async function getDashboardData(): Promise<DashboardData> {
  if (!isSupabaseConfigured()) return emptyDashboard;

  const { createClient } = await import("./supabase/server");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return emptyDashboard;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle();
  if (!profile) return emptyDashboard;

  const [{ data: company }, { count: clientsCount }, { data: appointments }] = await Promise.all([
    supabase.from("companies").select("*").eq("id", profile.company_id).maybeSingle(),
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("company_id", profile.company_id),
    supabase
      .from("appointments")
      .select("id, starts_at, ends_at, status, total_amount, clients(name), services(name), staff(full_name)")
      .eq("company_id", profile.company_id)
      .order("starts_at", { ascending: true })
      .limit(100),
  ]);

  const rows = (appointments ?? []) as unknown as Array<{
    id: string;
    starts_at: string;
    ends_at: string;
    status: Appointment["status"];
    total_amount: number;
    clients: { name: string } | null;
    services: { name: string } | null;
    staff: { full_name: string } | null;
  }>;

  const today = new Date();
  const todayAppointments = rows
    .filter((row) => {
      const date = new Date(row.starts_at);
      return date.toDateString() === today.toDateString() && row.status !== "cancelled";
    })
    .map((row) => ({
      id: row.id,
      client_name: row.clients?.name ?? "Cliente sem nome",
      service_name: row.services?.name ?? "Serviço",
      staff_name: row.staff?.full_name ?? "Profissional",
      starts_at: row.starts_at,
      ends_at: row.ends_at,
      status: row.status,
      total_amount: Number(row.total_amount ?? 0),
    }));

  const monthRevenue = rows
    .filter((row) => row.status === "completed")
    .reduce((total, row) => total + Number(row.total_amount ?? 0), 0);

  return {
    company: company as Company | null,
    profile: profile as Profile,
    metrics: [
      { label: "Agendamentos hoje", value: String(todayAppointments.length), description: "Na agenda de hoje", tone: "blue" },
      { label: "Clientes ativos", value: String(clientsCount ?? 0), description: "Cadastrados no espaço", tone: "mint" },
      { label: "Faturamento do mês", value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(monthRevenue), description: "Atendimentos concluídos", tone: "violet" },
      { label: "Taxa de retorno", value: "—", description: "Será calculada com o histórico", tone: "amber" },
    ],
    todayAppointments,
    chart: [],
  };
}
