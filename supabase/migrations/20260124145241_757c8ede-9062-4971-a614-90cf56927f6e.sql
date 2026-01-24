-- Drop the public read policy that exposes admin settings
DROP POLICY IF EXISTS "Anyone can read admin settings" ON public.admin_settings;

-- Create a new policy that restricts read access to admins only
CREATE POLICY "Admins can read admin settings" 
ON public.admin_settings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));