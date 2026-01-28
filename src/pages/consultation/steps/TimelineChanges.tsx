import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ConsultationDraft, SymptomOnset } from "@/types/consultation";

interface TimelineChangesProps {
  draft: ConsultationDraft;
  updateDraft: (updates: Partial<ConsultationDraft>) => void;
  onNext: () => void;
}

const ONSET_OPTIONS: SymptomOnset[] = ["today", "thisWeek", "thisMonth", "longerAgo"];

const TimelineChanges = ({ draft, updateDraft, onNext }: TimelineChangesProps) => {
  const { t } = useTranslation("consultation");
  const changeDescriptionRef = useRef<HTMLTextAreaElement>(null);

  const canContinue = draft.symptomOnset && draft.hasChanged !== undefined;

  // Auto-focus textarea when "Yes" is selected
  useEffect(() => {
    if (draft.hasChanged && changeDescriptionRef.current) {
      changeDescriptionRef.current.focus();
    }
  }, [draft.hasChanged]);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("step5.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("step5.subtitle")}
        </p>
      </div>

      {/* Onset selection */}
      <div className="grid grid-cols-2 gap-3">
        {ONSET_OPTIONS.map(onset => (
          <button
            key={onset}
            type="button"
            onClick={() => updateDraft({ symptomOnset: onset })}
            className={cn(
              "p-4 rounded-xl border-2 transition-all text-center",
              "hover:border-primary hover:bg-primary/5",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              draft.symptomOnset === onset
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            )}
          >
            <span className="font-medium text-foreground">
              {t(`step5.onset.${onset}`)}
            </span>
          </button>
        ))}
      </div>

      {/* Has changed */}
      <div className="space-y-3">
        <p className="font-medium text-foreground">
          {t("step5.changed")}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => updateDraft({ hasChanged: true })}
            className={cn(
              "flex-1 p-4 rounded-xl border-2 transition-all",
              "hover:border-primary hover:bg-primary/5",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              draft.hasChanged === true
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            )}
          >
            <span className="font-medium text-foreground">
              {t("step5.changedOptions.yes")}
            </span>
          </button>
          <button
            type="button"
            onClick={() => updateDraft({ hasChanged: false, changeDescription: undefined })}
            className={cn(
              "flex-1 p-4 rounded-xl border-2 transition-all",
              "hover:border-primary hover:bg-primary/5",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              draft.hasChanged === false
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            )}
          >
            <span className="font-medium text-foreground">
              {t("step5.changedOptions.no")}
            </span>
          </button>
        </div>
      </div>

      {/* Change description */}
      {draft.hasChanged && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("step5.changeDescription")}
          </label>
          <Textarea
            ref={changeDescriptionRef}
            value={draft.changeDescription || ""}
            onChange={(e) => updateDraft({ changeDescription: e.target.value })}
            placeholder=""
            className="min-h-[100px] resize-none"
          />
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

export default TimelineChanges;
