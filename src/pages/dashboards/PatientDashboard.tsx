import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Calendar, FileText, Plus, Clock, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import medenaLogo from "@/assets/logo/medena-logo.png";
import { ConsultationDetailDialog } from "@/components/patient/ConsultationDetailDialog";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface Consultation {
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
  doctor_id: string | null;
  doctor_name: string | null;
  doctor_avatar_url: string | null;
  icd10_code: string | null;
  icd10_description: string | null;
  report_storage_path: string | null;
}

const statusConfig: Record<string, { label: string; labelDe: string; icon: React.ElementType; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Draft", labelDe: "Entwurf", icon: FileText, variant: "outline" },
  submitted: { label: "Submitted", labelDe: "Eingereicht", icon: Clock, variant: "secondary" },
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

const PatientDashboard = () => {
  const { t, i18n } = useTranslation("auth");
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lang = i18n.language === "de" ? "de" : "en";

  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Show success toast if redirected after submission
  useEffect(() => {
    if (location.state?.consultationSubmitted) {
      toast({
        title: lang === "de" ? "Antrag eingereicht!" : "Consultation Submitted!",
        description: lang === "de" 
          ? "Ihr Antrag wurde erfolgreich übermittelt. Sie erhalten eine Antwort innerhalb von 24 Stunden."
          : "Your consultation has been successfully submitted. You'll receive a response within 24 hours.",
      });
      // Clear the state so toast doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, lang, toast]);

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user) return;

        // Avoid overly-strict type coupling to the generated DB types for newly-added tables.
        const db = supabase as any;
      
      const { data, error } = await supabase
        .from("consultations")
        .select(`
          id, status, concern_category, body_locations, symptom_onset, 
          symptoms, symptom_severity, doctor_response, created_at, 
          submitted_at, responded_at, doctor_id, icd10_code, icd10_description,
          report_storage_path
        `)
        .eq("patient_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Fetch doctor names for consultations that have a doctor_id
        const doctorIds = [...new Set(data.filter((c) => c.doctor_id).map((c) => c.doctor_id))];
        
        // NOTE: Patients cannot read full doctor `profiles` rows (PII). We fetch a safe subset instead.
        let doctorMap: Record<string, { display_name: string | null; avatar_url: string | null }> = {};
        if (doctorIds.length > 0) {
          const { data: doctors } = await db
            .from("doctor_public_profiles")
            .select("doctor_id, display_name, avatar_url")
            .in("doctor_id", doctorIds);

          if (doctors) {
            const rows = doctors as Array<{ doctor_id: string; display_name: string | null; avatar_url: string | null }>;
            doctorMap = Object.fromEntries(
              rows.map((d) => [d.doctor_id, { display_name: d.display_name, avatar_url: d.avatar_url }])
            ) as Record<string, { display_name: string | null; avatar_url: string | null }>;
          }
        }
        
        const consultationsWithDoctors = data.map(c => ({
          ...c,
          doctor_name: c.doctor_id ? (doctorMap[c.doctor_id]?.display_name || null) : null,
          doctor_avatar_url: c.doctor_id ? (doctorMap[c.doctor_id]?.avatar_url || null) : null,
        }));
        
        setConsultations(consultationsWithDoctors as Consultation[]);
      }
      setIsLoading(false);
    };

    fetchConsultations();
  }, [user]);

  const activeConsultations = consultations.filter(c => c.status !== "completed" && c.status !== "cancelled");
  const pastConsultations = consultations.filter(c => c.status === "completed" || c.status === "cancelled");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleConsultationClick = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={medenaLogo} alt="Medena" className="w-8 h-8 rounded-lg" />
            <span className="font-serif font-bold text-xl text-foreground">medena</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                {t("common.viewProfile")}
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="gap-2" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              {t("common.logout")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t("dashboard.patient.welcome")}, {user?.user_metadata?.full_name || user?.email?.split("@")[0]}!
            </h1>
            <p className="text-muted-foreground mt-2">{t("dashboard.patient.subtitle")}</p>
          </div>
          <Link to="/consultation">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {lang === "de" ? "Neue Anfrage" : "New Consultation"}
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Consultations */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {lang === "de" ? "Aktive Anfragen" : "Active Consultations"}
            </h2>
            
            {isLoading ? (
              <Card className="shadow-card">
                <CardContent className="py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">Loading...</div>
                  </div>
                </CardContent>
              </Card>
            ) : activeConsultations.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {lang === "de" ? "Keine aktiven Anfragen" : "No active consultations"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {lang === "de" 
                      ? "Starten Sie jetzt Ihre erste Anfrage und erhalten Sie innerhalb von 24 Stunden eine Diagnose."
                      : "Start your first consultation and receive a diagnosis within 24 hours."}
                  </p>
                  <Link to="/consultation">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      {lang === "de" ? "Anfrage starten" : "Start Consultation"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {activeConsultations.map((consultation) => {
                  const config = statusConfig[consultation.status] || statusConfig.submitted;
                  const StatusIcon = config.icon;
                  
                  return (
                    <Card key={consultation.id} className="shadow-card hover:shadow-md transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <StatusIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {consultation.concern_category 
                                  ? concernLabels[consultation.concern_category]?.[lang] || consultation.concern_category
                                  : (lang === "de" ? "Hautanfrage" : "Skin Consultation")}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {lang === "de" ? "Eingereicht am" : "Submitted"} {formatDate(consultation.submitted_at || consultation.created_at)}
                              </p>
                              {consultation.doctor_id && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={consultation.doctor_avatar_url || undefined}
                                      alt={consultation.doctor_name || (lang === "de" ? "Arzt" : "Doctor")}
                                    />
                                    <AvatarFallback>
                                      <User className="h-3.5 w-3.5" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>
                                    {consultation.doctor_name
                                      ? consultation.doctor_name
                                      : (lang === "de" ? "Zugewiesener Arzt" : "Assigned doctor")}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge variant={config.variant}>
                            {lang === "de" ? config.labelDe : config.label}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Past Consultations */}
            {pastConsultations.length > 0 && (
              <>
                <h2 className="text-xl font-semibold text-foreground mt-8">
                  {lang === "de" ? "Vergangene Anfragen" : "Past Consultations"}
                </h2>
                <div className="space-y-3">
                  {pastConsultations.slice(0, 5).map((consultation) => {
                    const config = statusConfig[consultation.status] || statusConfig.completed;
                    
                    return (
                      <Card 
                        key={consultation.id} 
                        className="shadow-soft hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => handleConsultationClick(consultation)}
                      >
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {consultation.concern_category 
                                  ? concernLabels[consultation.concern_category]?.[lang] || consultation.concern_category
                                  : (lang === "de" ? "Hautanfrage" : "Skin Consultation")}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(consultation.submitted_at || consultation.created_at)}
                              </p>
                              {consultation.doctor_id && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={consultation.doctor_avatar_url || undefined}
                                      alt={consultation.doctor_name || (lang === "de" ? "Arzt" : "Doctor")}
                                    />
                                    <AvatarFallback>
                                      <User className="h-3.5 w-3.5" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>
                                    {consultation.doctor_name
                                      ? consultation.doctor_name
                                      : (lang === "de" ? "Zugewiesener Arzt" : "Assigned doctor")}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {lang === "de" ? config.labelDe : config.label}
                              </Badge>
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">
                  {lang === "de" ? "Übersicht" : "Overview"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {lang === "de" ? "Gesamt Anfragen" : "Total Consultations"}
                  </span>
                  <span className="font-semibold text-foreground">{consultations.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {lang === "de" ? "Aktiv" : "Active"}
                  </span>
                  <span className="font-semibold text-foreground">{activeConsultations.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {lang === "de" ? "Abgeschlossen" : "Completed"}
                  </span>
                  <span className="font-semibold text-foreground">
                    {consultations.filter(c => c.status === "completed").length}
                  </span>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>

      <ConsultationDetailDialog 
        consultation={selectedConsultation}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default PatientDashboard;
