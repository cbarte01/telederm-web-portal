-- Add referral fields to profiles table for B2B2C doctor referral system
ALTER TABLE profiles ADD COLUMN referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN practice_name TEXT;
ALTER TABLE profiles ADD COLUMN welcome_message TEXT;

-- Create an index for fast referral lookups
CREATE INDEX idx_profiles_referral_code ON profiles(referral_code) WHERE referral_code IS NOT NULL;

-- Allow public lookup of doctor profiles by referral code (limited to doctors with referral codes)
CREATE POLICY "Public can lookup doctors by referral code"
ON profiles FOR SELECT
TO anon, authenticated
USING (referral_code IS NOT NULL);