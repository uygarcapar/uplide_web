-- Uplide Admin Panel — Initial Schema
-- Roles, profiles, products, customers + RLS

create extension if not exists "pgcrypto";

-- 1. Role enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('full_access', 'reader');
  end if;
end$$;

-- 2. Profiles table mirrors auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  role user_role not null default 'reader',
  created_at timestamptz not null default now()
);

-- Auto-create profile when a user is added to auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'reader'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null,                       -- { tr, en }
  description jsonb,                          -- { tr, en } or null
  category text not null,
  price numeric(10, 2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_created_at_idx on public.products (created_at desc);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- 4. Customers
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text,
  city text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  total_orders integer not null default 0 check (total_orders >= 0),
  created_at timestamptz not null default now()
);

create index if not exists customers_email_idx on public.customers (email);
create index if not exists customers_created_at_idx on public.customers (created_at desc);

-- 5. RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;

-- Profiles: users can read their own profile
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

-- Helper function: current user's role
create or replace function public.current_user_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Products policies
drop policy if exists "products_select_authenticated" on public.products;
create policy "products_select_authenticated" on public.products
  for select to authenticated using (true);

drop policy if exists "products_write_full_access" on public.products;
create policy "products_write_full_access" on public.products
  for all to authenticated
  using (public.current_user_role() = 'full_access')
  with check (public.current_user_role() = 'full_access');

-- Customers policies
drop policy if exists "customers_select_authenticated" on public.customers;
create policy "customers_select_authenticated" on public.customers
  for select to authenticated using (true);

drop policy if exists "customers_write_full_access" on public.customers;
create policy "customers_write_full_access" on public.customers
  for all to authenticated
  using (public.current_user_role() = 'full_access')
  with check (public.current_user_role() = 'full_access');
