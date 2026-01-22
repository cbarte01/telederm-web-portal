-- Fix public PII exposure by removing broad public SELECT on profiles
DO $$
BEGIN
  -- policy name from earlier migration
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Public can lookup doctors by referral code'
  ) THEN
    EXECUTE 'DROP POLICY "Public can lookup doctors by referral code" ON public.profiles';
  END IF;
END $$;

-- Extend doctor_public_profiles to also support referral lookups (safe, minimal fields)
ALTER TABLE public.doctor_public_profiles
  ADD COLUMN IF NOT EXISTS referral_code text NULL,
  ADD COLUMN IF NOT EXISTS practice_name text NULL,
  ADD COLUMN IF NOT EXISTS welcome_message text NULL;

-- Ensure referral_code uniqueness for public lookup
CREATE UNIQUE INDEX IF NOT EXISTS uq_doctor_public_profiles_referral_code
  ON public.doctor_public_profiles(referral_code)
  WHERE referral_code IS NOT NULL;

-- Helpful index for lookup
CREATE INDEX IF NOT EXISTS idx_doctor_public_profiles_referral_code
  ON public.doctor_public_profiles(referral_code)
  WHERE referral_code IS NOT NULL;

-- Public (anon + authenticated) can lookup doctors by referral code via this safe table
DROP POLICY IF EXISTS "Public can lookup doctors by referral code" ON public.doctor_public_profiles;
CREATE POLICY "Public can lookup doctors by referral code"
ON public.doctor_public_profiles
FOR SELECT
TO anon, authenticated
USING (referral_code IS NOT NULL);
