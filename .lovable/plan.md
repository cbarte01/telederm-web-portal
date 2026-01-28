
# Rebrand from TeleDerm to Medena Care

## Overview
This plan covers the comprehensive rebranding of the application from "TeleDerm" to "Medena Care" (or "Medena" for short). The changes span all public-facing content, internal components, legal documents, translation files, and edge functions.

## Scope of Changes

### 1. Core Application Files

**index.html (Meta tags and SEO)**
- Update page title from "Telederm | Online Dermatologist" to "Medena Care | Online Dermatologist"
- Update meta description, author, and Open Graph tags
- Update Twitter meta tags

**src/components/Header.tsx**
- Update logo alt text from "Telederm" to "Medena"
- Update text brand name from "telederm" to "medena"

**src/components/Footer.tsx**
- Update logo alt text and displayed brand name

### 2. Authentication Pages

**src/pages/auth/PatientAuth.tsx**
- Update logo alt text and brand name display

**src/pages/auth/DoctorAuth.tsx**
- Update logo alt text and brand name display

**src/pages/auth/AdminLogin.tsx**
- Update logo alt text and brand name display

**src/pages/auth/ResetPassword.tsx**
- Update logo alt text and brand name display

### 3. Dashboard Pages

**src/pages/dashboards/PatientDashboard.tsx**
- Update logo alt text and brand name display

**src/pages/dashboards/DoctorDashboard.tsx**
- Update logo alt text and brand name display

**src/pages/dashboards/AdminDashboard.tsx**
- Update logo alt text and brand name display

### 4. Consultation Flow

**src/pages/consultation/ConsultationFlow.tsx**
- Update logo alt text and brand name display

### 5. Translation Files (English)

**src/i18n/locales/en/common.json**
- Update footer copyright from "Telederm" to "Medena Care"

**src/i18n/locales/en/home.json**
- Update all references to "Telederm" in:
  - Reviews section (patient testimonials mentioning Telederm)
  - About section (label, paragraphs, mission attribution)

**src/i18n/locales/en/doctors.json**
- Update "Telederm" references in:
  - Benefits title ("Why Doctors Choose Telederm")
  - Testimonials (doctor quotes)
  - CTA section
  - FAQ (e-prescription answer)

**src/i18n/locales/en/companies.json**
- Update "Telederm" references in:
  - Benefits section
  - How it works steps
  - Partners section
  - Testimonials
  - Contact description

**src/i18n/locales/en/auth.json**
- Update admin subtitle from "Manage your telederm platform"

**src/i18n/locales/en/consultation.json**
- Update "New to Telederm?" and "Thank you for trusting Telederm"

**src/i18n/locales/en/legal.json**
- Update all legal references:
  - Privacy Policy: Company name, email (info@telederm.at to info@medena.at), role descriptions
  - Impressum: Company name, business purpose
  - Terms of Service: All "TeleDerm GmbH" references to "Medena Care GmbH", website URL, email addresses

### 6. Translation Files (German)

**src/i18n/locales/de/common.json**
- Update footer copyright from "Telederm" to "Medena Care"

**src/i18n/locales/de/home.json**
- Update all "Telederm" references in:
  - Reviews section (patient testimonials)
  - About section (label, paragraphs, mission)

**src/i18n/locales/de/doctors.json**
- Update "Telederm" references in:
  - Benefits title
  - Testimonials
  - FAQ (e-prescription)
  - CTA section

**src/i18n/locales/de/companies.json**
- Update "Telederm" references in:
  - Benefits section
  - How it works steps
  - Partners section
  - Testimonials
  - Contact description

**src/i18n/locales/de/auth.json**
- Update admin subtitle

**src/i18n/locales/de/legal.json**
- Update all legal references:
  - Privacy Policy: Company name, email, role descriptions
  - Impressum: Company name, business purpose
  - Terms of Service: All references to "TeleDerm GmbH" and "telederm.at"

### 7. Edge Functions

**supabase/functions/create-checkout/index.ts**
- Update product names from "Teledermatologie-Konsultation" to "Medena Care Konsultation" or similar
- Note: The fallback origin URL is the published domain and does not need branding changes

### 8. Asset File Renaming

**src/assets/logo/telederm-logo.png**
- Keep the existing file but update all import references to use a new path
- Rename to `src/assets/logo/medena-logo.png` for consistency (even though the visual stays the same for now)

## Summary of Brand Name Usage

| Context | Old | New |
|---------|-----|-----|
| Full company name | TeleDerm GmbH | Medena Care GmbH |
| Short brand name | telederm / Telederm | medena / Medena |
| Website URL (legal docs) | www.telederm.at | www.medena.at |
| Email | info@telederm.at | info@medena.at |
| Copyright | Telederm | Medena Care |

## Technical Details

### Files to Modify (28 total)
1. `index.html` - Meta tags
2. `src/components/Header.tsx` - Logo reference
3. `src/components/Footer.tsx` - Logo reference
4. `src/pages/auth/PatientAuth.tsx` - Logo reference
5. `src/pages/auth/DoctorAuth.tsx` - Logo reference
6. `src/pages/auth/AdminLogin.tsx` - Logo reference
7. `src/pages/auth/ResetPassword.tsx` - Logo reference
8. `src/pages/dashboards/PatientDashboard.tsx` - Logo reference
9. `src/pages/dashboards/DoctorDashboard.tsx` - Logo reference
10. `src/pages/dashboards/AdminDashboard.tsx` - Logo reference
11. `src/pages/consultation/ConsultationFlow.tsx` - Logo reference
12. `src/i18n/locales/en/common.json` - Copyright
13. `src/i18n/locales/de/common.json` - Copyright
14. `src/i18n/locales/en/home.json` - Reviews, About section
15. `src/i18n/locales/de/home.json` - Reviews, About section
16. `src/i18n/locales/en/doctors.json` - Benefits, Testimonials, CTA
17. `src/i18n/locales/de/doctors.json` - Benefits, Testimonials, CTA
18. `src/i18n/locales/en/companies.json` - Multiple sections
19. `src/i18n/locales/de/companies.json` - Multiple sections
20. `src/i18n/locales/en/auth.json` - Admin subtitle
21. `src/i18n/locales/de/auth.json` - Admin subtitle
22. `src/i18n/locales/en/consultation.json` - Account prompts
23. `src/i18n/locales/de/consultation.json` - Account prompts (if applicable)
24. `src/i18n/locales/en/legal.json` - All legal documents
25. `src/i18n/locales/de/legal.json` - All legal documents
26. `supabase/functions/create-checkout/index.ts` - Product names
27. `src/assets/logo/telederm-logo.png` - Rename to medena-logo.png

### Note on Logo
You mentioned keeping the current logo for now. The visual image will remain unchanged, but all references will be updated to use "Medena" as the alt text and brand name. When you have a new logo ready, simply upload it and replace the file.
