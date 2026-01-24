-- Remove the overly permissive policy on honorarnote_counter
DROP POLICY IF EXISTS "Service role can manage honorarnote counter" ON honorarnote_counter;

-- The table will now only be accessible via service role (edge functions)
-- No RLS policies needed since we don't want any authenticated user access