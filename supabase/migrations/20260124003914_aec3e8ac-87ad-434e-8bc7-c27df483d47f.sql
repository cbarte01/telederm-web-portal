-- Add billing fields to profiles for doctors
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS practice_address_street TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS practice_address_zip TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS practice_address_city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS uid_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS iban TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bic TEXT;

-- Add payment and ICD-10 fields to consultations
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS icd10_code TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS icd10_description TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS stripe_invoice_id TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS honorarnote_number TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS honorarnote_storage_path TEXT;

-- Create honorarnote counter table for sequential numbering
CREATE TABLE IF NOT EXISTS honorarnote_counter (
  year INTEGER PRIMARY KEY,
  last_number INTEGER DEFAULT 0
);

-- Enable RLS on honorarnote_counter
ALTER TABLE honorarnote_counter ENABLE ROW LEVEL SECURITY;

-- Only allow service role to access counter (used by edge functions)
CREATE POLICY "Service role can manage honorarnote counter"
ON honorarnote_counter
FOR ALL
USING (true)
WITH CHECK (true);

-- Create storage bucket for honorarnoten PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('honorarnoten', 'honorarnoten', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Patients can view their own honorarnoten
CREATE POLICY "Patients can view own honorarnoten"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'honorarnoten' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policy: Service role can upload honorarnoten (via edge function)
CREATE POLICY "Service role can upload honorarnoten"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'honorarnoten');