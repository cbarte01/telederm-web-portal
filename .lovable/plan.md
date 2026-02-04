
# Documentation & Manuals System Plan

## Overview

This plan establishes a comprehensive documentation system for the Medena Care teledermatology platform. The documentation will be organized in a `docs/` directory with bilingual (English/German) user manuals for each role and technical documentation for developers.

---

## Documentation Structure

```text
docs/
├── README.md                           # Documentation hub / table of contents
├── user-manuals/
│   ├── patient-manual-en.md            # Patient guide (English)
│   ├── patient-manual-de.md            # Patient guide (German)
│   ├── doctor-manual-en.md             # Doctor guide (English)
│   ├── doctor-manual-de.md             # Doctor guide (German)
│   ├── admin-manual-en.md              # Admin guide (English)
│   └── admin-manual-de.md              # Admin guide (German)
├── technical/
│   ├── architecture.md                 # System architecture overview
│   ├── database-schema.md              # Database tables, relationships, RLS policies
│   ├── edge-functions.md               # API reference for all edge functions
│   ├── authentication.md               # Auth flows and role-based access
│   └── payment-integration.md          # Stripe integration details
└── changelog.md                        # Feature changelog / release notes
```

---

## User Manual Contents

### Patient Manual (EN/DE)
| Section | Description |
|---------|-------------|
| Getting Started | Account creation, email verification, login |
| Starting a Consultation | 10-step flow walkthrough with screenshots guidance |
| Prescription Requests | How to request a prescription renewal |
| Payment | Pricing plans, Stripe checkout process |
| Viewing Results | Dashboard overview, reading doctor responses |
| Downloading Reports | How to access consultation reports |
| Profile Management | Updating personal info, medical history |
| B2B Referrals | Using a doctor's referral link |

### Doctor Manual (EN/DE)
| Section | Description |
|---------|-------------|
| Getting Started | Account activation (via admin), first login |
| Dashboard Overview | Stats cards, consultation queue tabs |
| Reviewing Consultations | Claiming cases, viewing patient photos/history |
| Responding to Cases | Writing diagnoses, ICD-10 codes, completing consultations |
| Prescription Requests | Handling prescription requests vs regular consultations |
| Honorarnote | Understanding auto-generated medical fee notes |
| Profile Settings | Avatar, practice info, signature, banking details |
| Referral System | Using referral codes, QR codes, embed widgets |

### Admin Manual (EN/DE)
| Section | Description |
|---------|-------------|
| Dashboard Overview | Platform statistics, recent consultations |
| Doctor Management | Creating accounts, activating/deactivating, queue types |
| Patient Management | Viewing patient list, case counts |
| Pricing Configuration | Group pricing, individual doctor pricing |
| Widget System | Generating embed codes for doctors |
| System Settings | Platform-wide configuration |

---

## Technical Documentation Contents

### Architecture Overview
- High-level system diagram
- Frontend routing structure
- Backend (Supabase/Lovable Cloud) integration points
- File storage strategy

### Database Schema
- All tables with field descriptions
- Enum types (app_role, consultation_status, doctor_queue_type)
- Key relationships and foreign keys
- RLS policy summary per table

### Edge Functions API Reference
| Function | Method | Description |
|----------|--------|-------------|
| create-checkout | POST | Creates Stripe checkout session |
| verify-payment | POST | Verifies payment and updates consultation |
| create-doctor-account | POST | Creates new doctor account (admin only) |
| manage-doctor-account | POST | Activate/deactivate/delete doctors |
| manage-patient-account | POST | Patient account management |
| get-current-pricing | GET | Fetches pricing for consultation flow |
| generate-consultation-report | POST | Generates PDF report for patient |
| generate-honorarnote | POST | Generates medical fee note for doctor |
| seed-admin | POST | Initial admin account creation |

### Authentication Guide
- Supabase Auth configuration
- Role-based access control implementation
- Protected routes logic
- Session management

### Payment Integration
- Stripe checkout flow
- Webhook handling (if applicable)
- Custom pricing vs predefined price IDs
- Payment verification flow

