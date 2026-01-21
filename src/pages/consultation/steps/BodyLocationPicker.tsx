import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ConsultationDraft, BodyArea, BODY_AREA_LABELS } from "@/types/consultation";
import { motion, AnimatePresence } from "framer-motion";
import bodyFrontImage from "@/assets/body-picker/body-front.png";
import bodyBackImage from "@/assets/body-picker/body-back.png";

interface BodyLocationPickerProps {
  draft: ConsultationDraft;
  updateDraft: (updates: Partial<ConsultationDraft>) => void;
  onNext: () => void;
}

const BodyLocationPicker = ({ draft, updateDraft, onNext }: BodyLocationPickerProps) => {
  const { t, i18n } = useTranslation("consultation");
  const [view, setView] = useState<"front" | "back">("front");
  const [hoveredArea, setHoveredArea] = useState<BodyArea | null>(null);
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

  // Clickable regions mapped to the body images (percentages of image dimensions)
  const frontRegions: { id: BodyArea; x: number; y: number; width: number; height: number }[] = [
    { id: "head", x: 35, y: 0, width: 30, height: 12 },
    { id: "face", x: 38, y: 5, width: 24, height: 7 },
    { id: "neck", x: 40, y: 12, width: 20, height: 4 },
    { id: "left_shoulder", x: 22, y: 15, width: 16, height: 6 },
    { id: "right_shoulder", x: 62, y: 15, width: 16, height: 6 },
    { id: "chest", x: 35, y: 17, width: 30, height: 12 },
    { id: "left_upper_arm", x: 12, y: 18, width: 12, height: 14 },
    { id: "right_upper_arm", x: 76, y: 18, width: 12, height: 14 },
    { id: "abdomen", x: 35, y: 29, width: 30, height: 12 },
    { id: "left_forearm", x: 8, y: 32, width: 10, height: 14 },
    { id: "right_forearm", x: 82, y: 32, width: 10, height: 14 },
    { id: "groin", x: 38, y: 41, width: 24, height: 6 },
    { id: "left_hand", x: 4, y: 46, width: 10, height: 10 },
    { id: "right_hand", x: 86, y: 46, width: 10, height: 10 },
    { id: "left_thigh", x: 30, y: 47, width: 16, height: 18 },
    { id: "right_thigh", x: 54, y: 47, width: 16, height: 18 },
    { id: "left_knee", x: 30, y: 65, width: 14, height: 8 },
    { id: "right_knee", x: 56, y: 65, width: 14, height: 8 },
    { id: "left_lower_leg", x: 28, y: 73, width: 14, height: 18 },
    { id: "right_lower_leg", x: 58, y: 73, width: 14, height: 18 },
    { id: "left_foot", x: 26, y: 91, width: 14, height: 9 },
    { id: "right_foot", x: 60, y: 91, width: 14, height: 9 },
  ];

  const backRegions: { id: BodyArea; x: number; y: number; width: number; height: number }[] = [
    { id: "head", x: 35, y: 0, width: 30, height: 12 },
    { id: "neck", x: 40, y: 12, width: 20, height: 4 },
    { id: "left_shoulder", x: 22, y: 15, width: 16, height: 6 },
    { id: "right_shoulder", x: 62, y: 15, width: 16, height: 6 },
    { id: "upper_back", x: 35, y: 17, width: 30, height: 14 },
    { id: "left_upper_arm", x: 12, y: 18, width: 12, height: 14 },
    { id: "right_upper_arm", x: 76, y: 18, width: 12, height: 14 },
    { id: "lower_back", x: 35, y: 31, width: 30, height: 10 },
    { id: "left_forearm", x: 8, y: 32, width: 10, height: 14 },
    { id: "right_forearm", x: 82, y: 32, width: 10, height: 14 },
    { id: "left_hand", x: 4, y: 46, width: 10, height: 10 },
    { id: "right_hand", x: 86, y: 46, width: 10, height: 10 },
    { id: "left_thigh", x: 30, y: 44, width: 16, height: 21 },
    { id: "right_thigh", x: 54, y: 44, width: 16, height: 21 },
    { id: "left_knee", x: 30, y: 65, width: 14, height: 8 },
    { id: "right_knee", x: 56, y: 65, width: 14, height: 8 },
    { id: "left_lower_leg", x: 28, y: 73, width: 14, height: 18 },
    { id: "right_lower_leg", x: 58, y: 73, width: 14, height: 18 },
    { id: "left_foot", x: 26, y: 91, width: 14, height: 9 },
    { id: "right_foot", x: 60, y: 91, width: 14, height: 9 },
  ];

  const currentRegions = view === "front" ? frontRegions : backRegions;
  const currentImage = view === "front" ? bodyFrontImage : bodyBackImage;
  const hoveredRegion = currentRegions.find(r => r.id === hoveredArea);

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

      {/* Body Diagram with Image */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-[300px]">
          {/* Body Image */}
          <img
            src={currentImage}
            alt={view === "front" ? "Front body view" : "Back body view"}
            className="w-full h-auto select-none pointer-events-none rounded-lg"
            draggable={false}
          />
          
          {/* Clickable overlay regions */}
          <div className="absolute inset-0">
            {currentRegions.map(({ id, x, y, width, height }) => (
              <div
                key={id}
                className={cn(
                  "absolute cursor-pointer rounded-md transition-all duration-200 border-2",
                  isSelected(id)
                    ? "bg-primary/40 border-primary shadow-lg"
                    : hoveredArea === id
                    ? "bg-primary/20 border-primary/50"
                    : "bg-transparent border-transparent hover:bg-primary/10 hover:border-primary/30"
                )}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                }}
                onClick={() => toggleArea(id)}
                onMouseEnter={() => setHoveredArea(id)}
                onMouseLeave={() => setHoveredArea(null)}
              />
            ))}
          </div>

          {/* Hover Label Tooltip */}
          <AnimatePresence>
            {hoveredRegion && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute z-10 px-3 py-1.5 bg-popover border border-border rounded-md shadow-lg pointer-events-none"
                style={{
                  left: `${hoveredRegion.x + hoveredRegion.width / 2}%`,
                  top: `${hoveredRegion.y - 2}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <span className="text-sm font-medium text-popover-foreground whitespace-nowrap">
                  {BODY_AREA_LABELS[hoveredArea!][lang]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
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
