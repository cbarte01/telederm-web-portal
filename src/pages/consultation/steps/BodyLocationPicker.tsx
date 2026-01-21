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

// Simplified body regions that group related areas
type BodyRegion = {
  id: BodyArea;
  label: string;
  areas?: BodyArea[]; // For grouped selections
};

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

  // Simplified front view regions with better positioned hotspots
  const frontRegions: { id: BodyArea; path: string; labelPos: { x: number; y: number } }[] = [
    { 
      id: "head", 
      path: "M100,5 C130,5 145,25 145,50 C145,75 130,90 100,90 C70,90 55,75 55,50 C55,25 70,5 100,5",
      labelPos: { x: 100, y: 50 }
    },
    { 
      id: "neck", 
      path: "M85,90 L115,90 L115,110 L85,110 Z",
      labelPos: { x: 100, y: 100 }
    },
    { 
      id: "left_shoulder", 
      path: "M55,110 L85,110 L85,130 L45,130 L45,115 Z",
      labelPos: { x: 65, y: 120 }
    },
    { 
      id: "right_shoulder", 
      path: "M115,110 L145,110 L155,115 L155,130 L115,130 Z",
      labelPos: { x: 135, y: 120 }
    },
    { 
      id: "chest", 
      path: "M70,130 L130,130 L130,175 L70,175 Z",
      labelPos: { x: 100, y: 152 }
    },
    { 
      id: "abdomen", 
      path: "M70,175 L130,175 L125,220 L75,220 Z",
      labelPos: { x: 100, y: 197 }
    },
    { 
      id: "left_upper_arm", 
      path: "M25,130 L45,130 L45,185 L25,185 Z",
      labelPos: { x: 35, y: 157 }
    },
    { 
      id: "right_upper_arm", 
      path: "M155,130 L175,130 L175,185 L155,185 Z",
      labelPos: { x: 165, y: 157 }
    },
    { 
      id: "left_forearm", 
      path: "M20,185 L45,185 L45,245 L15,245 Z",
      labelPos: { x: 30, y: 215 }
    },
    { 
      id: "right_forearm", 
      path: "M155,185 L180,185 L185,245 L155,245 Z",
      labelPos: { x: 170, y: 215 }
    },
    { 
      id: "left_hand", 
      path: "M10,245 L45,245 L45,280 L5,280 Z",
      labelPos: { x: 25, y: 262 }
    },
    { 
      id: "right_hand", 
      path: "M155,245 L190,245 L195,280 L155,280 Z",
      labelPos: { x: 175, y: 262 }
    },
    { 
      id: "groin", 
      path: "M75,220 L125,220 L120,250 L80,250 Z",
      labelPos: { x: 100, y: 235 }
    },
    { 
      id: "left_thigh", 
      path: "M65,250 L95,250 L90,330 L60,330 Z",
      labelPos: { x: 77, y: 290 }
    },
    { 
      id: "right_thigh", 
      path: "M105,250 L135,250 L140,330 L110,330 Z",
      labelPos: { x: 122, y: 290 }
    },
    { 
      id: "left_knee", 
      path: "M60,330 L90,330 L90,365 L60,365 Z",
      labelPos: { x: 75, y: 347 }
    },
    { 
      id: "right_knee", 
      path: "M110,330 L140,330 L140,365 L110,365 Z",
      labelPos: { x: 125, y: 347 }
    },
    { 
      id: "left_lower_leg", 
      path: "M58,365 L90,365 L88,435 L62,435 Z",
      labelPos: { x: 74, y: 400 }
    },
    { 
      id: "right_lower_leg", 
      path: "M110,365 L142,365 L138,435 L112,435 Z",
      labelPos: { x: 126, y: 400 }
    },
    { 
      id: "left_foot", 
      path: "M55,435 L90,435 L90,460 L50,460 Z",
      labelPos: { x: 70, y: 447 }
    },
    { 
      id: "right_foot", 
      path: "M110,435 L145,435 L150,460 L110,460 Z",
      labelPos: { x: 130, y: 447 }
    },
  ];

  const backRegions: { id: BodyArea; path: string; labelPos: { x: number; y: number } }[] = [
    { 
      id: "head", 
      path: "M100,5 C130,5 145,25 145,50 C145,75 130,90 100,90 C70,90 55,75 55,50 C55,25 70,5 100,5",
      labelPos: { x: 100, y: 50 }
    },
    { 
      id: "neck", 
      path: "M85,90 L115,90 L115,110 L85,110 Z",
      labelPos: { x: 100, y: 100 }
    },
    { 
      id: "left_shoulder", 
      path: "M55,110 L85,110 L85,130 L45,130 L45,115 Z",
      labelPos: { x: 65, y: 120 }
    },
    { 
      id: "right_shoulder", 
      path: "M115,110 L145,110 L155,115 L155,130 L115,130 Z",
      labelPos: { x: 135, y: 120 }
    },
    { 
      id: "upper_back", 
      path: "M70,130 L130,130 L130,175 L70,175 Z",
      labelPos: { x: 100, y: 152 }
    },
    { 
      id: "lower_back", 
      path: "M70,175 L130,175 L125,220 L75,220 Z",
      labelPos: { x: 100, y: 197 }
    },
    { 
      id: "left_upper_arm", 
      path: "M25,130 L45,130 L45,185 L25,185 Z",
      labelPos: { x: 35, y: 157 }
    },
    { 
      id: "right_upper_arm", 
      path: "M155,130 L175,130 L175,185 L155,185 Z",
      labelPos: { x: 165, y: 157 }
    },
    { 
      id: "left_forearm", 
      path: "M20,185 L45,185 L45,245 L15,245 Z",
      labelPos: { x: 30, y: 215 }
    },
    { 
      id: "right_forearm", 
      path: "M155,185 L180,185 L185,245 L155,245 Z",
      labelPos: { x: 170, y: 215 }
    },
    { 
      id: "left_hand", 
      path: "M10,245 L45,245 L45,280 L5,280 Z",
      labelPos: { x: 25, y: 262 }
    },
    { 
      id: "right_hand", 
      path: "M155,245 L190,245 L195,280 L155,280 Z",
      labelPos: { x: 175, y: 262 }
    },
    { 
      id: "left_thigh", 
      path: "M65,220 L95,220 L90,330 L60,330 Z",
      labelPos: { x: 77, y: 275 }
    },
    { 
      id: "right_thigh", 
      path: "M105,220 L135,220 L140,330 L110,330 Z",
      labelPos: { x: 122, y: 275 }
    },
    { 
      id: "left_knee", 
      path: "M60,330 L90,330 L90,365 L60,365 Z",
      labelPos: { x: 75, y: 347 }
    },
    { 
      id: "right_knee", 
      path: "M110,330 L140,330 L140,365 L110,365 Z",
      labelPos: { x: 125, y: 347 }
    },
    { 
      id: "left_lower_leg", 
      path: "M58,365 L90,365 L88,435 L62,435 Z",
      labelPos: { x: 74, y: 400 }
    },
    { 
      id: "right_lower_leg", 
      path: "M110,365 L142,365 L138,435 L112,435 Z",
      labelPos: { x: 126, y: 400 }
    },
    { 
      id: "left_foot", 
      path: "M55,435 L90,435 L90,460 L50,460 Z",
      labelPos: { x: 70, y: 447 }
    },
    { 
      id: "right_foot", 
      path: "M110,435 L145,435 L150,460 L110,460 Z",
      labelPos: { x: 130, y: 447 }
    },
  ];

  const currentRegions = view === "front" ? frontRegions : backRegions;

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
          viewBox="0 0 200 470"
          className="w-full max-w-[280px] h-auto"
        >
          {/* Clean body silhouette */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--muted))" />
              <stop offset="100%" stopColor="hsl(var(--muted) / 0.8)" />
            </linearGradient>
          </defs>
          
          {/* Body silhouette path */}
          <path
            d="M100,5 C130,5 145,25 145,50 C145,75 130,95 115,95 L115,110 
               C140,110 155,115 155,130 L175,130 L180,185 L185,245 L190,280 L155,280 L155,245 L155,185 L155,130 
               L130,130 L130,220 L140,330 L142,365 L145,435 L150,460 L110,460 L112,435 L110,365 L110,330 L105,250 
               L100,220 L95,250 L90,330 L90,365 L88,435 L90,460 L50,460 L55,435 L58,365 L60,330 L65,220 L70,130 
               L45,130 L45,185 L45,245 L45,280 L10,280 L15,245 L20,185 L25,130 L45,130 
               C45,115 60,110 85,110 L85,95 C70,95 55,75 55,50 C55,25 70,5 100,5 Z"
            fill="url(#bodyGradient)"
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
          />

          {/* Clickable region paths */}
          {currentRegions.map(({ id, path }) => (
            <path
              key={id}
              d={path}
              className={cn(
                "cursor-pointer transition-all duration-200",
                isSelected(id)
                  ? "fill-primary/80 stroke-primary"
                  : "fill-transparent stroke-transparent hover:fill-primary/20 hover:stroke-primary/50"
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
