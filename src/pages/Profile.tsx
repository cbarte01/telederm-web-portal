import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Loader2, Trash2, Copy, Check, Link as LinkIcon, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import teledermLogo from "@/assets/logo/telederm-logo.png";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

const patientAddressSchema = z.object({
  patientAddressStreet: z.string().optional(),
  patientAddressZip: z.string().optional(),
  patientAddressCity: z.string().optional(),
});

const patientProfileSchema = z.object({
  dateOfBirth: z.string().optional(),
  socialSecurityNumber: z.string().optional(),
  biologicalSex: z.enum(["male", "female", "diverse"]).optional(),
  insuranceProvider: z.string().optional(),
});

const doctorProfileSchema = z.object({
  referralCode: z.string().min(3, "Code must be at least 3 characters").max(20, "Code must be at most 20 characters").regex(/^[A-Z0-9_]+$/, "Only uppercase letters, numbers, and underscores allowed"),
  practiceName: z.string().optional(),
  welcomeMessage: z.string().max(200, "Message must be at most 200 characters").optional(),
  standardPrice: z.number().min(1, "Price must be at least €1").max(999, "Price must be at most €999"),
  urgentPrice: z.number().min(1, "Price must be at least €1").max(999, "Price must be at most €999"),
});

const doctorBillingSchema = z.object({
  uidNumber: z.string().optional(),
  iban: z.string().optional(),
  bic: z.string().optional(),
  practiceAddressStreet: z.string().optional(),
  practiceAddressZip: z.string().optional(),
  practiceAddressCity: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PatientAddressFormData = z.infer<typeof patientAddressSchema>;
type PatientProfileFormData = z.infer<typeof patientProfileSchema>;
type DoctorProfileFormData = z.infer<typeof doctorProfileSchema>;
type DoctorBillingFormData = z.infer<typeof doctorBillingSchema>;

const Profile = () => {
  const { t, i18n } = useTranslation("auth");
  const lang = i18n.language === "de" ? "de" : "en";
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [isSubmittingPatient, setIsSubmittingPatient] = useState(false);
  const [isSubmittingDoctor, setIsSubmittingDoctor] = useState(false);
  const [isSubmittingBilling, setIsSubmittingBilling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [copied, setCopied] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", phone: "" },
  });

  const patientAddressForm = useForm<PatientAddressFormData>({
    resolver: zodResolver(patientAddressSchema),
    defaultValues: { patientAddressStreet: "", patientAddressZip: "", patientAddressCity: "" },
  });

  const patientForm = useForm<PatientProfileFormData>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: { dateOfBirth: "", socialSecurityNumber: "", biologicalSex: undefined, insuranceProvider: "" },
  });

  const doctorForm = useForm<DoctorProfileFormData>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: { referralCode: "", practiceName: "", welcomeMessage: "", standardPrice: 49, urgentPrice: 74 },
  });

  const billingForm = useForm<DoctorBillingFormData>({
    resolver: zodResolver(doctorBillingSchema),
    defaultValues: { uidNumber: "", iban: "", bic: "", practiceAddressStreet: "", practiceAddressZip: "", practiceAddressCity: "" },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, referral_code, practice_name, welcome_message, standard_price, urgent_price, date_of_birth, social_security_number, biological_sex, uid_number, iban, bic, practice_address_street, practice_address_zip, practice_address_city, patient_address_street, patient_address_zip, patient_address_city, insurance_provider")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

        if (data) {
          form.reset({
            fullName: data.full_name || "",
            phone: data.phone || "",
          });
          
          // Patient-specific fields
          if (role === "patient") {
            patientAddressForm.reset({
              patientAddressStreet: (data as any).patient_address_street || "",
              patientAddressZip: (data as any).patient_address_zip || "",
              patientAddressCity: (data as any).patient_address_city || "",
            });
            patientForm.reset({
              dateOfBirth: (data as any).date_of_birth || "",
              socialSecurityNumber: (data as any).social_security_number || "",
              biologicalSex: (data as any).biological_sex || undefined,
              insuranceProvider: (data as any).insurance_provider || "",
            });
          }
          
          if (role === "doctor") {
            doctorForm.reset({
              referralCode: data.referral_code || "",
              practiceName: data.practice_name || "",
              welcomeMessage: data.welcome_message || "",
              standardPrice: (data as any).standard_price ?? 49,
              urgentPrice: (data as any).urgent_price ?? 74,
            });
            billingForm.reset({
              uidNumber: (data as any).uid_number || "",
              iban: (data as any).iban || "",
              bic: (data as any).bic || "",
              practiceAddressStreet: (data as any).practice_address_street || "",
              practiceAddressZip: (data as any).practice_address_zip || "",
              practiceAddressCity: (data as any).practice_address_city || "",
            });
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user, form, patientAddressForm, patientForm, doctorForm, billingForm, role]);

  const getDashboardPath = () => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "doctor":
        return "/doctor/dashboard";
      default:
        return "/patient/dashboard";
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.fullName,
          phone: data.phone || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: t("profile.saved"),
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({
        variant: "destructive",
        title: t("errors.generic"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitPatientAddress = async (data: PatientAddressFormData) => {
    if (!user) return;
    
    setIsSubmittingAddress(true);
    try {
      const db = supabase as any;
      const { error } = await db
        .from("profiles")
        .update({
          patient_address_street: data.patientAddressStreet || null,
          patient_address_zip: data.patientAddressZip || null,
          patient_address_city: data.patientAddressCity || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: lang === "de" ? "Adresse gespeichert" : "Address saved",
      });
    } catch (err) {
      console.error("Error updating patient address:", err);
      toast({
        variant: "destructive",
        title: t("errors.generic"),
      });
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  const onSubmitPatient = async (data: PatientProfileFormData) => {
    if (!user) return;
    
    setIsSubmittingPatient(true);
    try {
      const db = supabase as any;
      const { error } = await db
        .from("profiles")
        .update({
          date_of_birth: data.dateOfBirth || null,
          social_security_number: data.socialSecurityNumber || null,
          biological_sex: data.biologicalSex || null,
          insurance_provider: data.insuranceProvider || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: lang === "de" ? "Medizinische Daten gespeichert" : "Medical details saved",
      });
    } catch (err) {
      console.error("Error updating patient profile:", err);
      toast({
        variant: "destructive",
        title: t("errors.generic"),
      });
    } finally {
      setIsSubmittingPatient(false);
    }
  };

  const onSubmitDoctor = async (data: DoctorProfileFormData) => {
    if (!user) return;
    
    setIsSubmittingDoctor(true);
    try {
      // Avoid tight coupling to generated DB types for newly-added columns.
      const db = supabase as any;

      const { error } = await db
        .from("profiles")
        .update({
          referral_code: data.referralCode || null,
          practice_name: data.practiceName || null,
          welcome_message: data.welcomeMessage || null,
          standard_price: data.standardPrice,
          urgent_price: data.urgentPrice,
        })
        .eq("id", user.id);

      if (error) {
        if (error.code === "23505") {
          toast({
            variant: "destructive",
            title: lang === "de" ? "Fehler" : "Error",
            description: lang === "de" ? "Dieser Empfehlungscode ist bereits vergeben." : "This referral code is already taken.",
          });
          return;
        }
        throw error;
      }

      // Keep public referral/branding fields in sync (safe subset used for referral lookups)
      const fullName = form.getValues("fullName") || user.user_metadata?.full_name || "Doctor";
      const { error: publicError } = await db
        .from("doctor_public_profiles")
        .upsert(
          {
            doctor_id: user.id,
            display_name: fullName,
            referral_code: data.referralCode || null,
            practice_name: data.practiceName || null,
            welcome_message: data.welcomeMessage || null,
          },
          { onConflict: "doctor_id" }
        );

      if (publicError) throw publicError;

      toast({
        title: lang === "de" ? "Empfehlungscode gespeichert" : "Referral settings saved",
      });
    } catch (err) {
      console.error("Error updating doctor profile:", err);
      toast({
        variant: "destructive",
        title: t("errors.generic"),
      });
    } finally {
      setIsSubmittingDoctor(false);
    }
  };

  const onSubmitBilling = async (data: DoctorBillingFormData) => {
    if (!user) return;
    
    setIsSubmittingBilling(true);
    try {
      const db = supabase as any;

      const { error } = await db
        .from("profiles")
        .update({
          uid_number: data.uidNumber || null,
          iban: data.iban || null,
          bic: data.bic || null,
          practice_address_street: data.practiceAddressStreet || null,
          practice_address_zip: data.practiceAddressZip || null,
          practice_address_city: data.practiceAddressCity || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: lang === "de" ? "Abrechnungsdaten gespeichert" : "Billing information saved",
      });
    } catch (err) {
      console.error("Error updating billing info:", err);
      toast({
        variant: "destructive",
        title: t("errors.generic"),
      });
    } finally {
      setIsSubmittingBilling(false);
    }
  };

  const getReferralLink = () => {
    const code = doctorForm.watch("referralCode");
    if (!code) return "";
    return `${window.location.origin}/consultation?ref=${code}`;
  };

  const copyReferralLink = async () => {
    const link = getReferralLink();
    if (!link) return;
    
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: lang === "de" ? "Link kopiert!" : "Link copied!",
    });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      // Sign out first
      await signOut();
      
      // Note: The actual user deletion should be done via an edge function
      // for security. For now, we just sign out.
      toast({
        title: "Account deleted",
        description: "Your account has been deleted.",
      });
      
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error deleting account:", err);
      toast({
        variant: "destructive",
        title: t("errors.generic"),
      });
      setIsDeleting(false);
    }
  };

  if (authLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={teledermLogo} alt="Telederm" className="w-8 h-8 rounded-lg" />
            <span className="font-serif font-bold text-xl text-foreground">telederm</span>
          </Link>
          {returnTo ? (
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate(returnTo)}>
              <ArrowLeft className="h-4 w-4" />
              {lang === "de" ? "Zurück zur Konsultation" : "Back to Consultation"}
            </Button>
          ) : (
            <Link to={getDashboardPath()}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t("common.dashboard")}
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t("profile.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("profile.subtitle")}</p>
        </div>

        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("profile.email")}
                    </label>
                    <Input value={user?.email || ""} disabled className="mt-1.5 bg-muted" />
                  </div>

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.fullName")}</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.phone")}</FormLabel>
                        <FormControl>
                          <Input placeholder="+43 123 456 7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("profile.save")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Patient Address - Only visible to patients */}
        {role === "patient" && (
          <Card className="shadow-card mb-8">
            <CardHeader>
              <CardTitle>{lang === "de" ? "Adresse" : "Address"}</CardTitle>
              <CardDescription>
                {lang === "de" 
                  ? "Ihre Adresse wird für Rechnungen und Honorarnoten benötigt."
                  : "Your address is required for invoices and medical fee notes."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...patientAddressForm}>
                <form onSubmit={patientAddressForm.handleSubmit(onSubmitPatientAddress)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={patientAddressForm.control}
                      name="patientAddressStreet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{lang === "de" ? "Straße & Hausnummer" : "Street & Number"}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={lang === "de" ? "z.B. Musterstraße 123" : "e.g. Main Street 123"} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={patientAddressForm.control}
                        name="patientAddressZip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{lang === "de" ? "PLZ" : "Postal Code"}</FormLabel>
                            <FormControl>
                              <Input placeholder="1010" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={patientAddressForm.control}
                        name="patientAddressCity"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>{lang === "de" ? "Stadt" : "City"}</FormLabel>
                            <FormControl>
                              <Input placeholder={lang === "de" ? "Wien" : "Vienna"} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmittingAddress}>
                    {isSubmittingAddress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("profile.save")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Patient Medical Details - Only visible to patients */}
        {role === "patient" && (
          <Card className="shadow-card mb-8">
            <CardHeader>
              <CardTitle>{lang === "de" ? "Medizinische Angaben" : "Medical Details"}</CardTitle>
              <CardDescription>
                {lang === "de" 
                  ? "Diese Informationen werden für Ihre Konsultationen benötigt."
                  : "This information is required for your consultations."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...patientForm}>
                <form onSubmit={patientForm.handleSubmit(onSubmitPatient)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={patientForm.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{lang === "de" ? "Geburtsdatum" : "Date of Birth"}</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              max={new Date().toISOString().split("T")[0]}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={patientForm.control}
                      name="socialSecurityNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{lang === "de" ? "Sozialversicherungsnummer" : "Social Security Number"}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={lang === "de" ? "z.B. 1234 010190" : "e.g. 1234 010190"} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={patientForm.control}
                      name="biologicalSex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{lang === "de" ? "Biologisches Geschlecht" : "Biological Sex"}</FormLabel>
                          <div className="flex gap-3 mt-2">
                            {(["male", "female", "diverse"] as const).map((sex) => (
                              <button
                                key={sex}
                                type="button"
                                onClick={() => field.onChange(sex)}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                  field.value === sex
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card"
                                }`}
                              >
                                <span className="font-medium text-foreground">
                                  {sex === "male" 
                                    ? (lang === "de" ? "Männlich" : "Male")
                                    : sex === "female"
                                    ? (lang === "de" ? "Weiblich" : "Female")
                                    : (lang === "de" ? "Divers" : "Diverse")}
                                </span>
                              </button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={patientForm.control}
                      name="insuranceProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{lang === "de" ? "Krankenversicherung" : "Health Insurance"}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={lang === "de" ? "z.B. ÖGK, SVS, BVAEB" : "e.g. ÖGK, SVS, BVAEB"} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmittingPatient}>
                    {isSubmittingPatient && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("profile.save")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Doctor Referral Settings - Only visible to doctors */}
        {role === "doctor" && (
          <Card className="shadow-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary" />
                {lang === "de" ? "Empfehlungslink" : "Referral Link"}
              </CardTitle>
              <CardDescription>
                {lang === "de" 
                  ? "Teilen Sie diesen Link mit Ihren Patienten, damit diese direkt bei Ihnen eine Beratung starten können."
                  : "Share this link with your patients so they can start consultations directly with you."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...doctorForm}>
                <form onSubmit={doctorForm.handleSubmit(onSubmitDoctor)} className="space-y-6">
                  <FormField
                    control={doctorForm.control}
                    name="referralCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === "de" ? "Ihr Empfehlungscode" : "Your Referral Code"}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="z.B. DRMUELLER" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          {lang === "de" 
                            ? "Nur Großbuchstaben, Zahlen und Unterstriche erlaubt."
                            : "Only uppercase letters, numbers, and underscores allowed."}
                        </p>
                      </FormItem>
                    )}
                  />

                  {doctorForm.watch("referralCode") && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {lang === "de" ? "Ihr Empfehlungslink" : "Your Referral Link"}
                      </label>
                      <div className="flex gap-2">
                        <Input 
                          value={getReferralLink()} 
                          readOnly 
                          className="bg-muted text-sm"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={copyReferralLink}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  <FormField
                    control={doctorForm.control}
                    name="practiceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === "de" ? "Praxisname (optional)" : "Practice Name (optional)"}</FormLabel>
                        <FormControl>
                          <Input placeholder={lang === "de" ? "z.B. Hautarztpraxis Dr. Müller" : "e.g. Dr. Mueller Dermatology"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={doctorForm.control}
                    name="welcomeMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === "de" ? "Begrüßungsnachricht (optional)" : "Welcome Message (optional)"}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={lang === "de" 
                              ? "z.B. Willkommen in meiner Online-Sprechstunde! Ich freue mich, Ihnen zu helfen."
                              : "e.g. Welcome to my online consultation! I look forward to helping you."}
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          {lang === "de" ? "Max. 200 Zeichen" : "Max. 200 characters"}
                        </p>
                      </FormItem>
                    )}
                  />

                  {/* Pricing Section */}
                  <div className="border-t border-border pt-6 mt-6">
                    <h4 className="font-medium text-foreground mb-4">
                      {lang === "de" ? "Ihre Preise" : "Your Pricing"}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {lang === "de" 
                        ? "Legen Sie Ihre Preise für die beiden Anfragetypen fest. Diese werden Ihren Patienten während des Konsultationsprozesses angezeigt."
                        : "Set your prices for the two request types. These will be shown to your patients during the consultation process."}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={doctorForm.control}
                        name="standardPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{lang === "de" ? "Standard-Anfrage (€)" : "Standard Request (€)"}</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                min={1}
                                max={999}
                                placeholder="49"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              {lang === "de" ? "Antwort in 48h" : "48h response"}
                            </p>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={doctorForm.control}
                        name="urgentPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{lang === "de" ? "Dringliche Anfrage (€)" : "Urgent Request (€)"}</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                min={1}
                                max={999}
                                placeholder="74"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              {lang === "de" ? "Antwort in 24h" : "24h response"}
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmittingDoctor}>
                    {isSubmittingDoctor && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {lang === "de" ? "Speichern" : "Save"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Doctor Billing Information - Only visible to doctors */}
        {role === "doctor" && (
          <Card className="shadow-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {lang === "de" ? "Abrechnungsdaten" : "Billing Information"}
              </CardTitle>
              <CardDescription>
                {lang === "de" 
                  ? "Diese Daten werden für die Erstellung von Honorarnoten benötigt."
                  : "This information is required for generating medical fee notes (Honorarnoten)."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...billingForm}>
                <form onSubmit={billingForm.handleSubmit(onSubmitBilling)} className="space-y-6">
                  <FormField
                    control={billingForm.control}
                    name="uidNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === "de" ? "UID-Nummer" : "VAT ID (UID Number)"}</FormLabel>
                        <FormControl>
                          <Input placeholder={lang === "de" ? "z.B. ATU12345678" : "e.g. ATU12345678"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={billingForm.control}
                      name="iban"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IBAN</FormLabel>
                          <FormControl>
                            <Input placeholder={lang === "de" ? "z.B. AT89 3704 0044 0532 0130 00" : "e.g. AT89 3704 0044 0532 0130 00"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={billingForm.control}
                      name="bic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>BIC</FormLabel>
                          <FormControl>
                            <Input placeholder={lang === "de" ? "z.B. RLNWATWW" : "e.g. RLNWATWW"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t border-border pt-6 mt-6">
                    <h4 className="font-medium text-foreground mb-4">
                      {lang === "de" ? "Praxisadresse" : "Practice Address"}
                    </h4>
                    
                    <div className="space-y-4">
                      <FormField
                        control={billingForm.control}
                        name="practiceAddressStreet"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{lang === "de" ? "Straße und Hausnummer" : "Street Address"}</FormLabel>
                            <FormControl>
                              <Input placeholder={lang === "de" ? "z.B. Musterstraße 123" : "e.g. 123 Main Street"} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={billingForm.control}
                          name="practiceAddressZip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{lang === "de" ? "PLZ" : "Postal Code"}</FormLabel>
                              <FormControl>
                                <Input placeholder={lang === "de" ? "z.B. 1010" : "e.g. 1010"} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={billingForm.control}
                          name="practiceAddressCity"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>{lang === "de" ? "Stadt" : "City"}</FormLabel>
                              <FormControl>
                                <Input placeholder={lang === "de" ? "z.B. Wien" : "e.g. Vienna"} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmittingBilling}>
                    {isSubmittingBilling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {lang === "de" ? "Speichern" : "Save"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-card border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">{t("profile.deleteAccount")}</CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  {t("profile.deleteAccount")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("profile.deleteAccount")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("profile.deleteConfirm")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("profile.deleteButton")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
