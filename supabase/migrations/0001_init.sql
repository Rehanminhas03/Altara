-- Altara Automotive — initial schema, RLS, storage.
-- Safe to run on a fresh Supabase project. Idempotent where practical.

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────
do $$ begin
  create type vehicle_status as enum ('available', 'reserved', 'sold');
exception when duplicate_object then null; end $$;

do $$ begin
  create type enquiry_kind as enum ('general','finance','sell','viewing','test_drive','newsletter');
exception when duplicate_object then null; end $$;
-- fuel + transmission are free text so the admin can enter custom values.

-- ─────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────
create table if not exists public.vehicles (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title          text not null,
  make           text not null,
  model          text not null,
  variant        text,
  year           int not null,
  mileage        int not null,
  fuel           text not null,
  transmission   text not null,
  engine_size    numeric(3,1),
  power_bhp      int,
  colour         text,
  body_type      text not null,
  doors          int,
  seats          int,
  price          numeric(10,2) not null,
  previous_price numeric(10,2),
  description    text,
  features       text[] default '{}',
  status         vehicle_status not null default 'available',
  featured       boolean not null default false,
  reg_plate      text,
  registered_at  date,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.vehicle_images (
  id             uuid primary key default gen_random_uuid(),
  vehicle_id     uuid not null references public.vehicles(id) on delete cascade,
  url            text not null,
  storage_path   text,
  is_placeholder boolean not null default false,
  display_order  int not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists public.enquiries (
  id           uuid primary key default gen_random_uuid(),
  kind         enquiry_kind not null,
  vehicle_id   uuid references public.vehicles(id) on delete set null,
  name         text,
  email        text,
  phone        text,
  message      text,
  payload      jsonb,
  handled      boolean not null default false,
  created_at   timestamptz not null default now()
);

create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- updated_at trigger
-- ─────────────────────────────────────────────────────────────
create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end $$ language plpgsql;

drop trigger if exists vehicles_touch on public.vehicles;
create trigger vehicles_touch before update on public.vehicles
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────
create index if not exists vehicles_status_idx   on public.vehicles (status);
create index if not exists vehicles_featured_idx  on public.vehicles (featured);
create index if not exists vehicles_make_model_idx on public.vehicles (make, model);
create index if not exists vehicles_price_idx     on public.vehicles (price);
create index if not exists vehicles_year_idx      on public.vehicles (year);
create index if not exists vehicle_images_vehicle_idx on public.vehicle_images (vehicle_id, display_order);
create index if not exists enquiries_kind_idx     on public.enquiries (kind, created_at desc);

-- ─────────────────────────────────────────────────────────────
-- is_admin() helper (security definer so it can read the admins table)
-- ─────────────────────────────────────────────────────────────
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- ─────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────
alter table public.vehicles       enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.enquiries      enable row level security;
alter table public.admins         enable row level security;

drop policy if exists "public read vehicles" on public.vehicles;
create policy "public read vehicles" on public.vehicles for select using (true);

drop policy if exists "admin write vehicles" on public.vehicles;
create policy "admin write vehicles" on public.vehicles
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read images" on public.vehicle_images;
create policy "public read images" on public.vehicle_images for select using (true);

drop policy if exists "admin write images" on public.vehicle_images;
create policy "admin write images" on public.vehicle_images
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "anyone create enquiry" on public.enquiries;
create policy "anyone create enquiry" on public.enquiries
  for insert with check (true);

drop policy if exists "admin read enquiries" on public.enquiries;
create policy "admin read enquiries" on public.enquiries
  for select using (public.is_admin());

drop policy if exists "admin update enquiries" on public.enquiries;
create policy "admin update enquiries" on public.enquiries
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "self read admin" on public.admins;
create policy "self read admin" on public.admins
  for select using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Storage bucket + policies
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do nothing;

drop policy if exists "public read vehicle images" on storage.objects;
create policy "public read vehicle images" on storage.objects
  for select using (bucket_id = 'vehicle-images');

drop policy if exists "admin write vehicle images" on storage.objects;
create policy "admin write vehicle images" on storage.objects
  for all
  using (bucket_id = 'vehicle-images' and public.is_admin())
  with check (bucket_id = 'vehicle-images' and public.is_admin());
