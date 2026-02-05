# Medena Care Authentication Guide

This document describes the authentication system, role-based access control, and session management.

---

## Table of Contents

1. [Authentication Overview](#authentication-overview)
2. [User Registration](#user-registration)
3. [Role-Based Access Control](#role-based-access-control)
4. [Session Management](#session-management)
5. [Protected Routes](#protected-routes)
6. [Security Considerations](#security-considerations)

---

## Authentication Overview

Medena Care uses Supabase Auth for authentication, with a custom role-based access control (RBAC) system.

### Authentication Methods

| Method | Supported |
|--------|-----------|
| Email/Password | ✅ Yes |
| Magic Link | ❌ No |
| OAuth (Google, etc.) | ❌ No |
| Anonymous | ❌ No |

### Entry Points

| Role | Login URL | Dashboard URL |
|------|-----------|---------------|
| Patient | `/auth/patient` | `/patient/dashboard` |
| Doctor | `/auth/doctor` | `/doctor/dashboard` |
| Admin | `/auth/admin` | `/admin/dashboard` |

---

## User Registration

### Patient Self-Registration

Patients can self-register through the patient auth page:

```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/`,
    data: {
      full_name: fullName
    }
  }
});
```

#### Registration Flow

1. User enters email, password, and name
2. Supabase creates auth.users record
3. Database trigger `handle_new_patient` fires:
   - Creates profile in `profiles` table
   - Assigns 'patient' role in `user_roles` table
4. Email verification sent (if not auto-confirm)
5. User clicks verification link
6. User can now sign in

### Doctor Account Creation

Doctors cannot self-register. Accounts are created by admins:

```typescript
// Admin calls edge function
const { data, error } = await supabase.functions.invoke('create-doctor-account', {
  body: {
    email: 'doctor@example.com',
    password: 'securePassword',
    fullName: 'Dr. Example',
    queueType: 'group'
  }
});
```

#### Doctor Creation Flow

1. Admin submits doctor details
2. Edge function validates admin role
3. Creates auth.users record with email_confirm: true
4. Creates profile with doctor settings
5. Removes auto-assigned patient role
6. Assigns 'doctor' role
7. Creates doctor_public_profile entry

### Admin Account Seeding

Admin accounts are created via the `seed-admin` edge function:

```bash
curl -X POST \
  https://<project>.supabase.co/functions/v1/seed-admin \
  -H "x-seed-admin-secret: <SEED_ADMIN_SECRET>" \
  -H "Content-Type: application/json"
```

---

## Role-Based Access Control

### Role Hierarchy

```
admin (priority: 3)
  └── Full platform access
  
doctor (priority: 2)
  └── Consultation queue access
  
patient (priority: 1)
  └── Own data access only
```

### Role Storage

Roles are stored in a dedicated `user_roles` table, NOT in the profiles table:

```sql
CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
```

### Role Checking

#### Frontend (useRole hook)

```typescript
import { useRole } from "@/hooks/useRole";

const { role, isLoading, hasRole } = useRole();

// Check specific role
if (hasRole('admin')) {
  // Admin-only logic
}

// Access current role
console.log(role); // 'patient' | 'doctor' | 'admin' | null
```

#### Database (RLS policies)

```sql
-- Using has_role security definer function
CREATE POLICY "Admins can view all"
ON some_table FOR SELECT
USING (has_role(auth.uid(), 'admin'));
```

### Multiple Roles

A user can have multiple roles. The `useRole` hook returns the highest-priority role:

```typescript
const ROLE_PRIORITY: Record<AppRole, number> = {
  admin: 3,
  doctor: 2,
  patient: 1,
};

// If user has both 'patient' and 'admin' roles,
// useRole returns 'admin'
```

---

## Session Management

### AuthContext

The `AuthContext` manages authentication state:

```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}
```

### Session Persistence

Sessions are stored in localStorage and persist across page reloads:

```typescript
// Supabase client configuration
const supabase = createClient(url, key, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true
  }
});
```

### Tab Session Isolation

To prevent session sharing issues across tabs:

```typescript
// On auth state change
const tabMarker = sessionStorage.getItem('medena_tab_session_marker');
if (!tabMarker && session) {
  // New tab without marker but has session in localStorage
  // Force re-authentication or validate
}
```

### Auth State Listener

```typescript
useEffect(() => {
  // Set up listener FIRST
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    }
  );

  // THEN check existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);
