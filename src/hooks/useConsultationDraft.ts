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
const SENSITIVE_FIELDS: (keyof ConsultationDraft)[] = ['socialSecurityNumber'];

// Strips sensitive fields before saving to storage
const stripSensitiveFields = (draft: ConsultationDraft): Omit<ConsultationDraft, 'socialSecurityNumber'> => {
  const sanitized = { ...draft };
  for (const field of SENSITIVE_FIELDS) {
    delete (sanitized as Record<string, unknown>)[field];
  }
  return sanitized;
};

export const useConsultationDraft = () => {
  const [draft, setDraft] = useState<ConsultationDraft>(INITIAL_DRAFT);
  const [isLoaded, setIsLoaded] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load draft from sessionStorage on mount (clears when tab closes)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Validate the loaded data against our schema
        const validationResult = validateConsultationDraft(parsed);
        
        if (!validationResult.success) {
          // Data failed validation - could be corrupted or tampered
          console.warn(
            'Consultation draft validation failed, clearing corrupted data:',
            validationResult.errors?.issues.map(i => i.message).join(', ')
          );
          sessionStorage.removeItem(STORAGE_KEY);
          setValidationError('Previous draft data was invalid and has been cleared.');
          setIsLoaded(true);
          return;
        }

        const validatedData = validationResult.data!;
        
        // Check if draft is not too old (2 hours for session data)
        const lastUpdated = new Date(validatedData.lastUpdated);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 2) {
          // Merge validated data with INITIAL_DRAFT to ensure all required fields exist
          setDraft({
            ...INITIAL_DRAFT,
            ...validatedData,
          } as ConsultationDraft);
        } else {
          // Clear stale draft
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Failed to load consultation draft:', e);
      // Clear potentially corrupted storage
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore storage errors
      }
      setValidationError('Failed to load previous draft.');
    }
    setIsLoaded(true);
  }, []);

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
