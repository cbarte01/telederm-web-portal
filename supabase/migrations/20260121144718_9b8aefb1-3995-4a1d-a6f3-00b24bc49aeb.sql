-- Drop the existing doctor UPDATE policy
DROP POLICY IF EXISTS "Doctors can update consultations" ON public.consultations;

-- Create a new UPDATE policy that allows doctors to update AND claim consultations
-- The USING clause determines which rows can be selected for update (based on queue type)
-- The WITH CHECK clause allows the doctor to set doctor_id to their own ID
CREATE POLICY "Doctors can update consultations" 
ON public.consultations 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'doctor'::app_role) 
  AND status <> 'draft'::consultation_status
  AND (
    -- Individual: can only update their own assigned consultations
    (get_doctor_queue_type(auth.uid()) = 'individual'::doctor_queue_type AND doctor_id = auth.uid())
    -- Group: can update unclaimed consultations
    OR (get_doctor_queue_type(auth.uid()) = 'group'::doctor_queue_type AND doctor_id IS NULL)
    -- Hybrid: can update unclaimed OR their own assigned consultations
    OR (get_doctor_queue_type(auth.uid()) = 'hybrid'::doctor_queue_type AND (doctor_id IS NULL OR doctor_id = auth.uid()))
  )
)
WITH CHECK (
  has_role(auth.uid(), 'doctor'::app_role) 
  AND status <> 'draft'::consultation_status
  AND (
    -- After update, doctor_id must be the current doctor's ID (claiming it) or remain as their ID
    doctor_id = auth.uid()
  )
);