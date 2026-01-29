-- Add storage path for consultation report
ALTER TABLE public.consultations 
ADD COLUMN IF NOT EXISTS report_storage_path text;