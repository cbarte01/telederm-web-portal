
# Fix: Doctor Signature Not Appearing in Honorarnote

## Problem Identified

The edge function logs show the signature file is being loaded (2078 bytes) but fails to embed with error:
```
"Error: SOI not found in JPEG"
```

This means the uploaded file (`signature.jpeg`) is **not a valid JPEG format**. The file is likely:
- A PNG file saved with a `.jpeg` extension
- A WebP or SVG file with wrong extension
- A corrupted image file

---

## Solution Options

### Option A: Re-upload the Signature (Quickest Fix)
The doctor can re-upload their signature ensuring it's a proper PNG or JPEG file:
1. Go to Profile page
2. Remove the current signature
3. Upload a new signature image that is a genuine PNG or JPEG file

### Option B: Improve Image Format Detection (Code Fix)
Enhance the edge function to handle more image formats:

**Changes to `supabase/functions/generate-honorarnote/index.ts`:**

1. Add better format detection by checking multiple magic bytes:
   - PNG: `0x89 0x50 0x4E 0x47`
   - JPEG: `0xFF 0xD8 0xFF`
   - WebP: Check for RIFF header

2. Add fallback handling when embedding fails:
   - Try PNG first
   - If that fails, try JPEG
   - Log clear message about unsupported format

3. Update the signature upload component to validate file format on upload

---

## Recommended Approach

**Implement Option B** - this will handle edge cases and prevent future issues:

```text
File to modify:
  supabase/functions/generate-honorarnote/index.ts
    - Update signature embedding logic to try PNG first, then JPEG
    - Add proper JPEG magic byte detection (0xFF 0xD8)
    - Add warning log with helpful message about file format
```

---

## Technical Details

The current code checks only the first 2 bytes for PNG:
```javascript
if (signatureImageBytes[0] === 0x89 && signatureImageBytes[1] === 0x50) {
  signatureImage = await pdfDoc.embedPng(signatureImageBytes);
} else {
  signatureImage = await pdfDoc.embedJpg(signatureImageBytes);  // Fails here
}
```

The fix will add proper JPEG detection and try-catch fallback:
```javascript
// Check PNG magic bytes (89 50 4E 47)
const isPng = signatureImageBytes[0] === 0x89 && signatureImageBytes[1] === 0x50;
// Check JPEG magic bytes (FF D8 FF)
const isJpeg = signatureImageBytes[0] === 0xFF && signatureImageBytes[1] === 0xD8;

if (isPng) {
  signatureImage = await pdfDoc.embedPng(signatureImageBytes);
} else if (isJpeg) {
  signatureImage = await pdfDoc.embedJpg(signatureImageBytes);
} else {
  // Try PNG as fallback (some PNGs may have non-standard headers)
  try {
    signatureImage = await pdfDoc.embedPng(signatureImageBytes);
  } catch {
    signatureImage = await pdfDoc.embedJpg(signatureImageBytes);
  }
}
```

---

## Implementation Steps

1. Update signature embedding code with proper format detection
2. Apply same fix to logo embedding for consistency
3. Deploy the edge function
4. Test with the existing signature
