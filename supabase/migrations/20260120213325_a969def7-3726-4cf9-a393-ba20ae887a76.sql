-- Create consultation status enum
CREATE TYPE consultation_status AS ENUM ('draft', 'submitted', 'in_review', 'completed', 'cancelled');

-- Create consultations table
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status consultation_status NOT NULL DEFAULT 'draft',
  concern_category TEXT,
  body_locations TEXT[] DEFAULT '{}',
  symptom_onset TEXT,
  has_changed BOOLEAN,
  change_description TEXT,
  symptoms JSONB DEFAULT '[]',
  symptom_severity TEXT,
  has_allergies BOOLEAN,
  allergies_description TEXT,
  takes_medications BOOLEAN,
  medications_description TEXT,
  has_self_treated BOOLEAN,
  self_treatment_description TEXT,
  date_of_birth DATE,
  biological_sex TEXT,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Patients can view their own consultations
CREATE POLICY "Patients can view own consultations"
ON public.consultations
FOR SELECT
USING (auth.uid() = patient_id);

-- Patients can create their own consultations
CREATE POLICY "Patients can create own consultations"
ON public.consultations
FOR INSERT
WITH CHECK (auth.uid() = patient_id);

-- Patients can update their own draft consultations
CREATE POLICY "Patients can update own draft consultations"
ON public.consultations
FOR UPDATE
USING (auth.uid() = patient_id AND status = 'draft');

-- Patients can delete their own draft consultations
CREATE POLICY "Patients can delete own draft consultations"
ON public.consultations
FOR DELETE
USING (auth.uid() = patient_id AND status = 'draft');

-- Doctors can view submitted consultations
CREATE POLICY "Doctors can view submitted consultations"
ON public.consultations
FOR SELECT
USING (has_role(auth.uid(), 'doctor') AND status != 'draft');

-- Doctors can update consultation status
CREATE POLICY "Doctors can update consultations"
ON public.consultations
FOR UPDATE
USING (has_role(auth.uid(), 'doctor') AND status != 'draft');

-- Admins can view all consultations
CREATE POLICY "Admins can view all consultations"
ON public.consultations
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_consultations_updated_at
BEFORE UPDATE ON public.consultations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create consultation_photos table
CREATE TABLE public.consultation_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  photo_type TEXT NOT NULL CHECK (photo_type IN ('closeup', 'context', 'additional')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consultation_photos ENABLE ROW LEVEL SECURITY;

-- Patients can view photos of their own consultations
CREATE POLICY "Patients can view own consultation photos"
ON public.consultation_photos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.consultations c
    WHERE c.id = consultation_id AND c.patient_id = auth.uid()
  )
);

-- Patients can upload photos to their own consultations
CREATE POLICY "Patients can upload own consultation photos"
ON public.consultation_photos
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.consultations c
    WHERE c.id = consultation_id AND c.patient_id = auth.uid() AND c.status = 'draft'
  )
);

-- Patients can delete photos from their own draft consultations
CREATE POLICY "Patients can delete own consultation photos"
ON public.consultation_photos
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.consultations c
    WHERE c.id = consultation_id AND c.patient_id = auth.uid() AND c.status = 'draft'
  )
);

-- Doctors can view photos of submitted consultations
CREATE POLICY "Doctors can view consultation photos"
ON public.consultation_photos
FOR SELECT
USING (
  has_role(auth.uid(), 'doctor') AND
  EXISTS (
    SELECT 1 FROM public.consultations c
    WHERE c.id = consultation_id AND c.status != 'draft'
  )
);

-- Admins can view all photos
CREATE POLICY "Admins can view all consultation photos"
ON public.consultation_photos
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Create storage bucket for consultation photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('consultation-photos', 'consultation-photos', false);

-- Storage policies for consultation photos bucket
CREATE POLICY "Patients can upload consultation photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'consultation-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Patients can view own consultation photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'consultation-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Patients can delete own consultation photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'consultation-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Doctors can view consultation photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'consultation-photos' AND
  has_role(auth.uid(), 'doctor')
);

CREATE POLICY "Admins can view all consultation photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'consultation-photos' AND
  has_role(auth.uid(), 'admin')
);