-- Fix storage RLS policy for doctors to access photos for claimed cases
DROP POLICY IF EXISTS "Doctors can view consultation photos" ON storage.objects;

CREATE POLICY "Doctors can view consultation photos"
ON storage.objects FOR SELECT
USING (
  (bucket_id = 'consultation-photos'::text) 
  AND has_role(auth.uid(), 'doctor'::app_role) 
  AND (EXISTS (
    SELECT 1 FROM consultations c
    WHERE (
      (c.id)::text = (storage.foldername(objects.name))[2]
      AND c.status <> 'draft'::consultation_status
      AND (
        (get_doctor_queue_type(auth.uid()) = 'individual'::doctor_queue_type AND c.doctor_id = auth.uid())
        OR (get_doctor_queue_type(auth.uid()) = 'group'::doctor_queue_type AND (c.doctor_id IS NULL OR c.doctor_id = auth.uid()))
        OR (get_doctor_queue_type(auth.uid()) = 'hybrid'::doctor_queue_type AND (c.doctor_id IS NULL OR c.doctor_id = auth.uid()))
      )
    )
  ))
);