

# Honorarnote Redesign Plan

## Overview

This plan redesigns the medical fee note (Honorarnote) to meet Austrian insurance compliance standards while incorporating modern professional aesthetics and doctor/practice branding - all within the classic Austrian format layout.

---

## Current State Analysis

The existing Honorarnote is a functional PDF generated via `pdf-lib` with:
- Basic A4 layout with Helvetica fonts
- Centered title "Honorarnote bei Privatordination"
- Right-aligned billing metadata (RechNR, date)
- Single patient info line
- Simple bordered services table
- Doctor signature at bottom

**Identified Gaps:**
- No practice logo support
- Limited patient address display
- Missing UID number prominently displayed
- No payment method/bank details section
- Tax exemption note is minimal
- Doctor contact info layout could be improved
- No visual hierarchy or modern typography

---

## Redesign Goals

1. **Insurance Compliance**: Ensure all fields required by Austrian private insurance (ÖGK/private Versicherung) are present
2. **Modern & Professional**: Clean typography, better spacing, visual hierarchy
3. **Branding & Identity**: Practice logo support, consistent professional appearance

---

## Technical Implementation

### Phase 1: Database Changes

Add new field to `profiles` table for practice logo:

```text
profiles table:
  + practice_logo_url (text, nullable) - Storage path for practice logo
```

Create storage bucket for practice logos:
```text
Bucket: practice-logos
  - Public: Yes (for PDF embedding)
  - Policies: Doctors can upload/manage their own
```

### Phase 2: Profile Page Enhancement

Add logo upload component to doctor profile settings:
- Image preview with upload zone
- Max file size: 500KB
- Supported formats: PNG, JPEG
- Recommended dimensions: 200x80px (landscape)

### Phase 3: PDF Layout Redesign

The redesigned PDF maintains the classic Austrian Honorarnote format while adding professional polish:

```text
+----------------------------------------------------------+
|                                                          |
|  [PRACTICE LOGO]          Dr. Max Mustermann             |
|                           Facharzt für Dermatologie      |
|                           Musterstraße 123, 1010 Wien    |
|                           Tel: +43 1 234 5678            |
|                           Email: praxis@example.at       |
|                           UID: ATU12345678               |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|            HONORARNOTE BEI PRIVATORDINATION              |
|               Zur Vorlage bei Versicherung               |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  Rechnungsnummer: RechNR//25/001                         |
|  Rechnungsdatum:  29.01.2026                             |
|  Leistungsdatum:  29.01.2026                             |
|  Original                                                |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  PATIENT                                                 |
|  --------------------------------------------------------|
|  Name:          Maria Musterfrau                         |
|  Geburtsdatum:  01.01.1980                               |
|  Vers.Nr:       1234                                     |
|  Anschrift:     Patientengasse 45, 1020 Wien             |
|  Versicherung:  Wiener Städtische                        |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  ERBRACHTE LEISTUNGEN                                    |
|  --------------------------------------------------------|
|  Datum      | Beschreibung                    | Betrag   |
|  -----------|--------------------------------|----------|
|  29.01.2026 | Telemedizinische Konsultation  | € 49,00  |
|             | (Dermatologie)                 |          |
|             | ICD-10: L20.9 - Atopische      |          |
|             | Dermatitis                     |          |
|  -----------|--------------------------------|----------|
|                                    Gesamt:   | € 49,00  |
|                                              |----------|
|                                                          |
|  Umsatzsteuerbefreit gemäß § 6 Abs. 1 Z 19 UStG         |
|  (Heilbehandlung)                                        |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  ZAHLUNGSINFORMATION                                     |
|  --------------------------------------------------------|
|  Betrag bereits beglichen am: 29.01.2026                 |
|  Zahlungsart: Kreditkarte (Online)                       |
|                                                          |
|  Bankverbindung für Rückfragen:                          |
|  IBAN: AT12 3456 7890 1234 5678                          |
|  BIC: ABCDEFGH                                           |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|                                        [SIGNATURE IMAGE] |
|                                                          |
|  Dr. Max Mustermann                                      |
|  Facharzt für Dermatologie                               |
|                                                          |
+----------------------------------------------------------+
```

### Phase 4: Edge Function Update

Modify `supabase/functions/generate-honorarnote/index.ts`:

**4.1 Data Fetching**
- Add `practice_logo_url` to doctor profile query
- Fetch patient full address fields

**4.2 PDF Generation Updates**

Header Section:
- Left: Practice logo (if available) with fallback to practice name
- Right: Doctor name, specialty, full address, phone, email, UID

Title Section:
- Centered title with improved typography
- Subtitle "Zur Vorlage bei Versicherung"

Billing Metadata:
- Invoice number, date
- Service date (Leistungsdatum)
- "Original" badge

Patient Section:
- Full name
- Date of birth
- Insurance number (first 4 digits)
- Full address (street, zip, city)
- Insurance provider

Services Table:
- Date column
- Description with ICD-10 code and description
- Amount column
- Visual borders and alternating shading (optional)
- Totals row

Tax Note:
- Full legal text for Austrian VAT exemption

Payment Section:
- Payment confirmation with date
- Payment method (if trackable)
- Bank details (IBAN/BIC) for reference

Footer:
- Signature image (right-aligned)
- Doctor name and specialty

---

## Files to be Modified

| File | Change Type | Description |
|------|-------------|-------------|
| `supabase/functions/generate-honorarnote/index.ts` | Major rewrite | Complete PDF layout redesign |
| `src/pages/Profile.tsx` | Enhancement | Add practice logo upload section |
| New migration | Database | Add `practice_logo_url` to profiles |
| New storage bucket | Infrastructure | Create `practice-logos` bucket |

---

## Insurance Compliance Checklist

The redesigned Honorarnote will include all fields typically required by Austrian insurers:

- [x] Doctor full name and title
- [x] Practice address with zip/city
- [x] UID number (tax ID)
- [x] Contact information (phone, email)
- [x] Sequential invoice number
- [x] Invoice date
- [x] Service date(s)
- [x] Patient full name
- [x] Patient date of birth
- [x] Patient insurance number
- [x] Patient address
- [x] Insurance provider name
- [x] Service description
- [x] ICD-10 diagnosis code and description
- [x] Amount with currency
- [x] VAT exemption notice with legal reference
- [x] Payment confirmation
- [x] Doctor signature
- [x] Bank details (IBAN/BIC)

---

## Implementation Order

1. Create database migration for `practice_logo_url` field
2. Create `practice-logos` storage bucket with RLS policies
3. Add logo upload component to Profile page
4. Redesign the PDF generation in the edge function
5. Test with sample data
6. Verify download works for both patients and doctors

---

## Design Considerations

**Typography:**
- Headers: Helvetica Bold, 12-14pt
- Body: Helvetica Regular, 10pt
- Fine print: Helvetica Regular, 8-9pt

**Spacing:**
- Consistent 50pt margins
- 20pt section gaps
- 14pt line height

**Visual Elements:**
- Thin border lines (0.5pt) for section separation
- Table with header row highlighted
- Signature positioned right-aligned at bottom

**Logo Handling:**
- Max width: 150px
- Max height: 60px
- Scaled proportionally
- PNG or JPEG support

