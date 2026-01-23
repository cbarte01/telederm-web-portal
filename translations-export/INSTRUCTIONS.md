# Translation Files - Editor Instructions

## Overview
This folder contains all translation strings from the Telederm website exported as CSV files. Each file represents a different section of the website.

## Files Included
| File | Description | Approx. Rows |
|------|-------------|--------------|
| `home.csv` | Main homepage content (hero, pricing, FAQ, reviews, doctors, about) | ~180 |
| `common.csv` | Navigation, buttons, footer, certificates | ~50 |
| `auth.csv` | Login, signup, password reset, dashboards | ~110 |
| `consultation.csv` | 10-step consultation flow | ~100 |
| `blog.csv` | Blog page and article content | ~55 |
| `conditions.csv` | Skin conditions library page | ~25 |
| `doctors.csv` | "For Doctors" partner page | ~85 |
| `companies.csv` | "For Companies" B2B page | ~110 |

**Total: ~715 translation strings**

---

## Column Structure

| Column | Description |
|--------|-------------|
| **Key Path** | Technical identifier - **DO NOT MODIFY** |
| **English** | English text - Edit as needed |
| **German** | German text - Edit as needed |
| **Notes** | Space for questions or comments |

---

## ⚠️ Important Guidelines

### 1. DO NOT Modify Column A (Key Path)
The Key Path is used by the code to find translations. Changing it will break the website.

### 2. Preserve Placeholders
Some text contains placeholders like:
- `{{time}}` - Will be replaced with actual time (e.g., "24 hours")
- `{{current}}` / `{{total}}` - Step numbers (e.g., "Step 2 of 10")
- `{{count}}` - Numeric counts
- `{{year}}` - Current year

**Example:**
- ✅ Correct: `"Response within {{time}}"` → `"Antwort innerhalb von {{time}}"`
- ❌ Wrong: `"Response within 24 hours"` (removed placeholder)

### 3. Keep Translations Similar Length
Try to keep translated text roughly the same length as the original. Very long translations may break the layout.

### 4. Use Column D for Notes
If you have questions about context or want to suggest alternatives, add them in the Notes column.

### 5. Array Items
Some keys end with `[0]`, `[1]`, etc. These are list items (like pricing plan features). Keep them in order.

---

## How to Import into Google Sheets

1. Open Google Sheets
2. Go to **File → Import**
3. Upload the CSV file
4. Select:
   - Import location: **Replace current sheet** or **Insert new sheet**
   - Separator type: **Comma**
   - Convert text to numbers: **No**
5. Click **Import data**

### Recommended Setup
- Freeze Row 1 (header row)
- Set column widths: A=200px, B=400px, C=400px, D=200px
- Enable text wrapping for columns B, C, D

---

## When You're Done

1. Export each sheet as CSV (File → Download → CSV)
2. Send the updated CSV files back
3. I will re-import them into the codebase

---

## Questions?
Use the Notes column to add any questions about specific translations. I'll clarify the context when re-importing.
