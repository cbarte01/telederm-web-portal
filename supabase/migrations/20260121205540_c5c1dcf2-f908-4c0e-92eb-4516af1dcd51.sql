-- Allow admins to update any profile (for referral codes, queue type, etc.)
CREATE POLICY "Admins can update any profile"
ON profiles FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));