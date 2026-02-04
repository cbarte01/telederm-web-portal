-- Allow doctors to view patient profile full_name for consultations they can access
CREATE POLICY "Doctors can view patient profile name for consultations"
ON public.profiles
FOR SELECT
USING (
  has_role(auth.uid(), 'doctor'::app_role) 
  AND EXISTS (
    SELECT 1 FROM consultations c
    WHERE c.patient_id = profiles.id
      AND c.status <> 'draft'::consultation_status
      AND (
        (get_doctor_queue_type(auth.uid()) = 'individual'::doctor_queue_type AND c.doctor_id = auth.uid())
        OR (get_doctor_queue_type(auth.uid()) = 'group'::doctor_queue_type AND (c.doctor_id IS NULL OR c.doctor_id = auth.uid()))
        OR (get_doctor_queue_type(auth.uid()) = 'hybrid'::doctor_queue_type AND (c.doctor_id IS NULL OR c.doctor_id = auth.uid()))
      )
  )
);