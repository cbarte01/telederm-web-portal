-- Add pricing columns to profiles table for doctors
ALTER TABLE public.profiles
ADD COLUMN standard_price numeric(10,2) DEFAULT 49.00,
ADD COLUMN urgent_price numeric(10,2) DEFAULT 74.00;

-- Create admin_settings table for platform-wide settings including group pricing
CREATE TABLE public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read admin settings (for displaying prices)
CREATE POLICY "Anyone can read admin settings"
ON public.admin_settings
FOR SELECT
USING (true);

-- Only admins can insert admin settings
CREATE POLICY "Admins can insert admin settings"
ON public.admin_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update admin settings
CREATE POLICY "Admins can update admin settings"
ON public.admin_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete admin settings
CREATE POLICY "Admins can delete admin settings"
ON public.admin_settings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default group pricing
INSERT INTO public.admin_settings (setting_key, setting_value)
VALUES ('group_pricing', '{"standard_price": 49.00, "urgent_price": 74.00}'::jsonb);

-- Add pricing_plan column to consultations table to track which plan was selected
ALTER TABLE public.consultations
ADD COLUMN pricing_plan text CHECK (pricing_plan IN ('standard', 'urgent')),
ADD COLUMN consultation_price numeric(10,2);