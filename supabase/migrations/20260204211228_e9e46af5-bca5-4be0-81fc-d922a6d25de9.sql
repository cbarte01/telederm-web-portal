-- Add consultation_type field to consultations table
ALTER TABLE public.consultations 
ADD COLUMN consultation_type text DEFAULT 'consultation';

-- Add prescription_price to profiles for doctor-specific pricing
ALTER TABLE public.profiles 
ADD COLUMN prescription_price numeric DEFAULT 29.00;