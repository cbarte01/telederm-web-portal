/**
 * Sanitization utilities for user input
 * These functions clean and normalize user input before storage
 */

/**
 * Removes potentially dangerous HTML/script content from text
 * Uses a simple allowlist approach - strips all HTML tags
 */
export function sanitizeText(input: string): string {
  if (typeof input !== "string") return "";

  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove script-like patterns
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    // Normalize whitespace (collapse multiple spaces, trim)
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Sanitizes a name field (more restrictive)
 * Allows letters, spaces, hyphens, apostrophes, and common diacritics
 */
export function sanitizeName(input: string): string {
  if (typeof input !== "string") return "";

  return input
    // Remove anything that's not a letter, space, hyphen, apostrophe, or period
    .replace(/[^\p{L}\s\-'.]/gu, "")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Sanitizes a date string to ensure YYYY-MM-DD format
 */
export function sanitizeDate(input: string): string {
  if (typeof input !== "string") return "";

  // Remove any non-digit and non-hyphen characters
  const cleaned = input.replace(/[^\d-]/g, "");

  // Validate format
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    // Basic date validation
    const date = new Date(cleaned);
    if (!isNaN(date.getTime())) {
      return cleaned;
    }
  }

  return "";
}

/**
 * Sanitizes description/notes fields
 * More permissive than name, but still removes dangerous content
 */
export function sanitizeDescription(input: string): string {
  if (typeof input !== "string") return "";

  return sanitizeText(input);
}

/**
 * Sanitizes referral codes (alphanumeric + hyphens only)
 */
export function sanitizeReferralCode(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toUpperCase()
    .substring(0, 50);
}

/**
 * Sanitizes UUID strings
 */
export function sanitizeUUID(input: string): string {
  if (typeof input !== "string") return "";

  const cleaned = input.toLowerCase().trim();

  // Validate UUID format
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
      cleaned
    )
  ) {
    return cleaned;
  }

  return "";
}

/**
 * Generic sanitization for consultation draft fields
 * Maps field names to appropriate sanitization functions
 */
export function sanitizeField(
  fieldName: string,
  value: unknown
): unknown {
  if (value === null || value === undefined) return value;

  // Handle string fields
  if (typeof value === "string") {
    switch (fieldName) {
      case "fullName":
      case "referredDoctorName":
        return sanitizeName(value);

      case "dateOfBirth":
        return sanitizeDate(value);

      case "referralCode":
        return sanitizeReferralCode(value);

      case "referredDoctorId":
        return sanitizeUUID(value);

      case "changeDescription":
      case "allergiesDescription":
      case "medicationsDescription":
      case "selfTreatmentDescription":
      case "additionalNotes":
      case "referredPracticeName":
      case "referredWelcomeMessage":
        return sanitizeDescription(value);

      default:
        return sanitizeText(value);
    }
  }

  // Handle arrays (e.g., bodyLocations, symptoms, photos)
  if (Array.isArray(value)) {
    return value.filter((item) => {
      // Allow string items (bodyLocations, symptoms)
      if (typeof item === "string") {
        return item.length <= 100;
      }
      // Allow objects (photos array contains photo objects)
      if (typeof item === "object" && item !== null) {
        return true;
      }
      return false;
    });
  }

  // Handle booleans
  if (typeof value === "boolean") {
    return value;
  }

  // Handle numbers
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  // For objects (like photos), return as-is - they have their own validation
  if (typeof value === "object") {
    return value;
  }

  return value;
}

/**
 * Sanitizes an entire draft object
 */
export function sanitizeDraft<T extends Record<string, unknown>>(
  draft: T
): T {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(draft)) {
    sanitized[key] = sanitizeField(key, value);
  }

  return sanitized as T;
}
