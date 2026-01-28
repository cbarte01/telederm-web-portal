import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ConsultationDraft } from "@/types/consultation";

interface MedicalHistoryProps {
  draft: ConsultationDraft;
  updateDraft: (updates: Partial<ConsultationDraft>) => void;
  onNext: () => void;
}

const MedicalHistory = ({ draft, updateDraft, onNext }: MedicalHistoryProps) => {
  const { t } = useTranslation("consultation");
  
  const allergiesRef = useRef<HTMLTextAreaElement>(null);
  const medicationsRef = useRef<HTMLTextAreaElement>(null);
  const selfTreatmentRef = useRef<HTMLTextAreaElement>(null);

  const canContinue = 
    draft.hasAllergies !== undefined && 
    draft.takesMedications !== undefined && 
    draft.hasSelfTreated !== undefined;

  // Auto-focus textareas when "Yes" is selected
  useEffect(() => {
    if (draft.hasAllergies && allergiesRef.current) {
      allergiesRef.current.focus();
    }
  }, [draft.hasAllergies]);

  useEffect(() => {
    if (draft.takesMedications && medicationsRef.current) {
      medicationsRef.current.focus();
    }
  }, [draft.takesMedications]);

  useEffect(() => {
    if (draft.hasSelfTreated && selfTreatmentRef.current) {
      selfTreatmentRef.current.focus();
    }
  }, [draft.hasSelfTreated]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("step7.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("step7.subtitle")}
        </p>
      </div>

      {/* Allergies */}
      <div className="space-y-3 p-4 rounded-xl border border-border bg-card">
        <p className="font-medium text-foreground">
          {t("step7.allergies.question")}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              updateDraft({ hasAllergies: true });
            }}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg border-2 transition-all",
              "hover:border-primary hover:bg-primary/5",
              draft.hasAllergies === true
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            {t("step7.allergies.yes")}
          </button>
          <button
            type="button"
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              updateDraft({ hasAllergies: false, allergiesDescription: undefined });
            }}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg border-2 transition-all",
              "hover:border-primary hover:bg-primary/5",
              draft.hasAllergies === false
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            {t("step7.allergies.no")}
          </button>
        </div>
        {draft.hasAllergies && (
          <Textarea
            ref={allergiesRef}
            value={draft.allergiesDescription || ""}
            onChange={(e) => updateDraft({ allergiesDescription: e.target.value })}
            placeholder={t("step7.allergies.placeholder")}
            className="min-h-[80px] resize-none"
          />
        )}
      </div>

      {/* Medications */}
      <div className="space-y-3 p-4 rounded-xl border border-border bg-card">
        <p className="font-medium text-foreground">
          {t("step7.medications.question")}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              updateDraft({ takesMedications: true });
            }}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg border-2 transition-all",
              "hover:border-primary hover:bg-primary/5",
              draft.takesMedications === true
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            {t("step7.medications.yes")}
          </button>
          <button
            type="button"
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              updateDraft({ takesMedications: false, medicationsDescription: undefined });
            }}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg border-2 transition-all",
              "hover:border-primary hover:bg-primary/5",
              draft.takesMedications === false
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            {t("step7.medications.no")}
          </button>
        </div>
        {draft.takesMedications && (
          <Textarea
            ref={medicationsRef}
            value={draft.medicationsDescription || ""}
            onChange={(e) => updateDraft({ medicationsDescription: e.target.value })}
            placeholder={t("step7.medications.placeholder")}
            className="min-h-[80px] resize-none"
          />
        )}
      </div>

      {/* Self-treatment */}
      <div className="space-y-3 p-4 rounded-xl border border-border bg-card">
        <p className="font-medium text-foreground">
          {t("step7.selfTreated.question")}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              updateDraft({ hasSelfTreated: true });
            }}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg border-2 transition-all",
              "hover:border-primary hover:bg-primary/5",
              draft.hasSelfTreated === true
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            {t("step7.selfTreated.yes")}
          </button>
          <button
            type="button"
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              updateDraft({ hasSelfTreated: false, selfTreatmentDescription: undefined });
            }}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg border-2 transition-all",
              "hover:border-primary hover:bg-primary/5",
              draft.hasSelfTreated === false
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            {t("step7.selfTreated.no")}
          </button>
        </div>
        {draft.hasSelfTreated && (
          <Textarea
            ref={selfTreatmentRef}
            value={draft.selfTreatmentDescription || ""}
            onChange={(e) => updateDraft({ selfTreatmentDescription: e.target.value })}
            placeholder={t("step7.selfTreated.placeholder")}
            className="min-h-[80px] resize-none"
          />
        )}
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={onNext}
        disabled={!canContinue}
      >
        {t("flow.next")}
      </Button>
    </div>
  );
};

export default MedicalHistory;
