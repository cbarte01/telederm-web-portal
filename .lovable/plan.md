
# Prescription Request Feature Implementation Plan

## Overview

This plan introduces a new consultation type: **Prescription Request (Rezeptanforderung)**. When selected, the patient skips the symptom/photo collection steps and proceeds directly to plan selection and payment. The doctor receives the request and can issue a prescription via their external software.

---

## User Flow

```text
Step 1: Concern Selection
  ├── [Existing categories: skin, hair, nails, infections, allergies, pigmentation]
  │     └── Continue to Step 2 (body location)...
  │
  └── [NEW] Request Prescription
        └── Skip to Step 8 (Plan Selection) ──> Step 9 (Account/Payment) ──> Step 10 (Confirmation)
```

---

## Technical Implementation

### Phase 1: Database Changes

**1.1 Add new consultation type field to consultations table:**

```text
consultations table:
  + consultation_type (text, default: 'consultation')
    - Values: 'consultation' | 'prescription'
```

**1.2 Add prescription-specific pricing to admin_settings:**

The admin can set a separate price for prescription requests via the existing `group_pricing` settings key. We'll extend the structure to include:
- `prescription_price` (default: €29)

**1.3 Add prescription pricing fields to profiles (for doctor-specific pricing):**

```text
profiles table:
  + prescription_price (integer, nullable)
```

---

### Phase 2: Type System Updates

**File: `src/types/consultation.ts`**

Add new types:

```typescript
export type ConsultationType = 'consultation' | 'prescription';

export type PricingPlan = 'standard' | 'urgent' | 'prescription';
```

Update `ConsultationDraft` interface:

```typescript
export interface ConsultationDraft {
  // Consultation type (new)
  consultationType?: ConsultationType;
  
  // ... existing fields ...
}
```

Update `INITIAL_DRAFT` to include `consultationType: undefined`.

---

### Phase 3: Frontend Changes

#### 3.1 Step 1 - ConcernSelection Component

**File: `src/pages/consultation/steps/ConcernSelection.tsx`**

Add a new "Request Prescription" option with distinct styling (separate from the category grid):

- Display below the existing 6 categories
- Use a distinct visual style (e.g., border separator + different background)
- When selected:
  - Set `consultationType: 'prescription'`
  - Set `concernCategory: undefined` (not applicable)
  - Skip directly to Step 8 using `setStep(8)`

#### 3.2 ConsultationFlow Component

**File: `src/pages/consultation/ConsultationFlow.tsx`**

Update step rendering logic:
- Pass `setStep` function to `ConcernSelection` component
- Handle prescription flow where steps 2-7 are skipped

Update progress bar calculation:
- For prescription flow, show appropriate progress (e.g., "Step 1 of 3" instead of "Step 1 of 10")
- Or show condensed steps: 1 → 8 → 9 → 10

Update back button logic:
- For prescription flow on Step 8, back should go to Step 1

#### 3.3 Step 8 - PlanSelection Component

**File: `src/pages/consultation/steps/PlanSelection.tsx`**

Add prescription plan option:
- When `draft.consultationType === 'prescription'`, show only the prescription pricing option
- Fetch `prescription_price` from:
  - Referred doctor's profile (if B2B referral), OR
  - Edge function (group pricing)

Prescription plan UI:
- Single plan card with prescription-specific messaging:
  - Title: "Rezeptanforderung" / "Prescription Request"
  - Description: "Request a prescription renewal for an existing treatment"
  - Response time: 24 hours
  - Features: 
    - Prescription issued to e-Medikation / uploaded to ELGA
    - No consultation or diagnosis included

#### 3.4 Step 9 - AccountPayment Component  

**File: `src/pages/consultation/steps/AccountPayment.tsx`**

Update summary display:
- For prescription requests, show simplified summary (no photos, symptoms, etc.)
- Indicate this is a "Prescription Request"

Update consultation creation:
- Set `consultation_type: 'prescription'` in database insert
- Skip photo upload for prescription requests

#### 3.5 Step 10 - Confirmation Component

**File: `src/pages/consultation/steps/Confirmation.tsx`**

Update messaging for prescription requests:
- "Your prescription request has been submitted"
- "The doctor will review your request and issue the prescription to your e-Medikation"

---

### Phase 4: Edge Function Updates

#### 4.1 get-current-pricing

**File: `supabase/functions/get-current-pricing/index.ts`**

Update to return prescription price:

```typescript
interface PricingData {
  standard_price: number;
  urgent_price: number;
  prescription_price: number; // NEW
}

const DEFAULT_PRICING: PricingData = {
  standard_price: 49,
  urgent_price: 74,
  prescription_price: 29, // NEW
};
```

#### 4.2 create-checkout

**File: `supabase/functions/create-checkout/index.ts`**

Update to handle prescription pricing plan:
- Add validation for `pricing_plan: 'prescription'`
- Create new Stripe price ID for prescription (or use price_data with custom amount)

```typescript
const PRICE_IDS = {
  standard: "price_...",
  urgent: "price_...",
  prescription: "price_...", // NEW - to be created
};
```

---

### Phase 5: Doctor Dashboard Updates

#### 5.1 ConsultationQueue

