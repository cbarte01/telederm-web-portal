-- Allow doctors to insert their own public profile
CREATE POLICY "Doctors can insert own public profile"
  ON public.doctor_public_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'doctor'::app_role) 
    AND auth.uid() = doctor_id
  );

-- Allow doctors to update their own public profile
CREATE POLICY "Doctors can update own public profile"
  ON public.doctor_public_profiles
  FOR UPDATE
  TO authenticated
  USING (
    has_role(auth.uid(), 'doctor'::app_role) 
    AND auth.uid() = doctor_id
  )
  WITH CHECK (
    has_role(auth.uid(), 'doctor'::app_role) 
    AND auth.uid() = doctor_id
  );