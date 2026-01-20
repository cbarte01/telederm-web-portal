import { useState, useEffect, useCallback } from 'react';
import { ConsultationDraft, INITIAL_DRAFT } from '@/types/consultation';

const STORAGE_KEY = 'telederm_consultation_draft';

export const useConsultationDraft = () => {
  const [draft, setDraft] = useState<ConsultationDraft>(INITIAL_DRAFT);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ConsultationDraft;
        // Check if draft is not too old (24 hours)
        const lastUpdated = new Date(parsed.lastUpdated);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setDraft(parsed);
        } else {
          // Clear old draft
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Failed to load consultation draft:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save draft to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
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
    localStorage.removeItem(STORAGE_KEY);
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
