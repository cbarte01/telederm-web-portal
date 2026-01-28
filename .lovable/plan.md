
# Bug Fix Plan: Three Critical Issues

This plan addresses three bugs that need to be fixed without breaking existing functionality.

---

## Bug 1: Spacebar Not Working in Text Fields (Steps 5 and 7)

### Root Cause
In `TimelineChanges.tsx` (Step 5) and `MedicalHistory.tsx` (Step 7), the Yes/No selection buttons are plain `<button>` elements. When these buttons have focus (which happens after clicking them), pressing the spacebar triggers the button's click handler instead of inserting a space into the adjacent textarea.

This is standard browser behavior: spacebar activates a focused button element.

### Solution
Add `type="button"` attribute to all the selection buttons. This is a defensive practice, but the real fix is ensuring focus moves appropriately. However, the cleanest fix is to prevent the spacebar from triggering these buttons when the user is typing in a textarea.

We will add an `onKeyDown` handler to these buttons that prevents spacebar activation when the textarea is visible and likely being used:

**Files to modify:**
- `src/pages/consultation/steps/TimelineChanges.tsx`
- `src/pages/consultation/steps/MedicalHistory.tsx`

**Changes:**
Add `type="button"` to all `<button>` elements in these files to ensure they don't accidentally submit forms and to be explicit about their behavior. The actual issue is that after clicking "Yes", the button retains focus, so when the user tabs to the textarea and starts typing, they might still have focus on the button.

The cleanest solution is to auto-focus the textarea when it appears after selecting "Yes".

---

## Bug 2: Consultation Photos Not Visible for Doctors

### Root Cause
The storage bucket RLS policy for doctors to view consultation photos has a logic flaw. The current policy:

```sql
((get_doctor_queue_type(auth.uid()) = 'group'::doctor_queue_type) AND (c.doctor_id IS NULL))
```

This means "group" queue doctors can ONLY see photos for unclaimed cases where `doctor_id IS NULL`. Once they claim a case (set `doctor_id = their_id`), they lose access to the photos because the condition `c.doctor_id IS NULL` fails.

The fix needs to mirror the logic in the `consultations` table RLS which correctly handles claimed cases:

```sql
((doctor_id IS NULL) OR (doctor_id = auth.uid()))
```

### Solution
Update the storage RLS policy for the `consultation-photos` bucket to allow "group" doctors to also access photos for cases they have claimed.

**Database migration required:**
Drop and recreate the doctor storage access policy with corrected logic:

```sql
DROP POLICY IF EXISTS "Doctors can view consultation photos" ON storage.objects;

CREATE POLICY "Doctors can view consultation photos"
ON storage.objects FOR SELECT
USING (
  (bucket_id = 'consultation-photos'::text) 
  AND has_role(auth.uid(), 'doctor'::app_role) 
  AND (EXISTS (
    SELECT 1 FROM consultations c
    WHERE (
      (c.id)::text = (storage.foldername(objects.name))[2]
      AND c.status <> 'draft'::consultation_status
      AND (
        (get_doctor_queue_type(auth.uid()) = 'individual'::doctor_queue_type AND c.doctor_id = auth.uid())
        OR (get_doctor_queue_type(auth.uid()) = 'group'::doctor_queue_type AND (c.doctor_id IS NULL OR c.doctor_id = auth.uid()))
        OR (get_doctor_queue_type(auth.uid()) = 'hybrid'::doctor_queue_type AND (c.doctor_id IS NULL OR c.doctor_id = auth.uid()))
      )
    )
  ))
);
```

---

## Bug 3: Honorarnote Not Visible for Doctors on Closed Cases

### Current Implementation Analysis
Looking at the `ConsultationDetail.tsx` code:

```typescript
const canDownloadHonorarnote = consultation.status === "completed" && !!(consultation as any).icd10_code;
```

The download button IS shown when:
1. Status is "completed"
2. ICD-10 code exists

The button triggers `handleDownloadHonorarnote()` which calls the `generate-honorarnote` edge function.

### Likely Issue
The issue is that the `ConsultationDetail` component receives its consultation data from the parent `DoctorDashboard`, which fetches consultations but does NOT include `icd10_code` and `icd10_description` in the SELECT query.

Looking at the fetch query in `DoctorDashboard.tsx`:
```typescript
.select(`
  id, patient_id, doctor_id, status, concern_category, body_locations,
  symptoms, symptom_severity, symptom_onset, has_changed, change_description,
  has_allergies, allergies_description, takes_medications, medications_description,
  has_self_treated, self_treatment_description, date_of_birth, biological_sex,
  additional_notes, created_at, submitted_at, doctor_response, responded_at,
  profiles:patient_id (full_name)
`)
```

**Missing fields:** `icd10_code`, `icd10_description`, `honorarnote_number`, `honorarnote_storage_path`

### Solution
Add the missing fields to the SELECT query in `DoctorDashboard.tsx` so the `ConsultationDetail` component has access to them.

**File to modify:**
- `src/pages/dashboards/DoctorDashboard.tsx`

Add to the select query:
```typescript
icd10_code,
icd10_description,
honorarnote_number,
honorarnote_storage_path
```

Also update the `Consultation` interface to include these fields properly typed.

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/pages/consultation/steps/TimelineChanges.tsx` | Add `type="button"` to buttons, auto-focus textarea when it appears |
| `src/pages/consultation/steps/MedicalHistory.tsx` | Add `type="button"` to buttons, auto-focus textareas when they appear |
| Database migration | Fix storage RLS policy for doctor photo access |
| `src/pages/dashboards/DoctorDashboard.tsx` | Add missing ICD-10 and honorarnote fields to query |

---

## Technical Details

### For Bug 1 - Auto-focus Implementation
Use a `useEffect` with a ref to focus the textarea when `draft.hasChanged` becomes `true`:

```typescript
const changeDescriptionRef = useRef<HTMLTextAreaElement>(null);

useEffect(() => {
  if (draft.hasChanged && changeDescriptionRef.current) {
    changeDescriptionRef.current.focus();
  }
}, [draft.hasChanged]);
```

### For Bug 2 - RLS Policy Fix
The key insight is that the existing policy mirrors the `consultations` table RLS for SELECT, but forgot to include the "claimed by me" case for group doctors. The fix aligns the storage policy with the table policy.

### For Bug 3 - Missing Query Fields
The interface in `DoctorDashboard.tsx` should be updated to properly type the ICD-10 fields, removing the need for the `(consultation as any).icd10_code` cast in `ConsultationDetail.tsx`.
