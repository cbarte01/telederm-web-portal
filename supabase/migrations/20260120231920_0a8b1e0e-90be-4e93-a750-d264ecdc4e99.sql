-- Fix RLS policies to explicitly target authenticated users only
-- This ensures unauthenticated (anon) users cannot access sensitive data

-- =============================================
-- CONSULTATIONS TABLE - Recreate policies for authenticated role
-- =============================================

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Patients can view own consultations" ON public.consultations;
DROP POLICY IF EXISTS "Doctors can view submitted consultations" ON public.consultations;
DROP POLICY IF EXISTS "Admins can view all consultations" ON public.consultations;
DROP POLICY IF EXISTS "Patients can create own consultations" ON public.consultations;
DROP POLICY IF EXISTS "Patients can update own draft consultations" ON public.consultations;
DROP POLICY IF EXISTS "Patients can delete own draft consultations" ON public.consultations;
DROP POLICY IF EXISTS "Doctors can update consultations" ON public.consultations;

-- Recreate with TO authenticated
CREATE POLICY "Patients can view own consultations" 
ON public.consultations 
FOR SELECT 
TO authenticated
USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view submitted consultations" 
ON public.consultations 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'doctor'::app_role) AND status <> 'draft'::consultation_status);

CREATE POLICY "Admins can view all consultations" 
ON public.consultations 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Patients can create own consultations" 
ON public.consultations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update own draft consultations" 
ON public.consultations 
FOR UPDATE 
TO authenticated
USING (auth.uid() = patient_id AND status = 'draft'::consultation_status);

CREATE POLICY "Patients can delete own draft consultations" 
ON public.consultations 
FOR DELETE 
TO authenticated
USING (auth.uid() = patient_id AND status = 'draft'::consultation_status);

CREATE POLICY "Doctors can update consultations" 
ON public.consultations 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'doctor'::app_role) AND status <> 'draft'::consultation_status);

-- =============================================
-- PROFILES TABLE - Recreate policies for authenticated role
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile insertion" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

-- Recreate with TO authenticated
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow profile insertion" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = id);

-- =============================================
-- CONSULTATION_PHOTOS TABLE - Also secure for completeness
-- =============================================

DROP POLICY IF EXISTS "Patients can view own consultation photos" ON public.consultation_photos;
DROP POLICY IF EXISTS "Doctors can view consultation photos" ON public.consultation_photos;
DROP POLICY IF EXISTS "Admins can view all consultation photos" ON public.consultation_photos;
DROP POLICY IF EXISTS "Patients can upload own consultation photos" ON public.consultation_photos;
DROP POLICY IF EXISTS "Patients can delete own consultation photos" ON public.consultation_photos;

CREATE POLICY "Patients can view own consultation photos" 
ON public.consultation_photos 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM consultations c
  WHERE c.id = consultation_photos.consultation_id 
  AND c.patient_id = auth.uid()
));

CREATE POLICY "Doctors can view consultation photos" 
ON public.consultation_photos 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'doctor'::app_role) AND 
  EXISTS (
    SELECT 1 FROM consultations c
    WHERE c.id = consultation_photos.consultation_id 
    AND c.status <> 'draft'::consultation_status
  )
);

CREATE POLICY "Admins can view all consultation photos" 
ON public.consultation_photos 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Patients can upload own consultation photos" 
ON public.consultation_photos 
FOR INSERT 
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM consultations c
  WHERE c.id = consultation_photos.consultation_id 
  AND c.patient_id = auth.uid()
  AND c.status = 'draft'::consultation_status
));

CREATE POLICY "Patients can delete own consultation photos" 
ON public.consultation_photos 
FOR DELETE 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM consultations c
  WHERE c.id = consultation_photos.consultation_id 
  AND c.patient_id = auth.uid()
  AND c.status = 'draft'::consultation_status
));

-- =============================================
-- USER_ROLES TABLE - Also secure for completeness
-- =============================================

DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

CREATE POLICY "Users can view own role" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert roles" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles" 
ON public.user_roles 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));