import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  User, 
  LogOut, 
  UserPlus, 
  Loader2, 
  Shield, 
  Users, 
  Stethoscope,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Activity,
  MoreHorizontal,
  Ban,
  RefreshCw,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import teledermLogo from "@/assets/logo/telederm-logo.png";

const createDoctorSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type CreateDoctorFormData = z.infer<typeof createDoctorSchema>;

interface Doctor {
  id: string;
  full_name: string | null;
  created_at: string;
  user_id: string;
  is_active: boolean;
  doctor_queue_type: 'group' | 'individual' | 'hybrid' | null;
}

interface Patient {
  id: string;
  full_name: string | null;
  created_at: string;
  is_active: boolean;
  closedCases: number;
  ongoingCases: number;
}

interface PlatformStats {
  totalPatients: number;
  totalDoctors: number;
  totalConsultations: number;
  pendingConsultations: number;
  inReviewConsultations: number;
  completedConsultations: number;
  consultationsThisMonth: number;
  avgResponseTime: string;
}

interface RecentConsultation {
  id: string;
  status: string;
  concern_category: string | null;
  created_at: string;
  submitted_at: string | null;
  patient_name: string | null;
}

const AdminDashboard = () => {
  const { t, i18n } = useTranslation("auth");
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [recentConsultations, setRecentConsultations] = useState<RecentConsultation[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'deactivate' | 'reactivate' | 'delete';
    target: Doctor | Patient | null;
    targetType: 'doctor' | 'patient';
  }>({ open: false, type: 'deactivate', target: null, targetType: 'doctor' });

  const lang = i18n.language === "de" ? "de" : "en";
  const dateLocale = lang === "de" ? de : enUS;

  const form = useForm<CreateDoctorFormData>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: { email: "", fullName: "", password: "" },
  });

  const fetchStats = async () => {
    try {
      // Get patient count
      const { count: patientCount } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "patient");

      // Get doctor count
      const { count: doctorCount } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "doctor");

      // Get all consultations (excluding drafts)
      const { data: consultations } = await supabase
        .from("consultations")
        .select("id, status, submitted_at, responded_at")
        .neq("status", "draft");

      const total = consultations?.length || 0;
      const pending = consultations?.filter(c => c.status === "submitted").length || 0;
      const inReview = consultations?.filter(c => c.status === "in_review").length || 0;
      const completed = consultations?.filter(c => c.status === "completed").length || 0;

      // Consultations this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const thisMonth = consultations?.filter(c => 
        c.submitted_at && new Date(c.submitted_at) >= startOfMonth
      ).length || 0;

      // Calculate average response time for completed consultations
      const completedWithTimes = consultations?.filter(
        c => c.status === "completed" && c.submitted_at && c.responded_at
      ) || [];
      
      let avgResponseTime = lang === "de" ? "N/A" : "N/A";
      if (completedWithTimes.length > 0) {
        const totalHours = completedWithTimes.reduce((acc, c) => {
          const submitted = new Date(c.submitted_at!);
          const responded = new Date(c.responded_at!);
          return acc + (responded.getTime() - submitted.getTime()) / (1000 * 60 * 60);
        }, 0);
        const avgHours = Math.round(totalHours / completedWithTimes.length);
        avgResponseTime = avgHours < 24 
          ? `${avgHours}h` 
          : `${Math.round(avgHours / 24)}d`;
      }

      setStats({
        totalPatients: patientCount || 0,
        totalDoctors: doctorCount || 0,
        totalConsultations: total,
        pendingConsultations: pending,
        inReviewConsultations: inReview,
        completedConsultations: completed,
        consultationsThisMonth: thisMonth,
        avgResponseTime,
      });

      // Get recent consultations with patient names
      const { data: recent } = await supabase
        .from("consultations")
        .select(`
          id,
          status,
          concern_category,
          created_at,
          submitted_at,
          profiles:patient_id (full_name)
        `)
        .neq("status", "draft")
        .order("submitted_at", { ascending: false })
        .limit(10);

      if (recent) {
        setRecentConsultations(recent.map(c => ({
          id: c.id,
          status: c.status,
          concern_category: c.concern_category,
          created_at: c.created_at,
          submitted_at: c.submitted_at,
          patient_name: (c.profiles as { full_name: string | null } | null)?.full_name || null,
        })));
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data: doctorRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, created_at")
        .eq("role", "doctor");

      if (rolesError) throw rolesError;

      if (!doctorRoles || doctorRoles.length === 0) {
        setDoctors([]);
        setIsLoadingDoctors(false);
        return;
      }

      const userIds = doctorRoles.map((r) => r.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, is_active, doctor_queue_type")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      const doctorsList = doctorRoles.map((role) => {
        const profile = profiles?.find((p) => p.id === role.user_id);
        return {
          id: role.user_id,
          user_id: role.user_id,
          full_name: profile?.full_name || "Unknown",
          created_at: role.created_at,
          is_active: profile?.is_active ?? true,
          doctor_queue_type: (profile?.doctor_queue_type as 'group' | 'individual' | 'hybrid' | null) ?? 'group',
        };
      });

      setDoctors(doctorsList);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
    setIsLoadingDoctors(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const { data: patientRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, created_at")
        .eq("role", "patient");

      if (rolesError) throw rolesError;

      if (!patientRoles || patientRoles.length === 0) {
        setPatients([]);
        setIsLoadingPatients(false);
        return;
      }

      const userIds = patientRoles.map((r) => r.user_id);
      
      // Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, is_active")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Get consultation counts per patient
      const { data: consultations, error: consultError } = await supabase
        .from("consultations")
        .select("patient_id, status")
        .in("patient_id", userIds)
        .neq("status", "draft");

      if (consultError) throw consultError;

      // Build patient list with consultation counts
      const patientsList = patientRoles.map((role) => {
        const profile = profiles?.find((p) => p.id === role.user_id);
        const patientConsultations = consultations?.filter(c => c.patient_id === role.user_id) || [];
        const closedCases = patientConsultations.filter(c => c.status === "completed" || c.status === "cancelled").length;
        const ongoingCases = patientConsultations.filter(c => c.status === "submitted" || c.status === "in_review").length;
        
        return {
          id: role.user_id,
          full_name: profile?.full_name || "Unknown",
          created_at: role.created_at,
          is_active: profile?.is_active ?? true,
          closedCases,
          ongoingCases,
        };
      });

      setPatients(patientsList);
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const handleDoctorAction = async (action: 'deactivate' | 'reactivate' | 'delete', doctor: Doctor) => {
    setActionInProgress(doctor.id);
    setConfirmDialog({ open: false, type: action, target: null, targetType: 'doctor' });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const { data: result, error } = await supabase.functions.invoke("manage-doctor-account", {
        body: {
          action,
          doctor_id: doctor.id,
        },
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      const messageKey = action === 'deactivate' 
        ? 'doctorDeactivated' 
        : action === 'reactivate' 
          ? 'doctorReactivated' 
          : 'doctorDeleted';

      toast({
        title: t(`dashboard.admin.${messageKey}`),
        description: doctor.full_name || '',
      });

      fetchDoctors();
      fetchStats();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Operation failed";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handlePatientAction = async (action: 'deactivate' | 'reactivate' | 'delete', patient: Patient) => {
    setActionInProgress(patient.id);
    setConfirmDialog({ open: false, type: action, target: null, targetType: 'patient' });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const { data: result, error } = await supabase.functions.invoke("manage-patient-account", {
        body: {
          action,
          patient_id: patient.id,
        },
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      const messageKey = action === 'deactivate' 
        ? 'patientDeactivated' 
        : action === 'reactivate' 
          ? 'patientReactivated' 
          : 'patientDeleted';

      toast({
        title: t(`dashboard.admin.${messageKey}`),
        description: patient.full_name || '',
      });

      fetchPatients();
      fetchStats();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Operation failed";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const openConfirmDialog = (type: 'deactivate' | 'reactivate' | 'delete', target: Doctor | Patient, targetType: 'doctor' | 'patient') => {
    setConfirmDialog({ open: true, type, target, targetType });
  };

  const handleUpdateQueueType = async (doctorId: string, queueType: 'group' | 'individual' | 'hybrid') => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ doctor_queue_type: queueType })
        .eq("id", doctorId);

      if (error) throw error;

      toast({
        title: t("dashboard.admin.queueTypeUpdated"),
      });

      fetchDoctors();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update queue type";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  const getQueueTypeBadge = (queueType: 'group' | 'individual' | 'hybrid' | null) => {
    const type = queueType || 'group';
    const colors = {
      group: "bg-blue-100 text-blue-700 border-blue-200",
      individual: "bg-purple-100 text-purple-700 border-purple-200",
      hybrid: "bg-teal-100 text-teal-700 border-teal-200",
    };
    return (
      <Badge variant="outline" className={`gap-1 ${colors[type]}`}>
        {t(`dashboard.admin.queueType${type.charAt(0).toUpperCase() + type.slice(1)}`)}
      </Badge>
    );
  };

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchStats();
  }, []);

  const onSubmit = async (data: CreateDoctorFormData) => {
    setIsSubmitting(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("create-doctor-account", {
        body: {
          email: data.email,
          password: data.password,
          fullName: data.fullName,
        },
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      toast({
        title: t("dashboard.admin.doctorCreated"),
        description: `Doctor account created for ${data.email}`,
      });

      form.reset();
      fetchDoctors();
      fetchStats();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create doctor account";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> {lang === "de" ? "Neu" : "New"}</Badge>;
      case "in_review":
        return <Badge variant="default" className="gap-1"><AlertCircle className="h-3 w-3" /> {lang === "de" ? "In Bearbeitung" : "In Review"}</Badge>;
      case "completed":
        return <Badge variant="outline" className="gap-1 text-green-600 border-green-600"><CheckCircle className="h-3 w-3" /> {lang === "de" ? "Abgeschlossen" : "Completed"}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const concernLabels: Record<string, { en: string; de: string }> = {
    skin: { en: "Skin Conditions", de: "Hauterkrankungen" },
    hair: { en: "Hair & Scalp", de: "Haare & Kopfhaut" },
    nails: { en: "Nail Problems", de: "Nagelprobleme" },
    infections: { en: "Infections", de: "Infektionen" },
    allergies: { en: "Allergies", de: "Allergien" },
    pigmentation: { en: "Pigmentation", de: "Pigmentierung" },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={teledermLogo} alt="Telederm" className="w-8 h-8 rounded-lg" />
            <span className="font-serif font-bold text-xl text-foreground">telederm</span>
          </Link>
          <div className="flex items-center gap-4">
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">{t("dashboard.admin.welcome")}</h1>
          </div>
          <p className="text-muted-foreground">{t("dashboard.admin.subtitle")}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                {lang === "de" ? "Patienten" : "Patients"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.totalPatients || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {lang === "de" ? "Registrierte Nutzer" : "Registered users"}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" />
                {lang === "de" ? "Ärzte" : "Doctors"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.totalDoctors || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {lang === "de" ? "Aktive Ärzte" : "Active doctors"}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                {lang === "de" ? "Konsultationen" : "Consultations"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.totalConsultations || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.consultationsThisMonth || 0} {lang === "de" ? "diesen Monat" : "this month"}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                {lang === "de" ? "Ø Antwortzeit" : "Avg Response"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.avgResponseTime || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {lang === "de" ? "Bearbeitungszeit" : "Processing time"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Consultation Status Cards */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Card className="shadow-card border-l-4 border-l-amber-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{lang === "de" ? "Ausstehend" : "Pending"}</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.pendingConsultations || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{lang === "de" ? "In Bearbeitung" : "In Review"}</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.inReviewConsultations || 0}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{lang === "de" ? "Abgeschlossen" : "Completed"}</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.completedConsultations || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              {lang === "de" ? "Übersicht" : "Overview"}
            </TabsTrigger>
            <TabsTrigger value="patients" className="gap-2">
              <Users className="h-4 w-4" />
              {lang === "de" ? "Patienten" : "Patients"}
            </TabsTrigger>
            <TabsTrigger value="doctors" className="gap-2">
              <Stethoscope className="h-4 w-4" />
              {lang === "de" ? "Ärzte" : "Doctors"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Consultations */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {lang === "de" ? "Aktuelle Konsultationen" : "Recent Consultations"}
                </CardTitle>
                <CardDescription>
                  {lang === "de" ? "Die letzten 10 eingereichten Anfragen" : "Last 10 submitted requests"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : recentConsultations.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4 text-center">
                    {lang === "de" ? "Noch keine Konsultationen." : "No consultations yet."}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{lang === "de" ? "Patient" : "Patient"}</TableHead>
                        <TableHead>{lang === "de" ? "Kategorie" : "Category"}</TableHead>
                        <TableHead>{lang === "de" ? "Datum" : "Date"}</TableHead>
                        <TableHead>{lang === "de" ? "Status" : "Status"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentConsultations.map((consultation) => (
                        <TableRow key={consultation.id}>
                          <TableCell className="font-medium">
                            {consultation.patient_name || (lang === "de" ? "Unbekannt" : "Unknown")}
                          </TableCell>
                          <TableCell>
                            {consultation.concern_category 
                              ? concernLabels[consultation.concern_category]?.[lang] || consultation.concern_category
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {consultation.submitted_at 
                              ? format(new Date(consultation.submitted_at), "PP", { locale: dateLocale })
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(consultation.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {t("dashboard.admin.patientsList")}
                </CardTitle>
                <CardDescription>
                  {t("dashboard.admin.patientsSubtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPatients ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : patients.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">
                      {t("dashboard.admin.noPatients")}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{lang === "de" ? "Name" : "Name"}</TableHead>
                        <TableHead>{lang === "de" ? "Erstellt" : "Created"}</TableHead>
                        <TableHead>{t("dashboard.admin.ongoingCases")}</TableHead>
                        <TableHead>{t("dashboard.admin.closedCases")}</TableHead>
                        <TableHead>{t("dashboard.admin.doctorStatus")}</TableHead>
                        <TableHead className="text-right">{t("dashboard.admin.doctorActions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patients.map((patient) => (
                        <TableRow key={patient.id} className={!patient.is_active ? "opacity-60" : ""}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${patient.is_active ? "bg-primary/10" : "bg-muted"}`}>
                                <User className={`h-4 w-4 ${patient.is_active ? "text-primary" : "text-muted-foreground"}`} />
                              </div>
                              {patient.full_name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(patient.created_at), "PP", { locale: dateLocale })}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {patient.ongoingCases}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                              <CheckCircle className="h-3 w-3" />
                              {patient.closedCases}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {patient.is_active ? (
                              <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                                <CheckCircle className="h-3 w-3" />
                                {t("dashboard.admin.activeStatus")}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1 text-muted-foreground">
                                <Ban className="h-3 w-3" />
                                {t("dashboard.admin.inactiveStatus")}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  disabled={actionInProgress === patient.id}
                                >
                                  {actionInProgress === patient.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <MoreHorizontal className="h-4 w-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {patient.is_active ? (
                                  <DropdownMenuItem 
                                    onClick={() => openConfirmDialog('deactivate', patient, 'patient')}
                                    className="gap-2"
                                  >
                                    <Ban className="h-4 w-4" />
                                    {t("dashboard.admin.deactivatePatient")}
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => openConfirmDialog('reactivate', patient, 'patient')}
                                    className="gap-2"
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                    {t("dashboard.admin.reactivatePatient")}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  onClick={() => openConfirmDialog('delete', patient, 'patient')}
                                  className="gap-2 text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  {t("dashboard.admin.deletePatient")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Create Doctor Form */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    {t("dashboard.admin.createDoctor")}
                  </CardTitle>
                  <CardDescription>
                    {lang === "de" 
                      ? "Neues Arztkonto für die Plattform erstellen" 
                      : "Create new doctor accounts for your platform"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("dashboard.admin.doctorName")}</FormLabel>
                            <FormControl>
                              <Input placeholder="Dr. Jane Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("dashboard.admin.doctorEmail")}</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="doctor@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("dashboard.admin.doctorPassword")}</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t("dashboard.admin.createButton")}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Doctors List */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    {t("dashboard.admin.doctorsList")}
                  </CardTitle>
                  <CardDescription>
                    {lang === "de" 
                      ? "Alle registrierten Ärzte auf der Plattform" 
                      : "All registered doctors on the platform"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingDoctors ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : doctors.length === 0 ? (
                    <div className="text-center py-8">
                      <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-sm">
                        {lang === "de" 
                          ? "Noch keine Ärzte registriert. Erstellen Sie das erste Arztkonto." 
                          : "No doctors registered yet. Create your first doctor account."}
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{lang === "de" ? "Name" : "Name"}</TableHead>
                          <TableHead>ID</TableHead>
                          <TableHead>{t("dashboard.admin.queueType")}</TableHead>
                          <TableHead>{t("dashboard.admin.doctorStatus")}</TableHead>
                          <TableHead>{lang === "de" ? "Erstellt" : "Created"}</TableHead>
                          <TableHead className="text-right">{t("dashboard.admin.doctorActions")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {doctors.map((doctor) => (
                          <TableRow key={doctor.id} className={!doctor.is_active ? "opacity-60" : ""}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${doctor.is_active ? "bg-primary/10" : "bg-muted"}`}>
                                  <User className={`h-4 w-4 ${doctor.is_active ? "text-primary" : "text-muted-foreground"}`} />
                                </div>
                                {doctor.full_name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                {doctor.id.slice(0, 8)}...
                              </code>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-auto py-1 px-2">
                                    {getQueueTypeBadge(doctor.doctor_queue_type)}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuItem onClick={() => handleUpdateQueueType(doctor.id, 'group')}>
                                    <div>
                                      <div className="font-medium">{t("dashboard.admin.queueTypeGroup")}</div>
                                      <div className="text-xs text-muted-foreground">{t("dashboard.admin.queueTypeGroupDesc")}</div>
                                    </div>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUpdateQueueType(doctor.id, 'individual')}>
                                    <div>
                                      <div className="font-medium">{t("dashboard.admin.queueTypeIndividual")}</div>
                                      <div className="text-xs text-muted-foreground">{t("dashboard.admin.queueTypeIndividualDesc")}</div>
                                    </div>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUpdateQueueType(doctor.id, 'hybrid')}>
                                    <div>
                                      <div className="font-medium">{t("dashboard.admin.queueTypeHybrid")}</div>
                                      <div className="text-xs text-muted-foreground">{t("dashboard.admin.queueTypeHybridDesc")}</div>
                                    </div>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                            <TableCell>
                              {format(new Date(doctor.created_at), "PP", { locale: dateLocale })}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    disabled={actionInProgress === doctor.id}
                                  >
                                    {actionInProgress === doctor.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <MoreHorizontal className="h-4 w-4" />
                                    )}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {doctor.is_active ? (
                                    <DropdownMenuItem 
                                      onClick={() => openConfirmDialog('deactivate', doctor, 'doctor')}
                                      className="gap-2"
                                    >
                                      <Ban className="h-4 w-4" />
                                      {t("dashboard.admin.deactivateDoctor")}
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem 
                                      onClick={() => openConfirmDialog('reactivate', doctor, 'doctor')}
                                      className="gap-2"
                                    >
                                      <RefreshCw className="h-4 w-4" />
                                      {t("dashboard.admin.reactivateDoctor")}
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem 
                                    onClick={() => openConfirmDialog('delete', doctor, 'doctor')}
                                    className="gap-2 text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    {t("dashboard.admin.deleteDoctor")}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Confirmation Dialog */}
            <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {confirmDialog.targetType === 'doctor' ? (
                      <>
                        {confirmDialog.type === 'deactivate' && (t("dashboard.admin.deactivateDoctor"))}
                        {confirmDialog.type === 'reactivate' && (t("dashboard.admin.reactivateDoctor"))}
                        {confirmDialog.type === 'delete' && (t("dashboard.admin.deleteDoctor"))}
                      </>
                    ) : (
                      <>
                        {confirmDialog.type === 'deactivate' && (t("dashboard.admin.deactivatePatient"))}
                        {confirmDialog.type === 'reactivate' && (t("dashboard.admin.reactivatePatient"))}
                        {confirmDialog.type === 'delete' && (t("dashboard.admin.deletePatient"))}
                      </>
                    )}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {confirmDialog.targetType === 'doctor' ? (
                      <>
                        {confirmDialog.type === 'deactivate' && t("dashboard.admin.confirmDeactivate")}
                        {confirmDialog.type === 'reactivate' && t("dashboard.admin.confirmReactivate")}
                        {confirmDialog.type === 'delete' && t("dashboard.admin.confirmDelete")}
                      </>
                    ) : (
                      <>
                        {confirmDialog.type === 'deactivate' && t("dashboard.admin.confirmDeactivatePatient")}
                        {confirmDialog.type === 'reactivate' && t("dashboard.admin.confirmReactivatePatient")}
                        {confirmDialog.type === 'delete' && t("dashboard.admin.confirmDeletePatient")}
                      </>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{lang === "de" ? "Abbrechen" : "Cancel"}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (confirmDialog.target) {
                        if (confirmDialog.targetType === 'doctor') {
                          handleDoctorAction(confirmDialog.type, confirmDialog.target as Doctor);
                        } else {
                          handlePatientAction(confirmDialog.type, confirmDialog.target as Patient);
                        }
                      }
                    }}
                    className={confirmDialog.type === 'delete' ? "bg-destructive hover:bg-destructive/90" : ""}
                  >
                    {confirmDialog.targetType === 'doctor' ? (
                      <>
                        {confirmDialog.type === 'deactivate' && t("dashboard.admin.deactivateDoctor")}
                        {confirmDialog.type === 'reactivate' && t("dashboard.admin.reactivateDoctor")}
                        {confirmDialog.type === 'delete' && t("dashboard.admin.deleteDoctor")}
                      </>
                    ) : (
                      <>
                        {confirmDialog.type === 'deactivate' && t("dashboard.admin.deactivatePatient")}
                        {confirmDialog.type === 'reactivate' && t("dashboard.admin.reactivatePatient")}
                        {confirmDialog.type === 'delete' && t("dashboard.admin.deletePatient")}
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
