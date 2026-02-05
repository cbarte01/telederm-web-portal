-- Session revocations table for tracking when user sessions were invalidated
CREATE TABLE public.session_revocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  revoked_before timestamptz NOT NULL DEFAULT now(),
  revoked_by uuid,
  reason text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.session_revocations ENABLE ROW LEVEL SECURITY;

-- Users can read their own revocation status
CREATE POLICY "Users can read own revocation"
  ON public.session_revocations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can read all revocations
CREATE POLICY "Admins can read all revocations"
  ON public.session_revocations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage all revocations (insert, update, delete)
CREATE POLICY "Admins can insert revocations"
  ON public.session_revocations FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update revocations"
  ON public.session_revocations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete revocations"
  ON public.session_revocations FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Users can revoke their own sessions (insert if not exists)
CREATE POLICY "Users can revoke own sessions"
  ON public.session_revocations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND revoked_by = auth.uid());

-- Users can update their own revocation (to revoke again)
CREATE POLICY "Users can update own revocation"
  ON public.session_revocations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_session_revocations_updated_at
  BEFORE UPDATE ON public.session_revocations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Security events table for audit logging
CREATE TABLE public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  event_type text NOT NULL,
  details jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Users can read their own security events
CREATE POLICY "Users can read own events"
  ON public.security_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can read all events
CREATE POLICY "Admins can read all events"
  ON public.security_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Index for efficient queries
CREATE INDEX idx_security_events_user_time ON public.security_events(user_id, created_at DESC);
CREATE INDEX idx_security_events_type ON public.security_events(event_type);
CREATE INDEX idx_session_revocations_user ON public.session_revocations(user_id);