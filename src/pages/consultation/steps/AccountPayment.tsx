import { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Check, AlertCircle, User, MapPin, Camera, Clock, Activity, Stethoscope, FileText, CreditCard, ShieldCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ConsultationDraft, BODY_AREA_LABELS, BiologicalSex } from "@/types/consultation";

interface AccountPaymentProps {
  draft: ConsultationDraft;
  updateDraft: (updates: Partial<ConsultationDraft>) => void;
  onNext: () => void;
  setStep: (step: number) => void;
  onAllowNavigation?: () => void;
}

interface PatientProfile {
  id: string;
  full_name: string | null;
  date_of_birth: string | null;
  social_security_number: string | null;
  biological_sex: string | null;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AccountPayment = ({ draft, updateDraft, onNext, setStep, onAllowNavigation }: AccountPaymentProps) => {
  const { t, i18n } = useTranslation("consultation");
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [healthDataConsentChecked, setHealthDataConsentChecked] = useState(false);
  const [termsConsentChecked, setTermsConsentChecked] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const lang = i18n.language === "de" ? "de" : "en";

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  // Fetch patient profile when user is logged in
  useEffect(() => {
    const fetchPatientProfile = async () => {
      if (!user) {
        setPatientProfile(null);
        return;
      }

      setIsLoadingProfile(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, date_of_birth, social_security_number, biological_sex")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;
        setPatientProfile(data as PatientProfile);
      } catch (err) {
        console.error("Error fetching patient profile:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchPatientProfile();
  }, [user]);

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setAuthError(null);
    setIsSubmitting(true);
    const { error } = await signIn(values.email, values.password);
    setIsSubmitting(false);
    
    if (error) {
      setAuthError(error.message);
    }
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setAuthError(null);
    setIsSubmitting(true);
    const { error } = await signUp(values.email, values.password, values.fullName);
    setIsSubmitting(false);
    
    if (error) {
      setAuthError(error.message);
    }
  };

  const handleSubmitConsultation = async () => {
    if (!user || !healthDataConsentChecked || !termsConsentChecked || !patientProfile) return;
    
    setIsProcessingPayment(true);
    
    const isPrescriptionFlow = draft.consultationType === 'prescription';
    
    try {
      // Create consultation in draft status first
      const db = supabase as any;
      const { data: consultation, error: consultationError } = await db
        .from("consultations")
        .insert({
          patient_id: patientProfile.id,
          status: "draft", // Will be updated to "submitted" after payment
          consultation_type: draft.consultationType || 'consultation',
          concern_category: isPrescriptionFlow ? null : draft.concernCategory,
          body_locations: isPrescriptionFlow ? [] : draft.bodyLocations,
          symptom_onset: isPrescriptionFlow ? null : draft.symptomOnset,
          has_changed: isPrescriptionFlow ? null : draft.hasChanged,
          change_description: isPrescriptionFlow ? null : draft.changeDescription,
          symptoms: isPrescriptionFlow ? [] : draft.symptoms,
          symptom_severity: isPrescriptionFlow ? null : draft.symptomSeverity,
          has_allergies: isPrescriptionFlow ? null : draft.hasAllergies,
          allergies_description: isPrescriptionFlow ? null : draft.allergiesDescription,
          takes_medications: isPrescriptionFlow ? null : draft.takesMedications,
          medications_description: isPrescriptionFlow ? null : draft.medicationsDescription,
          has_self_treated: isPrescriptionFlow ? null : draft.hasSelfTreated,
          self_treatment_description: isPrescriptionFlow ? null : draft.selfTreatmentDescription,
          date_of_birth: patientProfile.date_of_birth,
          biological_sex: patientProfile.biological_sex,
          additional_notes: draft.additionalNotes,
          doctor_id: draft.referredDoctorId || null,
          pricing_plan: draft.pricingPlan || "standard",
          consultation_price: draft.consultationPrice || (draft.pricingPlan === "urgent" ? 74 : draft.pricingPlan === "prescription" ? 29 : 49),
          payment_status: "pending",
        })
        .select()
        .single();

      if (consultationError) throw consultationError;
      
      setConsultationId(consultation.id);

      // Upload photos to storage (only for regular consultations)
      if (!isPrescriptionFlow) {
        for (const photo of draft.photos) {
          if (photo.file) {
            const filePath = `${user.id}/${consultation.id}/${photo.type}_${Date.now()}.jpg`;
            
            const { error: uploadError } = await supabase.storage
              .from("consultation-photos")
              .upload(filePath, photo.file, {
                contentType: photo.file.type,
              });

            if (uploadError) {
              console.error("Photo upload error:", uploadError);
              continue;
            }

            await supabase
              .from("consultation_photos")
              .insert({
                consultation_id: consultation.id,
                storage_path: filePath,
                photo_type: photo.type,
              });
          }
        }
      }

      // Create Stripe checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke("create-checkout", {
        body: {
          consultation_id: consultation.id,
          pricing_plan: draft.pricingPlan || "standard",
          custom_price: draft.consultationPrice,
        },
      });

      if (checkoutError) throw checkoutError;

      if (checkoutData?.url) {
        // Signal parent to allow navigation without warning
        onAllowNavigation?.();
        // Clear beforeunload handler as backup
        window.onbeforeunload = null;
        // Redirect to Stripe Checkout
        window.location.href = checkoutData.url;
      } else {
        throw new Error("No checkout URL received");
      }
      
    } catch (error) {
      console.error("Consultation submission error:", error);
      toast({
        variant: "destructive",
        title: lang === "de" ? "Fehler" : "Error",
        description: lang === "de" 
          ? "Die Konsultation konnte nicht erstellt werden. Bitte versuchen Sie es erneut."
          : "Failed to create consultation. Please try again.",
      });
      setIsProcessingPayment(false);
    }
  };

  const categoryLabels: Record<string, { en: string; de: string }> = {
    skin: { en: "Skin Conditions", de: "Hauterkrankungen" },
    hair: { en: "Hair & Scalp", de: "Haare & Kopfhaut" },
    nails: { en: "Nail Problems", de: "Nagelprobleme" },
    infections: { en: "Infections", de: "Infektionen" },
    allergies: { en: "Allergies & Reactions", de: "Allergien & Reaktionen" },
    pigmentation: { en: "Pigmentation", de: "Pigmentierung" },
    prescription: { en: "Prescription Request", de: "Rezeptanforderung" },
  };

  const onsetLabels: Record<string, { en: string; de: string }> = {
    today: { en: "Today", de: "Heute" },
    thisWeek: { en: "This week", de: "Diese Woche" },
    thisMonth: { en: "This month", de: "Diesen Monat" },
    longerAgo: { en: "More than a month ago", de: "Vor mehr als einem Monat" },
  };

  const severityLabels: Record<string, { en: string; de: string }> = {
    mild: { en: "Mild", de: "Leicht" },
    moderate: { en: "Moderate", de: "Mittel" },
    severe: { en: "Severe", de: "Stark" },
  };

  const sexLabels: Record<BiologicalSex, { en: string; de: string }> = {
    male: { en: "Male", de: "Männlich" },
    female: { en: "Female", de: "Weiblich" },
    diverse: { en: "Diverse", de: "Divers" },
  };

  const symptomLabels: Record<string, { en: string; de: string }> = {
    itching: { en: "Itching", de: "Juckreiz" },
    pain: { en: "Pain", de: "Schmerzen" },
    burning: { en: "Burning", de: "Brennen" },
    swelling: { en: "Swelling", de: "Schwellung" },
    oozing: { en: "Oozing", de: "Nässen" },
    bleeding: { en: "Bleeding", de: "Blutung" },
    flaking: { en: "Flaking", de: "Schuppung" },
    none: { en: "None", de: "Keines" },
  };

  const getSelectedSymptoms = () => {
    if (!draft.symptoms || draft.symptoms.length === 0) return null;
    return draft.symptoms
      .filter(s => s !== "none")
      .map(s => symptomLabels[s]?.[lang] || s)
      .join(", ");
  };

  const SummarySection = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-foreground font-medium">
        <Icon className="w-4 h-4 text-primary" />
        <span>{title}</span>
      </div>
      <div className="pl-6 text-sm text-muted-foreground space-y-1">
        {children}
      </div>
    </div>
  );

