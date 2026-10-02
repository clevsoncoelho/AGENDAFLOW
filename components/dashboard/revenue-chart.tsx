"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/formatters";

export function RevenueChart({ data }: { data: { label: string; revenue: number; appointments: number }[] }) {
  if (!data.length) return <div className="grid h-64 place-items-center rounded-2xl bg-ink-50/60 text-center"><div><p className="text-sm font-semibold text-ink-600">Seu gráfico aparecerá aqui</p><p className="mt-1 text-xs text-ink-400">Assim que houver atendimentos concluídos</p></div></div>;
  return <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}><CartesianGrid stroke="#eef1f5" vertical={false} /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#7587a3", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#7587a3", fontSize: 11 }} tickFormatter={(value) => `R$${value}`} /><Tooltip cursor={{ fill: "#f5f7fb" }} formatter={(value, name) => [name === "revenue" ? formatCurrency(Number(value)) : value, name === "revenue" ? "Faturamento" : "Agendamentos"]} contentStyle={{ border: "1px solid #e7ebf2", borderRadius: 12, boxShadow: "0 8px 24px rgba(32,54,109,.08)" }} /><Bar dataKey="revenue" fill="#3574ef" radius={[5, 5, 0, 0]} barSize={18} /></BarChart></ResponsiveContainer></div>;
}
