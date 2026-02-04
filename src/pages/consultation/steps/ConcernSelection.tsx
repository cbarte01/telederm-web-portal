import { useTranslation } from "react-i18next";
import { Stethoscope, Scissors, Hand, Bug, AlertTriangle, Droplets, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConsultationDraft, ConcernCategory } from "@/types/consultation";

interface ConcernSelectionProps {
  draft: ConsultationDraft;
  updateDraft: (updates: Partial<ConsultationDraft>) => void;
  onNext: () => void;
  setStep: (step: number) => void;
}

const CONCERNS: { id: ConcernCategory; icon: React.ElementType }[] = [
  { id: "skin", icon: Stethoscope },
  { id: "hair", icon: Scissors },
  { id: "nails", icon: Hand },
  { id: "infections", icon: Bug },
  { id: "allergies", icon: AlertTriangle },
  { id: "pigmentation", icon: Droplets },
];

const ConcernSelection = ({ draft, updateDraft, onNext, setStep }: ConcernSelectionProps) => {
  const { t, i18n } = useTranslation("consultation");
  const lang = i18n.language === "de" ? "de" : "en";

  const handleSelect = (category: ConcernCategory) => {
    updateDraft({ 
      concernCategory: category,
      consultationType: 'consultation'
    });
    onNext();
  };

  const handlePrescriptionRequest = () => {
    updateDraft({ 
      consultationType: 'prescription',
      concernCategory: undefined,
      pricingPlan: 'prescription'
    });
    // Skip to step 8 (Plan Selection)
    setStep(8);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("step1.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("step1.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {CONCERNS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            className={cn(
              "group relative p-6 rounded-xl border-2 transition-all duration-200",
              "hover:border-primary hover:shadow-lg hover:scale-[1.02]",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              draft.concernCategory === id && draft.consultationType !== 'prescription'
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card"
            )}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                draft.concernCategory === id && draft.consultationType !== 'prescription'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {t(`step1.categories.${id}.name`)}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {t(`step1.categories.${id}.description`)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Prescription Request Option - Separated with divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {lang === "de" ? "oder" : "or"}
          </span>
        </div>
      </div>

      <button
        onClick={handlePrescriptionRequest}
        className={cn(
          "w-full group relative p-6 rounded-xl border-2 transition-all duration-200",
          "hover:border-emerald-500 hover:shadow-lg hover:scale-[1.01]",
          "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
          draft.consultationType === 'prescription'
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-md"
            : "border-border bg-card"
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-colors shrink-0",
            draft.consultationType === 'prescription'
              ? "bg-emerald-500 text-white"
              : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white"
          )}>
            <FileText className="w-7 h-7" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground text-lg">
              {lang === "de" ? "Rezept anfordern" : "Request Prescription"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {lang === "de" 
                ? "Erneuern Sie ein bestehendes Rezept ohne vollständige Konsultation"
                : "Renew an existing prescription without a full consultation"}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ConcernSelection;
