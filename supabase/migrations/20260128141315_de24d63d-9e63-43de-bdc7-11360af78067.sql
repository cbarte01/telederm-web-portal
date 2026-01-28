-- Add patient address and insurance fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS patient_address_street text,
ADD COLUMN IF NOT EXISTS patient_address_zip text,
ADD COLUMN IF NOT EXISTS patient_address_city text,
ADD COLUMN IF NOT EXISTS insurance_provider text;