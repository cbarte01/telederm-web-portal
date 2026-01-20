import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ConsultationDraft, BodyArea, BODY_AREA_LABELS } from "@/types/consultation";

interface BodyLocationPickerProps {
  draft: ConsultationDraft;
  updateDraft: (updates: Partial<ConsultationDraft>) => void;
  onNext: () => void;
}

const BodyLocationPicker = ({ draft, updateDraft, onNext }: BodyLocationPickerProps) => {
  const { t, i18n } = useTranslation("consultation");
  const [view, setView] = useState<"front" | "back">("front");
  const lang = i18n.language === "de" ? "de" : "en";

  const toggleArea = (area: BodyArea) => {
    const current = draft.bodyLocations;
    const updated = current.includes(area)
      ? current.filter(a => a !== area)
      : [...current, area];
    updateDraft({ bodyLocations: updated });
  };

  const isSelected = (area: BodyArea) => draft.bodyLocations.includes(area);

  const handleContinue = () => {
    if (draft.bodyLocations.length > 0) {
      onNext();
    }
  };

  // SVG body parts for front and back view
  const frontAreas: { id: BodyArea; cx: number; cy: number }[] = [
    { id: "head", cx: 100, cy: 30 },
    { id: "face", cx: 100, cy: 50 },
    { id: "neck", cx: 100, cy: 75 },
    { id: "left_shoulder", cx: 65, cy: 95 },
    { id: "right_shoulder", cx: 135, cy: 95 },
    { id: "chest", cx: 100, cy: 115 },
    { id: "left_upper_arm", cx: 50, cy: 120 },
    { id: "right_upper_arm", cx: 150, cy: 120 },
    { id: "abdomen", cx: 100, cy: 155 },
    { id: "left_forearm", cx: 40, cy: 165 },
    { id: "right_forearm", cx: 160, cy: 165 },
    { id: "left_hand", cx: 30, cy: 210 },
    { id: "right_hand", cx: 170, cy: 210 },
    { id: "groin", cx: 100, cy: 195 },
    { id: "left_thigh", cx: 80, cy: 240 },
    { id: "right_thigh", cx: 120, cy: 240 },
    { id: "left_knee", cx: 80, cy: 290 },
    { id: "right_knee", cx: 120, cy: 290 },
    { id: "left_lower_leg", cx: 80, cy: 340 },
    { id: "right_lower_leg", cx: 120, cy: 340 },
    { id: "left_foot", cx: 80, cy: 385 },
    { id: "right_foot", cx: 120, cy: 385 },
  ];

  const backAreas: { id: BodyArea; cx: number; cy: number }[] = [
    { id: "head", cx: 100, cy: 30 },
    { id: "neck", cx: 100, cy: 75 },
    { id: "left_shoulder", cx: 65, cy: 95 },
    { id: "right_shoulder", cx: 135, cy: 95 },
    { id: "upper_back", cx: 100, cy: 125 },
    { id: "left_upper_arm", cx: 50, cy: 120 },
    { id: "right_upper_arm", cx: 150, cy: 120 },
    { id: "lower_back", cx: 100, cy: 165 },
    { id: "left_forearm", cx: 40, cy: 165 },
    { id: "right_forearm", cx: 160, cy: 165 },
    { id: "left_hand", cx: 30, cy: 210 },
    { id: "right_hand", cx: 170, cy: 210 },
    { id: "left_thigh", cx: 80, cy: 240 },
    { id: "right_thigh", cx: 120, cy: 240 },
    { id: "left_knee", cx: 80, cy: 290 },
    { id: "right_knee", cx: 120, cy: 290 },
    { id: "left_lower_leg", cx: 80, cy: 340 },
    { id: "right_lower_leg", cx: 120, cy: 340 },
    { id: "left_foot", cx: 80, cy: 385 },
    { id: "right_foot", cx: 120, cy: 385 },
  ];

  const currentAreas = view === "front" ? frontAreas : backAreas;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("step2.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("step2.subtitle")}
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center gap-2">
        <Button
          variant={view === "front" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("front")}
        >
          {t("step2.frontView")}
        </Button>
        <Button
          variant={view === "back" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("back")}
        >
          {t("step2.backView")}
        </Button>
      </div>

      {/* Body Diagram */}
      <div className="flex justify-center">
        <svg
          viewBox="0 0 200 410"
          className="w-full max-w-[250px] h-auto"
        >
          {/* Body outline */}
          <ellipse cx="100" cy="35" rx="25" ry="30" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          <rect x="85" y="60" width="30" height="20" rx="5" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          <ellipse cx="100" cy="130" rx="40" ry="55" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          {/* Arms */}
          <rect x="40" y="95" width="20" height="50" rx="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          <rect x="140" y="95" width="20" height="50" rx="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          <rect x="32" y="140" width="18" height="55" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          <rect x="150" y="140" width="18" height="55" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          <ellipse cx="35" cy="210" rx="10" ry="15" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          <ellipse cx="165" cy="210" rx="10" ry="15" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          {/* Legs */}
          <rect x="65" y="180" width="30" height="80" rx="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          <rect x="105" y="180" width="30" height="80" rx="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          <rect x="67" y="255" width="26" height="25" rx="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          <rect x="107" y="255" width="26" height="25" rx="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          <rect x="65" y="275" width="30" height="80" rx="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          <rect x="105" y="275" width="30" height="80" rx="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          <ellipse cx="80" cy="385" rx="18" ry="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
          <ellipse cx="120" cy="385" rx="18" ry="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />

          {/* Clickable areas */}
          {currentAreas.map(({ id, cx, cy }) => (
            <circle
              key={id}
              cx={cx}
              cy={cy}
              r="15"
              className={cn(
                "cursor-pointer transition-all duration-200",
                isSelected(id)
                  ? "fill-primary stroke-primary-foreground"
                  : "fill-transparent stroke-primary/50 hover:fill-primary/20"
              )}
              strokeWidth="2"
              onClick={() => toggleArea(id)}
            />
          ))}
        </svg>
      </div>

      {/* Selected Areas */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">
          {t("step2.selectedAreas")}:
        </p>
        <div className="flex flex-wrap gap-2 min-h-[32px]">
          {draft.bodyLocations.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("step2.noSelection")}</p>
          ) : (
            draft.bodyLocations.map(area => (
              <Badge
                key={area}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => toggleArea(area)}
              >
                {BODY_AREA_LABELS[area][lang]}
                <span className="ml-1">×</span>
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Continue Button */}
      <Button
        className="w-full"
        size="lg"
        onClick={handleContinue}
        disabled={draft.bodyLocations.length === 0}
      >
        {t("flow.next")}
      </Button>
    </div>
  );
};

export default BodyLocationPicker;