  const SummaryRow = ({ label, value }: { label: string; value?: string | null }) => {
    if (!value) return null;
    return (
      <div className="flex justify-between gap-4">
        <span>{label}:</span>
        <span className="font-medium text-foreground text-right">{value}</span>
      </div>
    );
  };

  // Check if profile is complete for submission
  const isProfileComplete = patientProfile && 
    patientProfile.full_name && 
    patientProfile.date_of_birth && 
    patientProfile.biological_sex;

  const isPrescriptionFlow = draft.consultationType === 'prescription';

  const getPlanLabel = () => {
    if (draft.pricingPlan === 'prescription') {
      return lang === 'de' ? 'Rezeptanforderung' : 'Prescription Request';
    }
    if (draft.pricingPlan === 'urgent') {
      return lang === 'de' ? 'Dringliche Anfrage' : 'Urgent Request';
    }
    return lang === 'de' ? 'Standard-Anfrage' : 'Standard Request';
  };

  const getPlanPrice = () => {
    if (typeof draft.consultationPrice === 'number') return draft.consultationPrice;
    if (draft.pricingPlan === 'prescription') return 29;
    if (draft.pricingPlan === 'urgent') return 74;
    return 49;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("step9.title")}
        </h1>
        <p className="text-muted-foreground">
          {isPrescriptionFlow 
            ? (lang === "de" ? "Melden Sie sich an, um Ihre Rezeptanforderung einzureichen" : "Sign in to submit your prescription request")
            : t("step9.subtitle")}
        </p>
      </div>

