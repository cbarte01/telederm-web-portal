import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import medenaLogo from "@/assets/logo/medena-logo.png";
import ConsultationQueue from "./doctor/ConsultationQueue";
import ConsultationDetail from "./doctor/ConsultationDetail";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
  icd10_code: string | null;
  icd10_description: string | null;
  honorarnote_number: string | null;
  honorarnote_storage_path: string | null;
  profiles?: { full_name: string | null } | null;
}

interface ConsultationPhoto {
  id: string;
  photo_type: string;
  storage_path: string;
}

const DoctorDashboard = () => {
  const { t, i18n } = useTranslation("auth");
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "in_review" | "completed">("pending");
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<ConsultationPhoto[]>([]);
  
  const lang = i18n.language === "de" ? "de" : "en";

  const fetchConsultations = async () => {
    const { data, error } = await supabase
      .from("consultations")
      .select(`
        id,
        patient_id,
        doctor_id,
        status,
        consultation_type,
        concern_category,
        body_locations,
        symptoms,
        symptom_severity,
        symptom_onset,
        has_changed,
        change_description,
        has_allergies,
        allergies_description,
        takes_medications,
        medications_description,
        has_self_treated,
        self_treatment_description,
        date_of_birth,
        biological_sex,
        additional_notes,
        created_at,
        submitted_at,
        doctor_response,
        responded_at,
        icd10_code,
        icd10_description,
        honorarnote_number,
        honorarnote_storage_path,
        profiles:patient_id (full_name)
      `)
      .neq("status", "draft")
      .order("submitted_at", { ascending: false });

    if (!error && data) {
      setConsultations(data as unknown as Consultation[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(data);
    };
    fetchProfile();
    fetchConsultations();
  }, [user]);

  const handleSelectConsultation = async (id: string) => {
    setSelectedConsultationId(id);
    
    // Fetch photos for this consultation
    const { data: photos } = await supabase
      .from("consultation_photos")
      .select("id, photo_type, storage_path")
      .eq("consultation_id", id);
    
    setSelectedPhotos(photos || []);
  };

  const handleBack = () => {
    setSelectedConsultationId(null);
    setSelectedPhotos([]);
  };

  const handleUpdate = () => {
    fetchConsultations();
    handleBack();
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Doctor";
  const selectedConsultation = consultations.find(c => c.id === selectedConsultationId);

  const pendingCount = consultations.filter(c => c.status === "submitted").length;
  const inReviewCount = consultations.filter(c => c.status === "in_review").length;
  const completedCount = consultations.filter(c => c.status === "completed").length;

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
        {selectedConsultation ? (
          <ConsultationDetail 
            consultation={selectedConsultation}
            photos={selectedPhotos}
            onBack={handleBack}
            onUpdate={handleUpdate}
          />
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                {t("dashboard.doctor.welcome")} {displayName}
              </h1>
              <p className="text-muted-foreground mt-2">{t("dashboard.doctor.subtitle")}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    {lang === "de" ? "Ausstehend" : "Pending"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{pendingCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {lang === "de" ? "Neue Anfragen" : "New requests"}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    {lang === "de" ? "In Bearbeitung" : "In Review"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{inReviewCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {lang === "de" ? "Aktive Fälle" : "Active cases"}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {lang === "de" ? "Abgeschlossen" : "Completed"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{completedCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {lang === "de" ? "Diesen Monat" : "This month"}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    {lang === "de" ? "Gesamt" : "Total"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{consultations.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {lang === "de" ? "Alle Konsultationen" : "All consultations"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Consultation Queue */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {lang === "de" ? "Konsultationen" : "Consultations"}
              </h2>
              <ConsultationQueue 
                consultations={consultations}
                isLoading={isLoading}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onSelectConsultation={handleSelectConsultation}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;
