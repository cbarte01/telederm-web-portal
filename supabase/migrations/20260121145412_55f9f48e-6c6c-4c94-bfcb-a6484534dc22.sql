-- Update doctor SELECT policy to allow group doctors to also see cases they have claimed
DROP POLICY IF EXISTS "Doctors can view consultations based on queue type" ON public.consultations;

CREATE POLICY "Doctors can view consultations based on queue type"
ON public.consultations
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'doctor'::app_role)
  AND status <> 'draft'::consultation_status
  AND (
    -- Individual: only assigned to them
    (get_doctor_queue_type(auth.uid()) = 'individual'::doctor_queue_type AND doctor_id = auth.uid())
    -- Group: unclaimed OR claimed by them
    OR (get_doctor_queue_type(auth.uid()) = 'group'::doctor_queue_type AND (doctor_id IS NULL OR doctor_id = auth.uid()))
    -- Hybrid: unclaimed OR claimed by them
    OR (get_doctor_queue_type(auth.uid()) = 'hybrid'::doctor_queue_type AND (doctor_id IS NULL OR doctor_id = auth.uid()))
  )
);

-- Update doctor UPDATE policy to allow group doctors to continue updating cases they've claimed
DROP POLICY IF EXISTS "Doctors can update consultations" ON public.consultations;

CREATE POLICY "Doctors can update consultations"
ON public.consultations
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'doctor'::app_role)
  AND status <> 'draft'::consultation_status
  AND (
    -- Individual: only assigned to them
    (get_doctor_queue_type(auth.uid()) = 'individual'::doctor_queue_type AND doctor_id = auth.uid())
    -- Group: unclaimed OR claimed by them
    OR (get_doctor_queue_type(auth.uid()) = 'group'::doctor_queue_type AND (doctor_id IS NULL OR doctor_id = auth.uid()))
    -- Hybrid: unclaimed OR claimed by them
    OR (get_doctor_queue_type(auth.uid()) = 'hybrid'::doctor_queue_type AND (doctor_id IS NULL OR doctor_id = auth.uid()))
  )
)
WITH CHECK (
  has_role(auth.uid(), 'doctor'::app_role)
  AND status <> 'draft'::consultation_status
  -- after update, must be claimed by the current doctor (can't leave it unassigned)
  AND doctor_id = auth.uid()
);