      {/* Detailed Consultation Summary */}
      <div className="p-4 rounded-xl border border-border bg-card space-y-5">
        <h3 className="font-semibold text-foreground text-lg border-b border-border pb-2">
          {isPrescriptionFlow 
            ? (lang === "de" ? "Ihre Rezeptanforderung" : "Your Prescription Request")
            : t("step9.summary.title")}
        </h3>
        
        {/* Prescription Request Type Indicator */}
        {isPrescriptionFlow && (
          <SummarySection icon={FileText} title={lang === "de" ? "Anfrageart" : "Request Type"}>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                {lang === "de" ? "Rezeptanforderung" : "Prescription Request"}
              </span>
            </div>
            <p className="text-sm mt-2">
              {lang === "de" 
                ? "Sie fordern eine Rezeptverlängerung für eine bestehende Behandlung an."
                : "You are requesting a prescription renewal for an existing treatment."}
            </p>
          </SummarySection>
        )}
        
        {/* Personal Details - from profile */}
        {user && patientProfile && (
          <SummarySection icon={User} title={lang === "de" ? "Persönliche Angaben" : "Personal Details"}>
            <SummaryRow label={lang === "de" ? "Name" : "Name"} value={patientProfile.full_name} />
            <SummaryRow label={lang === "de" ? "Geburtsdatum" : "Date of birth"} value={patientProfile.date_of_birth} />
            <SummaryRow label={lang === "de" ? "SVNr" : "SSN"} value={patientProfile.social_security_number} />
            <SummaryRow 
              label={lang === "de" ? "Geschlecht" : "Sex"} 
              value={patientProfile.biological_sex ? sexLabels[patientProfile.biological_sex as BiologicalSex]?.[lang] : undefined} 
            />
            {!isProfileComplete && (
              <Alert className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {lang === "de" 
                    ? "Bitte vervollständigen Sie Ihr Profil vor der Einreichung (Name, Geburtsdatum, Geschlecht)."
                    : "Please complete your profile before submitting (name, date of birth, sex)."}
                </AlertDescription>
              </Alert>
            )}
          </SummarySection>
        )}

