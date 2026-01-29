-- Add practice_logo_url column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN practice_logo_url text;

-- Create storage bucket for practice logos
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('practice-logos', 'practice-logos', true, 524288)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for practice-logos bucket

-- Doctors can view their own practice logos
CREATE POLICY "Doctors can view own practice logo"
ON storage.objects FOR SELECT
USING (bucket_id = 'practice-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Doctors can upload their own practice logos
CREATE POLICY "Doctors can upload own practice logo"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'practice-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Doctors can update their own practice logos
CREATE POLICY "Doctors can update own practice logo"
ON storage.objects FOR UPDATE
USING (bucket_id = 'practice-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Doctors can delete their own practice logos
CREATE POLICY "Doctors can delete own practice logo"
ON storage.objects FOR DELETE
USING (bucket_id = 'practice-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Public read access for practice logos (needed for PDF embedding)
CREATE POLICY "Public can view practice logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'practice-logos');