"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { signUpSchema } from "@/lib/validations";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function SignupPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(null); setSuccess(false); setLoading(true);
    const form = new FormData(event.currentTarget);
    const result = signUpSchema.safeParse(Object.fromEntries(form.entries()));
    if (!result.success) { setMessage(result.error.issues[0]?.message ?? "Confira os campos."); setLoading(false); return; }
    if (!isSupabaseConfigured()) { setMessage("Ambiente ainda não conectado ao Supabase. Preencha o arquivo .env.local para criar sua conta."); setLoading(false); return; }
    const { createClient } = await import("@/lib/supabase/browser");
    const { error } = await createClient().auth.signUp({ email: result.data.email, password: result.data.password, options: { data: { full_name: result.data.fullName, company_name: result.data.companyName, company_slug: result.data.companySlug } } });
    if (error) setMessage(error.message); else setSuccess(true);
    setLoading(false);
  }

  return <main className="min-h-screen bg-ink-50 px-5 py-8"><div className="mx-auto max-w-5xl"><div className="flex items-center justify-between"><Logo /><Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900"><ArrowLeft size={16} /> Já tenho uma conta</Link></div><div className="mx-auto mt-12 max-w-xl rounded-3xl border border-ink-100 bg-white p-6 shadow-soft sm:p-10"><div className="text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Comece gratuitamente</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900">Crie seu espaço no AgendaFlow</h1><p className="mt-2 text-sm text-ink-500">Configure sua operação e compartilhe seu link de reservas.</p></div>{success ? <div className="py-12 text-center"><div className="mx-auto grid size-14 place-items-center rounded-full bg-mint-50 text-mint-600"><CheckCircle2 size={28} /></div><h2 className="mt-5 text-xl font-bold text-ink-900">Confira seu e-mail</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-500">Enviamos um link de confirmação. Depois disso, você poderá acessar seu painel.</p><Link href="/login"><Button className="mt-6">Ir para o login</Button></Link></div> : <form onSubmit={handleSubmit} className="mt-8 space-y-5"><div className="grid gap-5 sm:grid-cols-2"><Field label="Seu nome"><div className="relative"><UserRound size={17} className="absolute left-3.5 top-3.5 text-ink-400" /><Input name="fullName" required placeholder="Seu nome completo" className="pl-10" /></div></Field><Field label="Nome da empresa"><div className="relative"><Building2 size={17} className="absolute left-3.5 top-3.5 text-ink-400" /><Input name="companyName" required placeholder="Ex.: Studio Aurora" className="pl-10" /></div></Field></div><Field label="Link público" hint="agenda-flow.com/book/..."><div className="flex"><span className="inline-flex h-11 items-center rounded-l-xl border border-r-0 border-ink-200 bg-ink-50 px-3 text-xs text-ink-500">/book/</span><Input name="companySlug" required placeholder="studio-aurora" className="rounded-l-none" /></div></Field><Field label="E-mail"><div className="relative"><Mail size={17} className="absolute left-3.5 top-3.5 text-ink-400" /><Input name="email" type="email" required placeholder="voce@empresa.com" className="pl-10" /></div></Field><Field label="Senha"><div className="relative"><LockKeyhole size={17} className="absolute left-3.5 top-3.5 text-ink-400" /><Input name="password" type="password" required placeholder="Mínimo de 8 caracteres" className="pl-10" /></div></Field>{message && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">{message}</p>}<Button type="submit" className="w-full" disabled={loading}>{loading ? "Criando seu espaço…" : <>Criar minha conta <ArrowRight size={16} /></>}</Button><p className="text-center text-xs leading-5 text-ink-400">Ao continuar, você concorda com nossos termos de uso e política de privacidade.</p></form>}</div></div></main>;
}
