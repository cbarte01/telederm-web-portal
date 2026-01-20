-- Add doctor response fields to consultations table
ALTER TABLE public.consultations 
ADD COLUMN IF NOT EXISTS doctor_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS doctor_response text,
ADD COLUMN IF NOT EXISTS responded_at timestamp with time zone;

-- Create index for doctor lookups
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON public.consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);