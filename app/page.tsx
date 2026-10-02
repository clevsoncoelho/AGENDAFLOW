import Link from "next/link";
import { ArrowRight, BarChart3, CalendarCheck2, Check, Clock3, Layers3, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

const features = [
  { icon: CalendarCheck2, title: "Agenda sem conflitos", text: "Disponibilidade, duração dos serviços e confirmações em um só lugar." },
  { icon: UsersRound, title: "Clientes mais próximos", text: "Histórico completo para entender, cuidar e fidelizar cada cliente." },
  { icon: BarChart3, title: "Decisões com clareza", text: "Indicadores simples para saber o que está funcionando no seu negócio." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-semibold text-ink-500 md:flex">
          <a href="#recursos" className="transition hover:text-ink-900">Recursos</a>
          <a href="#como-funciona" className="transition hover:text-ink-900">Como funciona</a>
          <a href="#seguranca" className="transition hover:text-ink-900">Segurança</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden px-3 py-2 text-sm font-bold text-ink-600 hover:text-ink-900 sm:block">Entrar</Link>
          <Link href="/signup"><Button size="sm">Começar agora <ArrowRight size={15} /></Button></Link>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-12 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="pointer-events-none absolute -right-48 -top-48 size-[600px] rounded-full bg-brand-50 blur-3xl" />
        <div className="relative grid items-center gap-14 lg:grid-cols-[1fr_0.92fr]">
          <div className="max-w-2xl animate-float-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700"><Sparkles size={14} /> Mais tempo para cuidar do seu negócio</div>
            <h1 className="text-balance text-5xl font-extrabold leading-[1.04] tracking-[-0.05em] text-ink-900 sm:text-6xl lg:text-7xl">Sua agenda no ritmo do seu <span className="text-brand-600">crescimento.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ink-500">O AgendaFlow organiza reservas, clientes e resultados para que você possa focar no que realmente importa: entregar uma experiência memorável.</p>
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"><Link href="/signup"><Button size="lg">Criar minha conta <ArrowRight size={18} /></Button></Link><span className="text-sm text-ink-400">Configuração em poucos minutos</span></div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-ink-600"><span className="flex items-center gap-2"><Check className="text-mint-600" size={17} /> Sem cartão de crédito</span><span className="flex items-center gap-2"><Check className="text-mint-600" size={17} /> Dados protegidos</span></div>
          </div>
          <div className="relative animate-float-in [animation-delay:120ms]">
            <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-brand-100/70 via-white to-mint-100/60 blur-2xl" />
            <div className="relative rounded-[2rem] border border-ink-100 bg-white p-3 shadow-soft">
              <div className="overflow-hidden rounded-[1.5rem] bg-ink-50">
                <div className="flex items-center justify-between border-b border-ink-100 bg-white px-5 py-4"><div><p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">Visão geral</p><p className="mt-1 text-lg font-extrabold text-ink-900">Bom dia, seu negócio</p></div><div className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600"><Sparkles size={17} /></div></div>
                <div className="grid grid-cols-2 gap-3 p-4"><MockMetric title="Hoje" value="24" detail="agendamentos" tone="blue" /><MockMetric title="Este mês" value="R$ 18,4k" detail="faturamento" tone="mint" /></div>
                <div className="mx-4 mb-4 rounded-2xl border border-ink-100 bg-white p-4"><div className="mb-4 flex items-center justify-between"><p className="text-xs font-bold text-ink-900">Próximos horários</p><span className="text-[10px] font-bold text-brand-600">Ver agenda</span></div>{["09:00  •  Corte + barba", "10:30  •  Design de sobrancelha", "13:00  •  Coloração"].map((item, i) => <div key={item} className="flex items-center gap-3 border-t border-ink-50 py-3 first:border-0 first:pt-0 last:pb-0"><div className={`size-2 rounded-full ${i === 0 ? "bg-brand-500" : i === 1 ? "bg-mint-500" : "bg-violet-500"}`} /><p className="text-xs font-semibold text-ink-700">{item}</p><span className="ml-auto text-[10px] text-ink-400">confirmado</span></div>)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="border-y border-ink-100 bg-ink-50/60 py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Tudo conectado</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">Uma operação mais leve, todos os dias.</h2></div><div className="mt-12 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-ink-100 bg-white p-7 shadow-card transition hover:-translate-y-1 hover:shadow-soft"><div className="mb-8 grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600"><Icon size={22} /></div><h3 className="text-lg font-bold text-ink-900">{title}</h3><p className="mt-3 text-sm leading-6 text-ink-500">{text}</p></article>)}</div></div></section>

      <section id="como-funciona" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Feito para quem faz acontecer</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">Do primeiro clique ao cliente satisfeito.</h2><p className="mt-5 max-w-lg leading-7 text-ink-500">Uma experiência simples para quem agenda e poderosa para quem administra. Personalize seus serviços, compartilhe seu link e acompanhe tudo.</p><div className="mt-8 space-y-4"><Step number="01" icon={Layers3} title="Configure seu espaço" text="Cadastre serviços, equipe e horários de atendimento." /><Step number="02" icon={Clock3} title="Compartilhe seu link" text="Seus clientes encontram os melhores horários em poucos cliques." /><Step number="03" icon={ShieldCheck} title="Acompanhe o crescimento" text="Tenha clareza dos seus números e decida com segurança." /></div></div><div id="seguranca" className="rounded-[2rem] bg-ink-900 p-8 text-white shadow-soft sm:p-12"><ShieldCheck className="text-brand-300" size={30} /><h3 className="mt-8 text-2xl font-bold">Seu negócio merece tranquilidade.</h3><p className="mt-4 leading-7 text-ink-300">Arquitetura preparada para crescimento, permissões por equipe e dados isolados por empresa desde a primeira linha de código.</p><div className="mt-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-7"><div><p className="text-3xl font-extrabold">100%</p><p className="mt-1 text-xs text-ink-300">dados sob seu controle</p></div><div><p className="text-3xl font-extrabold">24/7</p><p className="mt-1 text-xs text-ink-300">acesso à sua operação</p></div></div></div></section>

      <footer className="border-t border-ink-100"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-ink-400 sm:flex-row sm:items-center sm:justify-between lg:px-8"><Logo /><span>© 2026 AgendaFlow. Feito para negócios que cuidam.</span></div></footer>
    </main>
  );
}

function MockMetric({ title, value, detail, tone }: { title: string; value: string; detail: string; tone: "blue" | "mint" }) {
  return <div className={`rounded-2xl p-4 ${tone === "blue" ? "bg-brand-50" : "bg-mint-50"}`}><p className="text-[10px] font-bold uppercase tracking-wider text-ink-500">{title}</p><p className="mt-2 text-2xl font-extrabold text-ink-900">{value}</p><p className="mt-1 text-[10px] text-ink-500">{detail}</p></div>;
}

function Step({ number, icon: Icon, title, text }: { number: string; icon: typeof Layers3; title: string; text: string }) {
  return <div className="flex gap-4"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xs font-extrabold text-brand-600">{number}</div><div><div className="flex items-center gap-2"><Icon size={15} className="text-brand-500" /><h3 className="font-bold text-ink-900">{title}</h3></div><p className="mt-1 text-sm leading-6 text-ink-500">{text}</p></div></div>;
}
