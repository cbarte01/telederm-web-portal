import { useState, useEffect, useCallback } from 'react';
import { ConsultationDraft, INITIAL_DRAFT } from '@/types/consultation';

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

  // Load draft from sessionStorage on mount (clears when tab closes)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ConsultationDraft;
        // Check if draft is not too old (2 hours for session data)
        const lastUpdated = new Date(parsed.lastUpdated);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 2) {
          setDraft(parsed);
        } else {
          // Clear stale draft
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Failed to load consultation draft:', e);
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
    setDraft(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const setStep = useCallback((step: number) => {
    setDraft(prev => ({
      ...prev,
      currentStep: step,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const clearDraft = useCallback(() => {
    setDraft(INITIAL_DRAFT);
    sessionStorage.removeItem(STORAGE_KEY);
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
    updateDraft,
    setStep,
    clearDraft,
    goToNextStep,
    goToPreviousStep,
  };
};
