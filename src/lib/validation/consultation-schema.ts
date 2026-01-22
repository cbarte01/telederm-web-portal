import { z } from "zod";

// ============= Enum Schemas =============

export const ConcernCategorySchema = z.enum([
  "skin",
  "hair",
  "nails",
  "infections",
  "allergies",
  "pigmentation",
]);

export const BodyAreaSchema = z.enum([
  "head",
  "face",
  "neck",
  "chest",
  "abdomen",
  "upper_back",
  "lower_back",
  "left_shoulder",
  "right_shoulder",
  "left_upper_arm",
  "right_upper_arm",
  "left_forearm",
  "right_forearm",
  "left_hand",
  "right_hand",
  "groin",
  "left_thigh",
  "right_thigh",
  "left_knee",
  "right_knee",
  "left_lower_leg",
  "right_lower_leg",
  "left_foot",
  "right_foot",
]);

export const SymptomOnsetSchema = z.enum([
  "today",
  "thisWeek",
  "thisMonth",
  "longerAgo",
]);

export const SymptomTypeSchema = z.enum([
  "itching",
  "pain",
  "burning",
  "swelling",
  "oozing",
  "bleeding",
  "flaking",
  "none",
]);

export const SymptomSeveritySchema = z.enum(["mild", "moderate", "severe"]);

export const BiologicalSexSchema = z.enum(["male", "female", "diverse"]);

export const PhotoTypeSchema = z.enum(["closeup", "context", "additional"]);

// ============= Complex Type Schemas =============

export const ConsultationPhotoSchema = z.object({
  type: PhotoTypeSchema,
  // File objects can't be stored in sessionStorage, so we only validate serializable fields
  preview: z.string().optional(),
  storagePath: z.string().optional(),
});

// ============= Main Consultation Draft Schema =============

export const ConsultationDraftSchema = z.object({
  // Step 1 - Concern
  concernCategory: ConcernCategorySchema.optional(),

  // Step 2 - Body location (max 10 locations for reasonable limit)
  bodyLocations: z.array(BodyAreaSchema).max(20).default([]),

  // Step 3-4 - Photos (max 10 photos)
  photos: z.array(ConsultationPhotoSchema).max(10).default([]),

  // Step 5 - Timeline
  symptomOnset: SymptomOnsetSchema.optional(),
  hasChanged: z.boolean().optional(),
  changeDescription: z
    .string()
    .max(2000, "Change description must be 2000 characters or less")
    .optional(),

  // Step 6 - Symptoms
  symptoms: z.array(SymptomTypeSchema).max(8).default([]),
  symptomSeverity: SymptomSeveritySchema.optional(),

  // Step 7 - Medical history
  hasAllergies: z.boolean().optional(),
  allergiesDescription: z
    .string()
    .max(1000, "Allergies description must be 1000 characters or less")
    .optional(),
  takesMedications: z.boolean().optional(),
  medicationsDescription: z
    .string()
    .max(1000, "Medications description must be 1000 characters or less")
    .optional(),
  hasSelfTreated: z.boolean().optional(),
  selfTreatmentDescription: z
    .string()
    .max(1000, "Self-treatment description must be 1000 characters or less")
    .optional(),

  // Step 8 - Personal details
  fullName: z
    .string()
    .max(200, "Full name must be 200 characters or less")
    .optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional()
    .or(z.literal("")),
  // Note: socialSecurityNumber is intentionally NOT in this schema
  // It's kept in memory only and never persisted to storage
  biologicalSex: BiologicalSexSchema.optional(),
  additionalNotes: z
    .string()
    .max(3000, "Additional notes must be 3000 characters or less")
    .optional(),

  // Meta
  currentStep: z.number().int().min(1).max(10).default(1),
  lastUpdated: z.string().datetime().or(z.string()),

  // Referral (B2B2C) - validated but not strictly required
  referralCode: z
    .string()
    .max(50, "Referral code must be 50 characters or less")
    .optional(),
  referredDoctorId: z.string().uuid().optional().or(z.literal("")),
  referredDoctorName: z
    .string()
    .max(200, "Doctor name must be 200 characters or less")
    .optional(),
  referredPracticeName: z
    .string()
    .max(200, "Practice name must be 200 characters or less")
    .optional(),
  referredWelcomeMessage: z
    .string()
    .max(1000, "Welcome message must be 1000 characters or less")
    .optional(),
});

// Type inference from schema
export type ValidatedConsultationDraft = z.infer<typeof ConsultationDraftSchema>;

// ============= Validation Functions =============

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
}

/**
 * Validates consultation draft data loaded from storage
 * Returns validated data or null if validation fails
 */
export function validateConsultationDraft(
  data: unknown
): ValidationResult<ValidatedConsultationDraft> {
  const result = ConsultationDraftSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
}

/**
 * Validates a partial update to the draft
 */
export function validatePartialDraft(
  data: unknown
): ValidationResult<Partial<ValidatedConsultationDraft>> {
  const PartialSchema = ConsultationDraftSchema.partial();
  const result = PartialSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
}

/**
 * Validates step number is within valid range
 */
export function validateStep(step: unknown): step is number {
  return (
    typeof step === "number" &&
    Number.isInteger(step) &&
    step >= 1 &&
    step <= 10
  );
}
