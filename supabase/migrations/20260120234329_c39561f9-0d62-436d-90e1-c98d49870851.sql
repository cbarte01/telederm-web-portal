-- Create doctor queue type enum
CREATE TYPE public.doctor_queue_type AS ENUM ('group', 'individual', 'hybrid');

-- Add queue type column to profiles (default to 'group' for existing doctors)
ALTER TABLE public.profiles 
ADD COLUMN doctor_queue_type public.doctor_queue_type DEFAULT 'group';

-- Add indexes for performance
CREATE INDEX idx_profiles_doctor_queue_type ON public.profiles(doctor_queue_type);
CREATE INDEX idx_consultations_doctor_id_status ON public.consultations(doctor_id, status);

-- Create helper function to get doctor's queue type
CREATE OR REPLACE FUNCTION public.get_doctor_queue_type(_user_id uuid)
RETURNS public.doctor_queue_type
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT doctor_queue_type FROM profiles WHERE id = _user_id
$$;

-- Drop existing doctor consultation policy
DROP POLICY IF EXISTS "Doctors can view submitted consultations" ON public.consultations;

-- Create new policy based on queue type
CREATE POLICY "Doctors can view consultations based on queue type"
ON public.consultations FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'doctor'::public.app_role)
  AND status <> 'draft'::public.consultation_status
  AND (
    -- INDIVIDUAL: Only see assigned consultations
    (public.get_doctor_queue_type(auth.uid()) = 'individual' AND doctor_id = auth.uid())
    OR
    -- GROUP: Only see unassigned consultations
    (public.get_doctor_queue_type(auth.uid()) = 'group' AND doctor_id IS NULL)
    OR
    -- HYBRID: See both assigned and unassigned
    (public.get_doctor_queue_type(auth.uid()) = 'hybrid' AND (doctor_id IS NULL OR doctor_id = auth.uid()))
  )
);