import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  MapPin, 
  AlertCircle,
  Pill,
  FileText,
  Clock,
  Send,
  Image as ImageIcon,
  Download,
  Loader2
} from "lucide-react";

interface ConsultationPhoto {
  id: string;
  photo_type: string;
  storage_path: string;
}

interface Consultation {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  status: string;
  consultation_type: string | null;
  concern_category: string | null;
  body_locations: string[] | null;
  symptoms: string[] | null;
  symptom_severity: string | null;
  symptom_onset: string | null;
  has_changed: boolean | null;
  change_description: string | null;
  has_allergies: boolean | null;
  allergies_description: string | null;
  takes_medications: boolean | null;
  medications_description: string | null;
  has_self_treated: boolean | null;
  self_treatment_description: string | null;
  date_of_birth: string | null;
  biological_sex: string | null;
  additional_notes: string | null;
  created_at: string;
  submitted_at: string | null;
  doctor_response: string | null;
  responded_at: string | null;
  profiles?: { full_name: string | null } | null;
}

interface ConsultationDetailProps {
  consultation: Consultation;
  photos: ConsultationPhoto[];
  onBack: () => void;
  onUpdate: () => void;
}

const concernLabels: Record<string, { en: string; de: string }> = {
  skin: { en: "Skin Conditions", de: "Hauterkrankungen" },
  hair: { en: "Hair & Scalp", de: "Haare & Kopfhaut" },
  nails: { en: "Nail Problems", de: "Nagelprobleme" },
  infections: { en: "Infections", de: "Infektionen" },
  allergies: { en: "Allergies & Reactions", de: "Allergien & Reaktionen" },
  pigmentation: { en: "Pigmentation", de: "Pigmentierung" },
  prescription: { en: "Prescription Request", de: "Rezeptanfrage" },
};

const symptomLabels: Record<string, { en: string; de: string }> = {
  itching: { en: "Itching", de: "Juckreiz" },
  burning: { en: "Burning", de: "Brennen" },
  pain: { en: "Pain", de: "Schmerzen" },
  bleeding: { en: "Bleeding", de: "Blutung" },
  discharge: { en: "Discharge", de: "Ausfluss" },
  swelling: { en: "Swelling", de: "Schwellung" },
  redness: { en: "Redness", de: "Rötung" },
  scaling: { en: "Scaling", de: "Schuppung" },
};

const onsetLabels: Record<string, { en: string; de: string }> = {
  "days": { en: "A few days ago", de: "Vor einigen Tagen" },
  "weeks": { en: "1-4 weeks ago", de: "Vor 1-4 Wochen" },
  "months": { en: "1-6 months ago", de: "Vor 1-6 Monaten" },
  "over_6_months": { en: "Over 6 months ago", de: "Vor über 6 Monaten" },
  "years": { en: "Years ago", de: "Vor Jahren" },
};

// Common dermatology ICD-10 codes for autocomplete suggestions
const COMMON_ICD10_CODES = [
  { code: "L20.9", description: "Atopische Dermatitis, nicht näher bezeichnet" },
  { code: "L50.0", description: "Allergische Urticaria" },
  { code: "L70.0", description: "Acne vulgaris" },
  { code: "L40.0", description: "Psoriasis vulgaris" },
  { code: "L82", description: "Seborrhoische Keratose" },
  { code: "L30.9", description: "Dermatitis, nicht näher bezeichnet" },
  { code: "B35.0", description: "Tinea barbae und Tinea capitis" },
  { code: "L23.9", description: "Allergische Kontaktdermatitis" },
  { code: "L21.0", description: "Seborrhoische Dermatitis des Kopfes" },
  { code: "C44.9", description: "Bösartige Neubildung der Haut" },
  { code: "D22.9", description: "Melanozytärer Nävus" },
  { code: "L57.0", description: "Aktinische Keratose" },
  { code: "B07", description: "Viruswarzen" },
  { code: "L60.0", description: "Unguis incarnatus" },
  { code: "L72.0", description: "Epidermoidzyste" },
];