**File: `src/pages/dashboards/doctor/ConsultationQueue.tsx`**

Add visual indicator for prescription requests:
- Badge or icon to distinguish "Prescription" vs "Consultation"
- Filter option to show only prescription requests

#### 5.2 ConsultationDetail

**File: `src/pages/dashboards/doctor/ConsultationDetail.tsx`**

Update detail view for prescription requests:
- Show "Prescription Request" type prominently
- Hide symptom/photo sections that don't apply
- Update response form:
  - Add quick response template: "Prescription uploaded to e-Medikation"
  - ICD-10 code still required for Honorarnote

Add prescription concern label:
```typescript
const concernLabels: Record<string, { en: string; de: string }> = {
  // ... existing ...
  prescription: { en: "Prescription Request", de: "Rezeptanforderung" },
};
```

---

### Phase 6: Internationalization

#### 6.1 English translations

**File: `src/i18n/locales/en/consultation.json`**

Add new translations:

```json
{
  "step1": {
    // ... existing ...
    "prescription": {
      "name": "Request Prescription",
      "description": "Renew an existing prescription without a full consultation"
    }
  },
  "planSelection": {
    "prescription": {
      "name": "Prescription Request",
      "description": "Request a prescription renewal for an existing treatment from your doctor",
      "responseTime": "24 hours",
      "features": [
        "Prescription issued within 24 hours",
        "Uploaded to your e-Medikation (ELGA)",
        "No consultation or new diagnosis included"
      ]
    }
  }
}
```

#### 6.2 German translations

**File: `src/i18n/locales/de/consultation.json`**

Add corresponding German translations:

```json
{
  "step1": {
    // ... existing ...
    "prescription": {
      "name": "Rezept anfordern",
      "description": "Erneuern Sie ein bestehendes Rezept ohne vollständige Konsultation"
    }
  },
  "planSelection": {
    "prescription": {
      "name": "Rezeptanforderung",
      "description": "Fordern Sie eine Rezeptverlängerung für eine bestehende Behandlung bei Ihrem Arzt an",
      "responseTime": "24 Stunden",
      "features": [
        "Rezept innerhalb von 24 Stunden ausgestellt",
        "In Ihre e-Medikation (ELGA) hochgeladen",
        "Keine Konsultation oder neue Diagnose enthalten"
      ]
    }
  }
}
```

---

## Files to be Modified

| File | Change Type | Description |
|------|-------------|-------------|
| New migration | Database | Add `consultation_type` to consultations, `prescription_price` to profiles |
| `src/types/consultation.ts` | Enhancement | Add `ConsultationType`, update `PricingPlan`, update `ConsultationDraft` |
| `src/pages/consultation/steps/ConcernSelection.tsx` | Enhancement | Add prescription request option with step skip logic |
| `src/pages/consultation/ConsultationFlow.tsx` | Enhancement | Pass `setStep` to ConcernSelection, handle prescription back navigation |
| `src/pages/consultation/steps/PlanSelection.tsx` | Enhancement | Add prescription plan display and pricing fetch |
| `src/pages/consultation/steps/AccountPayment.tsx` | Enhancement | Handle prescription-specific summary and submission |
| `src/pages/consultation/steps/Confirmation.tsx` | Enhancement | Add prescription-specific messaging |
| `supabase/functions/get-current-pricing/index.ts` | Enhancement | Add prescription price to response |
| `supabase/functions/create-checkout/index.ts` | Enhancement | Add prescription pricing plan validation |
| `src/pages/dashboards/doctor/ConsultationQueue.tsx` | Enhancement | Add prescription type indicator |
| `src/pages/dashboards/doctor/ConsultationDetail.tsx` | Enhancement | Handle prescription request display |
| `src/i18n/locales/en/consultation.json` | Enhancement | Add prescription translations |
| `src/i18n/locales/de/consultation.json` | Enhancement | Add prescription translations |

---

## Implementation Order

1. **Database migration** - Add `consultation_type` and `prescription_price` fields
2. **Type system updates** - Update TypeScript types
3. **Edge functions** - Update pricing and checkout functions
4. **Step 1 (ConcernSelection)** - Add prescription option with skip logic
5. **ConsultationFlow** - Handle step navigation for prescription flow
6. **Step 8 (PlanSelection)** - Add prescription plan display
7. **Step 9 (AccountPayment)** - Handle prescription submission
8. **Step 10 (Confirmation)** - Update confirmation messaging
9. **Doctor Dashboard** - Add prescription request handling
10. **Translations** - Add EN/DE translations
11. **Testing** - End-to-end flow verification

---

## Additional Considerations

**Progress Indicator:**
For prescription requests, the progress bar will still show the step number (1, 8, 9, 10) but could optionally show "Step 1 of 4" for a cleaner UX. This is a design decision.

**Back Navigation:**
When on Step 8 with a prescription request, the back button should return to Step 1 (not Step 7).

**Medical History (Optional):**
Consider whether prescription requests should still collect basic medical history (Step 7) for safety. Currently the plan skips all middle steps, but this could be adjusted if medically advisable.

**ICD-10 Requirement:**
For Honorarnote generation, doctors will still need to provide an ICD-10 code when completing a prescription request. This ensures billing compliance.
