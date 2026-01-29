import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, AlertCircle, Calendar, MapPin, FileText, User, Download, Loader2 } from "lucide-react";
import { BODY_AREA_LABELS, type BodyArea } from "@/types/consultation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  icd10_code?: string | null;
  icd10_description?: string | null;
  report_storage_path?: string | null;
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
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const lang = i18n.language === "de" ? "de" : "en";

  if (!consultation) return null;

  const config = statusConfig[consultation.status] || statusConfig.completed;
  const hasIcd10 = !!consultation.icd10_code;

  const handleDownloadHonorarnote = async () => {
    setIsDownloading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-honorarnote", {
        body: { consultation_id: consultation.id },
      });

      if (error) throw error;

      if (data?.url) {
        // Fetch the PDF as a blob to ensure download works cross-origin
        const response = await fetch(data.url);
        if (!response.ok) throw new Error("Failed to fetch PDF");
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `Honorarnote_${data.honorarnote_number}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        URL.revokeObjectURL(blobUrl);
        
        toast({
          title: lang === "de" ? "Honorarnote erstellt" : "Medical fee note generated",
          description: lang === "de" 
            ? `Nummer: ${data.honorarnote_number}` 
            : `Number: ${data.honorarnote_number}`,
        });
      }
    } catch (err) {
      console.error("Honorarnote download error:", err);
      toast({
        variant: "destructive",
        title: lang === "de" ? "Fehler" : "Error",
        description: lang === "de" 
          ? "Honorarnote konnte nicht erstellt werden." 
          : "Could not generate medical fee note.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!consultation) return;
    setIsDownloadingReport(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-consultation-report", {
        body: { consultation_id: consultation.id, language: lang },
      });

      if (error) throw error;

      if (data?.url) {
        // Fetch the PDF as a blob to ensure download works cross-origin
        const response = await fetch(data.url);
        if (!response.ok) throw new Error("Failed to fetch PDF");
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = lang === "de" ? "Befundbericht.pdf" : "Consultation_Report.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        URL.revokeObjectURL(blobUrl);
        
        toast({
          title: lang === "de" ? "Befundbericht erstellt" : "Consultation report generated",
        });
      }
    } catch (err) {
      console.error("Report download error:", err);
      toast({
        variant: "destructive",
        title: lang === "de" ? "Fehler" : "Error",
        description: lang === "de" 
          ? "Befundbericht konnte nicht erstellt werden." 
          : "Could not generate consultation report.",
      });
    } finally {
      setIsDownloadingReport(false);
    }
  };

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
                        <AvatarFallback>
                          <User className="h-4 w-4" />
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

          {/* Downloads - only for completed consultations with ICD-10 */}
          {consultation.status === "completed" && hasIcd10 && (
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              {/* Consultation Report Download */}
              <Button 
                variant="default" 
                className="w-full gap-2"
                onClick={handleDownloadReport}
                disabled={isDownloadingReport}
              >
                {isDownloadingReport ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                {lang === "de" ? "Befundbericht herunterladen" : "Download Consultation Report"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {lang === "de"
                  ? "Zusammenfassung Ihrer Konsultation inkl. ärztlicher Beurteilung"
                  : "Summary of your consultation including doctor's assessment"}
              </p>

              {/* Honorarnote Download */}
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handleDownloadHonorarnote}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {lang === "de" ? "Honorarnote herunterladen" : "Download Medical Fee Note"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {lang === "de"
                  ? "Zur Einreichung bei Ihrer privaten Krankenversicherung"
                  : "For submission to your private health insurance"}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