        {/* Concern & Location - only for regular consultations */}
        {!isPrescriptionFlow && (
          <SummarySection icon={MapPin} title={lang === "de" ? "Anliegen & Betroffene Stellen" : "Concern & Affected Areas"}>
            <SummaryRow 
              label={lang === "de" ? "Kategorie" : "Category"} 
              value={draft.concernCategory ? categoryLabels[draft.concernCategory]?.[lang] : undefined} 
            />
            <SummaryRow 
              label={lang === "de" ? "Körperstellen" : "Body areas"} 
              value={draft.bodyLocations.length > 0 ? draft.bodyLocations.map(l => BODY_AREA_LABELS[l]?.[lang]).join(", ") : undefined} 
            />
          </SummarySection>
        )}

        {/* Photos - only for regular consultations */}
        {!isPrescriptionFlow && (
          <SummarySection icon={Camera} title={lang === "de" ? "Hochgeladene Fotos" : "Uploaded Photos"}>
            <p>{draft.photos.length} {lang === "de" ? "Foto(s) hochgeladen" : "photo(s) uploaded"}</p>
            {draft.photos.length > 0 && (
              <div className="flex gap-2 mt-2">
                {draft.photos.map((photo, idx) => (
                  photo.preview && (
                    <img 
                      key={idx} 
                      src={photo.preview} 
                      alt={`Photo ${idx + 1}`} 
                      className="w-12 h-12 object-cover rounded-md border border-border"
                    />
                  )
                ))}
              </div>
            )}
          </SummarySection>
        )}

        {/* Timeline - only for regular consultations */}
        {!isPrescriptionFlow && (
          <SummarySection icon={Clock} title={lang === "de" ? "Zeitverlauf" : "Timeline"}>
            <SummaryRow 
              label={lang === "de" ? "Beginn" : "Onset"} 
              value={draft.symptomOnset ? onsetLabels[draft.symptomOnset]?.[lang] : undefined} 
            />
            <SummaryRow 
              label={lang === "de" ? "Verändert" : "Changed"} 
              value={draft.hasChanged !== undefined ? (draft.hasChanged ? (lang === "de" ? "Ja" : "Yes") : (lang === "de" ? "Nein" : "No")) : undefined} 
            />
            {draft.hasChanged && draft.changeDescription && (
              <div className="mt-1">
                <span className="text-xs">{lang === "de" ? "Beschreibung der Veränderung" : "Change description"}:</span>
                <p className="font-medium text-foreground mt-0.5 text-xs italic">"{draft.changeDescription}"</p>
              </div>
            )}
          </SummarySection>
        )}

        {/* Symptoms - only for regular consultations */}
        {!isPrescriptionFlow && (
          <SummarySection icon={Activity} title={lang === "de" ? "Symptome" : "Symptoms"}>
            <SummaryRow 
              label={lang === "de" ? "Symptome" : "Symptoms"} 
              value={getSelectedSymptoms() || (lang === "de" ? "Keine angegeben" : "None specified")} 
            />
            <SummaryRow 
              label={lang === "de" ? "Schweregrad" : "Severity"} 
              value={draft.symptomSeverity ? severityLabels[draft.symptomSeverity]?.[lang] : undefined} 
            />
          </SummarySection>
        )}

        {/* Medical History - only for regular consultations */}
        {!isPrescriptionFlow && (
          <SummarySection icon={Stethoscope} title={lang === "de" ? "Krankengeschichte" : "Medical History"}>
            <SummaryRow 
              label={lang === "de" ? "Allergien" : "Allergies"} 
              value={draft.hasAllergies !== undefined ? (draft.hasAllergies ? (draft.allergiesDescription || (lang === "de" ? "Ja" : "Yes")) : (lang === "de" ? "Keine" : "None")) : undefined} 
            />
            <SummaryRow 
              label={lang === "de" ? "Medikamente" : "Medications"} 
              value={draft.takesMedications !== undefined ? (draft.takesMedications ? (draft.medicationsDescription || (lang === "de" ? "Ja" : "Yes")) : (lang === "de" ? "Keine" : "None")) : undefined} 
            />
            {draft.hasSelfTreated !== undefined && (
              <SummaryRow 
                label={lang === "de" ? "Selbstbehandlung" : "Self-treated"} 
                value={draft.hasSelfTreated ? (draft.selfTreatmentDescription || (lang === "de" ? "Ja" : "Yes")) : (lang === "de" ? "Nein" : "No")} 
              />
            )}
          </SummarySection>
        )}

