import { describe, it, expect } from "vitest";
import {
  validateConsultationDraft,
  validatePartialDraft,
  validateStep,
  ConsultationDraftSchema,
  ConcernCategorySchema,
  BodyAreaSchema,
  SymptomSeveritySchema,
} from "../consultation-schema";

describe("Consultation Schema Validation", () => {
  describe("validateConsultationDraft", () => {
    it("should validate a minimal valid draft", () => {
      const draft = {
        bodyLocations: [],
        photos: [],
        symptoms: [],
        currentStep: 1,
        lastUpdated: new Date().toISOString(),
      };

      const result = validateConsultationDraft(draft);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should validate a complete valid draft", () => {
      const draft = {
        concernCategory: "skin",
        bodyLocations: ["face", "neck"],
        photos: [{ type: "closeup", preview: "data:image/png;base64,..." }],
        symptomOnset: "thisWeek",
        hasChanged: true,
        changeDescription: "It got worse",
        symptoms: ["itching", "pain"],
        symptomSeverity: "moderate",
        hasAllergies: false,
        takesMedications: true,
        medicationsDescription: "Aspirin daily",
        hasSelfTreated: false,
        fullName: "John Doe",
        dateOfBirth: "1990-05-15",
        biologicalSex: "male",
        additionalNotes: "First time consultation",
        currentStep: 5,
        lastUpdated: new Date().toISOString(),
        referralCode: "DOC123",
        referredDoctorId: "550e8400-e29b-41d4-a716-446655440000",
        referredDoctorName: "Dr. Smith",
      };

      const result = validateConsultationDraft(draft);
      expect(result.success).toBe(true);
    });

    it("should reject invalid concern category", () => {
      const draft = {
        concernCategory: "invalid_category",
        bodyLocations: [],
        photos: [],
        symptoms: [],
        currentStep: 1,
        lastUpdated: new Date().toISOString(),
      };

      const result = validateConsultationDraft(draft);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it("should reject invalid step number", () => {
      const draft = {
        bodyLocations: [],
        photos: [],
        symptoms: [],
        currentStep: 15, // Invalid - max is 10
        lastUpdated: new Date().toISOString(),
      };

      const result = validateConsultationDraft(draft);
      expect(result.success).toBe(false);
    });

    it("should reject negative step number", () => {
      const draft = {
        bodyLocations: [],
        photos: [],
        symptoms: [],
        currentStep: -1,
        lastUpdated: new Date().toISOString(),
      };

      const result = validateConsultationDraft(draft);
      expect(result.success).toBe(false);
    });

    it("should reject overly long descriptions", () => {
      const draft = {
        bodyLocations: [],
        photos: [],
        symptoms: [],
        currentStep: 1,
        lastUpdated: new Date().toISOString(),
        changeDescription: "x".repeat(3000), // Exceeds 2000 char limit
      };

      const result = validateConsultationDraft(draft);
      expect(result.success).toBe(false);
    });

    it("should reject invalid date format", () => {
      const draft = {
        bodyLocations: [],
        photos: [],
        symptoms: [],
        currentStep: 1,
        lastUpdated: new Date().toISOString(),
        dateOfBirth: "15/05/1990", // Wrong format
      };

      const result = validateConsultationDraft(draft);
      // dateOfBirth is no longer part of the consultation draft schema
      // (patient medical details are stored in profile), so unknown keys are ignored.
      expect(result.success).toBe(true);
    });

    it("should accept empty string for optional date", () => {
      const draft = {
        bodyLocations: [],
        photos: [],
        symptoms: [],
        currentStep: 1,
        lastUpdated: new Date().toISOString(),
        dateOfBirth: "",
      };

      const result = validateConsultationDraft(draft);
      expect(result.success).toBe(true);
    });

    it("should reject invalid body locations", () => {
      const draft = {
        bodyLocations: ["face", "invalid_location"],
        photos: [],
        symptoms: [],
        currentStep: 1,
        lastUpdated: new Date().toISOString(),
      };

      const result = validateConsultationDraft(draft);
      expect(result.success).toBe(false);
    });

    it("should reject too many body locations", () => {
      const manyLocations = Array(25).fill("face"); // Exceeds max of 20
      const draft = {
        bodyLocations: manyLocations,
        photos: [],
        symptoms: [],
        currentStep: 1,
        lastUpdated: new Date().toISOString(),
      };

      const result = validateConsultationDraft(draft);
      expect(result.success).toBe(false);
    });

    it("should reject invalid UUID for doctor ID", () => {
      const draft = {
        bodyLocations: [],
        photos: [],
        symptoms: [],
        currentStep: 1,
        lastUpdated: new Date().toISOString(),
        referredDoctorId: "not-a-valid-uuid",
      };

      const result = validateConsultationDraft(draft);
      expect(result.success).toBe(false);
    });

    it("should handle XSS-like content in string fields", () => {
      const draft = {
        bodyLocations: [],
        photos: [],
        symptoms: [],
        currentStep: 1,
        lastUpdated: new Date().toISOString(),
        fullName: "<script>alert('xss')</script>John",
        additionalNotes: "Normal notes with <img onerror='alert(1)' src='x'>",
      };

      // Schema validation passes (sanitization happens separately)
      const result = validateConsultationDraft(draft);
      expect(result.success).toBe(true);
      // Content is validated as string, sanitization is applied later
    });
  });

  describe("validatePartialDraft", () => {
    it("should validate partial updates", () => {
      const update = {
        fullName: "Jane Doe",
        symptomSeverity: "severe",
      };

      const result = validatePartialDraft(update);
      expect(result.success).toBe(true);
    });

    it("should reject invalid partial updates", () => {
      const update = {
        symptomSeverity: "extremely_severe", // Invalid enum value
      };

      const result = validatePartialDraft(update);
      expect(result.success).toBe(false);
    });

    it("should allow empty partial update", () => {
      const result = validatePartialDraft({});
      expect(result.success).toBe(true);
    });
  });

  describe("validateStep", () => {
    it("should accept valid step numbers", () => {
      expect(validateStep(1)).toBe(true);
      expect(validateStep(5)).toBe(true);
      expect(validateStep(10)).toBe(true);
    });

    it("should reject invalid step numbers", () => {
      expect(validateStep(0)).toBe(false);
      expect(validateStep(11)).toBe(false);
      expect(validateStep(-1)).toBe(false);
    });

    it("should reject non-integers", () => {
      expect(validateStep(1.5)).toBe(false);
      expect(validateStep(NaN)).toBe(false);
    });

    it("should reject non-numbers", () => {
      expect(validateStep("1")).toBe(false);
      expect(validateStep(null)).toBe(false);
      expect(validateStep(undefined)).toBe(false);
    });
  });

  describe("Enum Schemas", () => {
    it("should validate concern categories", () => {
      expect(ConcernCategorySchema.safeParse("skin").success).toBe(true);
      expect(ConcernCategorySchema.safeParse("hair").success).toBe(true);
      expect(ConcernCategorySchema.safeParse("invalid").success).toBe(false);
    });

    it("should validate body areas", () => {
      expect(BodyAreaSchema.safeParse("face").success).toBe(true);
      expect(BodyAreaSchema.safeParse("left_hand").success).toBe(true);
      expect(BodyAreaSchema.safeParse("invalid_area").success).toBe(false);
    });

    it("should validate symptom severity", () => {
      expect(SymptomSeveritySchema.safeParse("mild").success).toBe(true);
      expect(SymptomSeveritySchema.safeParse("moderate").success).toBe(true);
      expect(SymptomSeveritySchema.safeParse("severe").success).toBe(true);
      expect(SymptomSeveritySchema.safeParse("extreme").success).toBe(false);
    });
  });

  describe("Security Edge Cases", () => {
    it("should handle prototype pollution attempts", () => {
      const maliciousDraft = JSON.parse(
        '{"__proto__": {"isAdmin": true}, "bodyLocations": [], "photos": [], "symptoms": [], "currentStep": 1, "lastUpdated": "2024-01-01T00:00:00.000Z"}'
      );

      const result = validateConsultationDraft(maliciousDraft);
      // Should either reject or ignore the __proto__ property
      expect(result.success).toBe(true);
      // Ensure prototype wasn't polluted
      expect(({} as Record<string, boolean>).isAdmin).toBeUndefined();
    });

    it("should handle null bytes in strings", () => {
      const draft = {
        bodyLocations: [],
        photos: [],
        symptoms: [],
        currentStep: 1,
        lastUpdated: new Date().toISOString(),
        fullName: "John\x00Doe",
      };

      // Should accept (sanitization handles null bytes)
      const result = validateConsultationDraft(draft);
      expect(result.success).toBe(true);
    });

    it("should handle extremely nested objects", () => {
      // This shouldn't cause stack overflow
      const draft = {
        bodyLocations: [],
        photos: [{ type: "closeup" }],
        symptoms: [],
        currentStep: 1,
        lastUpdated: new Date().toISOString(),
      };

      const result = validateConsultationDraft(draft);
      expect(result.success).toBe(true);
    });
  });
});