---

## Keeping Documentation Up-to-Date

### Strategy: Hybrid Approach

1. **User Manuals**: Updated manually alongside feature development
   - When a UI change is made, update the corresponding manual section
   - Use version tags (e.g., "Last updated: Feb 2026")

2. **Technical Documentation**: Semi-automated with manual curation
   - Database schema section references `src/integrations/supabase/types.ts`
   - Edge function reference updated when functions change
   - Architecture diagrams updated for major structural changes

3. **Changelog**: Maintained with each release
   - Date, version, summary of changes
   - Links to relevant manual sections

### Documentation Checklist (for future features)
When adding new features, update:
- [ ] Relevant user manual(s)
- [ ] Technical docs if backend changes
- [ ] Changelog entry
- [ ] README.md if navigation changes

---

## Implementation Phases

### Phase 1: Core Structure
- Create `docs/` directory structure
- Create `docs/README.md` as documentation hub
- Create English patient manual (most common user type)

### Phase 2: Complete User Manuals
- German patient manual
- English & German doctor manuals
- English & German admin manuals

### Phase 3: Technical Documentation
- Architecture overview with diagram
- Database schema documentation
- Edge functions API reference
- Authentication and payment guides

### Phase 4: Maintenance System
- Add changelog.md
- Add documentation checklist to PR template (optional)
- Add "last updated" timestamps to each document

---

## Technical Considerations

### File Format
- All documentation in Markdown (`.md`) for:
  - Easy editing in any text editor
  - Git version control friendly
  - Renders nicely in GitHub/GitLab
  - Can be converted to PDF/HTML if needed

### Linking Strategy
- Internal links use relative paths
- External links to Stripe docs, Supabase docs where relevant
- Screenshots stored in `docs/images/` subdirectory (optional future enhancement)

### Language Handling
- Separate files per language (not combined)
- Matching filenames with `-en` / `-de` suffixes
- Consistent structure between language versions

---

## Sample Content Outline: Patient Manual (English)

```text
# Medena Care Patient Guide

## Table of Contents
1. Introduction
2. Creating Your Account
3. Starting a Skin Consultation
4. Requesting a Prescription
5. Payment
6. Viewing Your Results
7. Managing Your Profile
8. FAQs

## 1. Introduction
Welcome to Medena Care, Austria's leading online dermatology platform...

## 2. Creating Your Account
1. Go to medena.care
2. Click "Get Started" or "Start Consultation"
3. Enter your email and create a password
4. Check your email for a verification link
...

## 3. Starting a Skin Consultation
The consultation process has 10 simple steps:

### Step 1: Select Your Concern
Choose the category that best matches your skin issue...

### Step 2: Mark the Affected Area
Tap on the body diagram to indicate where the problem is...

[continues for all 10 steps]
```

---

## Files to Create

| File | Priority | Description |
|------|----------|-------------|
| docs/README.md | High | Documentation hub with links to all guides |
| docs/user-manuals/patient-manual-en.md | High | English patient guide |
| docs/user-manuals/patient-manual-de.md | High | German patient guide |
| docs/user-manuals/doctor-manual-en.md | Medium | English doctor guide |
| docs/user-manuals/doctor-manual-de.md | Medium | German doctor guide |
| docs/user-manuals/admin-manual-en.md | Medium | English admin guide |
| docs/user-manuals/admin-manual-de.md | Medium | German admin guide |
| docs/technical/architecture.md | Medium | System architecture |
| docs/technical/database-schema.md | Medium | Database documentation |
| docs/technical/edge-functions.md | Medium | API reference |
| docs/technical/authentication.md | Low | Auth documentation |
| docs/technical/payment-integration.md | Low | Stripe documentation |
| docs/changelog.md | Low | Release notes |

---

## Estimated Implementation Time
- Phase 1 (Core + Patient EN): ~1 session
- Phase 2 (All User Manuals): ~2-3 sessions
- Phase 3 (Technical Docs): ~1-2 sessions
- Phase 4 (Maintenance): Ongoing

Total initial setup: ~4-6 sessions

