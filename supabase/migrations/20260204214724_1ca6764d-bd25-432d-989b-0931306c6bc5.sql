-- Drop the existing check constraint and add a new one that includes 'prescription'
ALTER TABLE public.consultations DROP CONSTRAINT IF EXISTS consultations_pricing_plan_check;

-- Add new check constraint that includes 'prescription' as a valid value
ALTER TABLE public.consultations ADD CONSTRAINT consultations_pricing_plan_check 
  CHECK (pricing_plan IS NULL OR pricing_plan IN ('standard', 'urgent', 'prescription'));