
# Streamlined Session Management & Token Revocation

## Summary
Implement a practical session management system that allows users to view and revoke their active sessions, and admins to force-logout compromised accounts. This provides meaningful security value without enterprise-scale complexity.

## What This Achieves
- Users can see their active sessions and logout from all devices
- Admins can force-logout any user's sessions during security incidents
- Basic security event logging for audit trails
- Token invalidation through Supabase's built-in mechanisms

## Architecture Approach

Since Supabase JWTs don't include a `jti` (JWT ID) claim, we'll use a practical workaround:

```text
+------------------+     +-------------------+     +------------------+
|   User Action    | --> |  session_revocations  | --> |  Token Check     |
|  (Logout All)    |     |  (user_id + revoked_at)     |  (iat < revoked_at?) |
+------------------+     +-------------------+     +------------------+
```

**Key insight**: Instead of blacklisting individual tokens, we store a `revoked_before` timestamp per user. Any token issued before this timestamp is considered invalid.

---

## Implementation Steps

### 1. Database Schema

Create new tables for session management:

**session_revocations table**
```sql
CREATE TABLE public.session_revocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  revoked_before timestamptz NOT NULL DEFAULT now(),
  revoked_by uuid REFERENCES auth.users(id),
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

-- Admins can manage all revocations
CREATE POLICY "Admins can manage revocations"
  ON public.session_revocations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can revoke their own sessions
CREATE POLICY "Users can revoke own sessions"
  ON public.session_revocations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND revoked_by = auth.uid());

CREATE POLICY "Users can update own revocation"
  ON public.session_revocations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

**security_events table** (for audit logging)
```sql
CREATE TABLE public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
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

-- Only insert via service role (Edge Functions)
CREATE POLICY "Service role can insert"
  ON public.security_events FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Index for efficient queries
CREATE INDEX idx_security_events_user_time ON public.security_events(user_id, created_at DESC);
CREATE INDEX idx_security_events_type ON public.security_events(event_type);
```

### 2. Token Revocation Edge Function

Create `supabase/functions/revoke-sessions/index.ts`:

- Accept POST requests with optional `target_user_id` (for admin use)
- Validate authentication
- Upsert into `session_revocations` with current timestamp
- Log security event
- Return success/error response

Request body:
```json
{
  "target_user_id": "optional-uuid-for-admin-action",
  "reason": "optional reason string"
}
```

Behavior:
- If no `target_user_id`: revoke own sessions
- If `target_user_id` provided: verify caller is admin, then revoke target's sessions

### 3. Token Validation Hook

Update `AuthContext.tsx` to check revocation status:

- On session restore, query `session_revocations` for current user
- Compare token's `iat` (issued at) with `revoked_before` timestamp
- If token was issued before revocation, force sign out
- This adds minimal overhead (one query on session restore)

```typescript
// In AuthContext useEffect
const checkTokenRevocation = async (session: Session) => {
  const { data } = await supabase
    .from('session_revocations')
    .select('revoked_before')
    .eq('user_id', session.user.id)
    .maybeSingle();
  
  if (data && session.user.iat) {
    const tokenIssuedAt = new Date(session.user.iat * 1000);
    const revokedBefore = new Date(data.revoked_before);
    if (tokenIssuedAt < revokedBefore) {
      await supabase.auth.signOut();
      return false;
    }
  }
  return true;
};
```

### 4. User Profile Security Section

Add to `Profile.tsx`:

- New Card component: "Security"
- Show last login info (if available)
- "Logout from all devices" button
- Confirmation dialog before action
- Success toast after revocation

### 5. Admin Dashboard Security Controls

Add to `AdminDashboard.tsx`:

- In Doctor/Patient action dropdown: "Force Logout" option
- Confirmation dialog explaining the action
- Calls revoke-sessions Edge Function with target_user_id
- Success/error toast feedback

### 6. Security Event Logging Integration

Update Edge Functions to log security events:
- `revoke-sessions`: Log session revocation events
- Existing auth functions: Add login/logout event logging

Event types to log:
- `session_revoked_self`: User revoked own sessions
- `session_revoked_admin`: Admin revoked user's sessions
- `login_success`: Successful login
- `login_failed`: Failed login attempt

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `supabase/migrations/[timestamp].sql` | Create | Database schema for revocations and events |
| `supabase/functions/revoke-sessions/index.ts` | Create | Session revocation Edge Function |
| `supabase/config.toml` | Modify | Add revoke-sessions function config |
| `src/contexts/AuthContext.tsx` | Modify | Add token revocation check |
| `src/pages/Profile.tsx` | Modify | Add security section with logout all button |
| `src/pages/dashboards/AdminDashboard.tsx` | Modify | Add force-logout action for users |

---

## Technical Notes

### Why This Approach Works

1. **No per-request blacklist check**: We only check on session restore, not every API call
2. **Uses token's `iat` claim**: Supabase JWTs include issued-at timestamp
3. **Upsert pattern**: Simple update of revoked_before timestamp
4. **Works with tab marker**: Complements existing session security

### Limitations

- Tokens remain technically valid until next session restore
- In-flight requests during revocation continue to work
- For medical platform, this is acceptable - true real-time revocation would require middleware on every request

### Performance Impact

- One extra query on session restore only
- No impact on regular API calls
- Security events insert is async/fire-and-forget
