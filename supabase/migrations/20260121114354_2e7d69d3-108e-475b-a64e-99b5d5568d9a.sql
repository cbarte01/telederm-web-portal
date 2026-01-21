-- Drop the existing overly permissive doctor storage policy
DROP POLICY IF EXISTS "Doctors can view consultation photos" ON storage.objects;

-- Create new restrictive policy that matches consultation RLS logic
CREATE POLICY "Doctors can view consultation photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'consultation-photos' AND
  has_role(auth.uid(), 'doctor'::app_role) AND
  EXISTS (
    SELECT 1 FROM public.consultations c
    WHERE 
      -- Match consultation_id from storage path (2nd folder segment)
      c.id::text = (storage.foldername(name))[2]
      -- Not a draft consultation
      AND c.status <> 'draft'::consultation_status
      -- Apply queue-type access rules
      AND (
        -- Individual doctors: only see assigned cases
        (get_doctor_queue_type(auth.uid()) = 'individual'::doctor_queue_type 
          AND c.doctor_id = auth.uid())
        OR
        -- Group doctors: only see unassigned cases in the pool
        (get_doctor_queue_type(auth.uid()) = 'group'::doctor_queue_type 
          AND c.doctor_id IS NULL)
        OR
        -- Hybrid doctors: see both their cases and the pool
        (get_doctor_queue_type(auth.uid()) = 'hybrid'::doctor_queue_type 
          AND (c.doctor_id IS NULL OR c.doctor_id = auth.uid()))
      )
  )
);