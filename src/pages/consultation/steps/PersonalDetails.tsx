import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ConsultationDraft, BiologicalSex } from "@/types/consultation";

interface PersonalDetailsProps {
  draft: ConsultationDraft;
  updateDraft: (updates: Partial<ConsultationDraft>) => void;
  onNext: () => void;
}

const SEX_OPTIONS: BiologicalSex[] = ["male", "female", "diverse"];

const PersonalDetails = ({ draft, updateDraft, onNext }: PersonalDetailsProps) => {
  const { t } = useTranslation("consultation");

  const canContinue = draft.dateOfBirth && draft.biologicalSex;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("step8.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("step8.subtitle")}
        </p>
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth" className="text-foreground">
          {t("step8.dateOfBirth")}
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={draft.dateOfBirth || ""}
          onChange={(e) => updateDraft({ dateOfBirth: e.target.value })}
          max={new Date().toISOString().split("T")[0]}
          className="w-full"
        />
      </div>

      {/* Biological Sex */}
      <div className="space-y-3">
        <Label className="text-foreground">
          {t("step8.biologicalSex")}
        </Label>
        <div className="flex gap-3">
          {SEX_OPTIONS.map(sex => (
            <button
              key={sex}
              onClick={() => updateDraft({ biologicalSex: sex })}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl border-2 transition-all",
                "hover:border-primary hover:bg-primary/5",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                draft.biologicalSex === sex
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              <span className="font-medium text-foreground">
                {t(`step8.sexOptions.${sex}`)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="additionalNotes" className="text-foreground">
          {t("step8.additionalNotes")}
        </Label>
        <Textarea
          id="additionalNotes"
          value={draft.additionalNotes || ""}
          onChange={(e) => updateDraft({ additionalNotes: e.target.value })}
          placeholder={t("step8.notesPlaceholder")}
          className="min-h-[100px] resize-none"
        />
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

export default PersonalDetails;
