-- Add billing contact and signature fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS billing_name text,
ADD COLUMN IF NOT EXISTS billing_email text,
ADD COLUMN IF NOT EXISTS billing_phone text,
ADD COLUMN IF NOT EXISTS signature_url text;

-- Create storage bucket for doctor signatures
INSERT INTO storage.buckets (id, name, public)
VALUES ('doctor-signatures', 'doctor-signatures', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for doctor-signatures bucket
CREATE POLICY "Doctors can upload own signature"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'doctor-signatures' 
  AND has_role(auth.uid(), 'doctor')
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Doctors can view own signature"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'doctor-signatures' 
  AND has_role(auth.uid(), 'doctor')
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Doctors can update own signature"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'doctor-signatures' 
  AND has_role(auth.uid(), 'doctor')
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Doctors can delete own signature"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'doctor-signatures' 
  AND has_role(auth.uid(), 'doctor')
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can manage signatures
CREATE POLICY "Admins can manage doctor signatures"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'doctor-signatures' AND has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'doctor-signatures' AND has_role(auth.uid(), 'admin'));