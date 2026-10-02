# AgendaFlow

SaaS de agendamentos para pequenos e médios negócios, construído com Next.js, TypeScript, Tailwind CSS, Supabase, Lucide e Recharts.

## Rodando localmente

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Preencha `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (a chave `anon` antiga também é aceita). Depois execute `supabase/migrations/001_initial_schema.sql` no SQL Editor do seu projeto Supabase.

## Validação

```bash
npm run lint
npm run typecheck
npm run build
```

O app funciona em modo de configuração sem credenciais, mostrando estados vazios e orientações. Dados de negócio não são inseridos como seed fictício.
