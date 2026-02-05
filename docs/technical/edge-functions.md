# Medena Care Edge Functions API Reference

This document provides the API reference for all Supabase Edge Functions in the Medena Care platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Function Reference](#function-reference)
   - [create-checkout](#create-checkout)
   - [verify-payment](#verify-payment)
   - [get-current-pricing](#get-current-pricing)
   - [create-doctor-account](#create-doctor-account)
   - [manage-doctor-account](#manage-doctor-account)
   - [manage-patient-account](#manage-patient-account)
   - [generate-consultation-report](#generate-consultation-report)
   - [generate-honorarnote](#generate-honorarnote)
   - [seed-admin](#seed-admin)

---

## Overview

Edge Functions are serverless Deno functions that handle backend logic. They are located in `supabase/functions/` and deployed automatically.

### Base URL

```
https://<project-id>.supabase.co/functions/v1/<function-name>
```

### Common Headers

All requests should include:

```http
Content-Type: application/json
Authorization: Bearer <supabase-anon-key>
```

For authenticated requests, include the user's JWT:

```http
Authorization: Bearer <user-jwt>
```

### CORS

All functions support CORS with the following headers:

```javascript
{
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, ...'
}
```

---

## Authentication

### JWT Verification

Most functions validate JWT tokens to identify the user:

```typescript
const authHeader = req.headers.get("Authorization");
const token = authHeader?.replace("Bearer ", "");
const { data: { user } } = await supabase.auth.getUser(token);
```

### Service Role Access

Functions requiring elevated privileges use the service role key:

```typescript
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);
```

---

## Function Reference

---

### create-checkout

Creates a Stripe Checkout session for consultation payment.

#### Request

```http
POST /functions/v1/create-checkout
Authorization: Bearer <user-jwt>
Content-Type: application/json
```

#### Body

```json
{
  "consultationId": "uuid",
  "pricingPlan": "standard" | "urgent" | "prescription"
}
```

#### Response

```json
{
  "url": "https://checkout.stripe.com/..."
}
```

#### Errors

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Missing consultationId | Required field not provided |
| 400 | Invalid pricing plan | Must be standard, urgent, or prescription |
| 401 | User not authenticated | No valid JWT |
| 404 | Consultation not found | Consultation doesn't exist |
| 500 | Internal error | Stripe or database error |

#### Flow

1. Validates user authentication
2. Fetches consultation and verifies ownership
3. Determines price (doctor-specific or global default)
4. Creates Stripe checkout session
5. Updates consultation with payment intent ID
6. Returns checkout URL

---

### verify-payment

Verifies payment completion and updates consultation status.

#### Request

```http
POST /functions/v1/verify-payment
Content-Type: application/json
```

#### Body

```json
{
  "sessionId": "cs_..."
}
```

#### Response

```json
{
  "success": true,
  "consultationId": "uuid"
}
```

#### Errors

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Missing sessionId | Required field not provided |
| 400 | Payment not completed | Stripe session not paid |
| 404 | Consultation not found | No matching payment intent |
| 500 | Internal error | Stripe or database error |

#### Flow

1. Retrieves Stripe session by ID
2. Verifies payment status is 'paid'
3. Finds consultation by payment intent ID
4. Updates consultation: status → 'submitted', payment_status → 'paid'
5. Sets submitted_at timestamp

---

### get-current-pricing

Fetches current pricing configuration.

#### Request

```http
GET /functions/v1/get-current-pricing
Authorization: Bearer <user-jwt>
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `doctorId` | uuid | Optional. Get doctor-specific pricing |

#### Response

```json
{
  "standard": 49,
  "urgent": 74,
  "prescription": 29
}
```

#### Flow

1. If doctorId provided, fetch doctor's custom pricing
2. Merge with global defaults from admin_settings
3. Return effective pricing

---

### create-doctor-account

Creates a new doctor account (admin only).

#### Request

```http
POST /functions/v1/create-doctor-account
Authorization: Bearer <admin-jwt>
Content-Type: application/json
```

#### Body

```json
{
  "email": "doctor@example.com",
  "password": "securePassword123",
  "fullName": "Dr. Example",
  "queueType": "group" | "individual" | "hybrid"
}
```

#### Response

```json
{
  "success": true,
  "userId": "uuid",
  "message": "Doctor account created successfully"
}
```

#### Errors

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | User is not an admin |
| 400 | Email already exists | Account with email exists |
| 400 | Missing required fields | Email, password, or name missing |
| 500 | Internal error | Database or auth error |

#### Flow

1. Validates admin role
2. Creates auth user with email confirmation
3. Creates profile with doctor settings
4. Removes auto-assigned patient role
5. Assigns doctor role
6. Creates doctor_public_profile entry

---

### manage-doctor-account

Manages doctor account status (activate/deactivate/delete).

#### Request

```http
POST /functions/v1/manage-doctor-account
Authorization: Bearer <admin-jwt>
Content-Type: application/json
```

#### Body

```json
{
  "action": "activate" | "deactivate" | "delete",
  "doctorId": "uuid"
}
```

#### Response

```json
{
  "success": true,
  "message": "Doctor account [action] successfully"
}
```

#### Actions

| Action | Effect |
|--------|--------|
| `activate` | Sets is_active = true in profile |
| `deactivate` | Sets is_active = false in profile |
| `delete` | Removes user from auth.users (cascades) |

---

### manage-patient-account

Manages patient account (delete).

#### Request

```http
POST /functions/v1/manage-patient-account
Authorization: Bearer <user-jwt>
Content-Type: application/json
```

#### Body

```json
{
  "action": "delete"
}
```

#### Response

```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

#### Notes

- Patient can only delete their own account
- Cascades to profiles, user_roles, consultations

---

### generate-consultation-report

Generates a PDF report for the patient.

#### Request

```http
POST /functions/v1/generate-consultation-report
Authorization: Bearer <user-jwt>
Content-Type: application/json
```

#### Body

```json
{
  "consultationId": "uuid"
}
```

#### Response

```json
{
  "success": true,
  "storagePath": "reports/uuid.pdf",
  "downloadUrl": "https://..."
}
```

#### Flow

1. Validates user owns consultation or is doctor/admin
2. Fetches consultation data with photos
3. Generates PDF with diagnosis, ICD-10, recommendations
4. Uploads to storage
5. Updates consultation.report_storage_path
6. Returns signed download URL

---

### generate-honorarnote

Generates a medical fee note (Honorarnote) PDF for insurance.

#### Request

```http
POST /functions/v1/generate-honorarnote
Authorization: Bearer <doctor-jwt>
Content-Type: application/json
```

#### Body

```json
{
  "consultationId": "uuid"
}
```

#### Response

```json
{
  "success": true,
  "honorarnoteNumber": "2026-00042",
  "storagePath": "honorarnoten/uuid.pdf",
  "downloadUrl": "https://..."
}
```

#### Flow

1. Validates doctor is assigned to consultation
2. Fetches doctor billing profile
3. Generates sequential honorarnote number (year-based)
4. Creates PDF with:
   - Doctor practice details
   - Patient information
   - Service description
   - ICD-10 code
   - Amount charged
   - Bank details
5. Uploads to private 'honorarnoten' bucket
6. Updates consultation with honorarnote details
7. Returns signed download URL

---

### seed-admin

Creates the initial admin account.

#### Request

```http
POST /functions/v1/seed-admin
x-seed-admin-secret: <SEED_ADMIN_SECRET>
Content-Type: application/json
```

#### Response

```json
{
  "message": "Admin account created successfully",
  "userId": "uuid"
}
```

#### Errors

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Invalid or missing seed secret |
| 400 | Missing credentials | ADMIN_EMAIL/PASSWORD not configured |
| 500 | Server misconfigured | SEED_ADMIN_SECRET not set |

#### Flow

1. Validates x-seed-admin-secret header
2. Checks if admin already exists
3. If exists with admin role, returns success
4. If exists without admin role, assigns admin role
5. If not exists, creates user and assigns admin role

#### Security

This function requires a dedicated secret header (`x-seed-admin-secret`) rather than JWT authentication, as it's used during initial setup before any admin exists.

---

## Environment Variables

| Variable | Used By | Description |
|----------|---------|-------------|
| `SUPABASE_URL` | All | Supabase project URL |
| `SUPABASE_ANON_KEY` | All | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin functions | Service role key |
| `STRIPE_SECRET_KEY` | Payment functions | Stripe API key |
| `ADMIN_EMAIL` | seed-admin | Initial admin email |
| `ADMIN_PASSWORD` | seed-admin | Initial admin password |
| `SEED_ADMIN_SECRET` | seed-admin | Seeding auth secret |

---

## Calling from Frontend

```typescript
import { supabase } from "@/integrations/supabase/client";

// Authenticated call
const { data, error } = await supabase.functions.invoke('create-checkout', {
  body: {
    consultationId: 'uuid',
    pricingPlan: 'standard'
  }
});

// Handle response
if (error) {
  console.error('Function error:', error);
} else {
  window.location.href = data.url;
}
```

---

*Last updated: February 2026*
