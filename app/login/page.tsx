"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);
    if (!isSupabaseConfigured()) {
      setMessage("Ambiente ainda não conectado ao Supabase. Copie .env.example para .env.local e preencha as chaves.");
      setLoading(false);
      return;
    }
    const { createClient } = await import("@/lib/supabase/browser");
    const { error } = await createClient().auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) });
    if (error) setMessage(error.message);
    else router.push("/dashboard");
    setLoading(false);
  }

  return <main className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]"><section className="hidden bg-ink-900 p-10 text-white lg:flex lg:flex-col lg:justify-between"><Logo dark /><div className="max-w-md"><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">Bem-vindo de volta</p><h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight">Sua operação, <span className="text-brand-300">mais leve.</span></h1><p className="mt-6 leading-7 text-ink-300">Entre para acompanhar sua agenda, equipe e resultados em um único lugar.</p></div><p className="text-xs text-ink-400">AgendaFlow · Gestão inteligente de agendamentos</p></section><section className="flex items-center justify-center bg-ink-50 px-5 py-10"><div className="w-full max-w-md"><div className="mb-10 flex items-center justify-between lg:hidden"><Logo /><Link href="/" className="text-sm font-semibold text-ink-500"><ArrowLeft size={16} /></Link></div><Link href="/" className="mb-10 hidden items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900 lg:inline-flex"><ArrowLeft size={16} /> Voltar ao início</Link><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Acesso seguro</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900">Entrar na sua conta</h2><p className="mt-2 text-sm text-ink-500">Acompanhe tudo o que acontece no seu negócio.</p></div><form onSubmit={handleSubmit} className="mt-8 space-y-5"><Field label="E-mail"><div className="relative"><Mail size={17} className="absolute left-3.5 top-3.5 text-ink-400" /><Input name="email" type="email" required placeholder="voce@empresa.com" className="pl-10" /></div></Field><Field label="Senha" hint="Esqueceu sua senha?"><div className="relative"><LockKeyhole size={17} className="absolute left-3.5 top-3.5 text-ink-400" /><Input name="password" type={showPassword ? "text" : "password"} required placeholder="Sua senha" className="pl-10 pr-10" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 text-ink-400" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></Field>{message && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">{message}</p>}<Button type="submit" className="w-full" disabled={loading}>{loading ? "Entrando…" : <>Entrar na conta <ArrowRight size={16} /></>}</Button></form><p className="mt-8 text-center text-sm text-ink-500">Ainda não tem uma conta? <Link href="/signup" className="font-bold text-brand-600 hover:text-brand-700">Criar agora</Link></p></div></section></main>;
}
