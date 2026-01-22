-- Public-facing doctor profile data (safe subset for patients)
CREATE TABLE IF NOT EXISTS public.doctor_public_profiles (
  doctor_id uuid PRIMARY KEY,
  display_name text NULL,
  avatar_url text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.doctor_public_profiles ENABLE ROW LEVEL SECURITY;

-- Index to speed up lookups
CREATE INDEX IF NOT EXISTS idx_doctor_public_profiles_doctor_id ON public.doctor_public_profiles(doctor_id);

-- Timestamp trigger function (shared pattern)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_doctor_public_profiles_updated_at ON public.doctor_public_profiles;
CREATE TRIGGER update_doctor_public_profiles_updated_at
BEFORE UPDATE ON public.doctor_public_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Policies
-- Admins can manage all
DROP POLICY IF EXISTS "Admins can view all doctor public profiles" ON public.doctor_public_profiles;
CREATE POLICY "Admins can view all doctor public profiles"
ON public.doctor_public_profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can insert doctor public profiles" ON public.doctor_public_profiles;
CREATE POLICY "Admins can insert doctor public profiles"
ON public.doctor_public_profiles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update doctor public profiles" ON public.doctor_public_profiles;
CREATE POLICY "Admins can update doctor public profiles"
ON public.doctor_public_profiles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete doctor public profiles" ON public.doctor_public_profiles;
CREATE POLICY "Admins can delete doctor public profiles"
ON public.doctor_public_profiles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::public.app_role));

-- Doctors can view their own public profile row
DROP POLICY IF EXISTS "Doctors can view own public profile" ON public.doctor_public_profiles;
CREATE POLICY "Doctors can view own public profile"
ON public.doctor_public_profiles
FOR SELECT
USING (has_role(auth.uid(), 'doctor'::public.app_role) AND auth.uid() = doctor_id);

-- Patients can view doctor public profiles for doctors assigned to their consultations
DROP POLICY IF EXISTS "Patients can view assigned doctor public profiles" ON public.doctor_public_profiles;
CREATE POLICY "Patients can view assigned doctor public profiles"
ON public.doctor_public_profiles
FOR SELECT
USING (
  has_role(auth.uid(), 'patient'::public.app_role)
  AND EXISTS (
    SELECT 1
    FROM public.consultations c
    WHERE c.patient_id = auth.uid()
      AND c.doctor_id = doctor_public_profiles.doctor_id
      AND c.status <> 'draft'::public.consultation_status
  )
);
