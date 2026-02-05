# Medena Care Architecture Overview

This document provides a comprehensive overview of the Medena Care teledermatology platform architecture.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [System Architecture](#system-architecture)
3. [Frontend Structure](#frontend-structure)
4. [Backend Integration](#backend-integration)
5. [File Storage](#file-storage)
6. [Security Architecture](#security-architecture)

---

## Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool and dev server |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Component library |
| **React Router v6** | Client-side routing |
| **TanStack Query** | Server state management |
| **i18next** | Internationalization (EN/DE) |
| **Framer Motion** | Animations |
| **Zod** | Schema validation |

### Backend (Lovable Cloud / Supabase)

| Technology | Purpose |
|------------|---------|
| **PostgreSQL** | Relational database |
| **Supabase Auth** | Authentication |
| **Edge Functions (Deno)** | Serverless backend logic |
| **Supabase Storage** | File storage (photos, documents) |
| **Row-Level Security** | Data access control |

### External Services

| Service | Purpose |
|---------|---------|
| **Stripe** | Payment processing |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    React Application                         ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐││
│  │  │  Pages   │ │Components│ │  Hooks   │ │ TanStack Query   │││
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
└───────────────────────────────┬─────────────────────────────────┘
                                │
                    HTTPS / WebSocket
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                     LOVABLE CLOUD (Supabase)                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                      API Gateway                             ││
│  └─────────────────────────────────────────────────────────────┘│
│           │              │              │              │         │
│  ┌────────▼───────┐ ┌────▼────┐ ┌───────▼──────┐ ┌─────▼─────┐ │
│  │ Edge Functions │ │  Auth   │ │  PostgreSQL  │ │  Storage  │ │
│  │    (Deno)      │ │         │ │  + RLS       │ │  Buckets  │ │
│  └────────────────┘ └─────────┘ └──────────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                         Stripe                               ││
│  │              (Checkout, Payments, Invoices)                  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Structure

### Directory Layout

```
src/
├── assets/                  # Static assets (images, logos)
│   ├── body-picker/         # Body location picker images
│   ├── doctors/             # Doctor profile photos
│   └── logo/                # Brand assets
├── components/              # Reusable UI components
│   ├── admin/               # Admin-specific components
│   ├── consultation/        # Consultation flow components
│   ├── patient/             # Patient dashboard components
│   ├── profile/             # Profile management components
│   └── ui/                  # shadcn/ui base components
├── contexts/                # React contexts
│   └── AuthContext.tsx      # Authentication state
├── data/                    # Static data definitions
├── hooks/                   # Custom React hooks
│   ├── use-mobile.tsx       # Mobile detection
│   ├── use-toast.ts         # Toast notifications
│   ├── useConsultationDraft.ts
│   ├── useReferralDoctor.ts
│   └── useRole.ts           # Role management
├── i18n/                    # Internationalization
│   ├── index.ts             # i18n configuration
│   └── locales/             # Translation files (en/de)
├── integrations/            # External service integrations
│   └── supabase/            # Supabase client & types
├── lib/                     # Utility libraries
│   ├── utils.ts             # General utilities
│   └── validation/          # Zod schemas
├── pages/                   # Route components
│   ├── auth/                # Authentication pages
│   ├── consultation/        # Consultation flow
│   └── dashboards/          # Role-specific dashboards
└── types/                   # TypeScript type definitions
```

### Routing Structure

| Route | Component | Access |
|-------|-----------|--------|
| `/` | `Index` | Public |
| `/auth/patient` | `PatientAuth` | Public |
| `/auth/doctor` | `DoctorAuth` | Public |
| `/auth/admin` | `AdminLogin` | Public |
| `/consultation` | `ConsultationFlow` | Authenticated (Patient) |
| `/patient/dashboard` | `PatientDashboard` | Patient |
| `/doctor/dashboard` | `DoctorDashboard` | Doctor |
| `/admin/dashboard` | `AdminDashboard` | Admin |
| `/profile` | `Profile` | Authenticated |
| `/widget/:referralCode` | `Widget` | Public |

### State Management

- **Server State**: TanStack Query for API data caching and synchronization
- **Auth State**: React Context (`AuthContext`) for session management
- **Form State**: React Hook Form with Zod validation
- **UI State**: Local component state with useState/useReducer

---

## Backend Integration

### Supabase Client

The Supabase client is pre-configured at `src/integrations/supabase/client.ts`:

```typescript
import { supabase } from "@/integrations/supabase/client";

// Database queries
const { data, error } = await supabase
  .from('consultations')
  .select('*')
  .eq('patient_id', userId);

// Edge function calls
const { data, error } = await supabase.functions.invoke('create-checkout', {
  body: { consultationId, pricingPlan }
});
```

### Edge Functions

Located in `supabase/functions/`, each function handles specific backend logic:

| Function | Purpose |
|----------|---------|
| `create-checkout` | Creates Stripe checkout session |
| `verify-payment` | Verifies payment completion |
| `create-doctor-account` | Admin creates doctor accounts |
| `manage-doctor-account` | Activate/deactivate doctors |
| `manage-patient-account` | Patient account management |
| `get-current-pricing` | Fetches pricing configuration |
| `generate-consultation-report` | Creates patient PDF report |
| `generate-honorarnote` | Creates doctor fee note PDF |
| `seed-admin` | Initial admin account creation |

### Database Access Patterns

```typescript
// Direct table access (with RLS)
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

// Joining related data
const { data } = await supabase
  .from('consultations')
  .select(`
    *,
    consultation_photos (*)
  `)
  .eq('id', consultationId);
```

---

## File Storage

### Storage Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| `consultation-photos` | No | Patient medical images |
| `doctor-avatars` | Yes | Doctor profile pictures |
| `doctor-signatures` | No | Doctor digital signatures |
| `practice-logos` | Yes | Practice branding |
| `honorarnoten` | No | Generated fee note PDFs |

### Upload Pattern

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('consultation-photos')
  .upload(`${consultationId}/${fileName}`, file);

// Get public URL (public buckets only)
const { data } = supabase.storage
  .from('doctor-avatars')
  .getPublicUrl(path);

// Get signed URL (private buckets)
const { data } = await supabase.storage
  .from('consultation-photos')
  .createSignedUrl(path, 3600); // 1 hour expiry
```

---

## Security Architecture

### Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  Supabase│────▶│  Auth    │
│          │◀────│  Auth    │◀────│  Server  │
└──────────┘     └──────────┘     └──────────┘
     │                                  │
     │         JWT Token                │
     │◀─────────────────────────────────│
     │                                  │
     ▼                                  │
┌──────────┐                           │
│  Store   │     Session stored in     │
│  Session │     localStorage          │
└──────────┘                           │
```

### Row-Level Security (RLS)

All tables use RLS policies enforced at the database level:

```sql
-- Example: Patients can only view own consultations
CREATE POLICY "Patients can view own consultations"
ON consultations FOR SELECT
USING (auth.uid() = patient_id);

-- Admins use security definer function
CREATE POLICY "Admins can view all"
ON consultations FOR SELECT
USING (has_role(auth.uid(), 'admin'));
```

### Role-Based Access Control

```
┌─────────────────────────────────────────────┐
│                 user_roles                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────────┐ │
│  │ patient │  │ doctor  │  │    admin    │ │
│  └────┬────┘  └────┬────┘  └──────┬──────┘ │
└───────┼────────────┼───────────────┼────────┘
        │            │               │
        ▼            ▼               ▼
   Own data     Queue-based      Full access
   only         consultations    all data
```

### Security Definer Functions

Used to prevent RLS recursion and centralize permission checks:

```sql
CREATE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

---

## Environment Variables

### Frontend (Vite)

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |
| `VITE_SUPABASE_PROJECT_ID` | Project identifier |

### Edge Functions

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin access key |
| `STRIPE_SECRET_KEY` | Stripe API key |
| `ADMIN_EMAIL` | Initial admin email |
| `ADMIN_PASSWORD` | Initial admin password |
| `SEED_ADMIN_SECRET` | Admin seeding auth |

---

## Data Flow Examples

### Consultation Submission

```
1. Patient fills 10-step form
2. Draft saved to 'consultations' table
3. Photos uploaded to 'consultation-photos' bucket
4. Patient selects pricing plan
5. create-checkout creates Stripe session
6. Patient completes payment on Stripe
7. verify-payment updates consultation status
8. Consultation appears in doctor queue
```

### Doctor Response

```
1. Doctor claims consultation (sets doctor_id)
2. Doctor reviews photos and history
3. Doctor enters diagnosis + ICD-10 code
4. Doctor submits response
5. Status changes to 'completed'
6. generate-honorarnote creates fee note PDF
7. Patient notified of completion
```

---

*Last updated: February 2026*
