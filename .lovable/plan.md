
# Fix Remaining TeleDerm References

## Overview
This plan updates the remaining hard-coded TeleDerm references to use Medena Care branding, including emails, company names, and storage keys.

## Files to Modify

### 1. src/components/ContactForm.tsx
**Lines 74-75**: Update email from `info@telederm.de` to `info@medena.at`

### 2. src/pages/Impressum.tsx
**Line 69**: Update email from `info@telederm.at` to `info@medena.at`

### 3. src/pages/PrivacyPolicy.tsx
**Lines 60-64**: Update company name from `TeleDerm GmbH` to `Medena Care GmbH` and email from `info@telederm.at` to `info@medena.at`

### 4. src/pages/TermsOfService.tsx
**Lines 72 and 153-155**: Update:
- Company name from `TeleDerm GmbH` to `Medena Care GmbH`
- Email from `info@telederm.at` to `info@medena.at` (both href and display text)

### 5. src/hooks/useConsultationDraft.ts
**Line 10**: Update storage key from `telederm_consultation_draft` to `medena_consultation_draft`

### 6. src/contexts/AuthContext.tsx
**Lines 38 and 154**: Update:
- Tab session marker key from `telederm_tab_session_marker` to `medena_tab_session_marker`
- Consultation draft key reference from `telederm_consultation_draft` to `medena_consultation_draft`

## Summary of Changes

| File | Old Value | New Value |
|------|-----------|-----------|
| ContactForm.tsx | info@telederm.de | info@medena.at |
| Impressum.tsx | info@telederm.at | info@medena.at |
| PrivacyPolicy.tsx | TeleDerm GmbH, info@telederm.at | Medena Care GmbH, info@medena.at |
| TermsOfService.tsx | TeleDerm GmbH, info@telederm.at | Medena Care GmbH, info@medena.at |
| useConsultationDraft.ts | telederm_consultation_draft | medena_consultation_draft |
| AuthContext.tsx | telederm_tab_session_marker, telederm_consultation_draft | medena_tab_session_marker, medena_consultation_draft |

## Technical Notes

- The storage key changes are internal identifiers and won't affect the user experience
- Users with existing drafts stored under the old key will start fresh (which is expected behavior given the rebrand)
- All email addresses are updated to use the `.at` domain (Austrian) consistently
