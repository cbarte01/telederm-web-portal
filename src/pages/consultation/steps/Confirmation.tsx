import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, Bell, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const Confirmation = () => {
  const { t } = useTranslation("consultation");

  const nextSteps = [
    { icon: FileText, key: "step1" },
    { icon: Bell, key: "step2" },
    { icon: CheckCircle, key: "step3" },
  ];

  return (
    <div className="space-y-8 text-center">
      {/* Success animation */}
      <div className="relative mx-auto w-24 h-24">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
        <div className="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-primary-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("step10.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("step10.subtitle")}
        </p>
      </div>

      {/* Response time */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
        <Clock className="w-5 h-5" />
        <span className="font-medium">
          {t("step10.responseTime")}: {t("step10.responseValue")}
        </span>
      </div>

      {/* Next steps */}
      <div className="bg-card rounded-xl border border-border p-6 text-left space-y-4">
        <h2 className="font-semibold text-foreground">
          {t("step10.nextSteps.title")}
        </h2>
        <ol className="space-y-4">
          {nextSteps.map(({ icon: Icon, key }, index) => (
            <li key={key} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">{index + 1}</span>
              </div>
              <span className="text-muted-foreground pt-1">
                {t(`step10.nextSteps.${key}`)}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link to="/patient/dashboard">
          <Button className="w-full" size="lg">
            {t("step10.viewDashboard")}
          </Button>
        </Link>
        <Link to="/consultation">
          <Button variant="outline" className="w-full" size="lg">
            {t("step10.submitAnother")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
