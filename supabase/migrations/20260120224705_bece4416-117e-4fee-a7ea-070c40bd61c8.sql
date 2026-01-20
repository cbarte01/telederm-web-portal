-- Add is_active column to profiles table for soft-delete functionality
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create index for performance when filtering by active status
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);