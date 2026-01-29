
# Embeddable Widget & QR Code Generation for Doctor Referrals

## Overview

This plan implements two complementary features to help doctors share their referral links:

1. **Embeddable Widget**: An iframe-based consultation card doctors can embed on their websites
2. **QR Code Generator**: Downloadable QR codes for physical materials (business cards, posters, etc.)

---

## Feature 1: Embeddable Widget

### How It Works

Doctors will be able to copy an embed code from their Profile page that looks like:

```html
<iframe 
  src="https://telederm-health.lovable.app/widget/DR_KRAUS" 
  width="350" 
  height="200" 
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
</iframe>
```

When embedded on a doctor's website, this displays a branded consultation card with:
- Medena logo
- Doctor's name and practice name
- "Start Online Consultation" button
- Clean, professional design that matches any website

### Visual Concept

```text
┌─────────────────────────────────────┐
│  [Logo]  Medena Care                │
│                                     │
│  Online Dermatology Consultation    │
│  with Dr. Müller                    │
│  Hautarztpraxis Dr. Müller          │
│                                     │
│  ┌─────────────────────────────┐    │
│  │   Start Consultation →      │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Technical Implementation

**A. New Widget Route & Page**

Create a dedicated widget page that:
- Loads the doctor's public profile data from `doctor_public_profiles`
- Renders a compact, styled card optimized for iframe embedding
- Clicking the button redirects to the consultation flow with `?ref=CODE`
- Supports both German and English (auto-detects or uses `?lang=de` parameter)

**B. Profile Page Enhancement**

Add an "Embed Code" section to the doctor's Referral Settings card:
- Shows a copyable code snippet
- Includes size customization options (compact/standard)
- Preview button to see what the widget looks like

---

## Feature 2: QR Code Generator

### How It Works

Doctors can generate and download a QR code that links directly to their referral URL. This QR code can be:
- Printed on business cards
- Displayed on posters in the waiting room
- Added to prescription pads or patient handouts

### Visual Concept in Profile Page

```text
┌─────────────────────────────────────────────┐
│  QR Code for Your Referral Link             │
│                                             │
│  ┌─────────────┐                            │
│  │ █▀▀▀▀▀▀▀█   │   Download this QR code    │
│  │ █ ▄▄▄ █ ▀█  │   for your practice        │
│  │ █ █▀█ █ ▄█  │   materials.               │
│  │ █ ▀▀▀ █ █   │                            │
│  │ █▀▀▀▀▀▀▀█   │   [Download PNG]           │
│  └─────────────┘   [Download SVG]           │
│                                             │
└─────────────────────────────────────────────┘
```

### Technical Implementation

**A. QR Code Generation**

Use a client-side QR code library (qrcode.react or similar) to:
- Generate QR code from the referral URL
- Render as both PNG (for printing) and SVG (for scaling)
- Include Medena branding (optional logo in center)

**B. Profile Page Enhancement**

Add a "QR Code" section below the referral link display:
- Shows live QR code preview
- Download buttons for PNG (300dpi) and SVG formats
- Only visible when a referral code is set

---

## Implementation Steps

### Step 1: Install QR Code Library

Add `qrcode.react` package for client-side QR code generation.

### Step 2: Create Widget Page

**New file**: `src/pages/Widget.tsx`

- Fetches doctor info from `doctor_public_profiles` using the referral code
- Renders a compact, branded card with CTA button
- Handles language switching via URL parameter
- Includes proper meta tags for iframe embedding

### Step 3: Add Widget Route

**Update**: `src/App.tsx`

- Add route: `/widget/:referralCode`

### Step 4: Create Embed Code Generator Component

**New file**: `src/components/profile/EmbedCodeGenerator.tsx`

- Generates the iframe embed code
- Provides copy-to-clipboard functionality
- Shows size options (compact: 300x180, standard: 350x200)
- Includes preview modal

### Step 5: Create QR Code Generator Component

**New file**: `src/components/profile/QRCodeGenerator.tsx`

- Renders QR code from referral URL
- Provides download as PNG and SVG
- Styled to match the application design

### Step 6: Update Profile Page

**Update**: `src/pages/Profile.tsx`

- Import and add `EmbedCodeGenerator` component
- Import and add `QRCodeGenerator` component
- Show both in the doctor's Referral Settings section (only when referral code exists)

---

## File Changes Summary

| Action | File | Description |
|--------|------|-------------|
| Add | `package.json` | Add `qrcode.react` dependency |
| Create | `src/pages/Widget.tsx` | Embeddable widget page |
| Create | `src/components/profile/EmbedCodeGenerator.tsx` | Embed code generator |
| Create | `src/components/profile/QRCodeGenerator.tsx` | QR code generator |
| Update | `src/App.tsx` | Add widget route |
| Update | `src/pages/Profile.tsx` | Add embed & QR sections |

---

## Technical Details

### Widget Page Styling

The widget will use:
- Minimal CSS (embedded, no external dependencies)
- Medena's brand colors (teal primary, warm cream background)
- Responsive design that works at various embed sizes
- `target="_blank"` for the CTA to open consultation in new tab

### QR Code Options

- **Size**: 256x256 pixels for preview, 1024x1024 for download
- **Error correction**: Level M (15% recovery)
- **Format**: PNG for print, SVG for digital
- **Branding**: Option to include Medena logo overlay

### Security Considerations

- Widget page only exposes public doctor profile data
- No authentication required for widget
- Rate limiting on the public profile lookup (existing RLS policies)

---

## User Experience

### For Doctors

1. Go to Profile page
2. Set up a referral code if not already done
3. Scroll to "Website Integration" section
4. Copy embed code OR download QR code
5. Use on their website or printed materials

### For Patients

1. See widget on doctor's website or scan QR code
2. Click "Start Consultation" or follow QR link
3. Arrive at consultation flow with doctor pre-selected
4. See familiar ReferralBanner confirming the doctor

---

## Translations

Add to `src/i18n/locales/*/consultation.json`:

**German**:
```json
{
  "widget": {
    "title": "Online Hautarzt-Beratung",
    "subtitle": "mit",
    "cta": "Beratung starten",
    "poweredBy": "Powered by Medena Care"
  },
  "profile": {
    "embedCode": "Einbettungscode",
    "embedCodeDescription": "Fügen Sie diesen Code in Ihre Website ein",
    "copyEmbedCode": "Code kopieren",
    "qrCode": "QR-Code",
    "qrCodeDescription": "Für Visitenkarten, Poster und Praxismaterialien",
    "downloadPng": "PNG herunterladen",
    "downloadSvg": "SVG herunterladen"
  }
}
```

**English**:
```json
{
  "widget": {
    "title": "Online Dermatology Consultation",
    "subtitle": "with",
    "cta": "Start Consultation",
    "poweredBy": "Powered by Medena Care"
  },
  "profile": {
    "embedCode": "Embed Code",
    "embedCodeDescription": "Add this code to your website",
    "copyEmbedCode": "Copy Code",
    "qrCode": "QR Code",
    "qrCodeDescription": "For business cards, posters and practice materials",
    "downloadPng": "Download PNG",
    "downloadSvg": "Download SVG"
  }
}
```
