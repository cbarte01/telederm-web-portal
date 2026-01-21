export type ConcernCategory = 
  | 'skin'
  | 'hair'
  | 'nails'
  | 'infections'
  | 'allergies'
  | 'pigmentation';

export type BodyArea =
  | 'head'
  | 'face'
  | 'neck'
  | 'chest'
  | 'abdomen'
  | 'upper_back'
  | 'lower_back'
  | 'left_shoulder'
  | 'right_shoulder'
  | 'left_upper_arm'
  | 'right_upper_arm'
  | 'left_forearm'
  | 'right_forearm'
  | 'left_hand'
  | 'right_hand'
  | 'groin'
  | 'left_thigh'
  | 'right_thigh'
  | 'left_knee'
  | 'right_knee'
  | 'left_lower_leg'
  | 'right_lower_leg'
  | 'left_foot'
  | 'right_foot';

export type SymptomOnset = 'today' | 'thisWeek' | 'thisMonth' | 'longerAgo';

export type SymptomType = 
  | 'itching'
  | 'pain'
  | 'burning'
  | 'swelling'
  | 'oozing'
  | 'bleeding'
  | 'flaking'
  | 'none';

export type SymptomSeverity = 'mild' | 'moderate' | 'severe';

export type BiologicalSex = 'male' | 'female' | 'diverse';

export type PhotoType = 'closeup' | 'context' | 'additional';

export interface ConsultationPhoto {
  type: PhotoType;
  file?: File;
  preview?: string;
  storagePath?: string;
}

export interface ConsultationDraft {
  // Step 1 - Concern
  concernCategory?: ConcernCategory;
  
  // Step 2 - Body location
  bodyLocations: BodyArea[];
  
  // Step 3-4 - Photos
  photos: ConsultationPhoto[];
  
  // Step 5 - Timeline
  symptomOnset?: SymptomOnset;
  hasChanged?: boolean;
  changeDescription?: string;
  
  // Step 6 - Symptoms
  symptoms: SymptomType[];
  symptomSeverity?: SymptomSeverity;
  
  // Step 7 - Medical history
  hasAllergies?: boolean;
  allergiesDescription?: string;
  takesMedications?: boolean;
  medicationsDescription?: string;
  hasSelfTreated?: boolean;
  selfTreatmentDescription?: string;
  
  // Step 8 - Personal details
  fullName?: string;
  dateOfBirth?: string;
  socialSecurityNumber?: string;
  biologicalSex?: BiologicalSex;
  additionalNotes?: string;
  
  // Meta
  currentStep: number;
  lastUpdated: string;
  
  // Referral (B2B2C)
  referralCode?: string;
  referredDoctorId?: string;
  referredDoctorName?: string;
  referredPracticeName?: string;
  referredWelcomeMessage?: string;
}

export const INITIAL_DRAFT: ConsultationDraft = {
  bodyLocations: [],
  photos: [],
  symptoms: [],
  currentStep: 1,
  lastUpdated: new Date().toISOString(),
};

export const BODY_AREA_LABELS: Record<BodyArea, { en: string; de: string }> = {
  head: { en: 'Head', de: 'Kopf' },
  face: { en: 'Face', de: 'Gesicht' },
  neck: { en: 'Neck', de: 'Hals' },
  chest: { en: 'Chest', de: 'Brust' },
  abdomen: { en: 'Abdomen', de: 'Bauch' },
  upper_back: { en: 'Upper Back', de: 'Oberer Rücken' },
  lower_back: { en: 'Lower Back', de: 'Unterer Rücken' },
  left_shoulder: { en: 'Left Shoulder', de: 'Linke Schulter' },
  right_shoulder: { en: 'Right Shoulder', de: 'Rechte Schulter' },
  left_upper_arm: { en: 'Left Upper Arm', de: 'Linker Oberarm' },
  right_upper_arm: { en: 'Right Upper Arm', de: 'Rechter Oberarm' },
  left_forearm: { en: 'Left Forearm', de: 'Linker Unterarm' },
  right_forearm: { en: 'Right Forearm', de: 'Rechter Unterarm' },
  left_hand: { en: 'Left Hand', de: 'Linke Hand' },
  right_hand: { en: 'Right Hand', de: 'Rechte Hand' },
  groin: { en: 'Groin', de: 'Leiste' },
  left_thigh: { en: 'Left Thigh', de: 'Linker Oberschenkel' },
  right_thigh: { en: 'Right Thigh', de: 'Rechter Oberschenkel' },
  left_knee: { en: 'Left Knee', de: 'Linkes Knie' },
  right_knee: { en: 'Right Knee', de: 'Rechtes Knie' },
  left_lower_leg: { en: 'Left Lower Leg', de: 'Linker Unterschenkel' },
  right_lower_leg: { en: 'Right Lower Leg', de: 'Rechter Unterschenkel' },
  left_foot: { en: 'Left Foot', de: 'Linker Fuß' },
  right_foot: { en: 'Right Foot', de: 'Rechter Fuß' },
};
