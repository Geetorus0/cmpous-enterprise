-- Supabase Schema for Campus Enterprise Real-time SaaS Platform
-- Execute this script in your Supabase SQL Editor.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Profiles Table (synchronizes with auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  roll_no text unique,
  phone text,
  name text,
  email text,
  role text check (role in ('student', 'parent', 'faculty', 'hod', 'admin', 'principal', 'super_admin')),
  
  -- Student Specific
  department text,
  course text,
  semester integer default 1,
  section text,
  batch text,
  parent_phone text,
  cgpa text,
  
  -- Faculty / HOD / Principal Specific
  employee_id text,
  designation text,
  subjects text[],
  
  -- Parent Specific
  student_name text,
  student_id text,
  
  setup_complete boolean default false,
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- Row Level Security Policies
create policy "Allow public read access to profiles" 
  on public.profiles for select 
  using (true);

create policy "Allow individual write access to own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Allow individual insert access to own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- 2. Setup trigger to automatically create a profile when a new user registers via Supabase auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, phone, name, role, setup_complete)
  values (
    new.id, 
    new.email, 
    new.phone, 
    coalesce(new.raw_user_meta_data->>'name', 'New Member'),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    false
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Create Notifications Table (for real-time announcements/broadcasts)
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  category text default 'general',
  role_target text check (role_target in ('all', 'student', 'parent', 'faculty', 'hod', 'admin', 'principal', 'super_admin')) default 'all',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Notifications
alter table public.notifications enable row level security;

create policy "Allow read access to notifications target groups"
  on public.notifications for select
  using (true);

create policy "Allow admin write access to notifications"
  on public.notifications for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() 
      and profiles.role in ('admin', 'principal', 'super_admin')
    )
  );

-- Enable Realtime replication for these tables in Supabase Dashboard
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.notifications;

-- 4. Create Storage Buckets for Avatars and Files
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Set up policies for the avatars bucket
create policy "Allow public avatar select access" 
  on storage.objects for select 
  using (bucket_id = 'avatars');

create policy "Allow individual avatar upload access" 
  on storage.objects for insert 
  with check (bucket_id = 'avatars');

create policy "Allow individual avatar update/delete access" 
  on storage.objects for all
  using (bucket_id = 'avatars');

