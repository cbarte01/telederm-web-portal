import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ConsultationDraft, BodyArea, BODY_AREA_LABELS } from "@/types/consultation";
import { motion, AnimatePresence } from "framer-motion";

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

  // Simplified front view regions with better positioned hotspots
  const frontRegions: { id: BodyArea; path: string; labelPos: { x: number; y: number } }[] = [
    { 
      id: "head", 
      path: "M100,8 C125,8 138,25 138,48 C138,71 125,85 100,85 C75,85 62,71 62,48 C62,25 75,8 100,8",
      labelPos: { x: 100, y: 48 }
    },
    { 
      id: "neck", 
      path: "M88,85 L112,85 L112,105 L88,105 Z",
      labelPos: { x: 100, y: 95 }
    },
    { 
      id: "left_shoulder", 
      path: "M60,105 L88,105 L88,128 Q70,130 55,125 Z",
      labelPos: { x: 72, y: 116 }
    },
    { 
      id: "right_shoulder", 
      path: "M112,105 L140,105 Q145,125 130,128 L112,128 Z",
      labelPos: { x: 128, y: 116 }
    },
    { 
      id: "chest", 
      path: "M72,128 L128,128 L128,170 L72,170 Z",
      labelPos: { x: 100, y: 149 }
    },
    { 
      id: "abdomen", 
      path: "M72,170 L128,170 L124,215 L76,215 Z",
      labelPos: { x: 100, y: 192 }
    },
    { 
      id: "left_upper_arm", 
      path: "M32,128 Q45,125 55,128 L55,180 L32,180 Z",
      labelPos: { x: 43, y: 154 }
    },
    { 
      id: "right_upper_arm", 
      path: "M145,128 Q155,125 168,128 L168,180 L145,180 Z",
      labelPos: { x: 157, y: 154 }
    },
    { 
      id: "left_forearm", 
      path: "M28,180 L55,180 L52,240 L22,240 Z",
      labelPos: { x: 38, y: 210 }
    },
    { 
      id: "right_forearm", 
      path: "M145,180 L172,180 L178,240 L148,240 Z",
      labelPos: { x: 162, y: 210 }
    },
    { 
      id: "left_hand", 
      path: "M18,240 L52,240 L50,275 L12,275 Z",
      labelPos: { x: 32, y: 257 }
    },
    { 
      id: "right_hand", 
      path: "M148,240 L182,240 L188,275 L150,275 Z",
      labelPos: { x: 168, y: 257 }
    },
    { 
      id: "groin", 
      path: "M76,215 L124,215 L118,245 L82,245 Z",
      labelPos: { x: 100, y: 230 }
    },
    { 
      id: "left_thigh", 
      path: "M68,245 L95,245 L92,325 L65,325 Z",
      labelPos: { x: 80, y: 285 }
    },
    { 
      id: "right_thigh", 
      path: "M105,245 L132,245 L135,325 L108,325 Z",
      labelPos: { x: 120, y: 285 }
    },
    { 
      id: "left_knee", 
      path: "M65,325 L92,325 L92,358 L65,358 Z",
      labelPos: { x: 78, y: 341 }
    },
    { 
      id: "right_knee", 
      path: "M108,325 L135,325 L135,358 L108,358 Z",
      labelPos: { x: 122, y: 341 }
    },
    { 
      id: "left_lower_leg", 
      path: "M65,358 L92,358 L90,430 L68,430 Z",
      labelPos: { x: 78, y: 394 }
    },
    { 
      id: "right_lower_leg", 
      path: "M108,358 L135,358 L132,430 L110,430 Z",
      labelPos: { x: 122, y: 394 }
    },
    { 
      id: "left_foot", 
      path: "M62,430 L90,430 L90,455 L55,455 Z",
      labelPos: { x: 72, y: 442 }
    },
    { 
      id: "right_foot", 
      path: "M110,430 L138,430 L145,455 L110,455 Z",
      labelPos: { x: 128, y: 442 }
    },
  ];

  const backRegions: { id: BodyArea; path: string; labelPos: { x: number; y: number } }[] = [
    { 
      id: "head", 
      path: "M100,8 C125,8 138,25 138,48 C138,71 125,85 100,85 C75,85 62,71 62,48 C62,25 75,8 100,8",
      labelPos: { x: 100, y: 48 }
    },
    { 
      id: "neck", 
      path: "M88,85 L112,85 L112,105 L88,105 Z",
      labelPos: { x: 100, y: 95 }
    },
    { 
      id: "left_shoulder", 
      path: "M60,105 L88,105 L88,128 Q70,130 55,125 Z",
      labelPos: { x: 72, y: 116 }
    },
    { 
      id: "right_shoulder", 
      path: "M112,105 L140,105 Q145,125 130,128 L112,128 Z",
      labelPos: { x: 128, y: 116 }
    },
    { 
      id: "upper_back", 
      path: "M72,128 L128,128 L128,170 L72,170 Z",
      labelPos: { x: 100, y: 149 }
    },
    { 
      id: "lower_back", 
      path: "M72,170 L128,170 L124,215 L76,215 Z",
      labelPos: { x: 100, y: 192 }
    },
    { 
      id: "left_upper_arm", 
      path: "M32,128 Q45,125 55,128 L55,180 L32,180 Z",
      labelPos: { x: 43, y: 154 }
    },
    { 
      id: "right_upper_arm", 
      path: "M145,128 Q155,125 168,128 L168,180 L145,180 Z",
      labelPos: { x: 157, y: 154 }
    },
    { 
      id: "left_forearm", 
      path: "M28,180 L55,180 L52,240 L22,240 Z",
      labelPos: { x: 38, y: 210 }
    },
    { 
      id: "right_forearm", 
      path: "M145,180 L172,180 L178,240 L148,240 Z",
      labelPos: { x: 162, y: 210 }
    },
    { 
      id: "left_hand", 
      path: "M18,240 L52,240 L50,275 L12,275 Z",
      labelPos: { x: 32, y: 257 }
    },
    { 
      id: "right_hand", 
      path: "M148,240 L182,240 L188,275 L150,275 Z",
      labelPos: { x: 168, y: 257 }
    },
    { 
      id: "left_thigh", 
      path: "M68,215 L95,215 L92,325 L65,325 Z",
      labelPos: { x: 80, y: 270 }
    },
    { 
      id: "right_thigh", 
      path: "M105,215 L132,215 L135,325 L108,325 Z",
      labelPos: { x: 120, y: 270 }
    },
    { 
      id: "left_knee", 
      path: "M65,325 L92,325 L92,358 L65,358 Z",
      labelPos: { x: 78, y: 341 }
    },
    { 
      id: "right_knee", 
      path: "M108,325 L135,325 L135,358 L108,358 Z",
      labelPos: { x: 122, y: 341 }
    },
    { 
      id: "left_lower_leg", 
      path: "M65,358 L92,358 L90,430 L68,430 Z",
      labelPos: { x: 78, y: 394 }
    },
    { 
      id: "right_lower_leg", 
      path: "M108,358 L135,358 L132,430 L110,430 Z",
      labelPos: { x: 122, y: 394 }
    },
    { 
      id: "left_foot", 
      path: "M62,430 L90,430 L90,455 L55,455 Z",
      labelPos: { x: 72, y: 442 }
    },
    { 
      id: "right_foot", 
      path: "M110,430 L138,430 L145,455 L110,455 Z",
      labelPos: { x: 128, y: 442 }
    },
  ];

  const currentRegions = view === "front" ? frontRegions : backRegions;
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

      {/* Body Diagram */}
      <div className="flex justify-center relative">
        <svg
          viewBox="0 0 200 465"
          className="w-full max-w-[280px] h-auto"
        >
          <defs>
            {/* Soft gradient for natural body appearance */}
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.9" />
              <stop offset="50%" stopColor="hsl(var(--muted))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.85" />
            </linearGradient>
            
            {/* Soft shadow filter */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Blur filter for softer edges */}
            <filter id="softenEdges" x="-5%" y="-5%" width="110%" height="110%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
            </filter>

            {/* Selection highlight */}
            <filter id="selectedGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="hsl(var(--primary))" floodOpacity="0.4" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Soft body silhouette with rounded, organic curves */}
          <path
            d="M100,10 
               C122,10 135,28 135,50 C135,72 122,88 112,88 
               L112,105 C130,108 142,115 145,128 
               Q155,125 168,130 L172,180 L178,240 L185,272 
               Q160,278 150,272 L148,240 L145,180 L145,130 
               L128,128 L128,215 L135,325 L135,358 L132,430 L138,455 
               Q125,460 110,455 L110,430 L108,358 L108,325 L105,245 
               L100,220 
               L95,245 L92,325 L92,358 L90,430 L90,455 
               Q75,460 62,455 L68,430 L65,358 L65,325 L72,215 L72,128 
               L55,130 L55,180 L52,240 L50,272 
               Q40,278 15,272 L22,240 L28,180 L32,130 
               Q45,125 55,128 C58,115 70,108 88,105 
               L88,88 C78,88 65,72 65,50 C65,28 78,10 100,10 Z"
            fill="url(#bodyGradient)"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeLinejoin="round"
            filter="url(#softenEdges)"
            opacity="0.95"
          />

          {/* Clickable region paths */}
          {currentRegions.map(({ id, path }) => (
            <path
              key={id}
              d={path}
              className={cn(
                "cursor-pointer transition-all duration-300",
                isSelected(id)
                  ? "fill-primary/70"
                  : hoveredArea === id
                  ? "fill-primary/30"
                  : "fill-transparent"
              )}
              stroke={isSelected(id) ? "hsl(var(--primary))" : hoveredArea === id ? "hsl(var(--primary) / 0.6)" : "transparent"}
              strokeWidth={isSelected(id) ? "2" : "1.5"}
              strokeLinejoin="round"
              filter={isSelected(id) ? "url(#selectedGlow)" : undefined}
              onClick={() => toggleArea(id)}
              onMouseEnter={() => setHoveredArea(id)}
              onMouseLeave={() => setHoveredArea(null)}
            />
          ))}

          {/* Hover label tooltip */}
          <AnimatePresence>
            {hoveredRegion && (
              <motion.g
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
              >
                {/* Tooltip background */}
                <rect
                  x={hoveredRegion.labelPos.x - 35}
                  y={hoveredRegion.labelPos.y - 22}
                  width="70"
                  height="20"
                  rx="4"
                  fill="hsl(var(--popover))"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  filter="url(#softGlow)"
                />
                {/* Tooltip text */}
                <text
                  x={hoveredRegion.labelPos.x}
                  y={hoveredRegion.labelPos.y - 9}
                  textAnchor="middle"
                  className="fill-popover-foreground text-[8px] font-medium pointer-events-none"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {BODY_AREA_LABELS[hoveredArea!][lang]}
                </text>
              </motion.g>
            )}
          </AnimatePresence>
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
