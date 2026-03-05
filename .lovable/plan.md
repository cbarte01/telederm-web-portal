

# Befundbericht Preview Page

## Summary

Create a standalone `/befundbericht-preview` page that renders a visual preview of the consultation report using mock data. This lets you iterate on the design in-browser without touching the existing Edge Function or app integration. The page will use a distinct clinical style (not matching the Honorarnote).

## What Gets Built

A single React page at `/befundbericht-preview` that:
- Renders a pixel-accurate A4 document preview using HTML/CSS (not PDF)
- Uses realistic mock consultation data (patient info, symptoms, doctor assessment, ICD-10)
- Shows the report in both German and English with a language toggle
- Is completely isolated from the rest of the app (no auth required, no database calls)

Once you're happy with the design, it can later be translated into the `pdf-lib` Edge Function code.

## Page Structure (Clinical Style)

```text
┌─────────────────────────────────────────┐
│  BEFUNDBERICHT                          │
│  Teledermatologische Konsultation       │
│  ─────────────────────────────────────  │
│                                         │
│  PATIENTENINFORMATIONEN                 │
│  Name: Max Mustermann                   │
│  Geburtsdatum: 15.03.1985               │
│  SVNr: 1234 150385                      │
│  Geschlecht: Männlich                   │
│  Adresse: Musterstraße 1, 1010 Wien     │
│  Versicherung: ÖGK                      │
│                                         │
│  KONSULTATIONSDETAILS                   │
│  Eingereicht: 01.03.2026                │
│  Beantwortet: 02.03.2026               │
│  Kategorie: Hauterkrankungen            │
│  Betroffene Bereiche: Gesicht, Hals     │
│  Symptome: Juckreiz, Rötung             │
│  Schweregrad: Mäßig                     │
│  Beginn: Diese Woche                    │
│                                         │
│  MEDIZINISCHE VORGESCHICHTE             │
│  Allergien: Keine                       │
│  Medikamente: Keine                     │
│  Selbstbehandlung: Nein                 │
│                                         │
│  ═══════════════════════════════════════ │
│  ÄRZTLICHE BEURTEILUNG                  │
│  ICD-10: L20.9                          │
│  Diagnose: Atopische Dermatitis         │
│                                         │
│  [Doctor's response text...]            │
│                                         │
│  Arzt: Dr. Anna Weber                   │
│  ═══════════════════════════════════════ │
│                                         │
│  ┌─ Wichtiger Hinweis ────────────────┐ │
│  │ Dieses Dokument ersetzt keine...   │ │
│  └────────────────────────────────────┘ │
│                                         │
│  Erstellt am: 05.03.2026    medena.at   │
└─────────────────────────────────────────┘
```

## Implementation

### Files to Create

| File | Description |
|------|-------------|
| `src/pages/BefundberichtPreview.tsx` | Standalone preview page with mock data, A4 styled div, language toggle |

### Files to Modify

| File | Description |
|------|-------------|
| `src/App.tsx` | Add route `/befundbericht-preview` (no auth required) |

### Design Details

- A4 aspect ratio container (210mm x 297mm scaled) centered on page
- Clean clinical typography: system sans-serif, muted color palette (dark gray text, subtle section dividers)
- Doctor's Assessment section visually distinguished with a left border accent or light background
- Disclaimer in a subtle box at the bottom
- Language toggle (DE/EN) floating in the top-right corner of the page (outside the document)
- Print-friendly CSS so `Ctrl+P` produces a clean output

### Mock Data

Hardcoded realistic mock data covering all fields: patient name, DOB, SSN, sex, address, insurance, concern category, body locations, symptoms, severity, onset, changes, allergies, medications, self-treatment, additional notes, ICD-10 code + description, doctor response, doctor name, dates.

