-- Fix doctor UPDATE policy to apply to authenticated users (doctors are authenticated)
DROP POLICY IF EXISTS "Doctors can update consultations" ON public.consultations;

CREATE POLICY "Doctors can update consultations"
ON public.consultations
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'doctor'::app_role)
  AND status <> 'draft'::consultation_status
  AND (
    (get_doctor_queue_type(auth.uid()) = 'individual'::doctor_queue_type AND doctor_id = auth.uid())
    OR (get_doctor_queue_type(auth.uid()) = 'group'::doctor_queue_type AND doctor_id IS NULL)
    OR (get_doctor_queue_type(auth.uid()) = 'hybrid'::doctor_queue_type AND (doctor_id IS NULL OR doctor_id = auth.uid()))
  )
)
WITH CHECK (
  has_role(auth.uid(), 'doctor'::app_role)
  AND status <> 'draft'::consultation_status
  AND doctor_id = auth.uid()
);