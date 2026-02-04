# Medena Care Doctor Guide

Welcome to the Medena Care Doctor Portal. This guide covers everything you need to know about managing consultations, responding to patients, and using the referral system.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Getting Started](#2-getting-started)
3. [Dashboard Overview](#3-dashboard-overview)
4. [Reviewing Consultations](#4-reviewing-consultations)
5. [Responding to Cases](#5-responding-to-cases)
6. [Prescription Requests](#6-prescription-requests)
7. [Honorarnote (Medical Fee Notes)](#7-honorarnote-medical-fee-notes)
8. [Profile Settings](#8-profile-settings)
9. [Referral System](#9-referral-system)
10. [FAQs](#10-faqs)

---

## 1. Introduction

Medena Care enables dermatologists to provide online consultations to patients across Austria. As a registered doctor on the platform, you can:

- Review patient cases with photos and medical history
- Provide diagnoses with ICD-10 codes
- Issue prescriptions when medically necessary
- Generate Honorarnoten for billing and insurance
- Build your practice through the referral system

### Queue Types

Doctors can operate in one of three queue modes:

| Queue Type | Description |
|------------|-------------|
| **Group** | Cases are distributed from a shared pool; you claim cases to work on |
| **Individual** | Only cases referred directly to you appear in your queue |
| **Hybrid** | Both shared pool cases and direct referrals appear in your queue |

Your queue type is set by the platform administrator.

---

## 2. Getting Started

### Account Activation

Your account is created by a platform administrator. You will receive:
1. An email invitation with login credentials
2. A temporary password (change this on first login)

### First Login

1. Go to [medena.care/auth/doctor](https://medena.care/auth/doctor)
2. Enter your email and password
3. You'll be redirected to your dashboard

### Changing Your Password

1. Click "Forgot password?" on the login page
2. Enter your registered email
3. Check your email for a reset link
4. Create a new secure password

---

## 3. Dashboard Overview

Your dashboard shows key metrics and the consultation queue.

### Stats Cards

| Card | Description |
|------|-------------|
| **Pending** | New cases waiting to be claimed/reviewed |
| **In Review** | Cases you're currently working on |
| **Completed** | Cases you've completed this month |
| **Total** | All consultations in the system |

### Consultation Queue Tabs

- **Pending**: New submissions awaiting review
- **In Review**: Cases claimed by you or other doctors
- **Completed**: Finished consultations

### Navigation

- **View Profile**: Access your settings and referral tools
- **Logout**: Securely sign out
- **Language Switcher**: Toggle between English and German

---

## 4. Reviewing Consultations

### Claiming a Case

For Group/Hybrid doctors:
1. Click on a pending consultation in the queue
2. Review the patient information
3. Click "Claim & Save Draft" or proceed to complete

Once claimed, the case is assigned to you and removed from the shared pool.

### Patient Information

Each consultation displays:

**Patient Overview**
- Name (from their profile)
- Age (calculated from date of birth)
- Biological sex
- Affected body locations

**Symptoms & Timeline** (for skin consultations)
- Reported symptoms (itching, burning, pain, etc.)
- Severity level
- When symptoms started
- Changes over time

**Medical History** (for skin consultations)
- Known allergies
- Current medications
- Self-treatment attempts

**Photos**
- Patient-uploaded images
- Click to view full-size
- Photos are securely stored and accessible only to authorized personnel

### Prescription Requests

Prescription requests (marked with "Rx" badge) show:
- Patient overview only
- No symptoms or medical history (not applicable)
- Request is for medication renewal, not new diagnosis

---

## 5. Responding to Cases

### Writing Your Response

1. **Open the consultation** by clicking on it
2. **Review all patient information** and photos
3. **Write your diagnosis** in the response field
4. **Add ICD-10 code** (required for completion)
5. **Choose an action**:
   - "Save Draft" – Keep working on it later
   - "Complete" – Finalize and send to patient

### ICD-10 Codes

An ICD-10 code is **required** to complete any consultation, including prescription requests.

**Using the autocomplete:**
1. Start typing a code or description
2. Select from common dermatology codes
3. Or enter any valid ICD-10 code manually

**Common codes include:**
- L20.9 – Atopic dermatitis
- L70.0 – Acne vulgaris
- L40.0 – Psoriasis vulgaris
- L50.0 – Allergic urticaria
- L30.9 – Dermatitis, unspecified

### Completion Requirements

To complete a case:
- ✅ Response text is required
- ✅ ICD-10 code is required
- The patient receives notification when completed

---

## 6. Prescription Requests

### What is a Prescription Request?

Patients can request prescription renewals without a full consultation. These are:
- Marked with an "Rx" badge
- Priced at €29 (vs €49/€74 for consultations)
- For existing treatments only, not new diagnoses

### Handling Prescription Requests

1. **Review patient identity** (name, date of birth)
2. **Consider the request** in context of prior treatment
3. **Write your response** (approval, questions, or denial)
4. **Enter ICD-10 code** (required for Honorarnote)
5. **Complete the request**

### Important Notes

- You can still ask follow-up questions before issuing
- If inappropriate for remote renewal, recommend in-person visit
- Prescriptions are uploaded to e-Medikation (ELGA)

---

## 7. Honorarnote (Medical Fee Notes)

### What is a Honorarnote?

A Honorarnote is an Austrian medical fee note that patients can submit to their insurance for reimbursement. It includes:

- Your practice information
- Patient information
- Service provided with ICD-10 code
- Fee amount
- VAT exemption notice (§6 Abs.1 Z19 UStG)

### Generating a Honorarnote

After completing a consultation with an ICD-10 code:
1. Open the completed consultation
2. Click "Download Honorarnote"
3. The PDF is generated and downloaded

### Requirements

- Consultation must be completed
- ICD-10 code must be entered
- Your profile must include billing information

### Numbering

Honorarnoten are automatically numbered sequentially per year (e.g., HN-2026-001).

---

## 8. Profile Settings

### Accessing Your Profile

Click "View Profile" in the dashboard header.

### Personal Information

- **Full Name**: Displayed to patients
- **Phone**: Optional contact number

### Consultation Pricing

Set your prices for referred patients:

| Field | Description | Default |
|-------|-------------|---------|
| Standard Price | 48-hour response time | €49 |
| Urgent Price | 24-hour response time | €74 |

*Note: Group pricing is set by the administrator.*

### Billing Information

Required for Honorarnote generation:

- **Billing Name**: Company/practice name for invoices
- **Email**: Billing contact email
- **Phone**: Billing contact phone
- **UID Number**: Your tax ID (ATU...)
- **IBAN**: Bank account for payments
- **BIC**: Bank identifier code

### Practice Address

- Street address
- ZIP code
- City

### Practice Logo

Upload your logo to appear on Honorarnoten:
1. Click "Upload Practice Logo"
2. Select an image file
3. Logo appears on generated documents

### Signature

Upload your digital signature:
1. Click the upload area under "Signature"
2. Select an image file (PNG recommended)
3. Signature appears on Honorarnoten

---

## 9. Referral System

### How Referrals Work

You can refer patients directly to yourself using:
- **Referral Link**: A URL patients click to start a consultation
- **QR Code**: Scannable code linking to your referral
- **Embed Widget**: Code to embed on your website

### Your Referral Code

Your referral code is auto-generated from your name:
- Format: `DR` + Last name in uppercase
- Example: Dr. Schmidt → `DRSCHMIDT`

### Referral Link

Your unique link format:
```
medena.care/consultation?ref=DRSCHMIDT
```

**To copy your link:**
1. Go to your Profile page
2. Find the "Referral Link" section
3. Click "Copy" to copy to clipboard

### QR Code

A QR code is generated for your referral link:
1. Go to Profile > Referral System section
2. View the QR code
3. Download or print for your practice

### Embed Widget

Add a consultation widget to your website:
1. Go to Profile page
2. Find the embed code section
3. Copy the HTML/JavaScript code
4. Paste into your website

### Benefits of Referrals

- **Direct assignment**: Cases go straight to you
- **Custom pricing**: Set your own rates
- **Welcome message**: Personalize patient experience
- **Practice branding**: Your logo on communications

---

## 10. FAQs

### Account & Access

**Q: I can't log in. What should I do?**
A: Use "Forgot password?" to reset. If problems persist, contact the administrator.

**Q: How do I change my email address?**
A: Contact the platform administrator to update your account email.

**Q: Can I work on multiple devices?**
A: Yes, you can log in from any device with a web browser.

### Consultations

**Q: How long do I have to respond?**
A: Standard cases: 48 hours. Urgent cases: 24 hours (including weekends).

**Q: Can I reassign a case I've claimed?**
A: Contact the administrator if you need to transfer a case.

**Q: What if I need more information from the patient?**
A: Include your questions in the response. Currently there's no direct messaging—patients can start a follow-up consultation if needed.

### Billing

**Q: How do I get paid?**
A: Payments are processed by the platform. Check with administration for payout schedules.

**Q: Why can't I download a Honorarnote?**
A: Ensure the case is completed and has an ICD-10 code entered.

**Q: Can I set different prices for different services?**
A: Currently Standard and Urgent pricing are supported. Prescription requests use a separate fixed price.

### Referrals

**Q: How do I track my referrals?**
A: Cases from your referral link show in your queue with your assigned doctor_id.

**Q: Can I have multiple referral codes?**
A: Currently one code per doctor. Contact administration for special requirements.

---

## Need Help?

- **Technical Issues**: Contact platform administration
- **Clinical Questions**: Consult your medical network
- **Billing Questions**: Reach out to the platform finance team

---

*Last updated: February 2026*
