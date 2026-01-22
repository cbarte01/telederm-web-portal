import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, AlertCircle, Calendar, MapPin, FileText } from "lucide-react";
import { BODY_AREA_LABELS, type BodyArea } from "@/types/consultation";

interface ConsultationDetail {
  id: string;
  status: string;
  concern_category: string | null;
  body_locations: string[] | null;
  symptom_onset: string | null;
  symptoms: string[] | null;
  symptom_severity: string | null;
  doctor_response: string | null;
  created_at: string;
  submitted_at: string | null;
  responded_at: string | null;
  doctor_name: string | null;
  doctor_avatar_url?: string | null;
}

interface ConsultationDetailDialogProps {
  consultation: ConsultationDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<string, { label: string; labelDe: string; icon: React.ElementType; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Draft", labelDe: "Entwurf", icon: FileText, variant: "outline" },
  submitted: { label: "Submitted", labelDe: "Eingereicht", icon: AlertCircle, variant: "secondary" },
  in_review: { label: "In Review", labelDe: "In Prüfung", icon: AlertCircle, variant: "default" },
  completed: { label: "Completed", labelDe: "Abgeschlossen", icon: CheckCircle, variant: "default" },
  cancelled: { label: "Cancelled", labelDe: "Abgebrochen", icon: AlertCircle, variant: "destructive" },
};

const concernLabels: Record<string, { en: string; de: string }> = {
  skin: { en: "Skin Conditions", de: "Hauterkrankungen" },
  hair: { en: "Hair & Scalp", de: "Haare & Kopfhaut" },
  nails: { en: "Nail Problems", de: "Nagelprobleme" },
  infections: { en: "Infections", de: "Infektionen" },
  allergies: { en: "Allergies & Reactions", de: "Allergien & Reaktionen" },
  pigmentation: { en: "Pigmentation", de: "Pigmentierung" },
};

const symptomLabels: Record<string, { en: string; de: string }> = {
  itching: { en: "Itching", de: "Juckreiz" },
  pain: { en: "Pain", de: "Schmerzen" },
  burning: { en: "Burning", de: "Brennen" },
  swelling: { en: "Swelling", de: "Schwellung" },
  oozing: { en: "Oozing", de: "Nässen" },
  bleeding: { en: "Bleeding", de: "Bluten" },
  flaking: { en: "Flaking", de: "Schuppen" },
  none: { en: "None", de: "Keine" },
};

const onsetLabels: Record<string, { en: string; de: string }> = {
  today: { en: "Today", de: "Heute" },
  thisWeek: { en: "This week", de: "Diese Woche" },
  thisMonth: { en: "This month", de: "Diesen Monat" },
  longerAgo: { en: "Longer ago", de: "Länger her" },
};

const severityLabels: Record<string, { en: string; de: string }> = {
  mild: { en: "Mild", de: "Leicht" },
  moderate: { en: "Moderate", de: "Mäßig" },
  severe: { en: "Severe", de: "Schwer" },
};

export const ConsultationDetailDialog = ({ consultation, open, onOpenChange }: ConsultationDetailDialogProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "de" ? "de" : "en";

  if (!consultation) return null;

  const config = statusConfig[consultation.status] || statusConfig.completed;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBodyLocationLabels = (locations: string[] | null) => {
    if (!locations || locations.length === 0) return "-";
    return locations
      .map((loc) => BODY_AREA_LABELS[loc as BodyArea]?.[lang] || loc)
      .join(", ");
  };

  const getSymptomLabels = (symptoms: string[] | null) => {
    if (!symptoms || symptoms.length === 0) return "-";
    return symptoms
      .map((sym) => symptomLabels[sym]?.[lang] || sym)
      .join(", ");
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return `${first}${last}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              {consultation.concern_category
                ? concernLabels[consultation.concern_category]?.[lang] || consultation.concern_category
                : (lang === "de" ? "Hautanfrage" : "Skin Consultation")}
            </DialogTitle>
            <Badge variant={config.variant}>
              {lang === "de" ? config.labelDe : config.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Doctor Response Section */}
          {consultation.doctor_response && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                {lang === "de" ? "Ärztliche Beurteilung" : "Doctor's Assessment"}
              </h3>
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {consultation.doctor_response}
              </p>
              <div className="mt-3 pt-3 border-t border-primary/10 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                {consultation.doctor_name && (
                  <span className="inline-flex items-center gap-2">
                    <span>{lang === "de" ? "Arzt/Ärztin" : "Doctor"}:</span>
                    <span className="inline-flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage
                          src={consultation.doctor_avatar_url || undefined}
                          alt={consultation.doctor_name}
                        />
                        <AvatarFallback className="text-xs">
                          {getInitials(consultation.doctor_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{consultation.doctor_name}</span>
                    </span>
                  </span>
                )}
                {consultation.responded_at && (
                  <span>
                    {lang === "de" ? "Beantwortet am" : "Responded on"} {formatDate(consultation.responded_at)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* No response yet */}
          {!consultation.doctor_response && consultation.status === "completed" && (
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-muted-foreground">
                {lang === "de" 
                  ? "Keine Antwort vom Arzt verfügbar." 
                  : "No doctor response available."}
              </p>
            </div>
          )}

          <Separator />

          {/* Consultation Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {lang === "de" ? "Eingereicht am" : "Submitted"}
              </p>
              <p className="font-medium text-foreground">
                {formatDate(consultation.submitted_at || consultation.created_at)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {lang === "de" ? "Betroffene Stellen" : "Body Location"}
              </p>
              <p className="font-medium text-foreground">
                {getBodyLocationLabels(consultation.body_locations)}
              </p>
            </div>

            {consultation.symptom_onset && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {lang === "de" ? "Beginn der Symptome" : "Symptom Onset"}
                </p>
                <p className="font-medium text-foreground">
                  {onsetLabels[consultation.symptom_onset]?.[lang] || consultation.symptom_onset}
                </p>
              </div>
            )}

            {consultation.symptoms && consultation.symptoms.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {lang === "de" ? "Symptome" : "Symptoms"}
                </p>
                <p className="font-medium text-foreground">
                  {getSymptomLabels(consultation.symptoms)}
                </p>
              </div>
            )}

            {consultation.symptom_severity && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {lang === "de" ? "Schweregrad" : "Severity"}
                </p>
                <p className="font-medium text-foreground">
                  {severityLabels[consultation.symptom_severity]?.[lang] || consultation.symptom_severity}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
