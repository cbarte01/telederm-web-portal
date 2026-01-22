import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SharedComputerWarning = () => {
  const { t, i18n } = useTranslation("consultation");
  const [isDismissed, setIsDismissed] = useState(false);
  const lang = i18n.language === "de" ? "de" : "en";

  if (isDismissed) return null;

  const message = lang === "de" 
    ? "Auf einem öffentlichen Computer? Bitte schließen Sie das Formular in einer Sitzung ab und lassen Sie den Computer nicht unbeaufsichtigt."
    : "On a public computer? Please complete this form in one session and don't leave the computer unattended.";

  return (
    <div className={cn(
      "mb-4 p-3 rounded-lg border flex items-start gap-3",
      "bg-muted/50 border-border"
    )}>
      <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
      <p className="text-sm text-muted-foreground flex-1">
        {message}
      </p>
      <button
        onClick={() => setIsDismissed(true)}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SharedComputerWarning;
