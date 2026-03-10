

# Per-Doctor Settings Mockup Page

## Summary

Create a standalone mockup page at `/mockup-doctor-settings` that shows an admin interface for configuring pricing and settings on a per-doctor basis. This is for discussion only — not integrated into the app flow.

## What Gets Built

A single React page with mock data representing 4 doctors (matching the screenshot), where the admin can:
- View each doctor in a card/accordion layout
- See and edit per-doctor pricing (Standard / Urgent / Prescription)
- See the doctor's current queue type, status, referral code
- Toggle between "Use global defaults" and "Custom pricing" per doctor
- Visual indication of which doctors have custom pricing vs. global defaults

## Page Layout

```text
┌──────────────────────────────────────────────┐
│  [DE/EN]              Per-Doctor Settings    │
│                       Mockup                 │
├──────────────────────────────────────────────┤
│                                              │
│  Global Defaults: 49 / 74 / 29  (read-only) │
│                                              │
│  ┌──────────────────────────────────────────┐│
│  │ Doctor 1 Test         Hybrid    Active   ││
│  │ ☑ Custom Pricing                        ││
│  │ Standard: [30]  Urgent: [90]  Rx: [15]  ││
│  └──────────────────────────────────────────┘│
│  ┌──────────────────────────────────────────┐│
│  │ Doctor 3 Test         Group     Active   ││
│  │ ☑ Custom Pricing                        ││
│  │ Standard: [55]  Urgent: [88]  Rx: [12]  ││
│  └──────────────────────────────────────────┘│
│  ┌──────────────────────────────────────────┐│
│  │ Dr. Jim Test2         Individual Active  ││
│  │ ☐ Use Global Defaults                   ││
│  │ Standard: 49   Urgent: 74    Rx: 29     ││
│  └──────────────────────────────────────────┘│
│  ┌──────────────────────────────────────────┐│
│  │ Eva Narro-Bartenstein Individual Active  ││
│  │ ☑ Custom Pricing                        ││
│  │ Standard: [90]  Urgent: [130] Rx: [45]  ││
│  └──────────────────────────────────────────┘│
│                                              │
│  [Save All Changes]                          │
└──────────────────────────────────────────────┘
```

## Files

| File | Action |
|------|--------|
| `src/pages/MockupDoctorSettings.tsx` | Create — standalone mockup with hardcoded data, toggle for custom vs global pricing, editable inputs |
| `src/App.tsx` | Add route `/mockup-doctor-settings` (no auth) |

## Design

- Matches existing admin dashboard style (same Card, Badge, Input, Switch components from shadcn/ui)
- Uses the same color palette and typography as the current admin dashboard
- Fully interactive locally (state managed in-component, no database calls)
- Language toggle (DE/EN) like the Befundbericht preview

