-- AgendaFlow: schema inicial multiempresa
-- Execute este arquivo no SQL Editor do Supabase.

create extension if not exists pgcrypto;
create extension if not exists btree_gist;

create type public.app_role as enum ('owner', 'admin', 'staff');
create type public.appointment_status as enum ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete restrict,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  phone text,
  email text,
  logo_url text,
  primary_color text not null default '#3574ef',
  timezone text not null default 'America/Sao_Paulo',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  full_name text not null,
  role public.app_role not null default 'staff',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staff (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid unique references auth.users(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  phone text not null,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, phone)
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null default 0 check (price >= 0),
  duration_minutes integer not null check (duration_minutes > 0 and duration_minutes <= 1440),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staff_services (
  staff_id uuid not null references public.staff(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  primary key (staff_id, service_id)
);

create table public.staff_availability (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  starts_at time not null,
  ends_at time not null,
  is_active boolean not null default true,
  check (starts_at < ends_at),
  unique (staff_id, day_of_week, starts_at, ends_at)
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  staff_id uuid not null references public.staff(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.appointment_status not null default 'scheduled',
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (starts_at < ends_at)
);

-- Impede dois agendamentos ativos para o mesmo profissional no mesmo intervalo.
alter table public.appointments add constraint appointments_no_overlap
  exclude using gist (staff_id with =, tstzrange(starts_at, ends_at, '[)') with &&)
  where (status in ('scheduled', 'confirmed', 'completed'));

create index appointments_company_starts_idx on public.appointments(company_id, starts_at);
create index appointments_staff_starts_idx on public.appointments(staff_id, starts_at);
create index clients_company_name_idx on public.clients(company_id, name);
create index services_company_active_idx on public.services(company_id, is_active);

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger companies_set_updated_at before update on public.companies for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger clients_set_updated_at before update on public.clients for each row execute function public.set_updated_at();
create trigger services_set_updated_at before update on public.services for each row execute function public.set_updated_at();
create trigger appointments_set_updated_at before update on public.appointments for each row execute function public.set_updated_at();

create or replace function public.user_company_id()
returns uuid language sql stable security definer set search_path = public as $$
  select company_id from public.profiles where id = auth.uid() limit 1;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  new_company_id uuid;
  company_slug text;
  company_name text;
  full_name text;
begin
  company_name := coalesce(nullif(new.raw_user_meta_data->>'company_name', ''), 'Meu espaço');
  full_name := coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1));
  company_slug := lower(coalesce(nullif(new.raw_user_meta_data->>'company_slug', ''), 'espaco-' || substring(new.id::text, 1, 8)));

  insert into public.companies (owner_id, name, slug, email)
  values (new.id, company_name, company_slug, new.email)
  returning id into new_company_id;

  insert into public.profiles (id, company_id, full_name, role)
  values (new.id, new_company_id, full_name, 'owner');

  insert into public.staff (company_id, user_id, full_name, email)
  values (new_company_id, new.id, full_name, new.email);

  return new;
exception when unique_violation then
  raise exception 'O link público escolhido já está em uso.' using errcode = '23505';
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.staff enable row level security;
alter table public.clients enable row level security;
alter table public.services enable row level security;
alter table public.staff_services enable row level security;
alter table public.staff_availability enable row level security;
alter table public.appointments enable row level security;

create policy "public can view active companies" on public.companies for select using (is_active = true or id = public.user_company_id());
create policy "members can update their company" on public.companies for update using (id = public.user_company_id()) with check (id = public.user_company_id());

create policy "users can view their profile" on public.profiles for select using (id = auth.uid() or company_id = public.user_company_id());
create policy "owners can manage profiles" on public.profiles for update using (company_id = public.user_company_id());

create policy "public can view active staff" on public.staff for select using (is_active = true or company_id = public.user_company_id());
create policy "members can manage staff" on public.staff for all using (company_id = public.user_company_id()) with check (company_id = public.user_company_id());

create policy "public can view active services" on public.services for select using (is_active = true or company_id = public.user_company_id());
create policy "members can manage services" on public.services for all using (company_id = public.user_company_id()) with check (company_id = public.user_company_id());

create policy "members can manage clients" on public.clients for all using (company_id = public.user_company_id()) with check (company_id = public.user_company_id());
create policy "members can manage appointments" on public.appointments for all using (company_id = public.user_company_id()) with check (company_id = public.user_company_id());
create policy "public can view active availability" on public.staff_availability for select using (is_active = true or staff_id in (select id from public.staff where company_id = public.user_company_id()));
create policy "members can manage availability" on public.staff_availability for all using (staff_id in (select id from public.staff where company_id = public.user_company_id())) with check (staff_id in (select id from public.staff where company_id = public.user_company_id()));
create policy "members can manage staff services" on public.staff_services for all using (staff_id in (select id from public.staff where company_id = public.user_company_id())) with check (staff_id in (select id from public.staff where company_id = public.user_company_id()));

create or replace function public.create_public_booking(
  p_company_slug text,
  p_service_id uuid,
  p_staff_id uuid,
  p_starts_at timestamptz,
  p_client_name text,
  p_client_phone text,
  p_client_email text default null,
  p_notes text default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  target_company uuid;
  target_duration integer;
  target_price numeric;
  target_client uuid;
  created_appointment uuid;
begin
  select id into target_company from public.companies where slug = lower(trim(p_company_slug)) and is_active = true;
  if target_company is null then raise exception 'Espaço não encontrado.'; end if;

  select duration_minutes, price into target_duration, target_price from public.services where id = p_service_id and company_id = target_company and is_active = true;
  if target_duration is null then raise exception 'Serviço indisponível.'; end if;

  if not exists (select 1 from public.staff where id = p_staff_id and company_id = target_company and is_active = true) then raise exception 'Profissional indisponível.'; end if;

  insert into public.clients (company_id, name, phone, email)
  values (target_company, trim(p_client_name), trim(p_client_phone), nullif(trim(p_client_email), ''))
  on conflict (company_id, phone) do update set name = excluded.name, email = coalesce(excluded.email, clients.email)
  returning id into target_client;

  insert into public.appointments (company_id, client_id, service_id, staff_id, starts_at, ends_at, total_amount, status, notes)
  values (target_company, target_client, p_service_id, p_staff_id, p_starts_at, p_starts_at + make_interval(mins => target_duration), target_price, 'scheduled', p_notes)
  returning id into created_appointment;

  return created_appointment;
end;
$$;

grant usage on schema public to anon, authenticated;
grant select on public.companies, public.services, public.staff, public.staff_availability to anon, authenticated;
grant execute on function public.create_public_booking(text, uuid, uuid, timestamptz, text, text, text, text) to anon, authenticated;
