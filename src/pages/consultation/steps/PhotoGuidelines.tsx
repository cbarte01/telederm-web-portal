import { useTranslation } from "react-i18next";
import { Camera, Sun, Ruler, Focus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoGuidelinesProps {
  onNext: () => void;
}

const PhotoGuidelines = ({ onNext }: PhotoGuidelinesProps) => {
  const { t } = useTranslation("consultation");

  const tips = [
    { icon: Sun, key: "lighting" },
    { icon: Ruler, key: "distance" },
    { icon: Focus, key: "focus" },
    { icon: Camera, key: "clean" },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("step3.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("step3.subtitle")}
        </p>
      </div>

      {/* Photo illustration */}
      <div className="relative mx-auto w-48 h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/30">
        <Camera className="w-16 h-16 text-primary/50" />
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground text-sm font-bold">3</span>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-foreground">
          {t("step3.tips.title")}
        </h2>
        <ul className="space-y-3">
          {tips.map(({ icon: Icon, key }) => (
            <li key={key} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm pt-1">
                {t(`step3.tips.${key}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Button className="w-full" size="lg" onClick={onNext}>
        {t("step3.ready")}
      </Button>
    </div>
  );
};

export default PhotoGuidelines;
