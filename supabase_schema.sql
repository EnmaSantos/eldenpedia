-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Public User Data)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Policy: Everyone can view profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- Policy: Users can insert their own profile
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

-- Policy: Users can update own profile
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 2. BUILDS TABLE (Saved Loadouts)
create table builds (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  
  -- Storing stats as JSONB is flexible (e.g. { "str": 50, "dex": 40 })
  stats jsonb not null default '{}'::jsonb,
  
  -- Storing weapon IDs or full snapshot
  weapon_r_id text, -- e.g. "moonveil"
  weapon_l_id text, -- e.g. "uchigatana"
  
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table builds enable row level security;

-- Policy: Everyone can view PUBLIC builds
create policy "Public builds are viewable by everyone."
  on builds for select
  using ( is_public = true );

-- Policy: Users can view ALL their own builds (public or private)
create policy "Users can view own builds."
  on builds for select
  using ( auth.uid() = user_id );

-- Policy: Users can create builds
create policy "Users can create builds."
  on builds for insert
  with check ( auth.uid() = user_id );

-- Policy: Users can update own builds
create policy "Users can update own builds."
  on builds for update
  using ( auth.uid() = user_id );

-- Policy: Users can delete own builds
create policy "Users can delete own builds."
  on builds for delete
  using ( auth.uid() = user_id );

-- 3. AUTOMATIC PROFILE CREATION TRIGGER
-- This automatically creates a profile entry when a new user signs up via Auth
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'username', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

