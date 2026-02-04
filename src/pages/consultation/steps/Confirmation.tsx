import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, Bell, FileText, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConsultationDraft } from "@/hooks/useConsultationDraft";

const Confirmation = () => {
  const { t, i18n } = useTranslation("consultation");
  const { draft } = useConsultationDraft();
  const lang = i18n.language === "de" ? "de" : "en";

  const nextSteps = [
    { icon: FileText, key: "step1" },
    { icon: Bell, key: "step2" },
    { icon: CheckCircle, key: "step3" },
  ];

  const isPrescriptionFlow = draft.consultationType === 'prescription';

  const prescriptionNextSteps = [
    { 
      label: lang === "de" 
        ? "Unser Arzt prüft Ihre Anfrage" 
        : "Our doctor will review your request" 
    },
    { 
      label: lang === "de" 
        ? "Das Rezept wird in Ihre e-Medikation (ELGA) hochgeladen" 
        : "The prescription will be uploaded to your e-Medikation (ELGA)" 
    },
    { 
      label: lang === "de" 
        ? "Sie erhalten eine Benachrichtigung, sobald das Rezept bereit ist" 
        : "You'll receive a notification when the prescription is ready" 
    },
  ];

  return (
    <div className="space-y-8 text-center">
      {/* Success animation */}
      <div className="relative mx-auto w-24 h-24">
        <div className={`absolute inset-0 rounded-full animate-ping ${isPrescriptionFlow ? "bg-emerald-500/20" : "bg-primary/20"}`} />
        <div className={`relative w-24 h-24 rounded-full flex items-center justify-center ${isPrescriptionFlow ? "bg-emerald-500" : "bg-primary"}`}>
          <CheckCircle className="w-12 h-12 text-primary-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {isPrescriptionFlow 
            ? (lang === "de" ? "Rezeptanforderung eingereicht!" : "Prescription Request Submitted!")
            : t("step10.title")}
        </h1>
        <p className="text-muted-foreground">
          {draft.referredDoctorName 
            ? (lang === "de" 
                ? `Ihre Anfrage wurde an ${draft.referredDoctorName} übermittelt.`
                : `Your request has been submitted to ${draft.referredDoctorName}.`)
            : (isPrescriptionFlow 
                ? (lang === "de" 
                    ? "Ihre Rezeptanforderung wird bearbeitet."
                    : "Your prescription request is being processed.")
                : t("step10.subtitle"))
          }
        </p>
      </div>

      {/* Doctor assignment info */}
      {draft.referredDoctorName && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground">
          <UserCheck className="w-5 h-5" />
          <span className="font-medium">
            {lang === "de" ? "Zugewiesen an" : "Assigned to"}: {draft.referredDoctorName}
          </span>
        </div>
      )}

      {/* Response time */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isPrescriptionFlow ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-primary/10 text-primary"}`}>
        <Clock className="w-5 h-5" />
        <span className="font-medium">
          {t("step10.responseTime")}: {isPrescriptionFlow ? (lang === "de" ? "24 Stunden" : "24 hours") : t("step10.responseValue")}
        </span>
      </div>

      {/* Next steps */}
      <div className="bg-card rounded-xl border border-border p-6 text-left space-y-4">
        <h2 className="font-semibold text-foreground">
          {t("step10.nextSteps.title")}
        </h2>
        <ol className="space-y-4">
          {isPrescriptionFlow ? (
            prescriptionNextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{index + 1}</span>
                </div>
                <span className="text-muted-foreground pt-1">{step.label}</span>
              </li>
            ))
          ) : (
            nextSteps.map(({ icon: Icon, key }, index) => (
              <li key={key} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                </div>
                <span className="text-muted-foreground pt-1">
                  {t(`step10.nextSteps.${key}`)}
                </span>
              </li>
            ))
          )}
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
            {isPrescriptionFlow 
              ? (lang === "de" ? "Neue Anfrage starten" : "Start new request")
              : t("step10.submitAnother")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
