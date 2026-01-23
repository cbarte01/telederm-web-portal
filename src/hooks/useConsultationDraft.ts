import { useState, useEffect, useCallback } from 'react';
import { ConsultationDraft, INITIAL_DRAFT } from '@/types/consultation';
import { 
  validateConsultationDraft, 
  validatePartialDraft,
  validateStep 
} from '@/lib/validation/consultation-schema';
import { sanitizeDraft } from '@/lib/validation/sanitization';

const STORAGE_KEY = 'telederm_consultation_draft';

// Fields that should NEVER be persisted to storage for security reasons
// (Note: personal details like SSN are now stored in profiles table, not in draft)
const SENSITIVE_FIELDS: string[] = [];

// Strips sensitive fields before saving to storage
const stripSensitiveFields = (draft: ConsultationDraft): ConsultationDraft => {
  const sanitized = { ...draft };
  for (const field of SENSITIVE_FIELDS) {
    delete (sanitized as Record<string, unknown>)[field];
  }
  return sanitized;
};

export const useConsultationDraft = (preserveDraft = false) => {
  const [draft, setDraft] = useState<ConsultationDraft>(INITIAL_DRAFT);
  const [isLoaded, setIsLoaded] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Clear draft on mount unless we're resuming (e.g., returning from profile page)
  useEffect(() => {
    try {
      if (preserveDraft) {
        // Restore draft from storage if available
        const savedDraft = sessionStorage.getItem(STORAGE_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          setDraft(parsed);
        }
      } else {
        // Clear any existing draft for a fresh start
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
    setIsLoaded(true);
  }, [preserveDraft]);

  // Save draft to sessionStorage whenever it changes (excluding sensitive fields)
  useEffect(() => {
    if (isLoaded) {
      try {
        const sanitizedDraft = stripSensitiveFields(draft);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedDraft));
      } catch (e) {
        console.error('Failed to save consultation draft:', e);
      }
    }
  }, [draft, isLoaded]);

  const updateDraft = useCallback((updates: Partial<ConsultationDraft>) => {
    // Validate the partial update
    const validationResult = validatePartialDraft(updates);
    
    if (!validationResult.success) {
      console.warn(
        'Draft update validation failed:',
        validationResult.errors?.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
      );
      // Still allow the update but log the warning
      // This prevents blocking the user but maintains visibility
    }

    // Sanitize the updates before applying
    const sanitizedUpdates = sanitizeDraft(updates as Record<string, unknown>);

    setDraft(prev => ({
      ...prev,
      ...sanitizedUpdates,
      lastUpdated: new Date().toISOString(),
    }));
    
    // Clear any previous validation error on successful update
    setValidationError(null);
  }, []);

  const setStep = useCallback((step: number) => {
    // Validate step is within valid range
    if (!validateStep(step)) {
      console.warn(`Invalid step value: ${step}. Must be between 1 and 10.`);
      return;
    }

    setDraft(prev => ({
      ...prev,
      currentStep: step,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const clearDraft = useCallback(() => {
    setDraft(INITIAL_DRAFT);
    setValidationError(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const goToNextStep = useCallback(() => {
    setDraft(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 10),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const goToPreviousStep = useCallback(() => {
    setDraft(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  return {
    draft,
    isLoaded,
    validationError,
    updateDraft,
    setStep,
    clearDraft,
    goToNextStep,
    goToPreviousStep,
  };
};
