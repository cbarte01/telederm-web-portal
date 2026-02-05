# Medena Care Database Schema

This document describes the PostgreSQL database schema, including tables, relationships, enums, and Row-Level Security policies.

---

## Table of Contents

1. [Enums](#enums)
2. [Tables](#tables)
3. [Relationships](#relationships)
4. [Database Functions](#database-functions)
5. [Triggers](#triggers)
6. [RLS Policy Summary](#rls-policy-summary)

---

## Enums

### app_role

User role types for role-based access control.

| Value | Description |
|-------|-------------|
| `patient` | Standard user who submits consultations |
| `doctor` | Medical professional who reviews consultations |
| `admin` | Platform administrator with full access |

### consultation_status

Lifecycle states for consultations.

| Value | Description |
|-------|-------------|
| `draft` | Consultation started but not submitted |
| `submitted` | Submitted and awaiting doctor review |
| `in_review` | Doctor has claimed and is reviewing |
| `completed` | Doctor has responded |
| `cancelled` | Consultation was cancelled |

### doctor_queue_type

Determines how consultations are routed to doctors.

| Value | Description |
|-------|-------------|
| `group` | Doctor receives cases from shared platform queue |
| `individual` | Doctor only receives referral-linked cases |
| `hybrid` | Doctor receives both group and referral cases |

---

## Tables

### profiles

Stores user profile information for all roles.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | - | Primary key, matches auth.users.id |
| `full_name` | text | Yes | - | Display name |
| `phone` | text | Yes | - | Contact phone |
| `avatar_url` | text | Yes | - | Profile picture URL |
| `date_of_birth` | date | Yes | - | Patient birthdate |
| `biological_sex` | text | Yes | - | Patient biological sex |
| `social_security_number` | text | Yes | - | Patient SSN (Austria) |
| `insurance_provider` | text | Yes | - | Patient insurance |
| `patient_address_street` | text | Yes | - | Patient street address |
| `patient_address_zip` | text | Yes | - | Patient postal code |
| `patient_address_city` | text | Yes | - | Patient city |
| `is_active` | boolean | Yes | true | Doctor active status |
| `doctor_queue_type` | doctor_queue_type | Yes | 'group' | Doctor queue mode |
| `standard_price` | numeric | Yes | 49.00 | Doctor's standard price |
| `urgent_price` | numeric | Yes | 74.00 | Doctor's urgent price |
| `prescription_price` | numeric | Yes | 29.00 | Doctor's prescription price |
| `practice_name` | text | Yes | - | Doctor practice name |
| `practice_address_street` | text | Yes | - | Practice street |
| `practice_address_zip` | text | Yes | - | Practice postal code |
| `practice_address_city` | text | Yes | - | Practice city |
| `practice_logo_url` | text | Yes | - | Practice logo |
| `signature_url` | text | Yes | - | Doctor signature image |
| `billing_name` | text | Yes | - | Doctor billing name |
| `billing_email` | text | Yes | - | Doctor billing email |
| `billing_phone` | text | Yes | - | Doctor billing phone |
| `iban` | text | Yes | - | Doctor bank IBAN |
| `bic` | text | Yes | - | Doctor bank BIC |
| `uid_number` | text | Yes | - | Doctor UID number |
| `referral_code` | text | Yes | - | Doctor referral code |
| `welcome_message` | text | Yes | - | Doctor welcome message |
| `created_at` | timestamptz | No | now() | Record creation time |
| `updated_at` | timestamptz | No | now() | Last update time |

### user_roles

Maps users to their roles (RBAC).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | gen_random_uuid() | Primary key |
| `user_id` | uuid | No | - | References auth.users.id |
| `role` | app_role | No | - | Assigned role |
| `created_at` | timestamptz | No | now() | Assignment time |

**Unique constraint**: (user_id, role) - prevents duplicate role assignments.

### consultations

Main consultation records.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | gen_random_uuid() | Primary key |
| `patient_id` | uuid | Yes | - | Patient who created |
| `doctor_id` | uuid | Yes | - | Assigned doctor |
| `status` | consultation_status | No | 'draft' | Current status |
| `consultation_type` | text | Yes | 'consultation' | 'consultation' or 'prescription' |
| `pricing_plan` | text | Yes | - | 'standard', 'urgent', or 'prescription' |
| `consultation_price` | numeric | Yes | - | Charged amount |
| `concern_category` | text | Yes | - | Selected concern type |
| `body_locations` | text[] | Yes | '{}' | Affected body areas |
| `symptom_onset` | text | Yes | - | When symptoms started |
| `symptom_severity` | text | Yes | - | Severity level |
| `symptoms` | jsonb | Yes | '[]' | Selected symptoms list |
| `has_changed` | boolean | Yes | - | Condition changed recently |
| `change_description` | text | Yes | - | Change details |
| `has_allergies` | boolean | Yes | - | Patient has allergies |
| `allergies_description` | text | Yes | - | Allergy details |
| `takes_medications` | boolean | Yes | - | Patient on medications |
| `medications_description` | text | Yes | - | Medication details |
| `has_self_treated` | boolean | Yes | - | Patient self-treated |
| `self_treatment_description` | text | Yes | - | Treatment details |
| `date_of_birth` | date | Yes | - | Patient DOB (snapshot) |
| `biological_sex` | text | Yes | - | Patient sex (snapshot) |
| `additional_notes` | text | Yes | - | Patient notes |
| `doctor_response` | text | Yes | - | Doctor's diagnosis |
| `icd10_code` | text | Yes | - | ICD-10 diagnosis code |
| `icd10_description` | text | Yes | - | ICD-10 description |
| `payment_status` | text | Yes | 'pending' | Payment state |
| `stripe_payment_intent_id` | text | Yes | - | Stripe payment ID |
| `stripe_invoice_id` | text | Yes | - | Stripe invoice ID |
| `honorarnote_number` | text | Yes | - | Generated fee note number |
| `honorarnote_storage_path` | text | Yes | - | Fee note PDF path |
| `report_storage_path` | text | Yes | - | Patient report PDF path |
| `submitted_at` | timestamptz | Yes | - | Submission timestamp |
| `responded_at` | timestamptz | Yes | - | Response timestamp |
| `created_at` | timestamptz | No | now() | Creation time |
| `updated_at` | timestamptz | No | now() | Last update time |

### consultation_photos

Photos attached to consultations.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | gen_random_uuid() | Primary key |
| `consultation_id` | uuid | No | - | Parent consultation |
| `photo_type` | text | No | - | Photo category |
| `storage_path` | text | No | - | Storage bucket path |
| `created_at` | timestamptz | No | now() | Upload time |

### doctor_public_profiles

Public-facing doctor information (for referral pages).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `doctor_id` | uuid | No | - | Primary key, doctor's user ID |
| `display_name` | text | Yes | - | Public display name |
| `practice_name` | text | Yes | - | Public practice name |
| `avatar_url` | text | Yes | - | Public avatar |
| `welcome_message` | text | Yes | - | Greeting message |
| `referral_code` | text | Yes | - | Unique referral code |
| `created_at` | timestamptz | No | now() | Creation time |
| `updated_at` | timestamptz | No | now() | Last update time |

### admin_settings

Platform-wide configuration settings.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | gen_random_uuid() | Primary key |
| `setting_key` | text | No | - | Setting identifier |
| `setting_value` | jsonb | No | - | Setting data |
| `created_at` | timestamptz | No | now() | Creation time |
| `updated_at` | timestamptz | No | now() | Last update time |

**Current settings**:
- `group_pricing`: `{ "standard": 49, "urgent": 74, "prescription": 29 }`

### honorarnote_counter

Sequential numbering for fee notes.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `year` | integer | No | - | Calendar year (primary key) |
| `last_number` | integer | Yes | 0 | Last used number |

---

## Relationships

```
┌──────────────┐       ┌─────────────────┐
│  auth.users  │───────│    profiles     │
└──────────────┘  1:1  └─────────────────┘
       │                       │
       │                       │
       │  1:N                  │ 1:N
       ▼                       ▼
┌──────────────┐       ┌─────────────────┐
│  user_roles  │       │  consultations  │
└──────────────┘       └─────────────────┘
                               │
                               │ 1:N
                               ▼
                       ┌─────────────────┐
                       │consultation_photos│
                       └─────────────────┘
```

### Foreign Keys

| Table | Column | References |
|-------|--------|------------|
| profiles | id | auth.users(id) |
| user_roles | user_id | auth.users(id) ON DELETE CASCADE |
| consultations | patient_id | profiles(id) |
| consultation_photos | consultation_id | consultations(id) |
| doctor_public_profiles | doctor_id | auth.users(id) |

---

## Database Functions

### has_role

Checks if a user has a specific role. Used in RLS policies.

```sql
CREATE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

### get_doctor_queue_type

Returns the queue type for a doctor.

```sql
CREATE FUNCTION get_doctor_queue_type(_user_id uuid)
RETURNS doctor_queue_type
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT doctor_queue_type FROM profiles WHERE id = _user_id
$$;
```

### handle_new_patient

Trigger function for new user registration.

```sql
CREATE FUNCTION handle_new_patient()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile for new user
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  -- Assign patient role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'patient');
  
  RETURN NEW;
END;
$$;
```

### update_updated_at_column

Updates the `updated_at` timestamp.

```sql
CREATE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

---

## Triggers

| Trigger | Table | Event | Function |
|---------|-------|-------|----------|
| on_auth_user_created | auth.users | AFTER INSERT | handle_new_patient |
| update_*_updated_at | Various | BEFORE UPDATE | update_updated_at_column |

---

## RLS Policy Summary

### profiles

| Policy | Command | Rule |
|--------|---------|------|
| Users can view own profile | SELECT | auth.uid() = id |
| Admins can view all profiles | SELECT | has_role(uid, 'admin') |
| Doctors can view patient profiles | SELECT | Patient has consultation with doctor |
| Allow profile insertion | INSERT | auth.uid() = id |
| Users can update own profile | UPDATE | auth.uid() = id |
| Admins can update any profile | UPDATE | has_role(uid, 'admin') |
| Users can delete own profile | DELETE | auth.uid() = id |

### user_roles

| Policy | Command | Rule |
|--------|---------|------|
| Users can view own role | SELECT | auth.uid() = user_id |
| Admins can view all roles | SELECT | has_role(uid, 'admin') |
| Admins can insert roles | INSERT | has_role(uid, 'admin') |
| Admins can delete roles | DELETE | has_role(uid, 'admin') |

### consultations

| Policy | Command | Rule |
|--------|---------|------|
| Patients can view own consultations | SELECT | auth.uid() = patient_id |
| Admins can view all consultations | SELECT | has_role(uid, 'admin') |
| Doctors can view based on queue type | SELECT | Complex queue logic |
| Patients can create own consultations | INSERT | auth.uid() = patient_id |
| Patients can update own draft | UPDATE | uid = patient_id AND status = 'draft' |
| Doctors can update consultations | UPDATE | Queue-based access |
| Patients can delete own draft | DELETE | uid = patient_id AND status = 'draft' |

### consultation_photos

| Policy | Command | Rule |
|--------|---------|------|
| Patients can view own photos | SELECT | Owns parent consultation |
| Doctors can view photos | SELECT | Non-draft consultation access |
| Admins can view all photos | SELECT | has_role(uid, 'admin') |
| Patients can upload own photos | INSERT | Owns parent consultation |
| Patients can delete own photos | DELETE | Owns draft consultation |

### admin_settings

| Policy | Command | Rule |
|--------|---------|------|
| Admins can read | SELECT | has_role(uid, 'admin') |
| Admins can insert | INSERT | has_role(uid, 'admin') |
| Admins can update | UPDATE | has_role(uid, 'admin') |
| Admins can delete | DELETE | has_role(uid, 'admin') |

### doctor_public_profiles

| Policy | Command | Rule |
|--------|---------|------|
| Public can lookup by referral code | SELECT | referral_code IS NOT NULL |
| Doctors can view own profile | SELECT | uid = doctor_id |
| Patients can view assigned doctor | SELECT | Has consultation with doctor |
| Admins can view all | SELECT | has_role(uid, 'admin') |
| Doctors can insert own | INSERT | uid = doctor_id |
| Doctors can update own | UPDATE | uid = doctor_id |
| Admins can manage all | INSERT/UPDATE/DELETE | has_role(uid, 'admin') |

---

*Last updated: February 2026*
