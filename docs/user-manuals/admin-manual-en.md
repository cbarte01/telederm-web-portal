# Medena Care Administrator Guide

Welcome to the Medena Care Administrator Guide. This manual covers platform management, doctor account administration, pricing configuration, and system settings.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Accessing the Admin Dashboard](#2-accessing-the-admin-dashboard)
3. [Dashboard Overview](#3-dashboard-overview)
4. [Doctor Management](#4-doctor-management)
5. [Patient Management](#5-patient-management)
6. [Pricing Configuration](#6-pricing-configuration)
7. [System Settings](#7-system-settings)
8. [Security Best Practices](#8-security-best-practices)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Introduction

As a Medena Care administrator, you have full access to manage the platform including:

- **Doctor accounts**: Create, activate, deactivate, and delete doctor profiles
- **Patient oversight**: View patient lists and consultation statistics
- **Pricing control**: Configure global and individual pricing tiers
- **Platform monitoring**: Track consultation volumes and wait times

### Role Hierarchy

| Role | Access Level |
|------|--------------|
| Admin | Full platform access, user management, pricing control |
| Doctor | Own consultations, profile settings, referral tools |
| Patient | Own consultations, profile settings |

---

## 2. Accessing the Admin Dashboard

### Login URL

Access the admin login at: `/auth/admin`

> **Note**: The admin login is separate from patient and doctor portals for security reasons.

### First-Time Setup

Admin accounts are created via a secure seeding process and cannot be self-registered. Contact your system administrator if you need admin credentials.

### Login Process

1. Navigate to the admin login page
2. Enter your admin email and password
3. Click **Sign In**
4. You will be redirected to the Admin Dashboard

---

## 3. Dashboard Overview

The Admin Dashboard provides a comprehensive view of platform activity.

### Navigation Tabs

| Tab | Description |
|-----|-------------|
| **Patients** | List of all registered patients with consultation counts |
| **Doctors** | Doctor management with status and queue type controls |
| **Settings** | Global pricing configuration |

### Key Metrics

The dashboard displays real-time statistics:

- **Total Patients**: Number of registered patient accounts
- **Total Doctors**: Number of doctor accounts (active and inactive)
- **Active Consultations**: Cases currently in review
- **Completed Consultations**: Total finished consultations

---

## 4. Doctor Management

### Viewing Doctors

The **Doctors** tab displays all doctor accounts with the following information:

| Column | Description |
|--------|-------------|
| Name | Doctor's full name |
| Email | Login email address |
| Queue Type | Group, Individual, or Hybrid |
| Status | Active or Inactive |
| Pricing | Individual pricing overrides (if set) |
| Created | Account creation date |

### Creating a Doctor Account

1. Click the **Create Doctor** button
2. Fill in the required fields:
   - **Full Name**: Doctor's display name
   - **Email**: Login email (must be unique)
   - **Password**: Initial password (doctor should change on first login)
   - **Queue Type**: Select the consultation routing mode
3. Click **Create Account**

The doctor will receive their credentials and can log in immediately.

### Queue Types Explained

| Type | Behavior |
|------|----------|
| **Group** | Doctor receives cases from the shared platform queue |
| **Individual** | Doctor only receives cases from their personal referral link |
| **Hybrid** | Doctor receives both group queue and individual referral cases |

### Activating/Deactivating Doctors

1. Find the doctor in the list
2. Click the status toggle or action menu
3. Select **Activate** or **Deactivate**

> **Note**: Deactivated doctors cannot log in or receive new consultations, but their historical data is preserved.

### Deleting a Doctor Account

1. Click the action menu (⋮) next to the doctor
2. Select **Delete Account**
3. Confirm the deletion

> **Warning**: Deletion is permanent. Consider deactivating instead if you may need the account later.

### Managing Doctor Avatars

1. In the doctor's row, click on the avatar or avatar placeholder
2. Upload a professional photo (recommended: 400x400px, JPG/PNG)
3. The avatar will appear in the public doctor listings

### Editing Individual Pricing

1. Click the **Edit Pricing** button for a specific doctor
2. Enter custom prices for:
   - Standard Consultation (€)
   - Urgent Consultation (€)
   - Prescription Request (€)
3. Save changes

> **Note**: Individual pricing overrides the global defaults for that doctor's consultations.

---

## 5. Patient Management

### Viewing Patients

The **Patients** tab shows all registered patients:

| Column | Description |
|--------|-------------|
| Name | Patient's full name |
| Email | Registration email |
| Ongoing Cases | Number of active consultations |
| Wait Time | Time since oldest pending consultation |
| Created | Account registration date |

### Sorting Options

Click column headers to sort by:
- Name (alphabetical)
- Ongoing cases (most to least)
- Wait time (longest waiting first)
- Registration date

### Wait Time Indicator

The wait time column shows how long the patient's oldest pending consultation has been waiting:

- **< 24h**: Displayed in hours (e.g., "5h")
- **≥ 24h**: Displayed in days and hours (e.g., "2d 14h")

This helps identify patients who may need priority attention.

---

## 6. Pricing Configuration

### Accessing Pricing Settings

1. Go to the **Settings** tab
2. Locate the **Group Pricing** section

### Global Pricing Tiers

| Tier | Default Price | Description |
|------|---------------|-------------|
| Standard | €49 | Regular consultation, 48-hour response |
| Urgent | €74 | Priority consultation, 24-hour response |
| Prescription | €29 | Medication renewal request |

### Editing Global Prices

1. In the Settings tab, find the pricing inputs
2. Enter new prices for each tier
3. Click **Save Changes**

> **Important**: Global prices apply to all doctors unless they have individual overrides set.

### Individual Doctor Pricing

To set custom pricing for a specific doctor:

1. Go to the **Doctors** tab
2. Find the doctor and click **Edit Pricing**
3. Enter custom values for any tier
4. Save changes

The doctor's consultations will use their individual pricing instead of global defaults.

### Pricing Display

- **Public website**: Shows hardcoded prices (€49/€74) for consistency
- **Checkout flow**: Uses actual configured prices from the database
- **Invoices/Honorarnoten**: Reflect the actual charged amount

---

## 7. System Settings

### Platform Configuration

The Settings tab includes:

| Setting | Description |
|---------|-------------|
| Group Pricing | Default prices for all consultation tiers |
| Auto-confirm Email | Whether new patients need email verification |

### Referral Code Management

Referral codes are managed at the doctor level:

1. Go to the **Doctors** tab
2. Click on a doctor's profile or edit button
3. Assign or modify their referral code

Referral codes follow the format: `DR[LASTNAME]` (e.g., `DRMUELLER`)

---

## 8. Security Best Practices

### Account Security

- **Use strong passwords**: Minimum 12 characters with mixed case, numbers, and symbols
- **Regular password rotation**: Change admin passwords every 90 days
- **Secure access**: Only access admin dashboard from trusted networks

### Data Protection

- **GDPR compliance**: Patient data is protected under Austrian and EU regulations
- **Audit trail**: All admin actions are logged for accountability
- **Minimal access**: Only grant admin access to personnel who need it

### Handling Sensitive Data

- Never share admin credentials
- Do not export patient data without proper authorization
- Report any suspicious activity immediately

---

## 9. Troubleshooting

### Common Issues

#### Doctor Cannot Log In

1. Verify the account is **Active** (not deactivated)
2. Check the email address is correct
3. Try resetting the password

#### Pricing Not Updating

1. Ensure changes are saved (look for confirmation message)
2. Clear browser cache and refresh
3. Check if individual doctor pricing is overriding global settings

#### Patient Not Receiving Responses

1. Check the consultation status in the system
2. Verify a doctor has claimed the case
3. Confirm the doctor's account is active

### Getting Help

For technical issues beyond this guide:

1. Review the technical documentation in `docs/technical/`
2. Check system logs for error details
3. Contact the development team

---

## Quick Reference

### Admin Dashboard URLs

| Page | URL |
|------|-----|
| Admin Login | `/auth/admin` |
| Admin Dashboard | `/admin/dashboard` |

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Refresh data | `Ctrl + R` / `Cmd + R` |
| Search | `Ctrl + F` / `Cmd + F` |

---

*Last updated: February 2026*
