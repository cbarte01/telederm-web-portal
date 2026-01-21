-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Patients can upload own consultation photos" ON public.consultation_photos;

-- Create a new INSERT policy that allows patients to upload photos for their own consultations
-- (both draft and submitted status - since submission happens atomically with photo upload)
CREATE POLICY "Patients can upload own consultation photos" 
ON public.consultation_photos 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM consultations c
    WHERE c.id = consultation_photos.consultation_id 
      AND c.patient_id = auth.uid()
  )
);