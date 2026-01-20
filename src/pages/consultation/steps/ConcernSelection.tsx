import { useTranslation } from "react-i18next";
import { Stethoscope, Scissors, Hand, Bug, AlertTriangle, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConsultationDraft, ConcernCategory } from "@/types/consultation";

interface ConcernSelectionProps {
  draft: ConsultationDraft;
  updateDraft: (updates: Partial<ConsultationDraft>) => void;
  onNext: () => void;
}

const CONCERNS: { id: ConcernCategory; icon: React.ElementType }[] = [
  { id: "skin", icon: Stethoscope },
  { id: "hair", icon: Scissors },
  { id: "nails", icon: Hand },
  { id: "infections", icon: Bug },
  { id: "allergies", icon: AlertTriangle },
  { id: "pigmentation", icon: Droplets },
];

const ConcernSelection = ({ draft, updateDraft, onNext }: ConcernSelectionProps) => {
  const { t } = useTranslation("consultation");

  const handleSelect = (category: ConcernCategory) => {
    updateDraft({ concernCategory: category });
    onNext();
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
              draft.concernCategory === id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card"
            )}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                draft.concernCategory === id
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
    </div>
  );
};

export default ConcernSelection;
