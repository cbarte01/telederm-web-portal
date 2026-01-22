import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Check, AlertCircle, User, MapPin, Camera, Clock, Activity, Stethoscope, FileText } from "lucide-react";
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

const AccountPayment = ({ draft, updateDraft, onNext, setStep }: AccountPaymentProps) => {
  const { t, i18n } = useTranslation("consultation");
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const lang = i18n.language === "de" ? "de" : "en";

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

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
    if (!user || !consentChecked) return;
    
    setIsSubmitting(true);
    
    try {
      // Get the user's profile id
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error("Profile not found");

      // Create consultation - pre-assign doctor if from referral
      const { data: consultation, error: consultationError } = await supabase
        .from("consultations")
        .insert({
          patient_id: profile.id,
          status: "submitted",
          concern_category: draft.concernCategory,
          body_locations: draft.bodyLocations,
          symptom_onset: draft.symptomOnset,
          has_changed: draft.hasChanged,
          change_description: draft.changeDescription,
          symptoms: draft.symptoms,
          symptom_severity: draft.symptomSeverity,
          has_allergies: draft.hasAllergies,
          allergies_description: draft.allergiesDescription,
          takes_medications: draft.takesMedications,
          medications_description: draft.medicationsDescription,
          has_self_treated: draft.hasSelfTreated,
          self_treatment_description: draft.selfTreatmentDescription,
          date_of_birth: draft.dateOfBirth,
          biological_sex: draft.biologicalSex,
          additional_notes: draft.additionalNotes,
          submitted_at: new Date().toISOString(),
          // B2B2C: Pre-assign doctor from referral link
          doctor_id: draft.referredDoctorId || null,
        })
        .select()
        .single();

      if (consultationError) throw consultationError;

      // Upload photos to storage and create records
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

      // Clear draft and navigate to patient dashboard with success state
      sessionStorage.removeItem("telederm_consultation_draft");
      navigate("/patient/dashboard", {
        replace: true, 
        state: { consultationSubmitted: true } 
      });
      
    } catch (error) {
      console.error("Consultation submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit consultation. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryLabels: Record<string, { en: string; de: string }> = {
    skin: { en: "Skin Conditions", de: "Hauterkrankungen" },
    hair: { en: "Hair & Scalp", de: "Haare & Kopfhaut" },
    nails: { en: "Nail Problems", de: "Nagelprobleme" },
    infections: { en: "Infections", de: "Infektionen" },
    allergies: { en: "Allergies & Reactions", de: "Allergien & Reaktionen" },
    pigmentation: { en: "Pigmentation", de: "Pigmentierung" },
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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("step9.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("step9.subtitle")}
        </p>
      </div>

      {/* Detailed Consultation Summary */}
      <div className="p-4 rounded-xl border border-border bg-card space-y-5">
        <h3 className="font-semibold text-foreground text-lg border-b border-border pb-2">
          {t("step9.summary.title")}
        </h3>
        
        {/* Personal Details */}
        <SummarySection icon={User} title={lang === "de" ? "Persönliche Angaben" : "Personal Details"}>
          <SummaryRow label={lang === "de" ? "Name" : "Name"} value={draft.fullName} />
          <SummaryRow label={lang === "de" ? "Geburtsdatum" : "Date of birth"} value={draft.dateOfBirth} />
          <SummaryRow label={lang === "de" ? "SVNr" : "SSN"} value={draft.socialSecurityNumber} />
          <SummaryRow 
            label={lang === "de" ? "Geschlecht" : "Sex"} 
            value={draft.biologicalSex ? sexLabels[draft.biologicalSex]?.[lang] : undefined} 
          />
        </SummarySection>

        {/* Concern & Location */}
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

        {/* Photos */}
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

        {/* Timeline */}
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

        {/* Symptoms */}
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

        {/* Medical History */}
        <SummarySection icon={Stethoscope} title={lang === "de" ? "Krankengeschichte" : "Medical History"}>
          <SummaryRow 
            label={lang === "de" ? "Allergien" : "Allergies"} 
            value={draft.hasAllergies !== undefined ? (draft.hasAllergies ? (draft.allergiesDescription || (lang === "de" ? "Ja" : "Yes")) : (lang === "de" ? "Keine" : "None")) : undefined} 
          />
          <SummaryRow 
            label={lang === "de" ? "Medikamente" : "Medications"} 
            value={draft.takesMedications !== undefined ? (draft.takesMedications ? (draft.medicationsDescription || (lang === "de" ? "Ja" : "Yes")) : (lang === "de" ? "Keine" : "None")) : undefined} 
          />
          <SummaryRow 
            label={lang === "de" ? "Selbstbehandlung" : "Self-treated"} 
            value={draft.hasSelfTreated !== undefined ? (draft.hasSelfTreated ? (draft.selfTreatmentDescription || (lang === "de" ? "Ja" : "Yes")) : (lang === "de" ? "Nein" : "No")) : undefined} 
          />
        </SummarySection>

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
          <div className="flex items-center gap-3 p-4 rounded-xl border border-primary bg-primary/5">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {user.user_metadata?.full_name || user.email}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={consentChecked}
              onCheckedChange={(checked) => setConsentChecked(checked === true)}
            />
            <label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
              {t("step9.consent")}
            </label>
          </div>
          
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmitConsultation}
            disabled={!consentChecked || isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("step9.submit")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountPayment;
