import { useTranslation } from "react-i18next";
import { UserCheck } from "lucide-react";

interface ReferralBannerProps {
  doctorName: string;
  practiceName?: string;
  welcomeMessage?: string;
}

const ReferralBanner = ({ doctorName, practiceName, welcomeMessage }: ReferralBannerProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "de" ? "de" : "en";

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2 text-primary">
        <UserCheck className="w-4 h-4 shrink-0" />
        <span className="text-sm font-medium">
          {lang === "de" ? "Beratung mit" : "Consultation with"} {doctorName}
        </span>
      </div>
      {practiceName && (
        <p className="text-xs text-muted-foreground mt-1 ml-6">
          {practiceName}
        </p>
      )}
      {welcomeMessage && (
        <p className="text-sm text-muted-foreground mt-2 ml-6 italic">
          "{welcomeMessage}"
        </p>
      )}
    </div>
  );
};

export default ReferralBanner;
