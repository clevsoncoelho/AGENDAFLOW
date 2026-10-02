"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, CalendarDays, ChevronDown, CircleHelp, LayoutDashboard, LogOut, Menu, Settings2, Sparkles, UsersRound, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/logo";
import { initials } from "@/lib/formatters";

const navGroups: { label: string; items: { href: Route; label: string; icon: typeof LayoutDashboard }[] }[] = [
  { label: "Visão geral", items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Operação", items: [{ href: "/dashboard/agenda", label: "Agenda", icon: CalendarDays }, { href: "/dashboard/clients", label: "Clientes", icon: UsersRound }, { href: "/dashboard/services", label: "Serviços", icon: Sparkles }] },
  { label: "Acompanhe", items: [{ href: "/dashboard/reports", label: "Relatórios", icon: BarChart3 }, { href: "/dashboard/settings", label: "Configurações", icon: Settings2 }] },
];

export function DashboardShell({ children, companyName, profileName, profileRole }: { children: React.ReactNode; companyName?: string; profileName?: string; profileRole?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function signOut() {
    const { createClient } = await import("@/lib/supabase/browser");
    await createClient().auth.signOut();
    router.push("/login");
  }

  return <div className="min-h-screen bg-ink-50/70"><aside className={cn("fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-ink-100 bg-white px-5 py-6 transition-transform duration-300 lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}><div className="flex items-center justify-between px-2"><Logo /><button onClick={() => setMobileOpen(false)} className="grid size-9 place-items-center rounded-xl text-ink-400 hover:bg-ink-50 lg:hidden" aria-label="Fechar menu"><X size={18} /></button></div><div className="mt-9 rounded-2xl border border-brand-100 bg-brand-50/60 p-3"><p className="px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600">Seu espaço</p><div className="mt-2 flex items-center gap-2.5"><div className="grid size-9 place-items-center rounded-xl bg-white text-sm font-bold text-brand-600 shadow-sm">{initials(companyName ?? "AF")}</div><div className="min-w-0"><p className="truncate text-sm font-bold text-ink-900">{companyName ?? "Configure seu espaço"}</p><p className="text-[11px] text-ink-500">Plano profissional</p></div><ChevronDown className="ml-auto shrink-0 text-brand-500" size={15} /></div></div><nav className="mt-8 flex-1 space-y-7">{navGroups.map((group) => <div key={group.label}><p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-400">{group.label}</p><div className="space-y-1">{group.items.map(({ href, label, icon: Icon }) => { const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href); return <Link onClick={() => setMobileOpen(false)} key={href} href={href} className={cn("group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition", active ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" : "text-ink-500 hover:bg-ink-50 hover:text-ink-900")}><Icon size={17} className={cn(active ? "text-white" : "text-ink-400 group-hover:text-brand-600")} />{label}{label === "Agenda" && <span className={cn("ml-auto rounded-full px-2 py-0.5 text-[10px]", active ? "bg-white/20 text-white" : "bg-brand-50 text-brand-600")}>Live</span>}</Link>})}</div></div>)}</nav><div className="border-t border-ink-100 pt-4"><Link href="/dashboard/help" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-500 hover:bg-ink-50 hover:text-ink-900"><CircleHelp size={17} className="text-ink-400" /> Central de ajuda</Link><button onClick={signOut} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-500 hover:bg-red-50 hover:text-red-600"><LogOut size={17} className="text-ink-400" /> Sair da conta</button></div></aside><div className="lg:pl-72"><header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-ink-100 bg-white/85 px-5 backdrop-blur-xl lg:px-8"><button onClick={() => setMobileOpen(true)} className="grid size-10 place-items-center rounded-xl text-ink-500 hover:bg-ink-50 lg:hidden" aria-label="Abrir menu"><Menu size={20} /></button><div className="hidden lg:block"><p className="text-xs font-semibold text-ink-400">{new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</p></div><div className="flex items-center gap-3"><button className="hidden rounded-xl border border-ink-100 bg-white px-3 py-2 text-xs font-bold text-ink-600 shadow-sm hover:border-brand-200 sm:inline-flex sm:items-center sm:gap-2"><Sparkles size={15} className="text-brand-500" /> Novidades</button><div className="mx-1 h-7 w-px bg-ink-100" /><div className="flex items-center gap-2.5"><div className="grid size-9 place-items-center rounded-full bg-ink-900 text-xs font-extrabold text-white">{initials(profileName ?? "Você")}</div><div className="hidden sm:block"><p className="text-xs font-bold text-ink-900">{profileName ?? "Sua conta"}</p><p className="text-[10px] capitalize text-ink-400">{profileRole ?? "Administrador"}</p></div></div></div></header><main className="mx-auto max-w-[1480px] px-5 py-7 lg:px-8 lg:py-9">{children}</main></div>{mobileOpen && <button className="fixed inset-0 z-30 bg-ink-900/20 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" />}</div>;
}
