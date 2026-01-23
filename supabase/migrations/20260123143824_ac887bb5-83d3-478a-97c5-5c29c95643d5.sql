-- Add patient-specific fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS social_security_number text,
ADD COLUMN IF NOT EXISTS biological_sex text;