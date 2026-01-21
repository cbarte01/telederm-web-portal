import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useConsultationDraft } from "@/hooks/useConsultationDraft";
import { useReferralDoctor } from "@/hooks/useReferralDoctor";
import ReferralBanner from "@/components/consultation/ReferralBanner";
import teledermLogo from "@/assets/logo/telederm-logo.png";

// Step components
import ConcernSelection from "./steps/ConcernSelection";
import BodyLocationPicker from "./steps/BodyLocationPicker";
import PhotoGuidelines from "./steps/PhotoGuidelines";
import PhotoUpload from "./steps/PhotoUpload";
import TimelineChanges from "./steps/TimelineChanges";
import Symptoms from "./steps/Symptoms";
import MedicalHistory from "./steps/MedicalHistory";
import PersonalDetails from "./steps/PersonalDetails";
import AccountPayment from "./steps/AccountPayment";
import Confirmation from "./steps/Confirmation";

const TOTAL_STEPS = 10;

const ConsultationFlow = () => {
  const { t } = useTranslation("consultation");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { draft, isLoaded, updateDraft, goToNextStep, goToPreviousStep, setStep } = useConsultationDraft();
  
  // Handle referral code from URL
  const urlReferralCode = searchParams.get("ref");
  const { doctor: referralDoctor, isLoading: isLoadingReferral } = useReferralDoctor(
    // Only fetch if we have a URL param and haven't already saved to draft
    urlReferralCode && !draft.referralCode ? urlReferralCode : null
  );
  
  // Save referral info to draft when doctor is loaded
  useEffect(() => {
    if (referralDoctor && !draft.referralCode && urlReferralCode) {
      updateDraft({
        referralCode: urlReferralCode,
        referredDoctorId: referralDoctor.id,
        referredDoctorName: referralDoctor.fullName,
        referredPracticeName: referralDoctor.practiceName,
        referredWelcomeMessage: referralDoctor.welcomeMessage,
      });
    }
  }, [referralDoctor, draft.referralCode, urlReferralCode, updateDraft]);

  // Prevent accidental navigation away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (draft.currentStep > 1 && draft.currentStep < 10) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [draft.currentStep]);

  if (!isLoaded || isLoadingReferral) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const progress = (draft.currentStep / TOTAL_STEPS) * 100;

  const renderStep = () => {
    switch (draft.currentStep) {
      case 1:
        return <ConcernSelection draft={draft} updateDraft={updateDraft} onNext={goToNextStep} />;
      case 2:
        return <BodyLocationPicker draft={draft} updateDraft={updateDraft} onNext={goToNextStep} />;
      case 3:
        return <PhotoGuidelines onNext={goToNextStep} />;
      case 4:
        return <PhotoUpload draft={draft} updateDraft={updateDraft} onNext={goToNextStep} />;
      case 5:
        return <TimelineChanges draft={draft} updateDraft={updateDraft} onNext={goToNextStep} />;
      case 6:
        return <Symptoms draft={draft} updateDraft={updateDraft} onNext={goToNextStep} />;
      case 7:
        return <MedicalHistory draft={draft} updateDraft={updateDraft} onNext={goToNextStep} />;
      case 8:
        return <PersonalDetails draft={draft} updateDraft={updateDraft} onNext={goToNextStep} />;
      case 9:
        return <AccountPayment draft={draft} updateDraft={updateDraft} onNext={goToNextStep} setStep={setStep} />;
      case 10:
        return <Confirmation />;
      default:
        return <ConcernSelection draft={draft} updateDraft={updateDraft} onNext={goToNextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            {draft.currentStep > 1 && draft.currentStep < 10 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousStep}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <img src={teledermLogo} alt="Telederm" className="w-7 h-7 rounded-lg" />
              <span className="font-serif font-bold text-lg text-foreground hidden sm:inline">telederm</span>
            </Link>
          </div>
          
          <div className="flex-1 max-w-xs mx-4">
            <div className="text-xs text-center text-muted-foreground mb-1">
              {t("flow.progress", { current: draft.currentStep, total: TOTAL_STEPS })}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <Link to="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 py-6 md:py-10">
        <div className="max-w-2xl mx-auto">
          {/* Referral Banner */}
          {draft.referredDoctorName && draft.currentStep < 10 && (
            <ReferralBanner
              doctorName={draft.referredDoctorName}
              practiceName={draft.referredPracticeName}
              welcomeMessage={draft.currentStep === 1 ? draft.referredWelcomeMessage : undefined}
            />
          )}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={draft.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default ConsultationFlow;