        {/* Additional Notes */}
        {draft.additionalNotes && (
          <SummarySection icon={FileText} title={lang === "de" ? "Zusätzliche Anmerkungen" : "Additional Notes"}>
            <p className="italic">"{draft.additionalNotes}"</p>
          </SummarySection>
        )}

        {/* Assigned Doctor (from referral) */}
        {draft.referredDoctorName && (
          <SummarySection icon={User} title={lang === "de" ? "Zugewiesener Arzt" : "Assigned Doctor"}>
            <SummaryRow 
              label={lang === "de" ? "Arzt" : "Doctor"} 
              value={draft.referredDoctorName} 
            />
            {draft.referredPracticeName && (
              <SummaryRow 
                label={lang === "de" ? "Praxis" : "Practice"} 
                value={draft.referredPracticeName} 
              />
            )}
          </SummarySection>
        )}

        {/* Pricing Plan */}
        {draft.pricingPlan && (
          <SummarySection icon={CreditCard} title={lang === "de" ? "Gewählter Plan" : "Selected Plan"}>
            <SummaryRow 
              label={lang === "de" ? "Plan" : "Plan"} 
              value={getPlanLabel()} 
            />
            <SummaryRow 
              label={lang === "de" ? "Preis" : "Price"} 
              value={`€${getPlanPrice()}`} 
            />
          </SummarySection>
        )}
      </div>

      {/* Auth / Submit */}
      {!user ? (
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t("step9.loginTab")}</TabsTrigger>
            <TabsTrigger value="signup">{t("step9.signupTab")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-4">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                {authError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("step9.loginTab")}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="signup" className="mt-4">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                {authError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}
                <FormField
                  control={signupForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("step9.signupTab")}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-primary bg-primary/5">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {patientProfile?.full_name || user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              {!isProfileComplete && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>
                      {lang === "de" 
                        ? "Ihr Profil ist unvollständig. Bitte ergänzen Sie Ihre Daten."
                        : "Your profile is incomplete. Please update your details."}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/profile?returnTo=/consultation?resume=true")}
                    >
                      {lang === "de" ? "Profil bearbeiten" : "Edit Profile"}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Health Data Consent - Art. 9 DSGVO */}
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-accent/30">
                <Checkbox
                  id="healthDataConsent"
                  checked={healthDataConsentChecked}
                  onCheckedChange={(checked) => setHealthDataConsentChecked(checked === true)}
                  disabled={!isProfileComplete}
                  className="mt-0.5"
                />
                <label htmlFor="healthDataConsent" className="text-sm text-muted-foreground cursor-pointer">
                  <Trans
                    i18nKey="step9.healthDataConsent"
                    ns="consultation"
                    components={{
                      privacyLink: <a href="/datenschutz#gesundheitsdaten" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline" />
                    }}
                  />
                </label>
              </div>

              {/* General Terms Consent */}
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-accent/30">
                <Checkbox
                  id="termsConsent"
                  checked={termsConsentChecked}
                  onCheckedChange={(checked) => setTermsConsentChecked(checked === true)}
                  disabled={!isProfileComplete}
                  className="mt-0.5"
                />
                <label htmlFor="termsConsent" className="text-sm text-muted-foreground cursor-pointer">
                  <Trans
                    i18nKey="step9.termsConsent"
                    ns="consultation"
                    components={{
                      termsLink: <a href="/agb" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline" />
                    }}
                  />
                </label>
              </div>
              
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleSubmitConsultation}
                disabled={!healthDataConsentChecked || !termsConsentChecked || isProcessingPayment || !isProfileComplete}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {lang === "de" ? "Weiter zur Zahlung..." : "Proceeding to payment..."}
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    {lang === "de" 
                      ? `Jetzt bezahlen (€${getPlanPrice()})` 
                      : `Pay now (€${getPlanPrice()})`}
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                {lang === "de" 
                  ? "Sichere Zahlung über Stripe" 
                  : "Secure payment via Stripe"}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountPayment;