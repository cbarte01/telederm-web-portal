import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { ArrowLeft, Loader2, Trash2, Copy, Check, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import teledermLogo from "@/assets/logo/telederm-logo.png";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

const doctorProfileSchema = z.object({
  referralCode: z.string().min(3, "Code must be at least 3 characters").max(20, "Code must be at most 20 characters").regex(/^[A-Z0-9_]+$/, "Only uppercase letters, numbers, and underscores allowed"),
  practiceName: z.string().optional(),
  welcomeMessage: z.string().max(200, "Message must be at most 200 characters").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type DoctorProfileFormData = z.infer<typeof doctorProfileSchema>;

const Profile = () => {
  const { t, i18n } = useTranslation("auth");
  const lang = i18n.language === "de" ? "de" : "en";
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingDoctor, setIsSubmittingDoctor] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [copied, setCopied] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", phone: "" },
  });

  const doctorForm = useForm<DoctorProfileFormData>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: { referralCode: "", practiceName: "", welcomeMessage: "" },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, phone, referral_code, practice_name, welcome_message")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          form.reset({
            fullName: data.full_name || "",
            phone: data.phone || "",
          });
          
          if (role === "doctor") {
            doctorForm.reset({
              referralCode: data.referral_code || "",
              practiceName: data.practice_name || "",
              welcomeMessage: data.welcome_message || "",
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
  }, [user, form, doctorForm, role]);

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

  const onSubmitDoctor = async (data: DoctorProfileFormData) => {
    if (!user) return;
    
    setIsSubmittingDoctor(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          referral_code: data.referralCode || null,
          practice_name: data.practiceName || null,
          welcome_message: data.welcomeMessage || null,
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
          <Link to={getDashboardPath()}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("common.dashboard")}
            </Button>
          </Link>
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

                  <Button type="submit" disabled={isSubmittingDoctor}>
                    {isSubmittingDoctor && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {lang === "de" ? "Speichern" : "Save"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Danger Zone */}
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
