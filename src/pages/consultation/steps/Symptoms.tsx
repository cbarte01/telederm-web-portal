import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConsultationDraft, SymptomType, SymptomSeverity } from "@/types/consultation";

interface SymptomsProps {
  draft: ConsultationDraft;
  updateDraft: (updates: Partial<ConsultationDraft>) => void;
  onNext: () => void;
}

const SYMPTOMS: SymptomType[] = [
  "itching", "pain", "burning", "swelling", "oozing", "bleeding", "flaking", "none"
];

const SEVERITY_LEVELS: SymptomSeverity[] = ["mild", "moderate", "severe"];

const Symptoms = ({ draft, updateDraft, onNext }: SymptomsProps) => {
  const { t } = useTranslation("consultation");

  const toggleSymptom = (symptom: SymptomType) => {
    let updated: SymptomType[];
    
    if (symptom === "none") {
      // If "none" is selected, clear all other symptoms
      updated = draft.symptoms.includes("none") ? [] : ["none"];
    } else {
      // Remove "none" if selecting other symptoms
      const withoutNone = draft.symptoms.filter(s => s !== "none");
      updated = withoutNone.includes(symptom)
        ? withoutNone.filter(s => s !== symptom)
        : [...withoutNone, symptom];
    }
    
    updateDraft({ symptoms: updated });
  };

  const hasNonNoneSymptoms = draft.symptoms.length > 0 && !draft.symptoms.includes("none");
  const canContinue = draft.symptoms.length > 0 && 
    (!hasNonNoneSymptoms || draft.symptomSeverity !== undefined);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("step6.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("step6.subtitle")}
        </p>
      </div>

      {/* Symptoms grid */}
      <div className="grid grid-cols-2 gap-3">
        {SYMPTOMS.map(symptom => (
          <button
            key={symptom}
            onClick={() => toggleSymptom(symptom)}
            className={cn(
              "p-4 rounded-xl border-2 transition-all text-center",
              "hover:border-primary hover:bg-primary/5",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              draft.symptoms.includes(symptom)
                ? "border-primary bg-primary/5"
                : "border-border bg-card",
              symptom === "none" && "col-span-2"
            )}
          >
            <span className="font-medium text-foreground">
              {t(`step6.symptoms.${symptom}`)}
            </span>
          </button>
        ))}
      </div>

      {/* Severity (only show if symptoms other than "none" are selected) */}
      {hasNonNoneSymptoms && (
        <div className="space-y-3">
          <p className="font-medium text-foreground">
            {t("step6.severity")}
          </p>
          <div className="flex gap-3">
            {SEVERITY_LEVELS.map(level => (
              <button
                key={level}
                onClick={() => updateDraft({ symptomSeverity: level })}
                className={cn(
                  "flex-1 p-4 rounded-xl border-2 transition-all",
                  "hover:border-primary hover:bg-primary/5",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  draft.symptomSeverity === level
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                )}
              >
                <span className="font-medium text-foreground">
                  {t(`step6.severityLevels.${level}`)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

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

export default Symptoms;
