-- Run this SQL in your Supabase SQL Editor to create the profiles table and set up permissions.

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT,
  phone TEXT,
  roll_no TEXT,
  name TEXT,
  role TEXT DEFAULT 'student',
  setup_complete BOOLEAN DEFAULT false,
  department TEXT,
  course TEXT,
  semester INTEGER,
  section TEXT,
  batch TEXT,
  parent_phone TEXT,
  cgpa TEXT,
  employee_id TEXT,
  designation TEXT,
  subjects JSONB,
  student_name TEXT,
  student_id TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated users to insert/read/update profiles for now
-- (In a production app, you would restrict these policies further)
CREATE POLICY "Allow public read access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.profiles FOR UPDATE USING (true);

-- Enable Realtime for the profiles table
alter publication supabase_realtime add table profiles;

-- ==========================================
-- STORAGE: Create the "avatars" bucket
-- ==========================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- Allow anyone to read avatars
CREATE POLICY "Avatar Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Allow anyone to upload avatars (For demo/testing purposes)
CREATE POLICY "Avatar Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');

-- Allow anyone to update avatars
CREATE POLICY "Avatar Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');
