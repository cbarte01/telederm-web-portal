-- Create storage bucket for doctor avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('doctor-avatars', 'doctor-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow admins to upload doctor avatars
CREATE POLICY "Admins can upload doctor avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'doctor-avatars' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to update doctor avatars
CREATE POLICY "Admins can update doctor avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'doctor-avatars' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete doctor avatars
CREATE POLICY "Admins can delete doctor avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'doctor-avatars' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow public read access to doctor avatars
CREATE POLICY "Public can view doctor avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'doctor-avatars');