```

---

## Protected Routes

### ProtectedRoute Component

```typescript
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AppRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { role, isLoading } = useRole();
  const navigate = useNavigate();

  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth/patient" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard
    return <Navigate to={getDashboardForRole(role)} replace />;
  }

  return children;
};
```

### Route Configuration

```typescript
<Routes>
  {/* Public routes */}
  <Route path="/" element={<Index />} />
  <Route path="/auth/patient" element={<PatientAuth />} />
  <Route path="/auth/doctor" element={<DoctorAuth />} />
  <Route path="/auth/admin" element={<AdminLogin />} />

  {/* Protected routes */}
  <Route
    path="/patient/dashboard"
    element={
      <ProtectedRoute allowedRoles={['patient']}>
        <PatientDashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/doctor/dashboard"
    element={
      <ProtectedRoute allowedRoles={['doctor']}>
        <DoctorDashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin/dashboard"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

### Dashboard Redirection

After login, users are redirected based on their role:

```typescript
const redirectToDashboard = (role: AppRole) => {
  switch (role) {
    case 'admin':
      navigate('/admin/dashboard');
      break;
    case 'doctor':
      navigate('/doctor/dashboard');
      break;
    case 'patient':
    default:
      navigate('/patient/dashboard');
  }
};
```

---

## Security Considerations

### Password Requirements

- Minimum 8 characters (Supabase default)
- Recommend: 12+ characters with mixed case, numbers, symbols

### Email Verification

Email verification is **enabled by default**. Users must verify their email before signing in.

To disable (development only):
- Admin Dashboard → Settings → Auth → Auto-confirm email

### Rate Limiting

Supabase applies rate limits to auth endpoints:
- Sign up: 5 per hour per IP
- Sign in: 30 per minute per IP
- Password reset: 5 per hour per email

### Secure Token Handling

```typescript
// ❌ Never log tokens
console.log(session.access_token);

// ✅ Supabase client handles tokens automatically
const { data } = await supabase.from('table').select();
```

### Admin Flow Restrictions

Admins are blocked from patient flows:

```typescript
// In consultation flow
if (role === 'admin') {
  navigate('/admin/dashboard');
  toast.error('Admins cannot create consultations');
  return;
}
```

### RLS as Security Layer

Never rely solely on frontend checks:

```typescript
// Frontend check (can be bypassed)
if (role === 'admin') { /* show admin UI */ }

// Backend RLS policy (cannot be bypassed)
CREATE POLICY "Admins only"
ON admin_settings FOR SELECT
USING (has_role(auth.uid(), 'admin'));
```

### Security Definer Functions

Use security definer functions to prevent RLS recursion:

```sql
-- ❌ This causes infinite recursion
CREATE POLICY ON profiles
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ✅ Use security definer function
CREATE POLICY ON profiles
USING (has_role(auth.uid(), 'admin'));
```

---

## Password Reset

### Initiate Reset

```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/reset-password`
});
```

### Complete Reset

```typescript
const { error } = await supabase.auth.updateUser({
  password: newPassword
});
```

---

## Sign Out

```typescript
const signOut = async () => {
  // Clear consultation draft
  sessionStorage.removeItem('consultation_draft');
  
  // Sign out from Supabase
  await supabase.auth.signOut();
  
  // Redirect to home
  navigate('/');
};
```

---

*Last updated: February 2026*
