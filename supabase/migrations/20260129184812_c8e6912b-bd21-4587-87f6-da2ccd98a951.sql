-- Add storage policy for doctors to view documents for their completed consultations
-- Storage path format: {patient_id}/{consultation_id}/filename.pdf
CREATE POLICY "Doctors can view documents for completed consultations"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'honorarnoten' 
  AND public.has_role(auth.uid(), 'doctor'::app_role)
  AND EXISTS (
    SELECT 1 FROM public.consultations c
    WHERE c.id::text = (storage.foldername(name))[2]
      AND c.doctor_id = auth.uid()
      AND c.status = 'completed'::consultation_status
  )
);