const ConsultationDetail = ({ consultation, photos, onBack, onUpdate }: ConsultationDetailProps) => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [response, setResponse] = useState(consultation.doctor_response || "");
  const [icd10Code, setIcd10Code] = useState((consultation as any).icd10_code || "");
  const [icd10Description, setIcd10Description] = useState((consultation as any).icd10_description || "");
  const [showIcd10Suggestions, setShowIcd10Suggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingHonorarnote, setIsDownloadingHonorarnote] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  
  const lang = i18n.language === "de" ? "de" : "en";
  const dateLocale = lang === "de" ? de : enUS;

  // Check if this is an unclaimed consultation (for Group/Hybrid doctors)
  const isUnclaimed = consultation.doctor_id === null;
  
  // Check if honorarnote can be downloaded (completed + ICD-10)
  const canDownloadHonorarnote = consultation.status === "completed" && !!(consultation as any).icd10_code;

  const handleDownloadHonorarnote = async () => {
    setIsDownloadingHonorarnote(true);
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
      setIsDownloadingHonorarnote(false);
    }
  };

  // Load photo URLs
  useEffect(() => {
    const loadPhotos = async () => {
      const urls: Record<string, string> = {};
      for (const photo of photos) {
        const { data } = await supabase.storage
          .from("consultation-photos")
          .createSignedUrl(photo.storage_path, 3600);
        if (data?.signedUrl) {
          urls[photo.id] = data.signedUrl;
        }
      }
      setPhotoUrls(urls);
    };
    loadPhotos();
  }, [photos]);

  // Check if this is a prescription request (for hiding certain sections)
  const isPrescriptionRequest = consultation.consultation_type === 'prescription';

  const handleSubmitResponse = async (newStatus: "in_review" | "completed") => {
    if (newStatus === "completed") {
      if (!response.trim()) {
        toast({
          title: lang === "de" ? "Fehler" : "Error",
          description: lang === "de" 
            ? "Bitte geben Sie eine Antwort ein, bevor Sie den Fall abschließen." 
            : "Please enter a response before completing the case.",
          variant: "destructive",
        });
        return;
      }
      
      // ICD-10 is required for all consultations including prescription requests
      if (!icd10Code.trim()) {
        toast({
          title: lang === "de" ? "Fehler" : "Error",
          description: lang === "de" 
            ? "Bitte geben Sie einen ICD-10-Code für die Honorarnote ein." 
            : "Please enter an ICD-10 code for the medical fee note.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    
    // If unclaimed, claim the consultation by setting doctor_id
    const updateData: Record<string, unknown> = {
      status: newStatus,
      doctor_response: response.trim() || null,
      responded_at: newStatus === "completed" ? new Date().toISOString() : null,
      icd10_code: icd10Code.trim() || null,
      icd10_description: icd10Description.trim() || null,
    };

    // Always claim the consultation if doctor_id is not set (ensures accountability)
    if (!consultation.doctor_id && user) {
      updateData.doctor_id = user.id;
    }

    const { error } = await supabase
      .from("consultations")
      .update(updateData)
      .eq("id", consultation.id);

    setIsSubmitting(false);

    if (error) {
      toast({
        title: lang === "de" ? "Fehler" : "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: lang === "de" ? "Erfolgreich" : "Success",
      description: newStatus === "completed"
        ? (lang === "de" ? "Antwort gesendet und Fall abgeschlossen." : "Response sent and case completed.")
        : isUnclaimed 
          ? (lang === "de" ? "Fall übernommen und Entwurf gespeichert." : "Case claimed and draft saved.")
          : (lang === "de" ? "Entwurf gespeichert." : "Draft saved."),
    });
    
    onUpdate();
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const patientName = consultation.profiles?.full_name || (lang === "de" ? "Unbekannt" : "Unknown");
  const patientAge = consultation.date_of_birth ? calculateAge(consultation.date_of_birth) : null;
  const patientSex = consultation.biological_sex === "male" 
    ? (lang === "de" ? "Männlich" : "Male") 
    : consultation.biological_sex === "female" 
      ? (lang === "de" ? "Weiblich" : "Female")
      : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {lang === "de" ? "Zurück" : "Back"}
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">
            {consultation.consultation_type === 'prescription'
              ? concernLabels.prescription[lang]
              : (consultation.concern_category 
                  ? concernLabels[consultation.concern_category]?.[lang] || consultation.concern_category
                  : (lang === "de" ? "Dermatologische Anfrage" : "Dermatology Consultation"))}
          </h2>
          <p className="text-muted-foreground text-sm">
            {lang === "de" ? "Eingereicht am" : "Submitted"}{" "}
            {format(new Date(consultation.submitted_at || consultation.created_at), "PPP", { locale: dateLocale })}
          </p>
        </div>
        <Badge variant={consultation.status === "completed" ? "default" : "secondary"}>
          {consultation.status === "submitted" && (lang === "de" ? "Neu" : "New")}
          {consultation.status === "in_review" && (lang === "de" ? "In Bearbeitung" : "In Review")}
          {consultation.status === "completed" && (lang === "de" ? "Abgeschlossen" : "Completed")}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Patient Info & Medical History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                {lang === "de" ? "Patientenübersicht" : "Patient Overview"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{lang === "de" ? "Name" : "Name"}</p>
                  <p className="font-medium">{patientName}</p>
                </div>
              </div>
              {patientAge && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{lang === "de" ? "Alter" : "Age"}</p>
                    <p className="font-medium">{patientAge} {lang === "de" ? "Jahre" : "years"}{patientSex && ` • ${patientSex}`}</p>
                  </div>
                </div>
              )}
              {consultation.body_locations && consultation.body_locations.length > 0 && (
                <div className="flex items-center gap-3 sm:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{lang === "de" ? "Betroffene Bereiche" : "Affected Areas"}</p>
                    <p className="font-medium">{consultation.body_locations.join(", ")}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Symptoms - hidden for prescription requests */}
          {!isPrescriptionRequest && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  {lang === "de" ? "Symptome & Verlauf" : "Symptoms & Timeline"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {consultation.symptoms && (consultation.symptoms as string[]).length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{lang === "de" ? "Symptome" : "Symptoms"}</p>
                    <div className="flex flex-wrap gap-2">
                      {(consultation.symptoms as string[]).map((symptom) => (
                        <Badge key={symptom} variant="outline">
                          {symptomLabels[symptom]?.[lang] || symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {consultation.symptom_severity && (
                  <div>
                    <p className="text-sm text-muted-foreground">{lang === "de" ? "Schweregrad" : "Severity"}</p>
                    <p className="font-medium capitalize">{consultation.symptom_severity}</p>
                  </div>
                )}
                {consultation.symptom_onset && (
                  <div>
                    <p className="text-sm text-muted-foreground">{lang === "de" ? "Beginn" : "Onset"}</p>
                    <p className="font-medium">{onsetLabels[consultation.symptom_onset]?.[lang] || consultation.symptom_onset}</p>
                  </div>
                )}
                {consultation.has_changed && consultation.change_description && (
                  <div>
                    <p className="text-sm text-muted-foreground">{lang === "de" ? "Veränderungen" : "Changes"}</p>
                    <p className="font-medium">{consultation.change_description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Medical History - hidden for prescription requests */}
          {!isPrescriptionRequest && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Pill className="h-5 w-5 text-primary" />
                  {lang === "de" ? "Medizinische Vorgeschichte" : "Medical History"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">{lang === "de" ? "Allergien" : "Allergies"}</p>
                    <p className="font-medium">
                      {consultation.has_allergies 
                        ? consultation.allergies_description || (lang === "de" ? "Ja" : "Yes")
                        : (lang === "de" ? "Keine bekannt" : "None known")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{lang === "de" ? "Medikamente" : "Medications"}</p>
                    <p className="font-medium">
                      {consultation.takes_medications 
                        ? consultation.medications_description || (lang === "de" ? "Ja" : "Yes")
                        : (lang === "de" ? "Keine" : "None")}
                    </p>
                  </div>
                  {consultation.has_self_treated && (
                    <div className="sm:col-span-2">
                      <p className="text-sm text-muted-foreground">{lang === "de" ? "Selbstbehandlung" : "Self-Treatment"}</p>
                      <p className="font-medium">{consultation.self_treatment_description || (lang === "de" ? "Ja" : "Yes")}</p>
                    </div>
                  )}
                </div>
                {consultation.additional_notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">{lang === "de" ? "Zusätzliche Hinweise" : "Additional Notes"}</p>
                    <p className="font-medium">{consultation.additional_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Additional notes for prescription requests */}
          {isPrescriptionRequest && consultation.additional_notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  {lang === "de" ? "Rezeptanfrage-Details" : "Prescription Request Details"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{consultation.additional_notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Photos */}
          {photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  {lang === "de" ? "Fotos" : "Photos"} ({photos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      {photoUrls[photo.id] ? (
                        <img 
                          src={photoUrls[photo.id]} 
                          alt={photo.photo_type}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(photoUrls[photo.id], "_blank")}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Clock className="h-6 w-6 text-muted-foreground animate-pulse" />
                        </div>
                      )}
                      <Badge 
                        variant="secondary" 
                        className="absolute bottom-2 left-2 text-xs"
                      >
                        {photo.photo_type === "close" ? (lang === "de" ? "Nahaufnahme" : "Close-up") :
                         photo.photo_type === "overview" ? (lang === "de" ? "Übersicht" : "Overview") :
                         photo.photo_type === "context" ? (lang === "de" ? "Kontext" : "Context") : photo.photo_type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Response */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                {lang === "de" ? "Ärztliche Stellungnahme" : "Doctor's Response"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {consultation.status === "completed" ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">{consultation.doctor_response}</p>
                  </div>
                  {consultation.responded_at && (
                    <p className="text-sm text-muted-foreground">
                      {lang === "de" ? "Beantwortet am" : "Responded"}{" "}
                      {format(new Date(consultation.responded_at), "PPP", { locale: dateLocale })}
                    </p>
                  )}
                  
                  {/* Download Honorarnote Button */}
                  {canDownloadHonorarnote && (
                    <div className="pt-4 border-t border-border">
                      <Button 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={handleDownloadHonorarnote}
                        disabled={isDownloadingHonorarnote}
                      >
                        {isDownloadingHonorarnote ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        {lang === "de" ? "Honorarnote herunterladen" : "Download Medical Fee Note"}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        {lang === "de"
                          ? "Honorarnote zur Überprüfung anzeigen"
                          : "View fee note for verification"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
              <>
                  <div className="space-y-2">
                    <Label htmlFor="response">
                      {lang === "de" ? "Ihre Diagnose & Empfehlung" : "Your Diagnosis & Recommendation"}
                    </Label>
                    <Textarea
                      id="response"
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder={lang === "de" 
                        ? "Geben Sie Ihre professionelle Einschätzung ein..." 
                        : "Enter your professional assessment..."}
                      className="min-h-[200px] resize-none"
                    />
                  </div>

                  {/* ICD-10 Code Section - only for regular consultations */}
                  {!isPrescriptionRequest && (
                    <div className="border-t border-border pt-4 mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="icd10Code" className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          {lang === "de" ? "ICD-10-Code (für Honorarnote)" : "ICD-10 Code (for medical fee note)"}
                        </Label>
                        <div className="relative">
                          <Input
                            id="icd10Code"
                            value={icd10Code}
                            onChange={(e) => {
                              const value = e.target.value.toUpperCase();
                              setIcd10Code(value);
                              setShowIcd10Suggestions(value.length > 0);
                            }}
                            onFocus={() => setShowIcd10Suggestions(icd10Code.length > 0 || true)}
                            onBlur={() => setTimeout(() => setShowIcd10Suggestions(false), 200)}
                            placeholder={lang === "de" ? "z.B. L50.0" : "e.g. L50.0"}
                            className="font-mono"
                          />
                          {showIcd10Suggestions && (
                            <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                              {COMMON_ICD10_CODES
                                .filter(item => 
                                  item.code.includes(icd10Code) || 
                                  item.description.toLowerCase().includes(icd10Code.toLowerCase()) ||
                                  icd10Code.length === 0
                                )
                                .slice(0, 8)
                                .map((item) => (
                                  <button
                                    key={item.code}
                                    type="button"
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent focus:bg-accent focus:outline-none"
                                    onMouseDown={() => {
                                      setIcd10Code(item.code);
                                      setIcd10Description(item.description);
                                      setShowIcd10Suggestions(false);
                                    }}
                                  >
                                    <span className="font-mono font-medium text-primary">{item.code}</span>
                                    <span className="text-muted-foreground ml-2">– {item.description}</span>
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="icd10Description">
                          {lang === "de" ? "Diagnose (optional)" : "Diagnosis (optional)"}
                        </Label>
                        <Input
                          id="icd10Description"
                          value={icd10Description}
                          onChange={(e) => setIcd10Description(e.target.value)}
                          placeholder={lang === "de" ? "z.B. Allergische Urticaria" : "e.g. Allergic Urticaria"}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-4">
                    <Button 
                      onClick={() => handleSubmitResponse("completed")}
                      disabled={isSubmitting || !response.trim() || (!isPrescriptionRequest && !icd10Code.trim())}
                      className="w-full gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting 
                        ? (lang === "de" ? "Wird gesendet..." : "Sending...")
                        : (lang === "de" ? "Antwort senden & abschließen" : "Send Response & Complete")}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleSubmitResponse("in_review")}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {lang === "de" ? "Als Entwurf speichern" : "Save as Draft"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetail;
